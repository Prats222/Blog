import mongoose from 'mongoose';

const Connection = async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL)
        console.log(`DB is connected ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in MongoDB ${error}`);
    }
}

export default Connection;