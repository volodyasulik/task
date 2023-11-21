/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/no-extraneous-dependencies */
import bodyParser from "body-parser";
import express from "express";
import "dotenv/config";
import passport from "passport";
import cors from "cors";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import AppRouter from "./routes";
import connectDB from "./config/database";
import { Server } from "socket.io";

const app = express();
const router = new AppRouter(app);

connectDB();

// Express configuration
app.set("port", process.env.PORT || 4200);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["total-count"],
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
router.init();

const port = app.get("port");
// eslint-disable-next-line no-console
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
export const io = new Server(server);
export default server;
