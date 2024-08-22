import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    CompanyLogo: {
        type: String,
    },
    CompanyName: {
        type: String,
        unique:true
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
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const company = mongoose.model("Company", CompanySchema)
export default company


// name: {
//     type: String, required: true
// },
// location: {
//     type: String
// },
// website: {
//     type: String
// },
// description: {
//     type: String
// },
// recruiters: [{
//     type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter'
// }],
//     jobs: [{
//         type: mongoose.Schema.Types.ObjectId, ref: 'Job'
//     }],
//         createdAt: {
//     type: Date, default: Date.now
// }
