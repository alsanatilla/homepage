'use server'

import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
})

export async function submitForm(formData: FormData) {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    throw new Error('Invalid form data')
  }

  // Here you would typically send an email or save to a database
  // For this example, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // If everything is successful, this function will resolve
  // If there's an error, it will throw, and the client will catch it
}