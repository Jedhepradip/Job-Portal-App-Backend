"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    ProfileImg: {
        type: String,
        // required: true,
        default: "",
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "Recruiter"]
    },
    profile: {
        bio: {
            type: String,
        },
        skills: {
            type: [String], // Use an array of strings if multiple skills are stored        
        },
        ResumeFile: {
            type: String,
        },
        company: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Company"
        }
    }
}, { timestamps: true });
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
// fullName: { type: String, required: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// phoneNumber: { type: String },
// resumeUrl: { type: String }, // URL to the user's uploaded resume
// skills: [String], // Array of skills
// education: [{
//     institution: String,
//     degree: String,
//     fieldOfStudy: String,
//     startDate: Date,
//     endDate: Date
// }],
// experience: [{
//     company: String,
//     position: String,
//     startDate: Date,
//     endDate: Date,
//     description: String
// }],
// appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
// createdAt: { type: Date, default: Date.now }
