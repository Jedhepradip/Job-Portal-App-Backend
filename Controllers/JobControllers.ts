import { Request, Response } from "express";
import jobModel from "../Models/JobModel";
import UserModel from "../Models/UserModel";
import Company from "../Models/CompanyModel";

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

        const CompanyId = req.params.id
        const UserId = req.user?.id;

        if (!title || !description || !requirements || !salary || !location || !jobtype || !position || !experienceLevel || !companyName) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        let FindUser = await UserModel.findById(UserId)
        if (!FindUser) {
            return res.status(401).json({ message: "Authorization User..." })
        }
        let CompanyData = await Company.findById(CompanyId)
        if (!CompanyData) {
            return res.status(400).json({ message: "Company Not Found" })
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

        if (CompanyData) {
            CompanyData.JobsId?.push(PostJobs.id)
            await CompanyData.save()
        }

        if (FindUser) {
            FindUser.JobPost?.push(PostJobs.id)
            await FindUser.save();
        }

        return res.status(200).json({ message: "Jobs created Successfully...", PostJobs })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}

export const UpdateJobs = async (req: CustomRequest, res: Response) => {
    try {
        const { title, description, requirements, salary, location, jobtype, position, experienceLevel } = req.body;
        const JobsId = req.params.id
        const JobsFind = await jobModel.findById(JobsId)

        const reqBodyData = req.body;

        if (JobsFind) {
            if (!title) reqBodyData.title = JobsFind.title;
            if (!description) reqBodyData.description = JobsFind.description;
            if (!requirements) reqBodyData.requirements = JobsFind.requirements;
            if (!salary) reqBodyData.salary = JobsFind.salary;
            if (!location) reqBodyData.location = JobsFind.location;
            if (!jobtype) reqBodyData.jobtype = JobsFind.jobtype;
            if (!position) reqBodyData.position = JobsFind.position;
            if (!experienceLevel) reqBodyData.experienceLevel = JobsFind.experienceLevel;
        }

        const UpdateJobs = await jobModel.findByIdAndUpdate(JobsId, reqBodyData, { new: true })

        console.log(UpdateJobs);

        return res.status(200).json({ message: "Jobs updated Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(501).json({ message: "Internal Server Error..." })
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
            console.log(Jobs);

            return res.status(200).json(Jobs);
        };

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}

export const SaveJobs = async (req: CustomRequest, res: Response) => {
    try {
        const JobsId = req.params?.id
        const UserId = req.user?.id
        const jobs = await jobModel.findById(JobsId)
        if (!jobs) { return res.status(400).json({ message: "Jobs Not Found..." }) }
        const user = await UserModel.findById(UserId)
        if (!user) { return res.status(400).json({ message: "User not Found..." }) }

        if (user) {
            if (user.SaveJobs?.length) {
                user.SaveJobs.filter((e) => {
                    if (e._id.toHexString() == jobs._id.toHexString()) {
                        return res.status(400).json({ message: "Jobs Save Already..." });
                    }
                });
            }
            user.SaveJobs?.push(jobs._id)
            await user.save();
        }

        return res.status(200).json({ message: "Job Save successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
