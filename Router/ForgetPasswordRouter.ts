import express from "express";
import { ForgetPassword } from "../Controllers/Forgetcontrollers";
const router = express.Router();

router.post("/ForgetPassword",ForgetPassword)

export default router