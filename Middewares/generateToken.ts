import Jwt from "jsonwebtoken";

export const generateToken = (usedata:string):string => {
    if (!process.env.SECRET_KEY) {
        console.error("SECRET_KEY is not defined in the environment variables");
        throw new Error("SECRET_KEY is not defined");
    }
    return Jwt.sign(usedata, process.env.SECRET_KEY)    
}