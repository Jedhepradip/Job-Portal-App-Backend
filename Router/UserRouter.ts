import express from "express";
import { RegistrationUser, UserLogin, UserProfileUpdate, UserInfomation } from "../Controllers/Usercontrollers";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";

const router = express.Router();

router.post("/User/Registration", RegistrationUser);
router.post("/User/login", UserLogin)
router.get("/User/Information", jwtAuthMiddleware, UserInfomation)
router.put("/User/Update/Profile", jwtAuthMiddleware, UserProfileUpdate)

export default router