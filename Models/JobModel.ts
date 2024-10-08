import mongoose, { Document } from "mongoose";

interface JobData extends Document {
    title: string;
    description: string;
    requirements: [];
    salary: number;
    location: string;
    jobtype: string;
    position: number
    experienceLevel: number;
    JobPostDate: Date;
    companyName: string,
    company?: mongoose.Types.ObjectId[];
    CreatedBy?: mongoose.Types.ObjectId[];
    applications?: mongoose.Types.ObjectId[];
}
const JOBSCHEMA: mongoose.Schema<JobData> = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true,
        default: []  // This sets the default to an empty array
    },
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobtype: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: Number,
        required: true
    },
    JobPostDate: {
        type: Date,
        default: Date.now
    },
    companyName: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ]
}, { timestamps: true })

const jobModel = mongoose.model("JOBSCHEMA", JOBSCHEMA)

export default jobModel
