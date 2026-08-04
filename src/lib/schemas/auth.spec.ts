import { describe, expect, it } from 'vitest';
import { forgotPasswordSchema, registerSchema, signInSchema, updatePasswordSchema } from './auth';

const validEmail = 'user@example.com';
const validPassword = 'Password1';

describe('registerSchema', () => {
	it('accepts a valid registration payload', () => {
		const result = registerSchema.safeParse({
			email: ' user@example.com ',
			password: validPassword,
			confirmPassword: validPassword
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBe(validEmail);
		}
	});

	it('rejects mismatched passwords', () => {
		const result = registerSchema.safeParse({
			email: validEmail,
			password: validPassword,
			confirmPassword: 'Password2'
		});
		expect(result.success).toBe(false);
	});

	it('rejects passwords without upper/lower/digit', () => {
		const result = registerSchema.safeParse({
			email: validEmail,
			password: 'password',
			confirmPassword: 'password'
		});
		expect(result.success).toBe(false);
	});

	it('rejects invalid email', () => {
		const result = registerSchema.safeParse({
			email: 'not-an-email',
			password: validPassword,
			confirmPassword: validPassword
		});
		expect(result.success).toBe(false);
	});
});

describe('signInSchema', () => {
	it('accepts email + non-empty password', () => {
		const result = signInSchema.safeParse({
			email: validEmail,
			password: 'x'
		});
		expect(result.success).toBe(true);
	});

	it('rejects empty password', () => {
		const result = signInSchema.safeParse({
			email: validEmail,
			password: ''
		});
		expect(result.success).toBe(false);
	});
});

describe('forgotPasswordSchema', () => {
	it('accepts a valid email', () => {
		expect(forgotPasswordSchema.safeParse({ email: 'a@b.co' }).success).toBe(true);
	});

	it('rejects blank email', () => {
		expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
	});
});

describe('updatePasswordSchema', () => {
	it('accepts matching strong passwords', () => {
		const result = updatePasswordSchema.safeParse({
			password: validPassword,
			confirmPassword: validPassword
		});
		expect(result.success).toBe(true);
	});

	it('rejects mismatch', () => {
		const result = updatePasswordSchema.safeParse({
			password: validPassword,
			confirmPassword: 'Password2'
		});
		expect(result.success).toBe(false);
	});
});
