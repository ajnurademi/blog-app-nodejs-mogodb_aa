const mongoose = require('mongoose');

// trying to connect to DB          
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`DB connected:${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;