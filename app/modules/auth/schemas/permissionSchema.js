import BaseSchema from "../../../common/schemas/baseSchema.js";
import { Schema, model } from "mongoose";

const permissionSchema = new Schema({
    name: {
        type: String,
        required: [true, "Permission name is required"],
    },
    description: {
        type: String,
        required: [true, "Permission description is required"],
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

permissionSchema.add(BaseSchema);

const Permission = model("permissions", permissionSchema);
export default Permission;
