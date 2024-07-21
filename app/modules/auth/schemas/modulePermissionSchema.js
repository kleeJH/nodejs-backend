import BaseSchema from "../../../common/schemas/baseSchema.js";
import { Schema, model, Types } from "mongoose";

const modulePermissionSchema = new Schema({
    moduleId: {
        type: Types.ObjectId,
        ref: "modules",
        required: true
    },
    permissionId: {
        type: Types.ObjectId,
        ref: "permissions",
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

modulePermissionSchema.add(BaseSchema);

const ModulePermission = model("rolepermissions", modulePermissionSchema);
export default ModulePermission;
