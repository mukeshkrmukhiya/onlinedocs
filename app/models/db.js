const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

module.exports = connectDB;
