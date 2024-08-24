import express from "express";
import cors from "cors";
import 'dotenv/config';
import indexrouter from "./Router/UserRouter";
import JobRouter from "./Router/JobRouter";
import CompanyRouter from "./Router/CompanyRouter";
import { connectDB } from "./Database/db";

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));

// Mounting routers
app.use("/", indexrouter);
app.use("/Company", CompanyRouter);
app.use("/Jobs", JobRouter);

app.listen(process.env.PORT, (): void => {   
    console.log(`Server Running On http://localhost:${process.env.PORT}`);
});