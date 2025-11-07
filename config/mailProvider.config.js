import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", 
  port: 587,
  secure: false,               
  auth: {
    user: process.env.BREVO_LOGIN, 
    pass: process.env.BREVO_PASS,  
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export default transporter;
