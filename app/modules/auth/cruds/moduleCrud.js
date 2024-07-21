import { NotFoundError } from "../../../common/exceptions/exceptions.js";
import Module from "../schemas/moduleSchema.js";

export default {
    async createModule(name) {
        const _module = Module.create({ name });
        return _module;
    },

    async batchCreateModules(_module) {
        await Module.insertMany(_module);
        return "Modules created successfully";
    },

    async getModules() {
        return await Module.find();
    },

    async getModuleByName(name) {
        const _module = await Module.findOne({ name });
        if (!_module) {
            throw new NotFoundError("Module not found");
        }
        return _module;
    },

    async getModuleById(id) {
        const _module = await Module.findById(id);
        if (!_module) {
            throw new NotFoundError("Module not found");
        }
        return _module;
    },

    async deleteAllModules() {
        await Module.deleteMany({});
    },
}