import express from "express";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { ApplyJobs, GetApplicantsJobs, getappliedJobs, UpdataStatus } from "../Controllers/ApplicationControllers";
const router = express.Router();

router.post("/ApplyJobs/:id",jwtAuthMiddleware,ApplyJobs)
router.get("/ApplyJob/Show/Student",jwtAuthMiddleware,getappliedJobs)
router.get("/Applicants/Jobs/:id",jwtAuthMiddleware,GetApplicantsJobs)
router.post("/Updata/Status/:id",jwtAuthMiddleware,UpdataStatus)

export default router;
