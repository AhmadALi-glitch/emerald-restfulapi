
import express from "express"
import { prisma } from "../../../database/adapter"
import { generateHash, isPasswordValid } from "../../utils/hash";
import path from "path";
import multer from "multer";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "fs"
import auth from "./middlware/auth";
import { getCurrentTimezoneDateInUtc } from "../../../timing/date";

// NEEDS REFACTORING
// const relativePublicPath = path.join(__dirname, '../../../public')
// const accountAvatarsPath = path.join(__dirname, '../../../public/static/account-avatar')

const router = express.Router();

let driver = multer({
    storage: multer.diskStorage({
        filename: (_, file, cb) => {
            let allowedExtensions = ['jpeg', 'png', 'jpg']
            let extArr = file.mimetype.split("/")
            let ext = extArr[extArr.length - 1]

            if(!allowedExtensions.includes(ext)) cb(new Error("File Type Not Allowed"), ext)
            console.log("UPLOADING ACCOUNT AVATAR : ", file)
            let fn = new Date().toDateString().replace(/[/]/g, '-') + file.originalname
            cb(null, fn)
        },
        destination: path.join(__dirname, `../../../public/account-avatar`)}
    )
})


router.get("/", async (req, res) => {
    console.log('asd')
    try {
        await prisma.$connect().catch((err) => { console.log(err) ;throw new Error("Can not Connect with the database") } )
        const result = await prisma.account.findMany()
        if(!result) throw new Error("can not get all accounts")
        res.json(result)
        await prisma.$disconnect()
    } catch(exp) {
        await prisma.$disconnect()
        res.json(exp).status(500)
    }
})


router.put('/update/:id', auth, driver.single('avatar'),
    async (req, res, next) => {
        prisma.$connect()
        let account = await prisma.account.findFirst({where: {id: +req.params.id}})
        if(!account) { res.send("Account Not Found").status(400); prisma.$disconnect() }
        else {

            console.log("OLD AVATAR : ", account.avatar, path.join(__dirname, '../../../public/account-avatar') )
            // delete the old avatar if new avatar uploaded
            try {
                if(account.avatar && (!req.file?.filename || req.file?.filename && account.avatar !== `/static/account-avatar/${req.file.filename}`)) {
                    let fullPathOfCurrentAvatar = account.avatar.split('/')
                    let currentAvatarName = fullPathOfCurrentAvatar[fullPathOfCurrentAvatar.length - 1]
                    fs.unlink(path.join(__dirname, `../../../public/account-avatar/${currentAvatarName}`), (err) => {
                        console.log(err)
                        if (err) throw new Error("when deleting old avatar")
                    })
                }
            } catch(err) {
                console.log("could not delete old avatar")
            }

            next()
        }
    },
    async (req, res) => {
        try {
            prisma.$connect();
            const result = await prisma.account.update({
                where: {id: +req.params.id},
                data: {
                    name: req.body.name,
                    about: req.body.about,
                    professions: req.body.professions,
                    avatar: req?.file?.filename ? `/static/account-avatar/${req?.file?.filename}` :  null
                }
            })
            res.send(result)
        } catch(exp) {
            res.send(exp)
        }
    })


router.get("/get-my-info/:timezone", auth, async (req, res) => {

    console.log("Getting User", req, "Info")
    //@ts-ignore
    let accountId = req.session.user.id

    try {
        prisma.$connect()
        const result = await prisma.account.findFirst({where: {id: +accountId}, select: {
            about: true,
            achievments: {
                select : {
                    achivment: true
                }
            },
            avatar: true,
            checkpoints: true,
            comments: true,
            email: true,
            hash: false,
            join_date_utc: true,
            name: true,
            organizing: {
                select: {
                    event: true
                }
            },
            posts: true,
            professions: true,
            recivedTeamJoinRequests: true,
            reciverEventJoinRequests: true,
            team_id: true,
            team: true,
            teamJoinRequests: true,
            xp_points: true
        }})

        let organizingNow = result?.organizing.filter((o) => {
            return +o.event.start_date_utc < getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/')) && 
            +o.event.end_date_utc > getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))
        });

        let scheduling = result?.organizing.filter((o) => {
            return +o.event.start_date_utc > getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))
        });

        let enrolledIn =  await prisma.event.findMany({where: {
            participants: {
                every: {
                    //@ts-ignore
                    team_id: +result.team_id
                }
            },
            start_date_utc: {
                lte: `${getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))}`
            },
            end_date_utc: {
                gte: `${getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))}`
            }
        }})
        res.json({ ...result, organizingNow, scheduling, enrolledIn  })

        await prisma.$disconnect()

    } catch(exp) {
        await prisma.$disconnect()
        res.send(exp).status(500)
    }

})

router.post('/create', driver.single('avatar'), async (req, res) => {

    try {

        prisma.$connect();
        let account = await prisma.account.create({
            data: {
                name: req.body.name,
                about: req.body.about,
                avatar: req.file?.filename ?  `/static/account-avatar/${ req.file?.filename }` : '',
                email: req.body.email,
                hash: generateHash(req.body.password),
                join_date_utc: `${ new Date().valueOf() }`,
                xp_points: 0,
                professions: req.body.professions
            }
        })

        if(!account) throw new Error("account can not be saved")

        //@ts-ignore
        req.session["user"] = {email: account.email, id: account.id}
        res.cookie('account', account, {
            maxAge: 90000000
        })
        res.send(account).status(200)

    } catch(exp: any) {
        if(exp instanceof PrismaClientKnownRequestError) {
            if(exp.code == "P2002") res.send("Email Should Be Unique").status(400)
        } else {
            res.send(exp.message)
        }
    }

})


router.post('/login/:timezone',driver.none(), async (req, res) => {
    console.log(req.body)
    prisma.$connect();
    try {
        let account = await prisma.account.findFirst({
            where: {
                email: req.body.email
            }
        })
        if(!account) throw new Error("Account Not Found")
        else {
            if(isPasswordValid(req.body.password, account.hash)) {
                //@ts-ignore
                req.session["user"] = {email: account.email, id: account.id}
                //@ts-ignore
                res.cookie('session', req.session['user'])
                
                const result = await prisma.account.findFirst({where: {id: +account.id}, select: {
                    about: true,
                    achievments: {
                        select : {
                            achivment: true
                        }
                    },
                    avatar: true,
                    checkpoints: true,
                    comments: true,
                    email: true,
                    hash: false,
                    join_date_utc: true,
                    name: true,
                    organizing: {
                        select: {
                            event: true
                        }
                    },
                    posts: true,
                    professions: true,
                    recivedTeamJoinRequests: true,
                    reciverEventJoinRequests: true,
                    team_id: true,
                    team: true,
                    teamJoinRequests: true,
                    xp_points: true
                }})

                let organizingNow = result?.organizing.filter((o) => {
                    return +o.event.start_date_utc < getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/')) && 
                    +o.event.end_date_utc > getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))
                });

                let scheduling = result?.organizing.filter((o) => {
                    return +o.event.start_date_utc > getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))
                });

                let enrolledIn =  await prisma.event.findMany({ where: {
                    participants: {
                        every: {
                            //@ts-ignore
                            team_id: +result.team_id
                        }
                    },
                    start_date_utc: {
                        lte: `${getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))}`
                    },
                    end_date_utc: {
                        gte: `${getCurrentTimezoneDateInUtc(req.params.timezone.replace('-', '/'))}`
                    }
                }})

                res.json({ ...result, organizingNow, scheduling, enrolledIn  })

            } else { throw new Error("password is wrong") }
        }
    } catch(exp: any) {
        console.log(exp)
        res.json(exp.message)
    }

})


router.post("/checkpass", auth, (req, res) => {
    prisma.$connect();
    prisma.account.findFirst({where: {email: req.body.email}}).then((data) => {
        if(!data) {
            prisma.$disconnect();
            res.send('account not found').status(400)
        } else {
            prisma.$disconnect();
            console.log(isPasswordValid(req.body.password, data.hash))
            res.send(isPasswordValid(req.body.password, data.hash))
        }
    }).catch((err) => {
        prisma.$disconnect();
        res.json(err).status(500)
    })
})


router.post("/forgetpass", auth, (req, res) => {
    prisma.$connect();
    prisma.account.findFirst({where: {email: req.body.email}}).then((data) => {
        if(!data) {
            prisma.$disconnect();
            res.send('account not found').status(400)
        } else {
            prisma.$disconnect();
            console.log(isPasswordValid(req.body.password, data.hash))
            res.send(isPasswordValid(req.body.password, data.hash))
        }
    }).catch((err) => {
        prisma.$disconnect();
        res.json(err).status(500)
    })
})

router.put('/update-avatar/:id', auth,
    async (req, res, next) => {
        prisma.$connect()
        let account = await prisma.account.findFirst({where: {id: +req.params.id}})
        if(!account) res.send("Account Not Found").status(400); prisma.$disconnect()
        // store email for avatar file name
        req.body.email = account?.email
    },
    driver.single('avatar'),
    async (req, res) => {
        try {
            prisma.$connect();
            const result = await prisma.account.update({
                where: {id: +req.params.id},
                data: {
                    name: req.body.name,
                    about: req.body.about,
                    professions: req.body.professions
                }
            })
            res.send(result)
        } catch(exp) {
            res.send(exp)
        }
    })


router.delete('/delete/:id', auth, async (req, res) => {


    try {
        prisma.$connect()
        let account = await prisma.account.findFirst({where: {id: +req.params.id}})
        console.log(account)
        if(!account) throw new Error("Account Not Found")
        else {
                if(account.avatar && (!req.file?.filename || req.file?.filename && account.avatar !== `/static/account-avatar/${req.file.filename}`)) {
                    let fullPathOfCurrentAvatar = account.avatar.split('/')
                    let currentAvatarName = fullPathOfCurrentAvatar[fullPathOfCurrentAvatar.length - 1]
                    fs.unlink(path.join(__dirname, `../../../public/account-avatar/${currentAvatarName}`), (err) => {
                        console.log(err)
                        if (err) throw new Error("when deleting old avatar")
                    })
                }
            await prisma.account.delete({where: {id: +req.params.id}}) 
            prisma.$disconnect()
            res.send("Deleted Succesfully").status(200)
        }
    } catch(exp: any) {
        prisma.$disconnect()
        res.send(exp.message).status(500)
    }

})

export default router;
