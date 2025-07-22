import express from "express";
import { setUpUsersTable } from "../controllers/admin_user";

const router = express.Router();

router.get("/", (req, res) => {
    setUpUsersTable();
});

export default router;