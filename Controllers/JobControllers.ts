import { Request, Response } from "express";
import jobModel from "../Models/JobModel";
import UserModel from "../Models/UserModel";

interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

export const PostJobCompany = async (req: CustomRequest, res: Response) => {
    try {
        const { title, description, requiements, salary, location, jobtype, position, experienceLevel, company } = req.body;

        if (!title || !description || !requiements || !salary || !location || !jobtype || !position || !experienceLevel || !company) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        const UserId = req.user?.id;

        let FindUser = await UserModel.findById(UserId)
        if (!FindUser) {
            return res.status(401).json({ message: "Authorization User..." })
        }

        const JobPost = new jobModel({
            title,
            description,
            requiements: requiements.split(","),
            salary: Number(salary),
            location,
            jobtype,
            position,
            experienceLevel,
            company,
            CreatedBy: UserId,
        })

        await JobPost.save()

        if (FindUser) {
            FindUser.JobPost?.push(JobPost.id)
        }
        return res.status(200).json({ message: "New Job created Successfully...", JobPost })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}

// Get All Jobs
export const GetAllJobs = async (req: Request, res: Response) => {
    try {
        const Jobs = await jobModel.find().populate({
            path: "Company"
        }).populate({ path: "User" });
        if (!Jobs) {
            return res.status(400).json({ message: "Jobs Not Found..." })
        }
        return res.status(200).json(Jobs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..!" })
    }
}