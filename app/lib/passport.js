import dotenv from "dotenv";
import passport from "passport";
import userCrud from "../modules/user/cruds/userCrud.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { log } from "../common/utils/loggingUtils.mjs";

dotenv.config();

passport.serializeUser(function (user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(async function (id, cb) {
    let user = await userCrud.findUserById(id);
    cb(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile", "email"]
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user;

            // TODO: Implement flow
            // 1. Check if user oauth account exists
            // 2. If not, create new user
            // 3. If yes, update oauth account and get user
            // 4. return user

            log.info(`User ${user.username} with id [${user._id}] has been created.`);
            log.info(`User ${user.username} with id [${user._id}] has logged in with Google successfully.`);
            return done(null, user);
        }
        catch (err) {
            log.error(err);
            return done(err);
        }
    }
));