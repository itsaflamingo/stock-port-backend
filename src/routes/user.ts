import express from "express";
import { updateUserFn, deleteUserFn } from "../controllers/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.patch("/", async (req, res) => {
    let hashedPassword = "";
    let result;

    if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10)
    }
    else {
        res.send("Please enter a password");
    }
    try {
        result = await updateUserFn(req.body.id, { username: req.body.username, email: req.body.email, password: hashedPassword, })
    } catch (err) {
        res.send(err);
    }

    res.send(result)
})

router.delete("/", async (_req, res) => {
    const result = await deleteUserFn(_req.body.id)
    res.send(result)
})

export default router;