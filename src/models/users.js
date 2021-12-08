/**
 * This handles all the required configuration for the Sample model.
 * @module MODELS:Sample
 */

const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    // Model Required fields
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeStamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    createdOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updatedOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    // Custom Fields
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['technician','client'],
        required: true,
    },
    fullName: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
});

model('User', userSchema);
