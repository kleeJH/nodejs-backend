import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default {
  async connect() {
    await mongoose
      .connect(process.env.MONGODB_URL, {
        user: process.env.MONGODB_USERNAME,
        pass: process.env.MONGODB_PASSWORD,
        dbName: process.env.MONGODB_DBNAME,
      })
      .then(() => console.log("Connected to MongoDB successfully."))
      .catch((err) => {
        console.log("Error while connecting to MongoDB\n\n", err);
        process.exit(1);
      });
  },

  async disconnect() {
    await mongoose.disconnect();
  },
};
