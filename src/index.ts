import express from "express";

const app = express();

app.use(express.json());
const port = 3000;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
