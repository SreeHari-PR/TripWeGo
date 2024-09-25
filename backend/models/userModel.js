// src/models/user.js
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')
const Joi=require('joi')
const userSchema = new mongoose.Schema({
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
    profilePicture: {
        type: String,
        default: '',
      },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }, 
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWTSECRETKEY,{expiresIn:'7d'})
    return token;
};
const User = mongoose.model('User', userSchema);
function validate(user) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
     
    });
  
    return schema.validate(user);
  }
  

module.exports ={ User,
    validate,
}
