import dotenv from 'dotenv';
dotenv.config();
import Jwt from "jsonwebtoken";
const jwtKey = process.env.JWTKEY;

const LoginVerify = async (req, res, next) => {
    console.log("This is Verification Middleware");
    next();
}

export default LoginVerify;