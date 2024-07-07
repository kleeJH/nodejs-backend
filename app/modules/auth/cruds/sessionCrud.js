import Session from "../schemas/sessionSchema.js";
import { AuthorizationError } from "../../../common/exceptions/exceptions.js";

export default {
    // Common crud functions
    async createSession({ userId, expiresAt }) {
        const session = Session.create({ userId, expiresAt });
        return session;
    },

    async findSessionByUserId(userId) {
        const session = await Session.findOne({ userId });
        return session;
    },

    // Specific crud functions
    async checkSessionHasExpiredByUserId(userId) {
        const session = await Session.findOne({ userId });
        if (!session) {
            throw new AuthorizationError("Session not found");
        }

        if (session.expiresAt < new Date()) {
            return true;
        } else {
            return false;
        }
    },
}