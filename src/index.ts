import express, { Request, Response } from "express";
import cors from "cors";
import 'dotenv/config';
import { connectDB } from "../Database/db";
import indexrouter from "../Router/UserRouter"
import JobRouter from "../Router/JobRouter"
import CompanyRouter from "../Router/CompanyRouter"
import ApplicationinJobs from "../Router/ApplicationRouter"

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: true,
    credentials: true,
};

app.get("/", (req: Request, res: Response) => {
    res.send("hello hi")
})

app.use(cors(corsOptions));

// Mounting routers
app.use("/", indexrouter);
app.use("/Company", CompanyRouter);
app.use("/Jobs", JobRouter);
app.use("/Application",ApplicationinJobs)

app.listen(process.env.PORT, (): void => {
    console.log(`Server Running On http://localhost:${process.env.PORT}`);
});