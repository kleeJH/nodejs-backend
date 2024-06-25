import { DatabaseError } from "../../../common/exceptions/exceptions.js";
import responseUtils from "../../../common/utils/responseUtils.js";
import { log } from "../../../common/utils/loggingUtils.mjs";

export default {
  async test(req, res) {
    try {
      log.debug("test");
      responseUtils.successHandler(res, "test");
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  // login: async (req: Request, res: Response) => {},
};
