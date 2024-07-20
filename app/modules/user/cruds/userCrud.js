import User from "../schemas/userSchema.js";
import { NotFoundError, ExistedError } from "../../../common/exceptions/exceptions.js";

const userFilter = { __v: 0, createdBy: 0, updatedBy: 0, passwordHash: 0, passwordSalt: 0 }
export default {
    // Common crud functions
    async createUser(username, body) {

        const foundUser = await User.findOne({ username, isDeleted: false });
        if (foundUser) {
            throw new ExistedError("User exists");
        }

        const newUser = await User.create(body);
        const user = await User.findById(newUser._id, userFilter);

        return user;
    },

    async findUserById(userId) {
        const user = await User.findById(userId, userFilter);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    },

    async findUserByKey(body) {
        const user = await User.findOne({ ...body, isDeleted: false }, userFilter);

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