import { connect } from "mongoose"
export const connectDB = async () =>{
    try {
        connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connect successfully`);
    } catch (error) {
         console.log("Error at connectDB.ts: " , error)
         throw new Error('Error while connecting MongoDB');
    }
}