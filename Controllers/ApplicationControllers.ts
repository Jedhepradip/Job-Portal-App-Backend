import { Request, Response } from "express";
import jobModel from "../Models/JobModel";
import Applicationcom from "../Models/ApplicationMode";
import UserModel from "../Models/UserModel";
import nodemailer from "nodemailer"
interface CustomRequest extends Request {
    user?: {
        id: string;  // Define the specific type you expect for 'user.id'
        // Add other properties if needed
    };
}

// Jobs Apply A Student
export const ApplyJobs = async (req: CustomRequest, res: Response) => {
    try {
        const UserId = req.user?.id
        const JobId = req.params.id
        const jobs = await jobModel.findById(JobId)
        const user = await UserModel.findById(UserId)

        if (!user?.ResumeFile || user?.ResumeFile === "null" || !user?.skills?.length || !user?.bio) {
            return res.status(400).json({ message: "Resume File, Skills, and Bio are required." });
        }

        if (!jobs) return res.status(404).json({ message: "Jobs Not Found...!" })
        if (!user) return res.status(404).json({ message: "user Not Found...!" })

        const ApplicationUser = new Applicationcom({
            job: JobId,
            applicant: UserId
        })

        const applyjobs = await ApplicationUser.save()
        if (jobs) {
            jobs.applications?.push(ApplicationUser.id); // Push the ObjectId to the Company array
            await jobs.save(); // Don't forget to save the document after modification
        }

        if (applyjobs.status == "pending") {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', // Use the SMTP host directly
                secure: true,
                port: Number(process.env.NODEMAILER_PORT) || 465, // 465 for secure SMTP
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
                logger: true, // log to console
                debug: true,
            });

            const info = await transporter.sendMail({
                from: process.env.FROM,
                to: "pradipjedhe69@gmail.com", // Email sent to the user
                subject: `Your Application for ${jobs.title} at ${jobs.companyName}`, // Subject with job title and company name
                text: "Hello world?", // Fallback text if HTML is not supported
                html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: black">Congratulations on Applying for ${jobs.title}</h2>
                    <p>Hello ${user?.name},</p>
            
                    <p style="color: #000;">
                        We are pleased to confirm that your application for the position of <strong>${jobs.title}</strong> at <strong>${jobs.companyName}</strong> has been successfully submitted. Here are the key details of the job you applied for:
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Company Name</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.companyName}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Job Title</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.title}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Location</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.location}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Salary</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.salary}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Application Status</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><span style="color: #FFA500;">Pending Review</span></td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px; color: #333;">
                        <strong>What to expect next:</strong> Your application is currently under review by our team at <strong>${jobs.companyName}</strong>. You will be notified shortly about the next steps in the process.
                    </p>
            
                    <p style="margin-top: 20px; color: #333;">
                        <strong>About the job:</strong> The role of <strong>${jobs.title}</strong> is a critical position at <strong>${jobs.companyName}</strong>. Our team is dedicated to finding the right talent to contribute to exciting projects, growth opportunities, and an excellent work environment.
                    </p>
            
                    <p style="margin-top: 20px; color: #333;">
                        <strong>Why work with us?</strong> At ${jobs.companyName}, we are committed to fostering a culture of innovation, inclusivity, and professional development. Our employees are our most valuable asset, and we strive to provide a fulfilling and enriching work experience.
                    </p>
            
                    <p>If you have any questions or would like to know more about the status of your application, please feel free to reach out. We're excited to review your application and connect with you soon!</p>
            
                    <footer style="margin-top: 40px; text-align: center; color: #666;">
                        <hr>
                        <p style="font-size: 14px; color: #555;">Thank you for considering ${jobs.companyName} as your next career destination.</p>
                        <p style="color: #4CAF50;">We look forward to seeing you achieve great things with us!</p>
                        <p style="font-weight: bold; color: #007BFF;">${jobs.company || "email for the company "}</p>
                    </footer>
                </div>
                `,
            });

            console.log("Email sent successfully!");

            // main().catch(console.error);

            return res.status(200).json({
                message: "Job applied successfully...",
                applyjobs
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error...!" })
    }
}

//applied Jobs from student show profile
export const getappliedJobs = async (req: CustomRequest, res: Response) => {
    try {
        const User = req.user?.id
        const ApplicationJobs = await Applicationcom.find({ applicant: User }).populate({
            path: "job",
            populate: ({
                path: "company"
            })
        })
        if (!ApplicationJobs) {
            return res.status(404).json({ message: "No Applications...!" })
        }

        return res.status(200).json(ApplicationJobs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error...!" })
    }
}

// kiti user ni job ver apply kela aahe the show hoil admin la 
export const GetApplicantsJobs = async (req: Request, res: Response) => {
    try {
        const JobsId = req.params.id;

        // Fetch the job by ID and populate applications with applicants
        const jobs = await jobModel.findById(JobsId).populate({
            path: "applications",
            populate: {
                path: "applicant", // Populate the applicant (user who applied)  
            },
        });

        if (!jobs) {
            return res.status(400).json({ message: "Job Not Found...!" });
        }

        return res.status(200).json(jobs);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error...!" });
    }
};

//updata Statu//s 
export const UpdataStatus = async (req: CustomRequest, res: Response) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const userid = await UserModel.findById(req.user?.id)

        console.log(req.body);
        if (!status) {
            return res.status(401).json({ message: "Something is missing..." })
        }

        const Applciationfind = await Applicationcom.findById(applicationId);

        if (!Applciationfind) {
            return res.status(404).json({ message: "Application Not Found...!" })
        }

        Applciationfind.status = status.toLowerCase();

        await Applciationfind.save()

        const jobs = await jobModel.findById(Applciationfind.job);
        const user = await UserModel.findById(req.user?.id)

        if (!jobs) return res.status(404).json({ message: "Jobs Not Found...!" })
        if (!user) return res.status(404).json({ message: "user Not Found...!" })

        if (Applciationfind.status == "accepted") {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', // Use the SMTP host directly
                secure: true,
                port: Number(process.env.NODEMAILER_PORT) || 465, // 465 for secure SMTP
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
                logger: true, // log to console
                debug: true,
            });

            const info = await transporter.sendMail({
                from: process.env.FROM,
                to: "pradipjedhe69@gmail.com", // Email sent to the user
                subject: `Application Submitted for ${jobs.title} at ${jobs.companyName}`, // Subject with job title and company name
                text: "Hello world?", // Fallback text if HTML is not supported
                html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="font-family: serif; color: black;">🎉 Your Application Has Been Successfully Submitted! 🎉</h2>
                    <p style="font-size: 18px;">Hi ${user?.name},</p>
                    
                    <p style="font-size: 16px; color: #000;">
                        We’re excited to inform you that your application for the <strong>${jobs.title}</strong> position at <strong>${jobs.companyName}</strong> has been received! Below are the key details of the job you’ve applied for:
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Company Name</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.companyName}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Job Title</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.title}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Location</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.location}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Salary</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.salary}</td>
                        </tr>
                    </table>
            
                    <p style="margin-top: 20px; font-size: 16px; color: #333;">
                        <strong>What to expect next:</strong> Our team at <strong>${jobs.companyName}</strong> is reviewing your application, and we’ll be in touch soon regarding the next steps. Make sure to keep an eye on your inbox!
                    </p>
            
                    <p style="margin-top: 20px; font-size: 16px; color: #333;">
                        <strong>About ${jobs.companyName}:</strong> We’re dedicated to fostering a positive work environment, offering career growth opportunities, and ensuring that all team members thrive in a collaborative space.
                    </p>
            
                    <p style="margin-top: 20px; font-size: 16px; color: #333;">
                        If you have any questions or would like to inquire further about your application, don’t hesitate to reach out. We look forward to connecting with you soon.
                    </p>
            
                    <footer style="margin-top: 40px; text-align: center; color: #666;">
                        <hr>
                        <p style="font-size: 14px; color: #555;">Thank you for applying to ${jobs.companyName}. We’re excited about the possibility of working with you!</p>
                        <p style="font-size: 16px; color: #28A745;">We’ll be in touch shortly.</p>
                        <p style="font-weight: bold; color: #007BFF;">${jobs.companyName || "email@example.com"}</p>
                    </footer>
                </div>
                `,
            });

            console.log("Email sent successfully!");

            return res.status(200).json({ message: `User ${status} Successfully...!` })
        }
        if (Applciationfind.status == "rejected") {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', // Use the SMTP host directly
                secure: true,
                port: Number(process.env.NODEMAILER_PORT) || 465, // 465 for secure SMTP
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
                logger: true, // log to console
                debug: true,
            });

            const info = await transporter.sendMail({
                from: process.env.FROM,
                to: "pradipjedhe69@gmail.com", // Email sent to the user
                subject: `Update on Your Application for ${jobs.title} at ${jobs.companyName}`, // Subject with job title and company name
                text: "Hello world?", // Fallback text if HTML is not supported
                html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: black; font-family: serif; ">💔 We're Sorry, ${user?.name}</h2>
                    <p style="font-size: 18px; color: #black;">
                        Unfortunately, after careful consideration, your application for the <strong>${jobs.title}</strong> position at <strong>${jobs.companyName}</strong> has been <span style="color: black;">rejected</span>.
                    </p>
            
                    <p style="font-size: 16px; color: #000;">
                        We appreciate the time and effort you invested in applying to <strong>${jobs.companyName}</strong>. While this decision is never easy, we encourage you to keep an eye on future opportunities at our company.
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: serif;">
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Company Name</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.companyName}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Job Title</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.title}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Location</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.location}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Salary</th>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${jobs.salary}</td>
                        </tr>
                    </table>
            
                    <p style="margin-top: 20px; font-size: 16px; color: #333;">
                        <strong>Why was your application rejected?</strong> The hiring team at <strong>${jobs.companyName}</strong> reviewed your application thoroughly, but we have decided to move forward with other candidates who more closely match the position requirements.
                    </p>
            
                    <p style="margin-top: 20px; font-size: 16px; color: #333;">
                        <strong>Next Steps:</strong> Please don't be discouraged! We encourage you to apply to other open roles that align with your skills and interests.
                    </p>
            
                    <p style="margin-top: 20px; font-size: 16px; color: #333;">
                        We thank you again for your interest in joining the team at <strong>${jobs.companyName}</strong>. Best of luck with your job search, and we hope to see your application again in the future.
                    </p>
            
                    <footer style="margin-top: 40px; text-align: center; color: #666;">
                        <hr>
                        <p style="font-size: 14px; color: #555;">Thank you for considering ${jobs.companyName}.</p>
                        <p style="font-size: 16px; color: #FF4500;">We appreciate your effort!</p>
                        <p style="font-weight: bold; color: #007BFF;">${jobs.companyName || "email@example.com"}</p>
                    </footer>
                </div>
                `,
            });
            return res.status(200).json({ message: `User ${status} Successfully...!` })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error...!" })
    }
}
