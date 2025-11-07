import transporter from "@/config/mailProvider.config.js";
import ExpressError from "@/utils/ExpressError.util.js";
import {
  VERIFICATION_TEMPLATE,
  WELCOME_TEMPLATE,
  FORGOT_PASSWORD_TEMPLATE,
  RESET_PASSWORD_TEMPLATE,
} from "./mailTemplates.util.js";

export async function sendVerificationEmail(email, verificationToken) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Verify your Email",
    html: VERIFICATION_TEMPLATE.replace("{verificationToken}", verificationToken),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, err);
  }
}

export async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Welcome to Dole Shole",
    html: WELCOME_TEMPLATE.replace("{name}", name).replace(
      "{dashboardURL}",
      `${process.env.CLIENT_URL}/dashboard`
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, err);
  }
}

export async function sendForgotPasswordEmail(email, resetUrl) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Reset Your Password",
    html: FORGOT_PASSWORD_TEMPLATE.replace("{resetURL}", resetUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, err);
  }
}

export async function sendResetPasswordEmail(email) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Password Reset Successful",
    html: RESET_PASSWORD_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, err);
  }
}
