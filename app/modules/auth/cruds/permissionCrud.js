import { NotFoundError } from "../../../common/exceptions/exceptions.js";
import Permission from "../schemas/permissionSchema.js";

export default {
    async createPermission(name) {
        const permission = Permission.create({ name });
        return permission;
    },

    async batchCreatePermissions(permissions) {
        await Permission.insertMany(permissions);
        return "Permissions created successfully";
    },

    async getPermissions() {
        return await Permission.find();
    },

    async getPermissionByName(name) {
        const permission = await Permission.findOne({ name });
        if (!permission) {
            throw new NotFoundError("Permission not found");
        }
        return permission;
    },

    async getPermissionById(id) {
        const permission = await Permission.findById(id);
        if (!permission) {
            throw new NotFoundError("Permission not found");
        }
        return permission;
    },

    async deleteAllPermissions() {
        await Permission.deleteMany({});
    },
}