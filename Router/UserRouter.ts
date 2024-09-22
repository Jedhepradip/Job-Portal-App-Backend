import express from "express";
import { RegistrationUser, UserLogin, UserProfileUpdate, UserInfomation } from "../Controllers/Usercontrollers";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { upload } from "../Middewares/Multer middleware";

const router = express.Router();

router.post("/User/Registration", upload.single("ProfileImg"), RegistrationUser);
router.post("/User/login", UserLogin)
router.get("/User/Information", jwtAuthMiddleware, UserInfomation)
// router.put("/User/Update/Profile", jwtAuthMiddleware, upload.single("ResumeFile"), UserProfileUpdate)

router.put("/User/Update/Profile",
    jwtAuthMiddleware, // Middleware for authentication
    upload.fields([
        { name: 'ResumeFile', maxCount: 1 }, // Upload resume file
        { name: 'ProfileImg', maxCount: 1 }  // Upload profile image
    ]),
    UserProfileUpdate // Controller function to handle the update
);

export default router