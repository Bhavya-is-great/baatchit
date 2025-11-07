import jwt from "jsonwebtoken";
import crypto from "crypto";


export function generateAndSetJWT(userId) {
    const payload = { _id: userId };

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
    });

    return token;
}

export function decodeJWT(token) {
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

export function generateVerificationToken() {
    const otp = crypto.randomInt(100000, 1000000);
    // console.log(otp)
    return otp.toString();
}

export function generateResetPasswordToken() {
    const verifyToken = crypto.randomBytes(20).toString("hex");
    // console.log(verifyToken);
    return verifyToken
}
