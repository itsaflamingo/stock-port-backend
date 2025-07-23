import express from "express";
import { setUpUsersTable } from "../controllers/admin_user";

const router = express.Router();

router.get("/", async (_req, res) => {
    console.log("index route executes")
    const status = await setUpUsersTable();
    res.send(status)
});

export default router;