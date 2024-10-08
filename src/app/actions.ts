"use server";

import { z } from "zod";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/ui/email";

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export async function submitForm(formData: FormData) {
  const validatedFields = formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const data = await resend.emails.send({
      from: "Your Website <onboarding@resend.dev>",
      to: ["alsan.atilla@icloud.com"],
      subject: "New Contact Form Submission",
      react: EmailTemplate({ name, email, message }),
    });

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
