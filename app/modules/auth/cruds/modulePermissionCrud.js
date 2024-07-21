import { NotFoundError } from "../../../common/exceptions/exceptions.js";
import ModulePermission from "../schemas/modulePermissionSchema.js";
import permissionCrud from "./permissionCrud.js";
import moduleCrud from "./moduleCrud.js";

export default {
    async createModulePermission(body) {
        const modulePermission = ModulePermission.create(body);
        return modulePermission;
    },

    /**
     * Inserts multiple module permissions into the database.
     *
     * @param {{moduleName: String, permissions: String[]}[]} batchModulePermissions - An array of role permission objects to be inserted.
     * @return {Promise<string>} A promise that resolves to a string indicating the success of the operation.
     */
    async batchCreateModulePermissions(batchModulePermissions) {
        for (const modulePermission of batchModulePermissions) {
            const _module = await moduleCrud.getModuleByName(modulePermission.moduleName);
            for (const permissionName of modulePermission.permissions) {
                const permission = await permissionCrud.getPermissionByName(permissionName);
                await ModulePermission.create({ moduleId: _module._id, permissionId: permission._id });
            }
        }
        return "ModulePermissions created successfully";
    },

    async getPermissionsByModuleName(moduleName) {
        const _module = await moduleCrud.getModuleByName(moduleName);
        const modulePermissions = await ModulePermission.find({ moduleId: _module._id }).populate("permissionId");
        if (!modulePermissions && modulePermissions.length === 0) {
            throw new NotFoundError("Permission not found");
        }
        return modulePermissions;
    },

    async deleteAllModulePermissions() {
        await ModulePermission.deleteMany({});
    },
}