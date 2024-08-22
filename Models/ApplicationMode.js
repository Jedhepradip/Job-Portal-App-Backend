"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ApplicationSchema = new mongoose_1.default.Schema({
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "JOBSCHEMA",
        required: true
    },
    applicant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });
const Applicationcom = mongoose_1.default.model("Application", ApplicationSchema);
exports.default = Applicationcom;
