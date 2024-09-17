import { Response, Request } from "express"
import UserData from "../Models/UserModel";
import bcrypt from "bcrypt"
import { generateToken } from "../Middewares/generateToken";


interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

//User Registration
export const RegistrationUser = async (req: Request, res: Response) => {
    try {
        const { name, email, mobile, password, role } = req.body

        console.log(req.body);

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

        const haspassword = await bcrypt.hash(password, 11)
        const User = new UserData({
            name,
            email,
            mobile,
            password: haspassword,
            role,
        })

        interface UserPayload {
            id: string;
            email: string;
            name: string;
        }
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
        let Useremail = await UserData.findOne({ email })
        if (!Useremail) {
            return res.status(404).json({ message: "User not Found..." })
        }

        let machpassword = await bcrypt.compare(password, Useremail.password)
        if (!machpassword) {
            return res.status(400).json({ message: "Incorrect Password try again..." })
        }

        if (role !== Useremail.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role..." })
        }

        interface UserPayload {
            id: string,
            email: string,
            name: string,
        }

        const payload: UserPayload = {
            id: Useremail._id,
            email: Useremail.email,
            name: Useremail.name,
        }

        const token = generateToken(JSON.stringify(payload))
        return res.status(200).json({ messge: "User login successfully...", token })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}

//User Get Information
export const UserInfomation = async (req: CustomRequest, res: Response) => {
    try {
        const UserId = req.user?.id;
        
        const user = await UserData.findById(UserId);

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

        // Find the user by their ID
        const user = await UserData.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(skills.split(","));
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

        const updatedUser = await UserData.findByIdAndUpdate(userId, reqbody, {
            new: true
        })

        console.log("updatedUser :", updatedUser);

        return res.status(200).json({ message: "Profile updated successfully", updatedUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
