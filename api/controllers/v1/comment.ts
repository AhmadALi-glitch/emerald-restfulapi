
import express from "express"
import auth from "./middlware/auth";
import { prisma } from "../../../database/adapter";
import { getCurrentTimezoneDateInUtc } from "../../../timing/date";
import multer from "multer";

const router = express.Router();

router.use(express.json())

router.get("/", async (req, res) => {

    try {

        prisma.$connect()

        let comments = await prisma.comment.findMany()

        if(!comments) throw new Error('can not return all comments')

        res.send(comments)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp)
        prisma.$disconnect()
    }

})

router.get('/get-account-comments', auth, async (req, res) => {

    console.log(req)

    //@ts-ignore
    let accountId = +req.session.user.id;
    console.log(accountId)

    try {

        prisma.$connect()

        let comments = await prisma.comment.findMany({
            where: { author_id : accountId }
        })

        if(!comments) throw new Error('can not the comments')

        res.send(comments)

        prisma.$disconnect()

    } catch(exp) {
        console.log("Get Account Comments Exception : ", exp)
        res.json(exp)
        prisma.$disconnect()
    }

})

router.get("/:id", auth, async (req, res) => {

    console.log(req.params.id)

    try {

        prisma.$connect()

        let comment = await prisma.comment.findFirst({
            where: { id : +req.params.id}
        })

        if(!comment) throw new Error('can not the comment')

        res.send(comment)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp)
        prisma.$disconnect()
    }

})

router.get("/for-post/:id", async (req, res) => {
    
    try {

        prisma.$connect()

        let comments = await prisma.comment.findMany({
            where: { post_id : +req.params.id }
        })

        if(!comments) throw new Error('can not the comments')

        res.send(comments)

        prisma.$disconnect()

    } catch(exp) {
        console.log("Get Posts Comments Exception : ", exp)
        res.json(exp)
        prisma.$disconnect()
    }


})

router.post("/create", multer().none(), auth, async (req, res) => {

    //@ts-ignore
    let accountId = req.session?.user?.id
    console.log(req.body, accountId)

    try {

        prisma.$connect()

        let comment = await prisma.comment.create({
            data: {
                author_id: +accountId,
                paragraph: req.body.paragraph,
                create_date_utc: `${getCurrentTimezoneDateInUtc(req.body.timezone)}`,
                post_id: +req.body.postId
            }
        })
        
        if(!comment) throw new Error('can not save comment')

        res.json(comment)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp)
        prisma.$disconnect()
    }

})

router.put("/update/:id", auth, async (req, res) => {

    try {

        prisma.$connect()

        let comment = await prisma.comment.update({
            where: {id: +req.params.id},
            data: {
                paragraph: req.body.paragraph
            }
        })
        
        if(!comment) throw new Error('can not update comment')

        res.send(comment).status(200)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp).status(500)
        prisma.$disconnect()
    }

})

router.delete("/delete/:id", auth, async (req, res) => {

    try {

        prisma.$connect()

        let comment = await prisma.comment.delete({
            where: {id: +req.params.id}
        })
        
        if(!comment) throw new Error('can not delete comment')

        res.send(comment).status(200)

        prisma.$disconnect()

    } catch(exp) {
        res.json(exp).status(500)
        prisma.$disconnect()
    }

})


export default router
