"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    // Check if the authorization header exists
    if (!authorization) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    // Extract the token from the authorization header
    const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing from authorization header" });
    }
    try {
        // Verify the token using the secret key
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "default_secret_key");
        // Attach the decoded user information to the request object
        // req.user = decoded;
        // Pass control to the next middleware or route handler
        next();
    }
    catch (error) {
        console.log("JWT verification error:", error);
        // Respond with a 401 status code for invalid token
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.jwtAuthMiddleware = jwtAuthMiddleware;
