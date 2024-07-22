import { ROLE_TYPE } from "../../../common/enums/authEnumTypes.js";
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

    async getRoleListWithAggr(match, page = 1, size = 10, sortBy, sortOrder) {
        let aggregationPipeline = [{ $match: match }];

        let totalCount = await Role.aggregate([...aggregationPipeline, { $group: { _id: null, total: { $sum: 1 } } }]);
        totalCount = totalCount[0] ? totalCount[0].total : 0;

        aggregationPipeline.push(
            { $sort: { [sortBy]: sortOrder } },
            { $skip: (page - 1) * size },
            { $limit: size }
        );

        // // Facet
        // aggregationPipeline.push({
        //     $facet: {
        //         metadata: [{ $count: "total" }],
        //         user: [
        //             // Pipeline for aggregation
        //             { $match: { name: ROLE_TYPE.USER } },
        //             // you can add additional fields here
        //             // or do more aggregation in this pipeline
        //         ],
        //         admin: [
        //             // Pipeline for aggregation
        //             { $match: { admin: ROLE_TYPE.ADMIN } },
        //             // you can add additional fields here
        //             // or do more aggregation in this pipeline
        //         ],
        //     },
        // });

        // // Combine aggregations
        // aggregationPipeline.push(
        //     {
        //         $project: {
        //             combined: {
        //                 $concatArrays: ["$user", "$admin"]
        //             }
        //         }
        //     },
        //     { $unwind: "$combined" },
        //     { $replaceRoot: { newRoot: "$combined" } }
        // );

        // // Final sorting
        // aggregationPipeline.push({ $sort: { [sortBy]: sortOrder } });

        const list = await Role.aggregate(aggregationPipeline);

        return { list, totalCount };
    }
}