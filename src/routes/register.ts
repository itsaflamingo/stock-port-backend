import express from "express";
import { addUserIfNotExists } from "../controllers/user";
// import { isUserInDb } from "../controllers/user";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("sign up");
})

router.post("/", (req, res) => {
    const { username, email, password } = req.body;
    res.send(addUserIfNotExists(username, email, password));
    console.log("REQ.body", req.body);
})

export default router;