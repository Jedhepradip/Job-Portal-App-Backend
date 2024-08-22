import mongoose, { Document } from "mongoose";


interface UserData extends Document {
    ProfileImg: string;
    name: string;
    email: string;
    mobile: number;
    password: string;
    role: string;
    profile?: object;
    bio?: string;
    skills?: string;
    ResumeFile?: string;
}

const UserSchema: mongoose.Schema<UserData> = new mongoose.Schema({
    ProfileImg: {
        type: String,
        // required: true,
        default: "",
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "Recruiter"]
    },
    profile: {
        bio: {
            type: String,
        },
        skills: {
            type: [String],  // Use an array of strings if multiple skills are stored        
        },
        ResumeFile: {
            type: String,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        }
    }

}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;



// fullName: { type: String, required: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// phoneNumber: { type: String },
// resumeUrl: { type: String }, // URL to the user's uploaded resume
// skills: [String], // Array of skills
// education: [{
//     institution: String,
//     degree: String,
//     fieldOfStudy: String,
//     startDate: Date,
//     endDate: Date
// }],
// experience: [{
//     company: String,
//     position: String,
//     startDate: Date,
//     endDate: Date,
//     description: String
// }],
// appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
// createdAt: { type: Date, default: Date.now }