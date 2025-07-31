import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Email/Username is required' })
    .min(1, 'Email/Username is required')
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isUsername = /^[a-zA-Z0-9._-]+$/.test(val);
      return isEmail || isUsername;
    }, {
      message: 'Enter a valid email address or username',
    }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
