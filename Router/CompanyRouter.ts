import express from "express";
import { CompanyUpdate, getcompany, getCompanyById, registerCompany } from "../Controllers/CompanyControllers";

const router = express.Router();

// POST /Company/registration
router.post("/registration", registerCompany);

// GET /Company/get
router.get("/get", getcompany);

// GET /Company/getInformationById/:id
router.get("/getInformationById/:id", getCompanyById);

// PUT /Company/UpdateCompany/:id
router.put("/UpdateCompany/:id", CompanyUpdate);

export default router;
