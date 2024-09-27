import express from "express";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { GetallJobinAdminCreated, GetAllJobs, PostJobCompany, UpdateJobs,SaveJobs } from "../Controllers/JobControllers";

const router = express.Router();

router.post("/Admin/PostJobs/:id", jwtAuthMiddleware, PostJobCompany);
router.post("/Jobs/Save/User/:id",jwtAuthMiddleware,SaveJobs)
router.put("/Admin/Jobs/Update/:id", jwtAuthMiddleware, UpdateJobs)
router.get("/GetAll/Jobs", GetAllJobs);
router.get("/GetAll/Jobs/Admin",jwtAuthMiddleware, GetallJobinAdminCreated)

export default router;