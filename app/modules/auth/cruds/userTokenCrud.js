import UserToken from "../schemas/userTokenSchema.js";
import { AuthorizationError } from "../../../common/exceptions/exceptions.js";

export default {
    async createUserToken(body) {
        const userToken = UserToken.create(body);
        return userToken;
    },

    async getUserTokenByRefreshToken(refreshToken) {
        const userToken = await UserToken.findOne({ refreshToken: refreshToken });

        if (!userToken) {
            throw new AuthorizationError("Refresh token not found");
        } else if (userToken.isDeleted) {
            throw new AuthorizationError("Refresh token has been invalidated");
        }
        return userToken;
    },

    async invalidateAllUserTokensByUserId(userId) {
        await UserToken.updateMany({ createdBy: userId, isDeleted: false }, { isDeleted: true });
    },

    async deleteAllInvalidatedUserTokensByUserId(userId) {
        await UserToken.deleteMany({ createdBy: userId, isDeleted: true });
    }
}