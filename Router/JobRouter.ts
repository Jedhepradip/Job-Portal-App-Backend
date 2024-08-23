import express from "express";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { PostJobCompany } from "../Controllers/JobControllers";

const router = express.Router();

router.post("/AdminPost", jwtAuthMiddleware, PostJobCompany);

export default router;
