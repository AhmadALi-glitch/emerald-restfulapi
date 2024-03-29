
import express from "express"
import { prisma } from "../../../database/adapter"
import auth from "./middlware/auth";
import { getTimezoneDateUtcInMs } from "../../../timing/date";
import multer from "multer";

const dayInMs = 60 * 60 * 1000 * 24

const router = express()

router.get('/', multer().none(), async (req, res) => {

    try {
        prisma.$connect()

        let events = await prisma.checkpoint.findMany()

        if(!events) throw new Error("can not fetch running events")

        res.json({ events, count: events.length })

        prisma.$disconnect()

    } catch(exc) {
        prisma.$disconnect()
        res.json(exc)
    }

})


router.get('/get-day-checkpoints/:event_id/:team_id/:checkpoint_date_in_utc', auth, multer().none(), async (req, res) => {

    let checkpointDay = new Date(+req.params.checkpoint_date_in_utc).toISOString().split('T')[0]

    try {
        prisma.$connect()
        
        let checkpoints = await prisma.checkpoint.findMany({
            where: {
                team_id: +req.params.team_id,
                event_id: +req.params.event_id
            },
            select: {
                title: true,
                executors: {
                    select: {
                        executor: true
                    }
                },
                checked: true,
                description: true,
                event_id: true,
                team: true,
                create_date_utc: true,
                id: true,
                team_id: true
            }
        })

        let checkpointsInDay = checkpoints.filter((e) => {
            return new Date(+e.create_date_utc).toISOString().split('T')[0] == checkpointDay
        })

        if(!checkpointsInDay) throw new Error("can not fetch day checkpoints")

        res.json({ checkpointsInDay, count: checkpointsInDay.length })

        prisma.$disconnect()

    } catch(exc) {
        prisma.$disconnect()
        res.json(exc)
    }

})

router.post('/create', auth, multer().none(), async(req, res) => {

    console.log("creating checkpoint", req.body)
    try {
        prisma.$connect()

        let checkpoint = await prisma.checkpoint.create({
            data: {
                description: req.body.description,
                create_date_utc: `${req.body.create_date_utc}`,
                checked: false,
                executors: {
                    createMany: {
                        data: req.body.executorsIds.map((id: number) => {return {executor_id: +id}})
                    }
                },
                title: req.body.title,
                event_id: +req.body.event_id,
                team_id: +req.body.team_id
            }
        })
        console.log(checkpoint)

        if(!checkpoint) throw new Error("can not save this checkpoint")

        res.json(checkpoint)

        prisma.$disconnect()
   } catch(exc) {
    console.log(exc)
        console.log(exc)
        res.json(exc)    
        prisma.$disconnect()
   }

})


router.post('/check/:id', auth, multer().none(), async(req, res) => {

    console.log(req.body.executorsIds)
    try {
        prisma.$connect()

        let checkpoint = await prisma.checkpoint.update({
            where: {
                id: +req.params.id
            },
            data: {
                checked: true
            }
        })

        let accounts = await prisma.account.updateMany({
            where: {
                OR: req.body.executorsIds.map((exId: number) => {
                    return {
                        id: +exId
                    }
                })
            },
            data: {
                xp_points: {
                    increment: 100
                }
            }

        })


        console.log(checkpoint)
        console.log(accounts)

        if(!checkpoint) throw new Error("can not check this checkpoint")

        res.json({ checkpoint, accounts })

        prisma.$disconnect()

   } catch(exc) {
    console.log(exc)
        console.log(exc)
        res.json(exc)    
        prisma.$disconnect()
   }

})



export default router;


