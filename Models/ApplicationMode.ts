import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JOBSCHEMA",
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

const Applicationcom = mongoose.model("Application", ApplicationSchema)
export default Applicationcom