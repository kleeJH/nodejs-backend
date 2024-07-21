import { NotFoundError } from "../../../common/exceptions/exceptions.js";
import RolePermission from "../schemas/rolePermissionSchema.js";
import permissionCrud from "./permissionCrud.js";
import roleCrud from "./roleCrud.js";

export default {
    async createRolePermission(name) {
        const permission = RolePermission.create({ name });
        return permission;
    },

    /**
     * Inserts multiple role permissions into the database.
     *
     * @param {{roleName: String, permissions: String[]}[]} batchRolePermissions - An array of role permission objects to be inserted.
     * @return {Promise<string>} A promise that resolves to a string indicating the success of the operation.
     */
    async batchCreateRolePermissions(batchRolePermissions) {
        for (const rolePermission of batchRolePermissions) {
            const role = await roleCrud.getRoleByName(rolePermission.roleName);
            for (const permissionName of rolePermission.permissions) {
                const permission = await permissionCrud.getPermissionByName(permissionName);
                await RolePermission.create({ roleId: role._id, permissionId: permission._id });
            }
        }
        return "RolePermissions created successfully";
    },

    async getPermissionsByRoleName(roleName) {
        const role = await roleCrud.getRoleByName(roleName);
        const permission = await RolePermission.find({ roleId: role._id });
        if (!permission) {
            throw new NotFoundError("Permission not found");
        }
        return permission;
    },

    async deleteAllRolePermissions() {
        await RolePermission.deleteMany({});
    },
}