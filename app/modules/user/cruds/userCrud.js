import User from "../schemas/userSchema.js";
import { NotFoundError, ExistedError } from "../../../common/exceptions/exceptions.js";

export default {
    // Common crud functions
    async createUser({ username, hashedPassword }) {

        const foundUser = await User.findOne({ username, isDeleted: false });
        if (foundUser) {
            throw new ExistedError("User exists");
        }

        const user = User.create({ username, hashedPassword });
        return user;
    },

    async findUserById(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    },

    async findUserByKey(body) {
        const user = await User.findOne({ ...body, isDeleted: false }, { __v: 0, createdBy: 0, updatedBy: 0, hashedPassword: 0 });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    },

    async updateUserById(userId, data) {
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        return user;
    },

    async deleteUserById(userId) {
        const user = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
        return user;
    },

    async getUserList() {

    },

    // Specific crud functions
    async checkUserExists(username) {
        const user = await User.findOne({ username, isDeleted: false });

        if (user) {
            throw new ExistedError("User exists");
        } else {
            return true;
        }
    },
}