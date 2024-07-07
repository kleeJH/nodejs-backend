import { Schema } from "mongoose";

// Define the base schema
const BaseSchema = new Schema({
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
    discriminatorKey: 'kind' // This is used for schema inheritance
});

// Method to soft delete a document
BaseSchema.methods.softDelete = function () {
    this.isDeleted = true;
    return this.save();
};

export default BaseSchema;
