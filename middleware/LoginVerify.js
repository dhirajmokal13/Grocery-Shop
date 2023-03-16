import dotenv from 'dotenv';
dotenv.config();
import Jwt from "jsonwebtoken";
const jwtKey = process.env.JWTKEY;

const LoginVerify = async (req, res, next) => {
    const token = req.headers['authorization'];
    Jwt.verify(token, jwtKey, async (err, decoded) => {
        if (!err) {
            req.headers['userData'] = decoded;
            next();
        } else {
            res.status(201).send({ 'message': "Invalid" })
        }
    })

}

export default LoginVerify;