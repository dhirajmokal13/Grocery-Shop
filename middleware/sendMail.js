import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const sendMail = (email, subject, message) => {
    try {
        const msg = { from: process.env.smtp_user, to: email, subject: subject, text: message };
        nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.smtp_user, pass: process.env.smtp_pass },
            port: 465,
            host: 'smtp.gmail.com',
            secure: false,
        }).sendMail(msg, (err) => {
            err ? console.log(err) : console.log('mail send')
        })
    } catch (err) {
        console.log('Error while send mail' + err);
    }
}

export default sendMail;
