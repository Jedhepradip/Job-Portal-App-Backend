import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";

export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
        const decoded = jwt.verify(token, process.env.SECRET_KEY || "default_secret_key");

        // Attach the decoded user information to the request object
        
        // req.user = decoded;

        // Pass control to the next middleware or route handler
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        // Respond with a 401 status code for invalid token
        return res.status(401).json({ message: "Invalid token" });
    }
};
