
import express from "express";

const router = express.Router();

router.get("/:id", (req, res) => {
    res.send(req.params.id).status(200);
})

router.post('/create', (req, res) => {
    res.send(req)
})

export default router;
