"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CompanyControllers_1 = require("../Controllers/CompanyControllers");
const router = express_1.default.Router();
// POST /Company/registration
router.post("/registration", CompanyControllers_1.registerCompany);
// GET /Company/get
router.get("/get", CompanyControllers_1.getcompany);
// GET /Company/getInformationById/:id
router.get("/getInformationById/:id", CompanyControllers_1.getCompanyById);
// PUT /Company/UpdateCompany/:id
router.put("/UpdateCompany/:id", CompanyControllers_1.CompanyUpdate);
exports.default = router;
