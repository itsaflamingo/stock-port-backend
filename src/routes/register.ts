import express from "express";
import { addUserIfNotExists } from "../controllers/user";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("sign up");
})

router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await addUserIfNotExists(username, email, hashedPassword);
    res.send(result);
})

export default router;