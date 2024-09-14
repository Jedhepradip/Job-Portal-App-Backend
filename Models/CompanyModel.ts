import mongoose, { Document } from "mongoose";

interface Company extends Document {
    CompanyLogo: string,
    CompanyName: string,
    description: string,
    website: string,
    location: string,
    createdAt: Date,
    JobsId?: mongoose.Types.ObjectId[],
    UserId?: mongoose.Types.ObjectId[];
}

const CompanySchema: mongoose.Schema<Company> = new mongoose.Schema({
    CompanyLogo: {
        type: String,
    },
    CompanyName: {
        type: String,
        unique: true
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    JobsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JOBSCHEMA"
        }
    ],
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const company = mongoose.model("Company", CompanySchema)
export default company
