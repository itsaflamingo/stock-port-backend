import express from "express";
import { updateUserFn, deleteUserFn } from "../controllers/user";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("sign in");
})

router.patch("/", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const result = await updateUserFn(req.body.id, { username: req.body.username, email: req.body.email, password: hashedPassword, })

    res.send(result)
})

router.delete("/", async (_req, res) => {
    const result = await deleteUserFn(_req.body.id)
    res.send(result)
})

export default router;