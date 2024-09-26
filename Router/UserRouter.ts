import express from "express";
import { RegistrationUser, UserLogin, UserProfileUpdate, UserInfomation, sendLoginOtp } from "../Controllers/Usercontrollers";
import { jwtAuthMiddleware } from "../Middewares/jwtAuthMiddleware";
import { upload } from "../Middewares/Multer middleware";

const router = express.Router();

router.post("/UserSendOtp", sendLoginOtp)
router.post("/User/Registration", upload.single("ProfileImg"), RegistrationUser);
router.post("/User/login", UserLogin)
router.get("/User/Information", jwtAuthMiddleware, UserInfomation)
router.put("/User/Update/Profile", jwtAuthMiddleware,
    upload.fields([{ name: 'ResumeFile', maxCount: 1 },
    { name: 'ProfileImg', maxCount: 1 }
    ]),
    UserProfileUpdate
);

export default router