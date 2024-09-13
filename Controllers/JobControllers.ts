import { Request, Response } from "express";
import jobModel from "../Models/JobModel";
import UserModel from "../Models/UserModel";

interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

// Jobs Post Company admin
export const PostJobCompany = async (req: CustomRequest, res: Response) => {
    try {
        const { title, description, requirements, salary, location, jobtype, position, experienceLevel, companyName } = req.body;

        console.log(req.body);

        const CompanyId = req.params.id
        console.log(CompanyId);

        if (!title || !description || !requirements || !salary || !location || !jobtype || !position || !experienceLevel || !companyName) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        const UserId = req.user?.id;

        let FindUser = await UserModel.findById(UserId)
        if (!FindUser) {
            return res.status(401).json({ message: "Authorization User..." })
        }

        const PostJobs = new jobModel({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobtype,
            position,
            experienceLevel,
            companyName,
            company: CompanyId,
            CreatedBy: UserId,
        })

        await PostJobs.save()

        if (FindUser) {
            FindUser.JobPost?.push(PostJobs.id)
            FindUser.save();
        }
        return res.status(200).json({ message: "Jobs created Successfully...", PostJobs })

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
            path: "company"
        }).populate({ path: "CreatedBy" });
        if (!Jobs) {
            return res.status(404).json({ message: "Jobs Not Found..." })
        }
        return res.status(200).json(Jobs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..!" })
    }
}

// admin created Jobs in Company
export const GetallJobinAdminCreated = async (req: CustomRequest, res: Response) => {
    try {
        const UserId = req.user?.id;

        let user = await UserModel.findById(UserId)
        // let user = await UserModel.findById(UserId).populate({
        //     path: "JobPost",
        // }).populate({
        //     path: "Company"
        // })
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
            return res.status(200).json({ message: "Fetch successfully...", user });
        }
        return res.status(404).json({ message: "No companies found for the user." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}