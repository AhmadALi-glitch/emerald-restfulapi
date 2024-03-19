
import express from "express"
import { prisma } from "../../../database/adapter"
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router = express.Router();

let driver = multer({
    storage: multer.diskStorage({
        filename: (_, file, cb) => {
            let allowedExtensions = ['jpeg', 'png', 'jpg']
            let extArr = file.mimetype.split("/")
            let ext = extArr[extArr.length - 1]

            if(!allowedExtensions.includes(ext)) cb(new Error("File Type Not Allowed"), ext)
            console.log("UPLOADING Team AVATAR : ", file)
            let fn = new Date().toDateString().replace(/[/]/g, '-') + file.originalname
            cb(null, fn)
        },
        destination: path.join(__dirname, `../../../public/team-avatar`)}
    )
})


router.put('/update/:id',
    driver.single('avatar'),
    async (req, res, next) => {
        prisma.$connect()
        let team = await prisma.team.findFirst({where: {id: +req.params.id}})
        if(!team) { res.send("Team Not Found").status(400); prisma.$disconnect() }
        else {

            console.log("OLD AVATAR : ", team.avatar, path.join(__dirname, '../../../public/team-avatar') )
            // delete the old avatar if new avatar uploaded
            try {
                if(team.avatar && req.file?.filename && team.avatar !== `/static/team-avatar/${req.file.filename}`) {
                    let fullPathOfCurrentAvatar = team.avatar.split('/')
                    let currentAvatarName = fullPathOfCurrentAvatar[fullPathOfCurrentAvatar.length - 1]
                    fs.unlink(path.join(__dirname, `../../../public/team-avatar/${currentAvatarName}`), (err) => {
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
            const result = await prisma.team.update({
                where: {id: +req.params.id},
                data: {
                    name: req.body.name,
                    about: req.body.about,
                    avatar: req?.file?.filename ? `/static/team-avatar/${req?.file?.filename}` : undefined
                }
            })
            res.send(result)
        } catch(exp) {
            res.send(exp)
        }
    })



router.get("/", async (req, res) => {
    try {
        prisma.$connect()
        const result = await prisma.team.findMany()
        res.json(result)
        await prisma.$disconnect()
    } catch(exp) {
        await prisma.$disconnect()
        res.send(exp).status(500)
    }
})

router.get("/:id", async (req, res) => {

    try {
        prisma.$connect()
        const result = await prisma.team.findFirst({where: {id: Number(req.params.id)}})
        res.json(result)
        await prisma.$disconnect()
    } catch(exp) {
        await prisma.$disconnect()
        res.send(exp).status(500)
    }

})

router.post('/create', driver.single('avatar'), async (req, res) => {

    // req.session

    try {

        prisma.$connect();
        let result = await prisma.team.create({
            data: {
                name: req.body.name,
                about: req.body.about,
                avatar: req.file?.filename ?  `/static/team-avatar/${ req.file?.filename }` : '',
                create_date: new Date().toDateString(),
                xp_points: 0,
                creator_id: 1
            }
        })

        if(!result) throw new Error("team can not be saved")

        res.send(result).status(200)

    } catch(exp: any) {
        if(exp instanceof PrismaClientKnownRequestError) {
            if(exp.code == "P2002") res.send("Name Should Be Unique").status(400)
        } else {
            res.send(exp.message)
        }
    }

})

router.delete('/delete/:id', async (req, res) => {


    try {
        prisma.$connect()
        let result = await prisma.account.findFirst({where: {id: +req.params.id}})
        console.log(result)
        if(!result) throw new Error("Account Not Found")
        else {
            let fullPathOfCurrentAvatar = result.avatar.split('/')
            let currentAvatarName = fullPathOfCurrentAvatar[fullPathOfCurrentAvatar.length - 1]
            fs.unlink(path.join(__dirname, `../../../public/account-avatar/${currentAvatarName}`), (err) => {
                console.log(err)
                if (err) throw new Error("when deleting old avatar")
            })
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
