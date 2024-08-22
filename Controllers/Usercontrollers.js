"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileUpdata = exports.UserLogin = exports.RegistrationUser = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../Middewares/generateToken");
//User Registration
const RegistrationUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, mobile, password, role } = req.body;
        if (!name || !email || !mobile || !password || !role) {
            return res.status(400).json({ message: "Something is missing..." });
        }
        const Emailexists = yield UserModel_1.default.findOne({ email });
        if (Emailexists) {
            return res.status(400).json({ message: "User already exist with this email..." });
        }
        const mobileexist = yield UserModel_1.default.findOne({ mobile });
        if (mobileexist) {
            return res.status(400).json({ message: "User already exist with this mobile number..." });
        }
        const haspassword = yield bcrypt_1.default.hash(password, 11);
        const User = new UserModel_1.default({
            name,
            email,
            mobile,
            password: haspassword,
            role,
        });
        const payload = {
            id: User.id,
            email: User.email,
            name: User.name,
        };
        const token = (0, generateToken_1.generateToken)(JSON.stringify(payload));
        yield User.save();
        return res.status(200).json({ message: "Registration Successful..", token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
});
exports.RegistrationUser = RegistrationUser;
//User Login
const UserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        let Useremail = yield UserModel_1.default.findOne({ email });
        if (!Useremail) {
            return res.status(400).json({ message: "User not Found..." });
        }
        let machpassword = yield bcrypt_1.default.compare(password, Useremail.password);
        if (!machpassword) {
            return res.status(400).json({ message: "Incorrect Password try again..." });
        }
        if (role !== Useremail.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role..." });
        }
        const payload = {
            id: Useremail._id,
            email: Useremail.email,
            name: Useremail.name,
        };
        const token = (0, generateToken_1.generateToken)(JSON.stringify(payload));
        return res.status(200).json({ messge: "User login successfully...", token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error..." });
    }
});
exports.UserLogin = UserLogin;
//User Profile Update 
const UserProfileUpdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, mobile, password, bio, skills } = req.body;
        // const UserId = req.user.id
        let UserId = "66c75e18a8234c614c9d3c3e";
        const User = yield UserModel_1.default.findById({ _id: UserId.toString() });
        console.log(req.body);
        const skillaArray = skills.split(",");
        console.log(skillaArray);
        if (!name)
            name = User === null || User === void 0 ? void 0 : User.name;
        if (!bio)
            bio = User === null || User === void 0 ? void 0 : User.bio;
        if (!skills)
            skills = User === null || User === void 0 ? void 0 : User.skills;
        if (email) {
            const emailexist = yield UserModel_1.default.findById({ email: email });
            if ((emailexist === null || emailexist === void 0 ? void 0 : emailexist.email) !== (User === null || User === void 0 ? void 0 : User.email)) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }
        if (mobile) {
            const mobileexist = yield UserModel_1.default.findById({ mobile: mobile });
            if ((mobileexist === null || mobileexist === void 0 ? void 0 : mobileexist.mobile) !== (User === null || User === void 0 ? void 0 : User.mobile)) {
                return res.status(400).json({ message: "Phone Number already exists" });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error..." });
    }
});
exports.UserProfileUpdata = UserProfileUpdata;
