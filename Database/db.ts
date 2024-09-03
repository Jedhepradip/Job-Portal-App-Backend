import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODBURL || ""

export const connectDB = async () => {
    try {        
        await mongoose.connect(mongodbUrl || "Databse not conncted") 
        // await mongoose.connect("mongodb://localhost:27017/JOBPORTALS") 
        console.log("Database Connection successfully...");
    } catch (error) {
       console.log(error);        
    }
}