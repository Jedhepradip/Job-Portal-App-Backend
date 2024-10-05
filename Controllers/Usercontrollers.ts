import { Response, Request } from "express"
import UserData from "../Models/UserModel";
import bcrypt from "bcrypt"
import { generateToken } from "../Middewares/generateToken";
import UserModel from "../Models/UserModel";
import nodemailer from "nodemailer"
import { v2 as cloudinary } from 'cloudinary';

interface MulterFile {
    originalname: string;
    path: string;
    filename: string;
    mimetype: string;
    size: number;
    // Add other properties from Multer's File type if necessary
}

interface UserPayload {
    id: string,
    email: string,
    name: string,
}

interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export const sendLoginOtp = async (req: Request, res: Response) => {
    try {
        const { email, number } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User already exist with this Email..." })
        }
        const MobileNum = await UserModel.findOne({ mobile: number })
        if (MobileNum) {
            return res.status(400).json({ message: "User already exist with this Number..." })
        }
        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Set up the email transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: Number(process.env.NODEMAILER_PORT) || 465,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        // Send OTP email
        const info = await transporter.sendMail({
            from: process.env.FROM,
            to: email, // Send the email to the user
            subject: "Sign In Confirmation & OTP Verification", // Subject line
            text: `Your OTP is ${otp}`, // Fallback text
            html: `
               <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: black; text-aling:center;">Hello Confirmation & OTP Verification </h2>
                <p>We noticed a successful sign-in to your account from a new device or location. For your security, we require additional verification before you can continue.</p>
                
                <p>Please use the following One-Time Password (OTP) to verify your identity:</p>
                <div style="background-color: #f4f4f4; padding: 10px 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; max-width: 200px; margin: auto;">
                    ${otp}
                </div>
                
                <p style="margin-top: 20px;">The OTP is valid for the next 10 minutes. If you did not request this verification, please ignore this email or contact our support team immediately.</p>
                
                <h3 style="margin-top: 30px; color: #333;">Sign In Details:</h3>
                <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
                </div>
                
                <p style="margin-top: 30px;">Thank you for using our service. We are committed to keeping your account secure.</p>
                
                <p>Best regards, <br/> The Support Team</p>
                
                <p style="font-size: 12px; color: #888; margin-top: 20px;">If you did not sign in or request this OTP, please contact us immediately at support@yourcompany.com.</p>
            </div>
            `,
        });
        return res.status(200).json({ message: "OTP sent successfully Check Your Email... ", otp });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//User Registration
export const RegistrationUser = async (req: Request, res: Response) => {
    try {
        const { name, email, mobile, password, role } = req.body

        if (!req.file) {
            return res.status(400).json({ message: "Profile Img Not Found" });
        }

        const result = await cloudinary.uploader.upload(req.file!.path);

        if (!name || !email || !mobile || !password || !role) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        const Emailexists = await UserData.findOne({ email: email })
        if (Emailexists) {
            return res.status(400).json({ message: "User already exist with this email..." })
        }

        const mobileexist = await UserData.findOne({ mobile: mobile })
        if (mobileexist) {
            return res.status(400).json({ message: "User already exist with this mobile number..." })
        }

        if (role == "recruiter") {
            if (!(email == "pradipjedhe69@gmail.com")) {
                return res.status(400).json({ message: "Only Administrators Can Register For This Role" });
            }
        }

        const haspassword = await bcrypt.hash(password, 11)
        const User = new UserData({
            ProfileImg: result.secure_url,
            name,
            email,
            mobile,
            password: haspassword,
            role,
        })

        const payload: UserPayload = {
            id: User.id,
            email: User.email,
            name: User.name,
        };

        const token = generateToken(JSON.stringify(payload));
        await User.save()
        return res.status(200).json({ message: "Registration Successful..", token, User })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" })
    }
}

//User Login
export const UserLogin = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;
        let Useremail: any = await UserData.findOne({ email })

        if (!Useremail) {
            return res.status(404).json({ message: "User not Found..." })
        }

        let machpassword = await bcrypt.compare(password, Useremail.password)

        if (!machpassword) return res.status(400).json({ message: "Incorrect Password try again..." })

        if (role !== Useremail?.role) return res.status(400).json({ message: "Account doesn't exist with current role..." })

        const payload: UserPayload = {
            id: Useremail._id,
            email: Useremail.email,
            name: Useremail.name,
        }

        const token = generateToken(JSON.stringify(payload))
        return res.status(200).json({ message: "User login successfully...", token })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}

//User Get Information
export const UserInfomation = async (req: CustomRequest, res: Response) => {
    try {
        const UserId = req.user?.id;
        const user = await UserData.findById(UserId).populate({ path: "SaveJobs" });
        if (!user) {
            return res.status(400).json({ message: "User Not Found " })
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const UserProfileUpdate = async (req: CustomRequest, res: Response) => {
    try {
        const { name, email, mobile, bio, skills } = req.body;
        const userId = req.user?.id;
        const reqbody = req.body;
        const user = await UserData.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        reqbody.skills = skills.split(",")

        if (email) {
            const EmailCheck = await UserData.findOne({ email })
            if (EmailCheck) {
                if (!(EmailCheck.email == user.email)) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            }
        }

        if (mobile) {
            const MobileCheck = await UserData.findOne({ mobile })
            if (MobileCheck) {
                if (!(MobileCheck.mobile == user.mobile)) {
                    return res.status(400).json({ message: "Mobile Number already exists" });
                }
            }
        }

        type Files = {
            [fieldname: string]: MulterFile[];
        }

        if (req.files && (req.files as Files).ResumeFile) {
            const result1 = await cloudinary.uploader.upload((req.files as Files)?.ResumeFile[0].path);
            reqbody.ResumeFile = result1.secure_url; // Or use 'path' or other properties            
        } else {
            reqbody.ResumeFile = user?.ResumeFile
        }

        if (req.files && (req.files as Files).ProfileImg) {
            const result2 = await cloudinary.uploader.upload((req.files as Files)?.ProfileImg[0].path);
            reqbody.ProfileImg = result2.secure_url

        } else {
            reqbody.ProfileImg = user?.ProfileImg
        }

        const updatedUser = await UserData.findByIdAndUpdate(userId, reqbody, {
            new: true
        })

        return res.status(200).json({ message: "Profile updated successfully", updatedUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
