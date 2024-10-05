import { Request, Response } from "express";
import CompanyData from "../Models/CompanyModel";
import jobModel from "../Models/JobModel";
import UserModel from "../Models/UserModel";
import { v2 as cloudinary } from 'cloudinary';


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

export const registerCompany = async (req: CustomRequest, res: Response) => {
    try {
        let LoginUserId = req.user?.id;
        const { CompanyName } = req.body

        if (!CompanyName) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        const company = await CompanyData.findOne({ CompanyName })
        if (company) {
            return res.status(400).json({ message: "You can't register same company..." })
        }

        let user = await UserModel.findById(LoginUserId).populate({ path: "Company" })

        if (!user) {
            return res.status(404).json({ message: "User Not Found..." })
        }
        const Companystord = new CompanyData({
            CompanyName,
            createdAt: Date.now(),
            UserId: LoginUserId,
        })

        await Companystord.save()

        if (user) {
            user.Company?.push(Companystord.id); // Push the ObjectId to the Company array
            await user.save(); // Don't forget to save the document after modification
        }

        return res.status(200).json({ message: "Company Register successfully...", Companystord })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" })
    }
}

//get companydata to create Login user  / addmin
export const getcompany = async (req: CustomRequest, res: Response) => {
    try {
        let loginuserid = req.user?.id;
        let user = await UserModel.findById(loginuserid)
        // .populate({path:"Company"})

        if (!user) {
            return res.status(404).json({ message: "Authorization User..." })
        }
        if (user?.Company?.length) {
            const companies = [];
            for (const CompanyId of user.Company) {
                let Id = CompanyId.toHexString();
                let CompanyFind = await CompanyData.findById(Id);
                if (CompanyFind) {
                    companies.push(CompanyFind);
                }
            }
            return res.status(200).json({ message: "Fetch successfully...", companies });
        }
        return res.status(404).json({ message: "No companies found for the user." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const CompanyUpdate = async (req: Request, res: Response) => {
    try {
        let { CompanyName, description, website, location } = req.body;
        const companyId = req.params.id;
        const company = await CompanyData.findById(companyId);

        const result = await cloudinary.uploader.upload(req.file!.path);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const companyUpdate = { CompanyName, description, website, location };

        if (CompanyName) {
            const CompanyFindByName = await CompanyData.findOne({ CompanyName });
            if (CompanyFindByName) {
                if (company.CompanyName !== CompanyFindByName.CompanyName) {
                    return res.status(400).json({ message: "Company is already registered..." });
                }
            }
        }

        if (CompanyName) {
            const company = await CompanyData.findById(companyId);
            if (company?.JobsId?.length) {
                for (let i = 0; i < company.JobsId.length; i++) {
                    const job = await jobModel.findById(company.JobsId[i].toHexString());
                    if (job) {
                        job.companyName = CompanyName;
                        await job.save();
                    }
                }
            }
        }

        if (req.file) {
            company.CompanyLogo = result.secure_url
            await company.save();
        } else {
            company.CompanyLogo = company.CompanyLogo
            await company.save()
        }

        if (!CompanyName) companyUpdate.CompanyName = company.CompanyName;
        if (!description) companyUpdate.description = company.description;
        if (!website) companyUpdate.website = company.website;
        if (!location) companyUpdate.location = company.location;

        const updatedCompany = await CompanyData.findByIdAndUpdate(companyId, companyUpdate, { new: true });
        return res.status(200).json({ updatedCompany });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." });
    }
}