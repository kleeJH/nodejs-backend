import { Schema, model } from "mongoose";
import BaseSchema from "../../../common/schemas/baseSchema.js";

const userTokenSchema = new Schema({
    refreshToken: {
        type: String,
        required: [true, "Refresh Token is required"],
    },
})
    .add(BaseSchema);

const userTokenModel = model("usertokens", userTokenSchema);
export default userTokenModel;
