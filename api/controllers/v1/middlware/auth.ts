import { Request, Response } from "express";

export default function(req: Request, res: Response, next: () => void) {
    console.log("Auth Middleware Running")
    // console.log("current session", req.session)
    //@ts-ignore
    if(!req.session.user) {
        console.log("Un Authenticated")
        res.status(403)
        res.send('not authorized')
    } else {
        next()
    }
}
