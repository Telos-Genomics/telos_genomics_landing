// src/pages/api/send-email.ts
export const prerender = false;
 
import type { APIRoute } from "astro";
import { Resend } from "resend";
 
const resend    = new Resend(import.meta.env.RESEND_API_KEY);
const emailFrom = import.meta.env.EMAIL_FROM;
const emailTo   = import.meta.env.EMAIL_TO;
 
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { nombre, apellido, email, subject, message } = data;
 
    if (!nombre || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400 }
      );
    }
 
    // apellido se reutiliza como empresa desde el componente
    const empresa = apellido ?? "";
 
    const emailHtml = `
      <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#f5f3ee;">
        <div style="border-bottom:1px solid #2a2a2a;padding-bottom:16px;margin-bottom:16px;">
          <h1 style="font-size:18px;font-weight:700;color:#ef5b5b;margin:0;">
            Telos Genomics · New Contact
          </h1>
        </div>
        <table style="width:100%;font-size:13px;line-height:2;">
          <tr><td style="color:#555;width:120px;">Name</td><td style="color:#f5f3ee;">${nombre}</td></tr>
          <tr><td style="color:#555;">Company</td><td style="color:#f5f3ee;">${empresa || "—"}</td></tr>
          <tr><td style="color:#555;">Email</td><td style="color:#ef5b5b;">${email}</td></tr>
          <tr><td style="color:#555;">Sector</td><td style="color:#f5f3ee;">${subject?.replace("[Telos-S] ", "").split(" · ")[0] ?? "—"}</td></tr>
        </table>
        <div style="margin-top:16px;border-top:1px solid #2a2a2a;padding-top:16px;">
          <p style="color:#555;font-size:12px;margin:0 0 8px;">Message:</p>
          <p style="color:#f5f3ee;font-size:13px;white-space:pre-wrap;">${message}</p>
        </div>
      </div>
    `;
 
    const { data: sendData, error: sendError } = await resend.emails.send({
      from:    `Telos Genomics Web <${emailFrom}>`,
      to:      [emailTo],
      subject: subject || `New contact from ${nombre}`,
      html:    emailHtml,
      replyTo: email,
    });
 
    if (sendError) {
      console.error(sendError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email.", details: sendError.message }),
        { status: 500 }
      );
    }
 
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully.", data: sendData }),
      { status: 200 }
    );
 
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error.", details: error.message }),
      { status: 500 }
    );
  }
};