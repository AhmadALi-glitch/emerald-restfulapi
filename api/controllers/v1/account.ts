
import express from "express";
import { prisma } from "../../../database/adapter";

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        prisma.$connect().then(() => {
            console.log("Connected")
        })

        const result = await prisma.account.findFirst({where: {id: Number(req.params.id)}})
        const cRes = await prisma.account.count()
        console.log(result, cRes)

        res.json(result)

        await prisma.$disconnect()
    } catch(exp) {
        await prisma.$disconnect()
        res.send(exp).status(500)
    }
})

router.post('/create', (req, res) => {
    res.send(req)
})

export default router;
