import { createApiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(2, "Subject must be at least 2 characters").optional().or(z.literal('')),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export const POST = createApiHandler(async (req, data) => {
  logger.info("Contact form submitted", { email: data.email });
  
  const messageEntry = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    }
  });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"NGO Website" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `New Contact Form Submission: ${data.subject || 'No Subject'}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nMessage:\n${data.message}`,
        html: `<h3>New Contact Form Submission</h3>
               <p><strong>Name:</strong> ${data.name}</p>
               <p><strong>Email:</strong> ${data.email}</p>
               <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
               <p><strong>Message:</strong></p>
               <p>${data.message.replace(/\n/g, '<br/>')}</p>`,
      });
      logger.info(`Email sent successfully for message ${messageEntry.id}`);
    } else {
      logger.warn('SMTP credentials not configured. Email not sent.');
    }
  } catch (err) {
    logger.error('Failed to send contact email:', err);
    // Don't fail the request if email fails but DB succeeds
  }

  return NextResponse.json({ success: true, message: "Message sent successfully!" });
}, { schema: ContactSchema, requireAuth: false });
