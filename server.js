// ##########################################################################
// Main Imports
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { logger } from "./app/common/utils/loggingUtils.mjs";
import morgan from "morgan";
// import session from "express-session";
import cors from "cors";
import database from "./app/lib/database.js";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "./app/lib/lucia.js";

dotenv.config();
// ##########################################################################


// ##########################################################################
// Route Imports
import authRouter from "./app/routes/auth.routes.js";
// ##########################################################################


// ##########################################################################
// App Setups and Configurations
const app = express();

// Ensure log directory exists
// const logDirectory = path.join(__dirname, 'logs');
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

// Setup morgan to use winston for request logging
app.use(morgan(":method :url :status :res[content-length]CL - :response-time ms", { stream: logger.stream }));

// Setting session
// var sess = {
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {}
// }
// if (process.env.NODE_ENV === "prod") {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
// }
// app.use(session(sess));

// Setting cors
var corsOptions = {
  credentials: true,
};

if (process.env.NODE_ENV === "local") {
  corsOptions.origin = process.env.HOST_LOCAL + ":" + process.env.PORT;
} else if (process.env.NODE_ENV === "development") {
  corsOptions.origin = process.env.HOST_DEV + ":" + process.env.PORT;
} else if (process.env.NODE_ENV === "uat") {
  corsOptions.origin = process.env.HOST_UAT + ":" + process.env.PORT;
} else if (process.env.NODE_ENV === "production") {
  corsOptions.origin = process.env.HOST_PROD + ":" + process.env.PORT;
} else {
  corsOptions.origin = "*";
  corsOptions.credentials = false;
}

app.use(cors(corsOptions));

app.use(express.json()); // only parse json objects
app.use(express.urlencoded({ extended: true })); // only parse urlencoded objects

// Database Connection
database.connect();

// Lucia Authentication
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     return next();
//   }
//   const originHeader = req.headers.origin ?? null;
//   const hostHeader = req.headers.host ?? null;
//   if (
//     !originHeader ||
//     !hostHeader ||
//     !verifyRequestOrigin(originHeader, [hostHeader])
//   ) {
//     return res.status(403).end();
//   }
//   return next();
// });

// app.use(async (req, res, next) => {
//   const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
//   if (!sessionId) {
//     res.locals.user = null;
//     res.locals.session = null;
//     return next();
//   }

//   const { session, user } = await lucia.validateSession(sessionId);
//   if (session && session.fresh) {
//     res.appendHeader(
//       "Set-Cookie",
//       lucia.createSessionCookie(session.id).serialize()
//     );
//   }
//   if (!session) {
//     res.appendHeader(
//       "Set-Cookie",
//       lucia.createBlankSessionCookie().serialize()
//     );
//   }
//   res.locals.session = session;
//   res.locals.user = user;
//   return next();
// });

// Cronjobs

// Routes
app.use("/auth", authRouter);

// Run Backend
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[START] Server is running on port ${PORT}`);
});
