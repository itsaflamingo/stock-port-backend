import express from "express";
import { setUpUsersTable } from "../controllers/user";
import { setUpAdmin } from "../controllers/user";

const router = express.Router();

router.get("/", async (_req, res) => {
    console.log("index route executes")
    const status = await setUpUsersTable();
    const admin = await setUpAdmin();

    res.send({ status, admin });
});

export default router;