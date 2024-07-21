import { NotFoundError } from "../../../common/exceptions/exceptions.js";
import RoleModule from "../schemas/roleModuleSchema.js";
import moduleCrud from "./moduleCrud.js";
import roleCrud from "./roleCrud.js";

export default {
    async createRoleModule(body) {
        const roleModule = RoleModule.create(body);
        return roleModule;
    },

    /**
     * Inserts multiple role modules into the database.
     *
     * @param {{roleName: String, moduleName: String}[]} batchRoleModules - An array of role permission objects to be inserted.
     * @return {Promise<string>} A promise that resolves to a string indicating the success of the operation.
     */
    async batchCreateRoleModules(batchRoleModules) {
        for (const roleModule of batchRoleModules) {
            const role = await roleCrud.getRoleByName(roleModule.roleName);
            const module = await moduleCrud.getModuleByName(roleModule.moduleName);
            await RoleModule.create({ roleId: role._id, moduleId: module._id, isActive: true });
        }
        return "RoleModules created successfully";
    },

    async getModulesByRoleName(roleName) {
        const role = await roleCrud.getRoleByName(roleName);
        const roleModules = await RoleModule.find({ roleId: role._id }).populate("moduleId");
        if (!roleModules && roleModules.length === 0) {
            throw new NotFoundError("Modules not found");
        }
        return roleModules;
    },

    async deleteAllRoleModules() {
        await RoleModule.deleteMany({});
    },
}