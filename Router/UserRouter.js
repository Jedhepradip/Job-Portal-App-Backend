"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Usercontrollers_1 = require("../Controllers/Usercontrollers");
const router = express_1.default.Router();
router.post("/User/Registration", Usercontrollers_1.RegistrationUser);
router.post("/User/login", Usercontrollers_1.UserLogin);
router.put("/User/Update/Profile", Usercontrollers_1.UserProfileUpdata);
exports.default = router;
