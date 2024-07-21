import BaseSchema from "../../../common/schemas/baseSchema.js";
import { ROLE_TYPE } from "../../../common/enums/authEnumTypes.js";
import { Schema, model, Types } from "mongoose";

const roleSchema = new Schema({
    name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true,
        enum: Object.values(ROLE_TYPE),
    },
    description: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

roleSchema.add(BaseSchema);

const Role = model("roles", roleSchema);
export default Role;
