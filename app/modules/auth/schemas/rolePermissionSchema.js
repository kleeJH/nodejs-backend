import BaseSchema from "../../../common/schemas/baseSchema.js";
import { Schema, model, Types } from "mongoose";

const rolePermissionSchema = new Schema({
    roleId: {
        type: Types.ObjectId,
        ref: "roles",
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

rolePermissionSchema.add(BaseSchema);

const RolePermission = model("rolepermissions", rolePermissionSchema);
export default RolePermission;
