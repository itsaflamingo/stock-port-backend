import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("signup");
    
    console.log(req);
})

export default router;