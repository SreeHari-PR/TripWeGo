const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
    },
    icon: {
        type: String,  
        required: false,  
        trim: true,
    }, 
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
