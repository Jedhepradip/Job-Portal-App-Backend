"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const UserRouter_1 = __importDefault(require("./Router/UserRouter"));
const CompanyRouter_1 = __importDefault(require("./Router/CompanyRouter"));
const db_1 = require("./Database/db");
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Mounting routers
app.use("/", UserRouter_1.default);
app.use("/Company", CompanyRouter_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server Running On http://localhost:${process.env.PORT}`);
});
