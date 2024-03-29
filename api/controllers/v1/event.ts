
import express from "express"
import { prisma } from "../../../database/adapter"
import auth from "./middlware/auth";
import { getCurrentTimezoneDateInUtc, getTimezoneDateUtcInMs } from "../../../timing/date";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

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

        let events = await prisma.event.findMany()

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

    //@ts-ignore
    let organizerId = req.session.user.id

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
                        organizer_id: organizerId
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



router.post('/finish', auth, multer().none(), async(req, res) => {

    console.log(req.body)

    let teamsXpPointsMap: {[key: string]: number} = {}
    let eventEvaluation = req.body.evaluation

    let calculatePointsInCompetetiveMode = () => {
        // Give The Firts 3 Participant 500, 300, 100 recpectively and else 25 xp_points
        let xpPointsForFirstThreeTeams = [500, 300, 100]
        let xpPoints = new Array(Object.keys(eventEvaluation).length).fill(25).map((xp, i) => {return i <= 2 ? xpPointsForFirstThreeTeams[i] : xp })

        let nextXpPoint=0;
        for(let teamId in eventEvaluation) {
            if([1, 2, 3].indexOf(+eventEvaluation[teamId]) > -1 ) {
                teamsXpPointsMap[teamId] = xpPointsForFirstThreeTeams[eventEvaluation[teamId] - 1]
            } else {
                teamsXpPointsMap[teamId] = xpPoints[nextXpPoint];
            }
            ++nextXpPoint 
        }
    }
    

    let calculatePointsInCollaborative = () => {
        // Give All Participant 150 xp_points
        let xpPoints = new Array(Object.keys(eventEvaluation).length).fill(150)

        let nextXpPoint=0;
        for(let teamId in eventEvaluation) {
            teamsXpPointsMap[teamId] = xpPoints[nextXpPoint]
            ++nextXpPoint;
        }
    }
    
    
    req.body.eventInfo.style == "competetive" ? calculatePointsInCompetetiveMode() : calculatePointsInCollaborative()

    console.log(teamsXpPointsMap)

    let teamsXpPointsLevelupRequests: Prisma.Prisma__TeamClient<{
        id: number;
        name: string;
        xp_points: number;
        avatar: string | null;
        create_date_utc: string;
        about: string;
        creator_id: number;
    }, never, DefaultArgs>[] = []

    for (const teamId in teamsXpPointsMap) {
        const teamXpPoints = teamsXpPointsMap[teamId];
        teamsXpPointsLevelupRequests.push(
            prisma.team.update({
                where: {
                    id: +teamId
                },
                data: {
                    xp_points: {
                        increment: +teamXpPoints
                    }
                }
            })
        )
    }

    
    try {
        prisma.$connect()

        let udpatedTeams = await Promise.all(teamsXpPointsLevelupRequests)
        
        let event = await prisma.event.update({
            where: {
                id: +req.body.eventInfo.id
            },
            data: {
                finished: true
            }
        })

        if(!udpatedTeams) throw new Error("can not update teams xp_points")
        if(!event) throw new Error("can not update the event")

        res.json({ event, udpatedTeams })

        prisma.$disconnect()
   } catch(exc) {
    console.log(exc)
        res.json(exc)    
        prisma.$disconnect()
   }

})


router.get('/join-request/:teamId/:eventId', auth, multer().none(), async(req, res) => {

    try {
        prisma.$connect()

        let event = await prisma.event.findFirst({where: { id: +req.params.eventId }, select: { organizers: true, id: true } })

        let request = await prisma.eventJoinRequests.create({
            data: {
                appplying_date_utc: `${ new Date().valueOf() }`,
                applier_id: +req.params.teamId,
                //@ts-ignore
                event_organizer_id: +event?.organizers[0].organizer_id,
                //@ts-ignore
                event_id: event?.id
            },
            select: {
                applier: true,
                eventOrganizer: true,
                id: true,
                appplying_date_utc: true
            }
        })

        console.log(request, event)

        res.json(request)

        prisma.$disconnect()
    } catch(exc) {
        console.log(exc)
        res.json(exc)
        prisma.$disconnect()
    }

})


router.get('/is-member/:teamId/:eventId', auth, multer().none(), async(req, res) => {

    try {
        prisma.$connect()

        let request = await prisma.event.findFirst({
            where: {
                id: +req.params.eventId,
                participants: {
                    some: {
                        team_id: +req.params.teamId
                    }
                }
            }
        })

        let isJROnHold = await prisma.eventJoinRequests.findFirst({
            where: {
                applier_id: +req.params.teamId,
                event_id: +req.params.eventId
            }
        })

        console.log("JR", isJROnHold)

        res.json(isJROnHold?.id ? "onHold" : request?.id ? true : false)

        prisma.$disconnect()
    } catch(exc) {
        res.json(exc)
        prisma.$disconnect()
    }

})

router.get('/is-joining-request-hold/:teamId/:eventId', auth, multer().none(), async(req, res) => {

    try {
        prisma.$connect()
        let isJROnHold = await prisma.eventJoinRequests.findFirst({
            where: {
                applier_id: +req.params.teamId,
                event_id: +req.params.eventId
            }
        })
       
        res.json(isJROnHold?.id ? "onHold" : "approved")
        
        prisma.$disconnect()
    } catch(exc) {
        res.json(exc)
        prisma.$disconnect()
    }
})


router.get('/received-join-requests', auth, async(req, res) => {

    console.log('jrssss')

    //@ts-ignore
    let accountId = req.session.user.id;

    try {
        prisma.$connect()
        let jrs = await prisma.eventJoinRequests.findMany({
            where: {
                event_organizer_id: +accountId
            },
            select: {
                applier: true,
                eventOrganizer: true,
                id: true,
                appplying_date_utc: true,
                event_id: true
            }
        })

        let eventsRequestsOnNames: {}[] = []

        for(let je of jrs) {
            let ev = await prisma.event.findFirst({
                where: {
                    id: +je.id
                }
            })
            eventsRequestsOnNames.push({ message : `طلب انضمام من فريق  "${je.applier?.name}" على فعالية ${ev?.name}`, type: 'event-join-request', details: je })
        }
       
        console.log(jrs)
        console.log(eventsRequestsOnNames)
        res.json(eventsRequestsOnNames)
        
        prisma.$disconnect()
    } catch(exc) {
        console.log(exc)
        res.json(exc)
        prisma.$disconnect()
    }

})


// router.post('/resolve-join-request', auth, async(req, res) => {

//     console.log('jrssss')

//     //@ts-ignore
//     let accountId = req.session.user.id;

//     try {
//         prisma.$connect()

//         let deleteJoinRequest = await prisma.event.

//         if(req.body.answre == 'accept') {



//         }

        
//         prisma.$disconnect()
//     } catch(exc) {
//         console.log(exc)
//         res.json(exc)
//         prisma.$disconnect()
//     }

// })








router.get('/:id', auth, async (req, res) => {


    //@ts-ignore
    let accountId = req.session.user.id

    try {
        prisma.$connect()

        let events = await prisma.event.findFirst({where: {id: +req.params.id},
            select: {
                name: true,
                achievment: true,
                checkpoints: true,
                participants: {
                    select: {
                        team: {
                            select: {
                                accounts: { select: {id: true, name: true} },
                                avatar: true,
                                name: true,
                                creator_id: true,
                                xp_points: true,
                                id: true,
                            }
                        },
                        join_date_utc: true,
                    }
                },
                achievment_id: true,
                end_date_utc: true,
                start_date_utc: true,
                description: true,
                field: true,
                finished: true,
                organizers: {
                    select: {
                        organizer: true
                    }
                },
                style: true,
                id: true
            }
        })

        let role;

        events?.participants.every((p) => {
            console.log(events?.participants, accountId)
            if(accountId == p.team.creator_id) {
                role = 'teamLeader'
                return false
            } else {
                role = 'default'
            }
        })

        events?.organizers.forEach((o) => {
            if(accountId == o.organizer.id) {
                role = 'organizer'
            }
        })

        if(!events) throw new Error("can not fetch running events")

        res.json({ events, role })

        prisma.$disconnect()

    } catch(exc) {
        prisma.$disconnect()
        res.json(exc)
    }

})



export default router;