"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (usedata) => {
    if (!process.env.SECRET_KEY) {
        console.error("SECRET_KEY is not defined in the environment variables");
        throw new Error("SECRET_KEY is not defined");
    }
    return jsonwebtoken_1.default.sign(usedata, process.env.SECRET_KEY);
};
exports.generateToken = generateToken;
