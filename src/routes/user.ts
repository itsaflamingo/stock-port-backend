import express from "express";
import { updateUserFn, deleteUserFn } from "../controllers/user";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("sign in");
})

router.patch("/", async (req, res) => {
    const result = await updateUserFn(req.body.username, req.body.email, req.body.password, req.body.id)

    res.send(result)
})

router.delete("/", async (_req, res) => {
    const result = await deleteUserFn(_req.body.id)
    res.send(result)
})

export default router;