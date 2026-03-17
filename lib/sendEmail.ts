import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (
  name: string,
  email: string,
  identity: string,
) => {
  try {
    await resend.emails.send({
      from: "ShiftSmart <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to ShiftSmart — Your Login ID",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #f0f0f0; border-radius: 16px;">
          <h2 style="color: #111; margin-bottom: 4px;">Welcome, ${name} 👋</h2>
          <p style="color: #888; font-size: 13px;">You've been added to ShiftSmart</p>
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 24px 0;" />
          <p style="color: #444; font-size: 14px;">Your login ID is:</p>
          <div style="background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; text-align: center;">
            <span style="font-size: 20px; font-weight: bold; color: #111; letter-spacing: 2px;">${identity}</span>
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Use this ID to log into ShiftSmart and start your shift. Keep it safe!</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};