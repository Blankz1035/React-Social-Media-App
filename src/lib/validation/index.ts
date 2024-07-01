import * as z from 'zod'

export const SignUpValidation = z.object({
    name: z.string().min(2, {message: "Name too Short"}), 
    username: z.string().min(2, {message: "Username too Short"}),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 Characters"})
  })

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message: "Password must be at least 8 Characters"})
})
  