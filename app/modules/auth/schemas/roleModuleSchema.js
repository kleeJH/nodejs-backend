import BaseSchema from "../../../common/schemas/baseSchema.js";
import { Schema, model, Types } from "mongoose";

const roleModuleSchema = new Schema({
    roleId: {
        type: Types.ObjectId,
        ref: "roles",
        required: true
    },
    moduleId: {
        type: Types.ObjectId,
        ref: "modules",
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

roleModuleSchema.add(BaseSchema);

const RoleModule = model("rolemodules", roleModuleSchema);
export default RoleModule;
