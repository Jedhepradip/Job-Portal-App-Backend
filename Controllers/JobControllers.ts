import { Request, Response } from "express";
import jobModel from "../Models/JobModel";
import UserModel from "../Models/UserModel";

interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

// Jobs Post Company
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

//Get Jobs ById
export const GetAllJobsById = async (req: Request, res: Response) => {
    try {
        const JobsId = req.params.id;
        const Jobs = await jobModel.findById(JobsId);
        if (!Jobs) {
            return res.status(404).json({ message: "Jons Not Found...!" })
        }
        return res.status(200).json(Jobs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal Server Error...!" })
    }
}

// Get All Jobs student
export const GetAllJobs = async (req: Request, res: Response) => {
    try {
        const Jobs = await jobModel.find().populate({
            path: "Company"
        }).populate({ path: "User" });
        if (!Jobs) {
            return res.status(404).json({ message: "Jobs Not Found..." })
        }
        return res.status(200).json(Jobs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..!" })
    }
}

// admin created Jobs 
export const GetallJobinAdminCreated = async (req: CustomRequest, res: Response) => {
    try {
        const UserId = req.user?.id;

        let user = await UserModel.findById(UserId)
        if (!user) {
            return res.status(404).json({ message: "Jobs Not Found..." })
        }

        if (user.JobPost?.length) {
            const Jobs = [];
            for (const JonsId of user.JobPost) {
                let Id = JonsId.toHexString();
                let JobsFind = await jobModel.findById(Id);
                if (JobsFind) {
                    Jobs.push(JobsFind);
                }
            }
            return res.status(200).json({ message: "Fetch successfully...", Jobs });
        }
        return res.status(404).json({ message: "No companies found for the user." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}