import { Request, Response } from "express";
import CompantData from "../Models/CompanyModel";
import UserModel from "../Models/UserModel";

interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

export const registerCompany = async (req: CustomRequest, res: Response) => {
    try {
        let LoginUserId = req.user?.id;
        const { CompanyName } = req.body
        if (!CompanyName) {
            return res.status(400).json({ message: "Something is missing..." })
        }
        console.log(req.body);


        const company = await CompantData.findOne({ CompanyName })
        if (company) {
            return res.status(400).json({ message: "You can't register same company..." })
        }

        let user = await UserModel.findById(LoginUserId).populate({ path: "Company" })

        if (!user) {
            return res.status(404).json({ message: "User Not Found..." })
        }
        const Companystord = new CompantData({
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

//get companydata to create Login user 
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
                let CompanyFind = await CompantData.findById(Id);
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

//get company by id to 
export const getCompanyById = async (req: Request, res: Response) => {
    try {
        const comapnyId = req.params.id
        const comapny = await CompantData.findById(comapnyId)
        if (!comapny) {
            return res.status(404).json({ message: "Company Not Found" })
        }
        return res.status(200).json(comapny)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}

// Company update 
export const CompanyUpdate = async (req: Request, res: Response) => {
    try {
        let { CompanyName, description, website, location } = req.body
        const CompanyLogo = req.file;
        const companyId = req.params.id

        const comapny = await CompantData.findById(companyId)

        const comapnyupdate = { CompanyName, description, website, location }
        if (CompanyName) {
            let FindCompanuname = await CompantData.findOne({ CompanyName })
            if (FindCompanuname) {
                return res.status(400).json({ message: "You can't register same company..." })
            }
        }

        if (!CompanyName) comapnyupdate.CompanyName = comapny?.CompanyName;
        if (!description) comapnyupdate.description = comapny?.description;
        if (!website) comapnyupdate.website = comapny?.website;
        if (!location) comapnyupdate.location = comapny?.location;

        const updatacomapny = await CompantData.findByIdAndUpdate(companyId, comapnyupdate, { new: true })

        return res.status(200).json({ updatacomapny })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." })
    }
}