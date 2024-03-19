

import express from "express"
import accountRoute from './account'
import teamRoute from './team'

const router = express.Router()

router.use('/account', accountRoute)
router.use('/team', teamRoute)

router.get('/', (req, res) => {
    console.log(req.signedCookies)
    res.send(`hello form api version 1 ${req}`)
})

export default router
