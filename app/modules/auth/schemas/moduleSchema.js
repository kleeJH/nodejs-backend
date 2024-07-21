import BaseSchema from "../../../common/schemas/baseSchema.js";
import { Schema, model } from "mongoose";

const moduleSchema = new Schema({
    name: {
        type: String,
        required: [true, "Module name is required"],
    },
    description: {
        type: String,
        required: [true, "Module description is required"],
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

moduleSchema.add(BaseSchema);

const Module = model("modules", moduleSchema);
export default Module;
