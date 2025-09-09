import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("sign in");
})

export default router;