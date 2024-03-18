
import express from "express";
import { prisma } from "../../../database/adapter";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        await prisma.$connect()

        const result = await prisma.account.findMany()
        res.send(result)

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
