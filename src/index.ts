import express, {Request, Response} from "express";
import dotenv from 'dotenv';
import { requireAuth } from "./middleware/auth";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();

app.use(express.json());
const port = 3000;

app.get('/api/positions', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;

    // Query DB, return data
    res.json({ positions: [], userId });
  } catch (err) {
    console.error('Error in /positions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  return;
});

app.use("/user", usersRouter);

app.listen(port, () => {
  console.log("Server running on port", port);
});
