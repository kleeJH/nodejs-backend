import { DatabaseError } from "../../../common/exceptions/exceptions.js";
import responseUtils from "../../../common/utils/responseUtils.js";

export default {
  async test(req, res) {
    try {

      responseUtils.successHandler(res, result);
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  // login: async (req: Request, res: Response) => {},
};
