import { Request, Response } from "express";

export default function(req: Request, res: Response, next: () => void) {
    //@ts-ignore
    if(!req.session.user) {
        res.send('not authorized').status(403)
    } else {
        next()
    }
}
