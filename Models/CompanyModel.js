"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CompanySchema = new mongoose_1.default.Schema({
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
    UserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
const company = mongoose_1.default.model("Company", CompanySchema);
exports.default = company;
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
