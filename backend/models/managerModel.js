// src/models/manager.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const managerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    license: { 
        type: String
     },
    kyc: { 
        type: String
     },
     profilePicture: {
        type: String,
        default: ''
      },  
    approved: {
         type: Boolean, 
         default: false 
        },
}, {
    timestamps: true
});

managerSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTSECRETKEY, { expiresIn: '7d' });
    return token;
};

const Manager = mongoose.model('Manager', managerSchema);

function validateManager(manager) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        license: Joi.string().uri().optional(), 
        kyc: Joi.string().uri().optional(), 
    });

    return schema.validate(manager);
}

module.exports = {
    Manager,
    validateManager
};
