
require('dotenv').config();
const mongoose=require('mongoose');

const connectDB = async () => {
   
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to Database');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
};

module.exports = connectDB;