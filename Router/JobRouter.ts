import express from "express";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { GetAllJobs, PostJobCompany } from "../Controllers/JobControllers";

const router = express.Router();

router.post("/Admin/PostJobs", jwtAuthMiddleware, PostJobCompany);
router.get("/GetAll/Jobs",jwtAuthMiddleware,GetAllJobs);

export default router;