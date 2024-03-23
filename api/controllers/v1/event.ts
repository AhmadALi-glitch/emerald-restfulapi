
import express from "express"
import { prisma } from "../../../database/adapter"
import auth from "./middlware/auth";
import { getCurrentTimezoneDateInUtc, getTimezoneDateUtcInMs } from "../../../timing/date";
import multer from "multer";

const router = express()

router.post('/get-running-events', auth, multer().none(), async (req, res) => {

    try {
        prisma.$connect()

        let events = await prisma.event.findMany({
            where: {
                end_date_utc: {
                    gte: `${ getCurrentTimezoneDateInUtc(req.body.timezone) }`
                },
                start_date_utc: {
                    lte: `${ getCurrentTimezoneDateInUtc(req.body.timezone) }`
                },
                finished: false
            }
        })

        if(!events) throw new Error("can not fetch running events")

        res.json({ events, count: events.length })

        prisma.$disconnect()

    } catch(exc) {
        prisma.$disconnect()
        res.json(exc)
    }

})


router.get('/', async (req, res) => {

    try {
        prisma.$connect()

        let events = await prisma.event.findMany({
            where: {
                end_date_utc: {
                    gte: `${ getTimezoneDateUtcInMs(new Date(), "America/Los_Angeles") }`
                },
                start_date_utc: {
                    lte: `${ getTimezoneDateUtcInMs(new Date(), "America/Los_Angeles") }`
                },
                finished: false
            }
        })

        if(!events) throw new Error("can not fetch running events")

        res.json({ events, count: events.length })

        prisma.$disconnect()

    } catch(exc) {
        prisma.$disconnect()
        res.json(exc)
    }

})

router.post('/get-scheduled-events', auth, multer().none(), async (req, res) => {

    try {
        prisma.$connect()
        
        let events = await prisma.event.findMany({
            where: {
                start_date_utc: {
                    gte: `${ getCurrentTimezoneDateInUtc(req.body.timezone) }`
                }
            }
        })

        if(!events) throw new Error("can not fetch scheduled events")

        res.json({ events, count: events.length })

        prisma.$disconnect()

    } catch(exc) {
        prisma.$disconnect()
        res.json(exc)
    }

})

router.post('/create', auth, multer().none(), async(req, res) => {

    console.log(req.body)

    try {
        prisma.$connect()

        let event = await prisma.event.create({
            data: {
                description: req.body.description,
                start_date_utc: `${getTimezoneDateUtcInMs(req.body.start_date, req.body.timezone)}`,
                end_date_utc: `${getTimezoneDateUtcInMs(req.body.end_date, req.body.timezone)}`,
                field: req.body.field,
                name: req.body.name,
                finished: false,
                style: req.body.style,
                organizers: {
                    create: {
                        organizer_id: 1
                    }
                }
            }
        })

        if(!event) throw new Error("can not save this event")

        res.json(event)

        prisma.$disconnect()
   } catch(exc) {
    console.log(exc)
        res.json(exc)    
        prisma.$disconnect()
   }

})


export default router;