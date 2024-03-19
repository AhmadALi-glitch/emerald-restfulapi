
import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import path from "path"
import apiV1 from "./controllers/v1/index";
import session from "express-session"

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(express.json())

app.use(session({
  secret: process.env.COOKIE_SECRET || "123123123",
  name: 'session',
  cookie: { maxAge: 60 * 60 * 24, signed: true },
  resave: false,
  saveUninitialized: false
}))


app.use("/api/v1", apiV1)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
})

app.use('/static', express.static(path.join(__dirname, '../public')))
app.use('/attachment', express.static(path.join(__dirname, '../public/attachment')))

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
});
