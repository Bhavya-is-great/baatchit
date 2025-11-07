import User from "@/models/user.model.js";
import Token from "@/models/token.model.js";
import ExpressError from "@/utils/ExpressError.util.js";
import {
    generateAndSetJWT,
    generateVerificationToken,
    generateResetPasswordToken,
    decodeJWT,
} from "@/utils/generateJWT.utils.js";
import { sanitizeUser } from "@/utils/sanitize.util.js";
import { NextResponse } from "next/server.js";

import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgotPasswordEmail,
    sendResetPasswordEmail,
} from "@/utils/mails.util.js";
import { cookies } from "next/headers";


async function decodingUser() {
    const cookieStore = await cookies();
    const tokenrec = cookieStore.get("token");

    if (!tokenrec || !tokenrec.value) {
        return null;
    }

    const decodedJwt = decodeJWT(tokenrec.value);

    if (!decodedJwt || !decodedJwt._id) {
        return null;
    }

    const user = await User.findOne({ _id: decodedJwt._id });
    return user || null;
}


// ---------------- STATUS ----------------
export async function handleStatus(req) {
    const userGot = await decodingUser();


    const resData = {
        success: true,
        message: "User Logged in Successfully",
        data: {
            user: sanitizeUser(userGot)
        }
    }
    return NextResponse.json(resData, { status: 200 });
}

// ---------------- REGISTER ----------------
export async function handleRegister(req) {
    const { name, email, phone, password } = await req.json();
    // console.log(name);

    const existingUser = await User.findOne({ email });
    // console.log(existingUser)
    if (existingUser) {
        // console.log("Entered Existing user")
        if (existingUser.googleId && !existingUser.password) {
            existingUser.name = name || existingUser.name;
            existingUser.password = password;

            await existingUser.save();
            const token = generateAndSetJWT(existingUser._id);

            const resData = {
                success: true,
                message: "User registered successfully",
                data: { user: sanitizeUser(existingUser) },
            }
            const response = NextResponse.json(resData, { status: 200 })
            response.cookies.set('token', token);
            return response;
        } else {
            throw new ExpressError(400, "User already exists");
        }
    }

    const verificationToken = generateVerificationToken();
    await sendVerificationEmail(email, verificationToken);

    const newUser = new User({
        name,
        email,
        phone,
        password,
    });
    await newUser.save();

    const newToken = new Token({
        value: verificationToken,
        user_id: newUser._id,
        type: "verification",
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    await newToken.save();

    const token = generateAndSetJWT(newUser._id);

    const resData = {
        success: true,
        message: "User registered successfully",
        data: {
            user: sanitizeUser(newUser),
        },
    }
    const response = NextResponse.json(resData, { status: 201 });
    response.cookies.set("token", token);
    return response;
}

// ---------------- SEND VERIFICATION ----------------
export async function handleSendVerification(req) {
    const user = await decodingUser();

    const existingToken = await Token.findOne({
        user_id: user._id,
        type: "verification",
    });

    const newVerificationToken = generateVerificationToken();
    await sendVerificationEmail(user.email, newVerificationToken);

    if (existingToken) {
        existingToken.value = newVerificationToken;
        existingToken.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await existingToken.save();
    } else {
        const newToken = new Token({
            value: newVerificationToken,
            user_id: user._id,
            type: "verification",
            expiresAt: Date.now() + 60 * 60 * 1000,
        });
        await newToken.save();
    }

    const resData = {
        success: true,
        message: "Verification code sent successfully",
    }
    return NextResponse.json(resData, { status: 201 })
}

// ---------------- VERIFY EMAIL ----------------
export async function handleVerifyEmail(req) {
    const { code } = await req.json();
    const user = await decodingUser();

    const token = await Token.findOne({
        value: code,
        user_id: user._id,
        type: "verification",
    });

    if (!token || token.expiresAt < new Date())
        throw new ExpressError(400, "Invalid or expired token");

    user.isVerified = true;
    await user.save();
    await token.deleteOne();

    await sendWelcomeEmail(user.email, user.name);

    const resData = {
        success: true,
        message: "Email verified successfully",
        data: {
            user: sanitizeUser(user),
        },
    };
    return NextResponse.json(resData, { status: 200 })
}

// ---------------- LOGIN ----------------
export async function handleLogin(req) {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    console.log(user)
    if (!user) throw new ExpressError(400, "User does not exist");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new ExpressError(400, "Invalid Password");

    const token = generateAndSetJWT(user._id);

    const resData = {
        success: true,
        message: "User logged in successfully",
        data: {
            user: sanitizeUser(user),
        },
    };
    const response = NextResponse.json(resData, { status: 200 });
    response.cookies.set('token', token);
    return response;
}

// ---------------- LOGOUT ----------------
export async function handleLogout() {

    const resData = {
        success: true,
        message: "Logged out successfully",
    };
    const response = NextResponse.json(resData, { status: 200 })
    response.cookies.set("token", '');
    return response;
}

// ---------------- FORGOT PASSWORD ----------------
export async function handleForgotPassword(req) {
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError(400, "User does not exist");

    const resetToken = generateResetPasswordToken();

    const newToken = new Token({
        value: resetToken,
        user_id: user._id,
        type: "reset",
        expiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
    });

    await newToken.save();

    const resetUrl = `${process.env.SERVER_URL}/reset-password/${resetToken}`;
    await sendForgotPasswordEmail(email, resetUrl);

    const resData = {
        success: true,
        message: "Reset Password Link sent successfully.",
    }
    return NextResponse.json(resData, { status: 200 });
}

// ---------------- RESET PASSWORD ----------------
export async function handleResetPassword(req, { params }) {
    const resetToken = params.token;
    const { password } = await req.json();

    const token = await Token.findOne({ value: resetToken });
    if (!token || token.expiresAt < new Date())
        throw new ExpressError(400, "Invalid or expired token");

    const user = await User.findOne({ _id: token.user_id });
    if (!user) throw new ExpressError(400, "User does not exist");

    user.password = password;
    await user.save();s
    await token.deleteOne();

    await sendResetPasswordEmail(user.email);

    const resData = {
        success: true,
        message: "Password reset successful",
    };
    return NextResponse.json(resData, { status: 200 });
}
