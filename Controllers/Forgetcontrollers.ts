import { Request, Response } from "express";
import UserModel from "../Models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"

export const ForgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Fixing email search by passing the search condition as an object
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }

        if (user) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                secure: true,
                port: Number(process.env.NODEMAILER_PORT) || 465,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            });

            const generateOTP = () => {
                return Math.floor(1000 + Math.random() * 9000);
            };

            const otp = generateOTP();

            // Enhanced HTML for OTP
            const info = await transporter.sendMail({
                from: process.env.FROM,
                to: user.email, // Corrected to send the email to the user's email
                subject: "Password Reset Request",
                text: `Your OTP is: ${otp}`,
                html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: black;">Reset Your Password</h2>
                <p>Hi ${user.name},</p>
                <p>We received a request to reset your password. Please use the One-Time Password (OTP) below to proceed:</p>
                <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f4f4f4; border: 2px solid black; text-align: center; border-radius: 8px;">
                    ${otp}
                </div>
                <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
                <p>To reset your password:</p>
                <ol>
                    <li>Enter the OTP on the password reset page.</li>
                    <li>If correct, you’ll be prompted to create a new password.</li>
                    <li>Choose a strong and unique password for your account.</li>
                </ol>
                <p>If you didn’t request this, please ignore this email.</p>
                <footer style="margin-top: 20px; text-align: center; color: #666;">
                    <hr>
                    <p>If you have any questions, contact our support team.</p>
                </footer>
            </div>
            `,
            });
            console.log(info.response);
            return res.status(200).json({ message: "OTP sent successfully..." });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const setUpNewPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const userId = req.params.id;

        if (!password) {
            return res.status(400).json({ message: "Password is missing." });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 11);

        // Update the user's password
        const userUpdated = await UserModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },  // Updating password
            { new: true, select: 'password' } // Return the updated document
        );

        if (!userUpdated) {
            return res.status(400).json({ message: "Failed to update password." });
        }

        return res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};