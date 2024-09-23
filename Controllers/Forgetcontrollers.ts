import { Request, Response } from "express";
import UserModel from "../Models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"

export const ForgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne(email); // Fixing email search        

        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }

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
            to: user.email, // Email sent to the user
            subject: "Password Reset Request",
            text: `Your OTP is: ${otp}`, // Fallback text
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding-left: 20px; padding-right:20px; padding-button:20px; padding-top:0px;">
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

        return res.status(200).json({ message: "OTP sent successfully...", user, otp });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const setUpNewPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const UserId = req.params.id;
        console.log(req.body);

        const user = await UserModel.findById(UserId)
        if (!password) {
            return res.status(400).json({ message: "Something is missing..." })
        }
        if (!user) {
            return res.status(400).json({ message: "User not Found" })
        }

        const hashpassword: any = await bcrypt.hash(password, 11)

        const userupdated = await UserModel.findByIdAndUpdate(UserId, hashpassword, { new: true }).select("password");
        console.log(userupdated);
        await user.save();
        return res.status(200).json({ message: "User Updated Password..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })

    }
}