import responseUtils from "../../../common/utils/responseUtils";
import roleCrud from "../cruds/roleCrud";

export default {
    async getRoleList(req, res) {
        try {
            // make so util to extract params, body, query
            let { page, size, sortBy, sortOrder } = req.query
            let results = { page: page, size: size }
            const match = {
                $and: [
                    // some filter criteria,
                    {}
                ]
            }

            const { list, totalCount } = await roleCrud.getRoleListWithAggr(match, page, size, sortBy, sortOrder)

            results.list = list
            results.totalCount = totalCount
            responseUtils.successHandler(res, results);
        } catch (error) {
            responseUtils.errorHandler(res, error);
        }
    }
}