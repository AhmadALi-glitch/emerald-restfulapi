
import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import path from "path"
import apiV1 from "./controllers/api_v1";

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 3000;


app.use("/api/v1", apiV1)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
})

app.use('/static', express.static(path.join(__dirname, '../public')))
app.use('/attachment', express.static(path.join(__dirname, '../public/attachment')))

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
});
