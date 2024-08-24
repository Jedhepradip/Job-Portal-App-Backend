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

        if (!name || !email || !mobile || !password || !role) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        const Emailexists = await UserData.findOne({ email })
        if (Emailexists) {
            return res.status(400).json({ message: "User already exist with this email..." })
        }

        const mobileexist = await UserData.findOne({ mobile })
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
            return res.status(400).json({ message: "User not Found..." })
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

//User Profile Update 
export const UserProfileUpdata = async (req: CustomRequest, res: Response) => {
    try {
        let { name, email, mobile, password, bio, skills } = req.body;
        const UserId = req.user?.id
        let User = await UserData.findById(UserId)

        if (!name) name = User?.name;
        if (!bio) bio = User?.bio;
        if (!skills) skills = User?.skills

        if (email) {
            const emailexist = await UserData.findOne({ email })
            if (emailexist) {
                let emailcheck: Boolean = email == User?.email
                if (emailcheck) {
                    return res.status(400).json({ message: "Email already exists..." })
                }
            }
        }

        if (mobile) {
            const mobileexist = await UserData.findOne({ mobile })
            if (mobileexist) {
                let mobileCjeck: Boolean = mobile == User?.mobile
                if (mobileCjeck) {
                    return res.status(400).json({ message: "Phone Number already exists..." })
                }
            }
        }

        // if (password) {
        //     let haspassword = bcrypt.hash(password,11);
        //     User?.password:String = await haspassword;
        // }

        return res.status(200).json({ message: "Profile update successfully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error..." })
    }
}