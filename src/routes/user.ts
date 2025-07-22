import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("sign in");
    console.log(req);
})

export default router;