"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUpdate = exports.getCompanyById = exports.getcompany = exports.registerCompany = void 0;
const CompanyModel_1 = __importDefault(require("../Models/CompanyModel"));
const registerCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CompanyName } = req.body;
        console.log(CompanyName);
        let UserIdJwt = "66c75e18a8234c614c9d3c3e";
        if (!CompanyName) {
            return res.status(400).json({ message: "Something is missing..." });
        }
        const company = yield CompanyModel_1.default.findOne({ CompanyName });
        if (company) {
            return res.status(400).json({ message: "You can't register same company..." });
        }
        const Companystord = new CompanyModel_1.default({
            CompanyName,
            UserId: UserIdJwt
        });
        yield Companystord.save();
        return res.status(200).json({ message: "Company Register successfully...", Companystord });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
});
exports.registerCompany = registerCompany;
//get company
const getcompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let loginuserid = req.user.id
        let loginuserid = "66c75e18a8234c614c9d3c3e";
        let comapny = yield CompanyModel_1.default.findById({ UserId: loginuserid });
        if (!comapny) {
            return res.status(404).json({ message: "Companies Not Found..." });
        }
        return res.status(200).json(comapny);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getcompany = getcompany;
//get company by id
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comapnyId = req.params.id;
        const comapny = yield CompanyModel_1.default.findById({ _id: comapnyId });
        if (!comapny) {
            return res.status(404).json({ message: "Company Not Found" });
        }
        return res.status(200).json(comapny);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." });
    }
});
exports.getCompanyById = getCompanyById;
// Company update 
const CompanyUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { CompanyName, description, website, location } = req.body;
        const CompanyLogo = req.file;
        const companyId = req.params.id;
        const comapny = yield CompanyModel_1.default.findById(companyId);
        const comapnyupdate = { CompanyName, description, website, location };
        if (CompanyName) {
            let FindCompanuname = yield CompanyModel_1.default.findOne({ CompanyName });
            if (FindCompanuname) {
                return res.status(400).json({ message: "You can't register same company..." });
            }
        }
        if (!CompanyName)
            comapnyupdate.CompanyName = comapny === null || comapny === void 0 ? void 0 : comapny.CompanyName;
        if (!description)
            comapnyupdate.description = comapny === null || comapny === void 0 ? void 0 : comapny.description;
        if (!website)
            comapnyupdate.website = comapny === null || comapny === void 0 ? void 0 : comapny.website;
        if (!location)
            comapnyupdate.location = comapny === null || comapny === void 0 ? void 0 : comapny.location;
        // if(!CompanyLogo) CompanyLogo = comapny?.CompanyLogo
        const updatacomapny = yield CompanyModel_1.default.findByIdAndUpdate(companyId, comapnyupdate, { new: true });
        return res.status(200).json({ updatacomapny });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." });
    }
});
exports.CompanyUpdate = CompanyUpdate;
