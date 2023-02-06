import dotenv from 'dotenv';
dotenv.config();
import registrationModel from "../models/customerAndUserModel.js";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import Jwt from "jsonwebtoken";
const jwtKey = process.env.JWTKEY;

class customerAndUser {
    static getOtp = async (req, res) => {
        try {
            const otp = Math.floor(Math.random() * 999999);
            const email = req.body.email;
            const msg = {
                from: process.env.smtp_user,
                to: email,
                subject: 'Otp Verification',
                text: `Hi ${email} Your Otp is ${otp} For Customer Registration`,
            };
            nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.smtp_user,
                    pass: process.env.smtp_pass
                },
                port: 465,
                host: 'smtp.gmail.com',
                secure: false,
            }).sendMail(msg, (err) => {
                if (!err) {
                    res.status(202).send({ 'send': true, 'otp': otp, 'email': email });
                } else {
                    res.status(202).send({ 'send': false, 'otp': '', 'email': email });
                }

            })
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static validateSeller = async (req, res) => {
        const token = req.headers['authorization'];
        Jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                res.status(201).send({ 'message': "Invalid" })
            } else {
                res.status(201).send({ 'message': decoded })
            }
        })
    }

    static logout = async (req, res) => {
        const token = req.headers['authorization'];
        Jwt.verify(token, jwtKey, (err) => {
            if (!err) {
                Jwt.sign({ 'expire': true }, jwtKey, { expiresIn: "3s" }, (err, token) => {
                    if (!err) {
                        res.status(201).send({ 'expire': true, 'token': token })
                    }
                });
            }
        })
    }

    static registerCustomer = async (req, res) => {
        try {
            const { name, password, email, mobile, username, address } = req.body;
            const result = await registrationModel.customer.findOne({ uname: username })
            if (result == null) {
                const re = new registrationModel.customer({
                    name: name,
                    mnumber: mobile,
                    email: email,
                    addr: address,
                    uname: username,
                    password: await bcrypt.hash(password, 10),
                });
                let rest = await re.save();
                res.status(202).send({ 'signup': true, 'reason': null });
            } else {
                res.status(202).send({ 'signup': false, 'reason': 'Username Already Register' });
            }

        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }

    };
    
    static loginCustomer = async (req, res) => {
        const { username, password } = req.body;
        const result = await registrationModel.customer.findOne({ uname: username })
        if (result != null) {
            const ismatch = await bcrypt.compare(password, result.password);
            if (ismatch) {
                let userData = JSON.stringify({
                    id: result._id,
                    Name: result.name,
                    email: result.email,
                    uname: result.uname,
                    address: result.addr,
                });
                Jwt.sign({ 'user': result }, jwtKey, { expiresIn: "1h" }, (err, token) => {
                    if (!err) {
                        res.status(200).send({ 'loginWho': 'customer', 'userData': userData, authData: token, 'reason': null });
                    } else {
                        res.status(200).send({ 'loginWho': false, 'reason': err });
                    }
                });
            } else {
                res.status(200).send({ 'loginWho': false, 'reason': 'Invalid Credentials' })
            }
        } else {
            res.status(200).send({ 'loginWho': false, 'reason': 'Invalid Credentials' })
        }
    }

    static loginseller = async (req, res) => {
        const { username, password } = req.body;
        const result = await registrationModel.seller.findOne({ buname: username })
        if (result != null) {
            const ismatch = await bcrypt.compare(password, result.password);
            if (ismatch) {
                let userData = JSON.stringify({
                    id: result._id,
                    Name: result.sellerName,
                    email: result.email,
                    uname: result.buname,
                });

                Jwt.sign({ 'user': result }, jwtKey, { expiresIn: "1h" }, (err, token) => {
                    if (!err) {
                        res.status(200).send({ 'loginWho': 'seller', 'userData': userData, authData: token, 'reason': null });
                    } else {
                        res.status(200).send({ 'loginWho': false, 'reason': err });
                    }
                });

            } else {
                res.status(200).send({ 'loginWho': false, 'reason': 'Invalid Credentials' })
            }
        } else {
            res.status(200).send({ 'loginWho': false, 'reason': 'Invalid Credentials' })
        }
    }

    static registerseller = async (req, res) => {
        try {
            const { name, bname, mobile, email, address, buname, password } = req.body;
            const result = await registrationModel.seller.findOne({ buname: buname });
            if (result == null) {
                const re = new registrationModel.seller({
                    sellerName: name,
                    businessName: bname,
                    mnumber: mobile,
                    email: email,
                    addr: address,
                    buname: buname,
                    password: await bcrypt.hash(password, 10),
                });
                await re.save();
                res.status(202).send({ 'signup': true, 'reason': null })
            } else {
                res.status(202).send({ 'signup': false, 'reason': 'Seller Username Already Register' });
            }
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static getSellerData = async (req, res) => {
        try {
            const sellers = await registrationModel.seller.find({}, 'sellerName businessName email addr location');
            res.status(200).send(sellers);
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static upadateSellerLocation = async (req, res) => {
        try {
            const { seller_id, location } = req.params;
            const result = await registrationModel.seller.findByIdAndUpdate(seller_id, { $set: { location: location.split(',') } });
            result ? res.status(200).send(true) : res.status(200).send(false)
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }
}

export default customerAndUser;