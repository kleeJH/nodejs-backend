// ##########################################################################
// Main Imports
import dotenv from "dotenv";
import express from "express";
import chalk from "chalk";
import morgan from "morgan";
// import session from "express-session";
import cors from "cors";
import database from "./app/lib/database.js";
import { logger } from "./app/common/utils/loggingUtils.mjs";
// import { verifyRequestOrigin } from "lucia";
// import { lucia } from "./app/lib/lucia.js";

dotenv.config();
// ##########################################################################


// ##########################################################################
// App Setups and Configurations
const app = express();

// 1. Setup morgan to use winston for request logging
// app.use(morgan(`:remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`, { stream: logger.stream }));
app.use(morgan(`:method :url :status :res[content-length]CL - :response-time ms`, { stream: logger.stream }));

// 2. Setting session
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

// 3. Setting cors
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

// 4. Database Connection
database.connect();

// // Validate Lucia session
// app.use(async (req, res, next) => {
//   // Extract the session ID from the cookies in the request headers
//   const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
//   // If there is no session ID, set user and session to null and proceed to the next middleware
//   if (!sessionId) {
//     res.locals.user = null;
//     res.locals.session = null;
//     return next();
//   }

//   // Validate the session ID and retrieve the session and user information
//   const { session, user } = await lucia.validateSession(sessionId);
//   // If the session is valid and fresh, renew the session by setting a new cookie
//   if (session && session.fresh) {
//     res.appendHeader(
//       "Set-Cookie",
//       lucia.createSessionCookie(session.id).serialize()
//     );
//   }
//   // If the session is not valid, create and set a blank session cookie
//   if (!session) {
//     res.appendHeader(
//       "Set-Cookie",
//       lucia.createBlankSessionCookie().serialize()
//     );
//   }
//   // Set the session and user information to res.locals to be accessible in the next middleware
//   res.locals.session = session;
//   res.locals.user = user;
//   return next();
// });
// ##########################################################################


// ##########################################################################
// Cronjob Imports
import { startDatabaseBackupCron } from "./app/cronjob/databaseBackup.js";
// ##########################################################################


// ##########################################################################
// Cronjobs
startDatabaseBackupCron();
// ##########################################################################


// ##########################################################################
// Route Imports
// V1
import authRouter from "./app/routes/v1/auth.routes.js";
// ##########################################################################


// ##########################################################################
// Routes
// V1
app.use("/v1/auth", authRouter);
// ##########################################################################


// ##########################################################################
// Run Backend
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[${chalk.green("✓")}]`, `Server is running on port ${chalk.cyan(PORT)} with ${chalk.magenta(process.env.NODE_ENV.toUpperCase())} environment.`);
});
// ##########################################################################
