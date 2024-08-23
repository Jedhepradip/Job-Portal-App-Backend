import express from "express";
import { CompanyUpdate, getcompany, getCompanyById, registerCompany } from "../Controllers/CompanyControllers";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
const router = express.Router();

router.post("/registration",jwtAuthMiddleware, registerCompany);
router.get("/get",jwtAuthMiddleware, getcompany);
router.get("/getInformationById/:id",jwtAuthMiddleware, getCompanyById);
router.put("/UpdateCompany/:id",jwtAuthMiddleware, CompanyUpdate);

export default router;
