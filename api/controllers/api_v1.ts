

import express from "express";

const router = express.Router();


router.get('/', (req, res) => {
    console.log(req.signedCookies)
    res.send(`hello form api version 1 ${req}`)
})

export default router;
