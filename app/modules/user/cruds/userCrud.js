import User from "../schemas/userSchema.js";
import { ForbiddenError } from "../../../common/exceptions/exceptions.js";

export default {
    // Common crud functions
    async createUser({ username, hashedPassword }) {
        const user = User.create({ username, hashedPassword });
        return user;
    },

    async findUserById(userId) {
        const user = await User.findById(userId);
        return user;
    },

    async findUserByKey(key) {
        const user = await User.findOne({ key });
        return user;
    },

    async updateUserById(userId, data) {
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        return user;
    },

    async getUserList() {

    },

    // Specific crud functions
    async checkUserExists(username) {
        const user = await User.findOne({ username });

        if (user) {
            throw new ForbiddenError("User already exists");
        } else {
            return true;
        }
    },
}