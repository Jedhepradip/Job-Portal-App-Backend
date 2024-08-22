"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JOBSCHEMA = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    requiements: [
        {
            type: String,
            required: true
        }
    ],
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
    experience: {
        type: Number,
        required: true
    },
    JobPostDate: {
        type: Date,
        default: Date.now
    },
    company: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    CreatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applications: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Application"
        }
    ]
}, { timestamps: true });
const jobModel = mongoose_1.default.model("JOBSCHEMA", JOBSCHEMA);
exports.default = jobModel;
// title: { type: String, required: true },
//     description: { type: String, required: true },
//     company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
//     recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
//     location: { type: String },
//     salary: { type: String },
//     jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'], required: true },
//     experienceRequired: { type: String }, // E.g., "2-4 years"
//     skillsRequired: [String],
//     applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     postedAt: { type: Date, default: Date.now }
