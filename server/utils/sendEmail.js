import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `"ZAPA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "ZAPA Email Confirmation",
    html: `
      <div style="font-family: Arial; color: #fff; padding: 20px;">
        <h2>Welcome to ZAPA</h2>
        <p>Please click the link below to confirm your email and complete your registration:</p>
        <a style="color: #0ff;" href="${verificationLink}">${verificationLink}</a>
      </div>
    `,
  });
};
