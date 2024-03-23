

import express from "express"
import accountRoute from './account'
import teamRoute from './team'
import postRoute from './post'
import commentRoute from './comment'
import eventRoute from './event'

const router = express.Router()

router.use('/account', accountRoute)
router.use('/team', teamRoute)
router.use('/post', postRoute)
router.use('/comment', commentRoute)
router.use('/event', eventRoute)

router.get('/', (req, res) => {
    console.log(req.signedCookies)
    res.send(`hello form api version 1 ${req}`)
})

export default router
