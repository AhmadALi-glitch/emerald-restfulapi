
import express from "express"
import accountRoute from './account'
import teamRoute from './team'
import postRoute from './post'
import commentRoute from './comment'
import eventRoute from './event'
import checkpointRoute from './checkpoint'
import auth from "./middlware/auth"

const router = express.Router()

router.use('/account', accountRoute)
router.use('/team', teamRoute)
router.use('/post', postRoute)
router.use('/comment', commentRoute)
router.use('/event', eventRoute)
router.use('/checkpoint', checkpointRoute)

router.get('/get-cookie', (req, res) => {
    //@ts-ignore
    req.session["user"] = {email: 'ah@gmail.co', id: 2}
    res.send("OK")
})

router.get('/logout', (req, res) => {
    //@ts-ignore
    req.session["user"] = null
    res.send("OK")
})

router.get('/check-auth', auth, (req, res) => {
    res.send("OK")
})

router.get('/', (req, res) => {
    console.log(req.signedCookies)
    res.send(`hello form api version 1 ${req}`)
})


router.get('/date', (req, res) => {  
    
    res.json(
         {
            date: new Date(+3249823094709 - new Date().getTimezoneOffset()).toISOString().split('T')[0],
            time: new Date(+3249823094709 - new Date().getTimezoneOffset()).toISOString().split(/[T.]/g)[1],
            ms: new Date(+3249823094709 - new Date().getTimezoneOffset()).valueOf()
        }
    )

})

export default router
