
import express from "express"
import accountRoute from './account'
import teamRoute from './team'
import postRoute from './post'
import commentRoute from './comment'
import eventRoute from './event'
import checkpointRoute from './checkpoint'
import auth from "./middlware/auth"
import { getTimezoneDateUtcInMs } from "../../../timing/date"

const router = express.Router()

router.use('/account', accountRoute)
router.use('/team', teamRoute)
router.use('/post', postRoute)
router.use('/comment', commentRoute)
router.use('/event', eventRoute)
router.use('/checkpoint', checkpointRoute)

router.get('/get-cookie', (req, res) => {
    console.log('give him cookie')
    //@ts-ignore
    req.session["user"] = {email: 'ah@gmail.co', id: 2}
    res.send("OK")
})

router.get('/logout', (req, res) => {
    //@ts-ignore
    req.session["user"] = null
    console.log('logout')
    res.send("OK")
})

router.get('/check-auth', auth, (req, res) => {
    console.log('is logged in checked')
    res.send("OK")
})

router.get('/', (req, res) => {
    console.log(req.signedCookies)
    res.send(`hello form api version 1 ${req}`)
})


router.get('/date/:date', (req, res) => {  

    res.json(
         {
            date: new Date(new Date(+req.params.date- new Date().getTimezoneOffset() * 60 * 1000) ),
            time: new Date(getTimezoneDateUtcInMs(new Date(+req.params.date), "Asia/Damascus")).valueOf(),
            ms: getTimezoneDateUtcInMs(new Date(+req.params.date), "Asia/Damascus")
        }
    )

})

export default router
