import express, {Request, Response, RequestHandler} from "express";
import dotenv from 'dotenv';
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();

app.use(express.json());
const port = 3000;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

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

app.listen(port, () => {
  console.log("Server running on port", port);
});
