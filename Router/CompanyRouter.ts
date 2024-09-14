import express from "express";
import { CompanyUpdate, getcompany, getCompanyById, registerCompany } from "../Controllers/CompanyControllers";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { upload } from "../Middewares/Multer middleware";
const router = express.Router();

router.post("/Register/Admin/Company", jwtAuthMiddleware, registerCompany);
router.get("/get", jwtAuthMiddleware, getcompany);
router.get("/getInformationById/:id", jwtAuthMiddleware, getCompanyById);
router.put("/UpdateCompany/:id", jwtAuthMiddleware, upload.single("CompanyLogo"), CompanyUpdate);

export default router;
