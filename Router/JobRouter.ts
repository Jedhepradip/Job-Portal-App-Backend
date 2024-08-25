import express from "express";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { GetallJobinAdminCreated, GetAllJobs, GetAllJobsById, PostJobCompany } from "../Controllers/JobControllers";

const router = express.Router();

router.post("/Admin/PostJobs",jwtAuthMiddleware, PostJobCompany);
router.get("/GetJobs/ById/:id",jwtAuthMiddleware,GetAllJobsById)
router.get("/GetAll/Jobs",jwtAuthMiddleware,GetAllJobs);
router.get("/GetAll/Jobs/Admin",jwtAuthMiddleware,GetallJobinAdminCreated)

export default router;