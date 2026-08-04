import z from 'zod';

const passwordField = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.max(72, 'Password must be at most 72 characters')
	.regex(/[a-z]/)
	.regex(/[A-Z]/)
	.regex(/[0-9]/);

export const registerSchema = z
	.object({
		email: z.string().trim().email('Enter a valid email').max(254),
		password: passwordField,
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type RegisterInput = z.infer<typeof registerSchema>;

export const signInSchema = z.object({
	email: z.string().trim().email('Enter a valid email').max(254),
	password: z.string().min(1, 'Enter your password').max(72)
});

export type SignInInput = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().trim().email('Enter a valid email').max(254)
});

export const updatePasswordSchema = z
	.object({
		password: passwordField,
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
