import { connect } from 'mongoose';

const connectDB = async () => {
    try {
       
        const conn = await connect(
            "mongodb+srv://igizeneza100:123@cluster0.zhfb1yk.mongodb.net/Swiss_contact"
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
