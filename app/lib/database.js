import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";
import { logger } from "../common/utils/loggingUtils.mjs";

dotenv.config();

export default {
  async connect() {
    await mongoose
      .connect(process.env.MONGODB_URL, {
        user: process.env.MONGODB_USERNAME,
        pass: process.env.MONGODB_PASSWORD,
        dbName: process.env.MONGODB_DBNAME,
      })
      .then(() => console.log(`[${chalk.green("✓")}] `, `Connected to ${chalk.cyan("MongoDB")} on [${chalk.magenta(process.env.MONGODB_DBNAME)}] successfully.`))
      .catch((err) => {
        logger.error("Error while connecting to MongoDB!");
        logger.error(err);
        process.exit(1);
      });
  },

  async disconnect() {
    await mongoose.disconnect();
  },
};
