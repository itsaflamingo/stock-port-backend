import express from "express";
import { addUserIfNotExists } from "../controllers/user";
// import { isUserInDb } from "../controllers/user";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("sign up");
})

router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await addUserIfNotExists(username, email, password);
        console.log(result);
    }
    catch (error: any) {
        if (error.message.includes("unique_username_email")) {
            res.status(409).send("User already exists");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
})

export default router;