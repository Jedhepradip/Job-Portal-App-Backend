import { Request, Response } from "express";
import CompantData from "../Models/CompanyModel";

export const registerCompany = async (req: Request, res: Response) => {
    try {
        const { CompanyName } = req.body
        console.log(CompanyName);

        let UserIdJwt = "66c75e18a8234c614c9d3c3e"

        if (!CompanyName) {
            return res.status(400).json({ message: "Something is missing..." })
        }

        const company = await CompantData.findOne({ CompanyName })
        if (company) {
            return res.status(400).json({ message: "You can't register same company..." })
        }
        const Companystord = new CompantData({
            CompanyName,
            UserId: UserIdJwt
        })
        await Companystord.save()

        return res.status(200).json({ message: "Company Register successfully...", Companystord })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" })
    }
}

//get company
export const getcompany = async (req: Request, res: Response) => {
    try {
        // let loginuserid = req.user.id
        let loginuserid = "66c75e18a8234c614c9d3c3e"
        let comapny = await CompantData.findById({ UserId: loginuserid })
        if (!comapny) {
            return res.status(404).json({ message: "Companies Not Found..." })
        }
        return res.status(200).json(comapny)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

//get company by id
export const getCompanyById = async (req: Request, res: Response) => {
    try {
        const comapnyId = req.params.id
        const comapny = await CompantData.findById({ _id: comapnyId })
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
        const ResumeFile = req.file;
        const companyId = req.params.id

        const comapny = await CompantData.findById(companyId)

        const comapnyupdate = { CompanyName, description, website, location }
        if (CompanyName) {
            let FindCompanuname = await CompantData.findOne({ CompanyName })
            if(FindCompanuname){
                return res.status(400).json({message:"You can't register same company..."})
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