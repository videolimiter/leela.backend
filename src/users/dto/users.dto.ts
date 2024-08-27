import { createZodDto } from 'nestjs-zod'
import { UserCreateInputSchema, UserSchema } from 'prisma/generated/zod'
import { z } from 'zod'

export class UserCreateDto extends createZodDto(UserCreateInputSchema) {}

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const username = z
  .string()
  .transform((str) => str.toLowerCase().trim())
  .refine((username) => !/[^0-9a-z_]/.test(username))

export const password = z
  .string()
  .min(4)
  .max(100)
  .transform((str) => str.trim())

export const firstName = z.string().transform((str) => str?.trim())

export const lastName = z.string().transform((str) => str?.trim())

export const telegram = z
  .string()
  .transform((str) => str.toLowerCase().trim().replace(/@/g, ''))
  .refine((username) => !/[^0-9a-z_.]/.test(username), {
    params: { i18n: 'zod:models.user.telegram.invalid', path: ['telegram'] },
  })

export const isGuide = z.boolean().optional()
export const GuestSignup = z.object({
  name: z.string().min(3),
  token: z.string(),
  locale: z.string(),
})
export const Signup = z.object({
  timezone: z.string().optional(),
  locale: z.string().optional(),
  email,
  username,
  password,
  firstName,
  lastName,
})

export class SignUpDto extends createZodDto(Signup) {}

export const Login = z.object({
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim())
    .optional(),
  username: z
    .string()
    .transform((str) => str.toLowerCase().trim())
    .refine((username) => !/[^0-9a-z_]/.test(username))
    .optional(),
  password: z.string(),
  timezone: z.string().optional(),
})

export class LoginDto extends createZodDto(Login) {}

export const QuickRegister = z
  .object({
    email,
    countryIsoCode: z.string(),
    agreeAllTerms: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
    timezone: z.string().optional(),
    locale: z.string(),
  })

  .refine((data) => data.agreeAllTerms, {
    params: { i18n: 'zod:models.user.agreeAllTerms.required' },
    path: ['agreeAllTerms'],
  })

export const ForgotPassword = z.object({
  email,
})

export const ConfirmEmail = z.object({
  token: z.string(),
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    params: { i18n: 'zod:models.user.password.noMatch' },
    path: ['passwordConfirmation'], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string().optional(),
  newPassword: password,
})

export type QuickRegistrType = z.infer<typeof QuickRegister>
export type UserType = z.infer<typeof UserSchema>

export const AgreementsSchema = z.object({
  id: z.number().optional(),
  'user-agreement-ru': z.boolean().optional(),
  'merchant-agreement-ru': z.boolean().optional(),
  'privacy-policy-agreement-ru': z.boolean().optional(),
  'user-agreement-en': z.boolean().optional(),
  'merchant-agreement-en': z.boolean().optional(),
  'privacy-policy-agreement-en': z.boolean().optional(),
})

export const UpdateUserSchema = UserSchema.pick({
  phone: true,
  telegram: true,
  about: true,
  avatarUrl: true,
  isGuide: true,
})
  .extend({
    email: z
      .string()
      .email()
      .nullish()
      .transform((str) => str?.toLowerCase().trim() || null),
    username,
    firstName,
    lastName,
  })
  .partial()
  .merge(UserSchema.pick({ id: true }))

export const BasicUserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  avatarUrl: z.string().nullable(),
  isGuide: z.boolean(),
})

export type BasicUserType = z.infer<typeof BasicUserSchema>

export type UserLoggedType = {
  id: number
  iat: number
  exp: number
}

export const UpdateUserSchemaAdmin = UpdateUserSchema.extend({
  status: z.string().optional(),
  blockReason: z.string().optional(),
})

// const refine = (schema: any, state: any) => {
//   return schema
//     .refine(
//       (data: { email: string }) => {
//         return !state?.conflictUser || data.email !== state?.conflictUser?.email
//       },
//       { params: { i18n: 'zod:models.user.email.unique' }, path: ['email'] },
//     )
//     .refine(
//       (data: { username: string }) => {
//         return (
//           !state?.conflictUser ||
//           data.username !== state?.conflictUser?.username
//         )
//       },
//       {
//         params: { i18n: 'zod:models.user.username.unique' },
//         path: ['username'],
//       },
//     )
// }

// const transform = (schema: any, state: any) => {
//   return schema.transform((data) => {
//     if (data.emailLeelaCertificate) {
//       data.emailLeelaCertificate = data.emailLeelaCertificate
//         .toLowerCase()
//         .trim()
//     }
//     return data
//   })
// }
// export const SignupSchemaCtx: ZodSchemaWithContext<{
//   conflictUser?: UserType
//   user?: UserType
// }> = (state) => {
//   return refine(Signup, state)
// }
