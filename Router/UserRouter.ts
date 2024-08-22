import express from "express";
import { RegistrationUser, UserLogin, UserProfileUpdata } from "../Controllers/Usercontrollers";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
const router = express.Router();

router.post("/User/Registration", RegistrationUser);
router.post("/User/login",UserLogin)
router.put("/User/Update/Profile",UserProfileUpdata)

export default router