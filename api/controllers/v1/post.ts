
import express from "express"
import auth from "./middlware/auth";
import { prisma } from "../../../database/adapter";
// import { getTimezoneDateUtcInMs } from "../../../timing/date";
import multer from "multer";

const router = express.Router();

router.use(express.json())

router.get("/", async (req, res) => {

    try {

        prisma.$connect()

        let post = await prisma.post.findMany()

        if(!post) throw new Error('can not return all posts')

        res.send(post)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp)
        prisma.$disconnect()
    }

})

router.get('/get-account-posts', auth, async (req, res) => {


    //@ts-ignore
    let accountId = +req.session.user.id;
    console.log(accountId)

    try {

        prisma.$connect()

        let post = await prisma.post.findMany({
            where: { author_id : accountId }
        })

        if(!post) throw new Error('can not the post')

        res.send(post)

        prisma.$disconnect()

    } catch(exp) {
        console.log("Get Account Posts Exception : ", exp)
        res.json(exp)
        prisma.$disconnect()
    }

})

router.get("/:id", auth, async (req, res) => {

    console.log(req.params.id)

    try {

        prisma.$connect()

        let post = await prisma.post.findFirst({
            where: { id : +req.params.id}
        })

        if(!post) throw new Error('can not the post')

        res.send(post)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp)
        prisma.$disconnect()
    }

})

router.post("/create", multer().none() , auth, async (req, res) => {

    //@ts-ignore
    console.log(req.body.title, req.session.user.id)
    //@ts-ignore
    let accountId = req.session?.user?.id

    try {

        prisma.$connect()

        let post = await prisma.post.create({
            data: {
                author_id: +accountId,
                title: req.body.title,
                paragraph: req.body.paragraph,
                create_date_utc: "100"
            }
        })
        
        if(!post) throw new Error('can not save post')

        res.send(post)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp)
        prisma.$disconnect()
    }

})

router.put("/update/:id", auth, async (req, res) => {

    try {

        prisma.$connect()

        let post = await prisma.post.update({
            where: {id: +req.params.id},
            data: {
                title: req.body.title,
                paragraph: req.body.paragraph
            }
        })
        
        if(!post) throw new Error('can not update post')

        res.send(post).status(200)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp).status(500)
        prisma.$disconnect()
    }

})

router.delete("/delete/:id", auth, async (req, res) => {

    try {

        prisma.$connect()

        let post = await prisma.post.delete({
            where: {id: +req.params.id}
        })
        
        if(!post) throw new Error('can not delete post')

        res.send(post).status(200)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp).status(500)
        prisma.$disconnect()
    }

})


export default router
