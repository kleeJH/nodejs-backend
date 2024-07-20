import { NotFoundError } from "../../../common/exceptions/exceptions.js";
import Role from "../schemas/roleSchema.js";

export default {
    async createRole(name) {
        const role = Role.create({ name });
        return role;
    },

    async batchCreateRoles(roles) {
        const createdRoles = await Role.insertMany(roles);
        return "Roles created successfully";
    },

    async getRoles() {
        return await Role.find();
    },

    async getRoleByName(name) {
        const role = await Role.findOne({ name });
        if (!role) {
            throw new NotFoundError("Role not found");
        }
        return role;
    },

    async getRoleById(id) {
        const role = await Role.findById(id);
        if (!role) {
            throw new NotFoundError("Role not found");
        }
        return role;
    },

    async deleteAllRoles() {
        await Role.deleteMany({});
    },
}