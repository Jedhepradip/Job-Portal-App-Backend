import express from "express";
import { ForgetPassword, setUpNewPassword } from "../Controllers/Forgetcontrollers";
const router = express.Router();

router.post("/ForgetPassword", ForgetPassword)
router.put("/Create/NewPassword/:id", setUpNewPassword)

export default router