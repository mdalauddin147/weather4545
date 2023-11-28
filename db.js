const mongoose = require('mongoose');
const localDB = 'mongodb://localhost:27017/weatherapp';

const connectDB = async () => {
    try {
        await mongoose.connect(localDB);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

module.exports = connectDB;
