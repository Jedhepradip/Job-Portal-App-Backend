import { Request, Response } from "express";
import jobModel from "../Models/JobModel";
import Applicationcom from "../Models/ApplicationMode";
interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

// Jobs Apply A Student
export const ApplyJobs = async (req: CustomRequest, res: Response) => {
    try {
        const UserId = req.user?.id
        const JobId = req.params.id
        const jobs = await jobModel.findById(JobId)

        if (!jobs) return res.status(404).json({ message: "Jobs Not Found...!" })
        
        const ApplicationUser = new Applicationcom({
            job: JobId,
            applicant: UserId
        })

        await ApplicationUser.save()
        if (jobs) {
            jobs.applications?.push(ApplicationUser.id); // Push the ObjectId to the Company array
            await jobs.save(); // Don't forget to save the document after modification
        }
        return res.status(200).json({ message: "Job applied successfully..." })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error...!" })
    }
}

//applied Jobs from student show profile
export const getappliedJobs = async (req: CustomRequest, res: Response) => {
    try {
        const User = req.user?.id
        const ApplicationJobs = await Applicationcom.find({ applicant: User }).populate({
            path: "job",
            populate: ({
                path: "company"
            })
        })
        if (!ApplicationJobs) {
            return res.status(404).json({ message: "No Applications...!" })
        }

        return res.status(200).json(ApplicationJobs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error...!" })
    }
}

// kiti user ni job ver apply kela aahe the show hoil admin la 
export const GetApplicantsJobs = async (req: Request, res: Response) => {
    try {
        const JobsId = req.params.id
        const jobs = await jobModel.findById(JobsId).populate({
            path: "applicant",
            // populate: ({
            //     path: "applicant" //User Applied
            // })
        })

        if (!jobs) {
            return res.status(400).json({ message: "Job Not Found...!" })
        }

        return res.status(200).json(jobs)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error...!" })
    }
}

//updata Statu//s 
export const UpdataStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(401).json({ message: "Something is missing..." })
        }
        const Applciationfind = await Applicationcom.findOne({ _id: applicationId });
        if (!Applciationfind) {
            return res.status(404).json({ message: "Application Not Found...!" })
        }

        Applciationfind.status = status.toLowerCase();
        
        await Applciationfind.save()

        return res.status(200).json({message:"Status Updata Successfully...!"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error...!" })
    }
}
