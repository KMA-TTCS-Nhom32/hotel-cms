import { z } from 'zod';

export const RegexValidation = {
  phone: /^(\+84|0)\d{9,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const loginSchema = z.object({
  emailOrPhone: z
    .string({
      required_error: 'Bạn cần nhập email hoặc số điện thoại',
    })
    .refine(
      (value) => {
        return RegexValidation.phone.test(value) || RegexValidation.email.test(value);
      },
      {
        message: 'Email hoặc số điện thoại không hợp lệ',
      },
    ),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu cần ít nhất 8 kí tự' })
    .regex(/[A-Z]/, { message: 'Mật khẩu cần ít nhất 1 chữ in hoa' })
    .regex(/[a-z]/, { message: 'Mật khẩu cần ít nhất 1 chữ thường' })
    .regex(/\d/, { message: 'Mật khẩu cần ít nhất 1 số' })
    .regex(/[^A-Za-z0-9]/, { message: 'Mật khẩu cần ít nhất 1 kí tự đặc biệt' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Register schema is same as login schema have additional fields
export const registerSchema = z
  .object({
    ...loginSchema.shape,
    confirmPassword: z.string({
      required_error: 'Xác nhận mật khẩu không được để trống',
    }),
    name: z.string({
      required_error: 'Tên không được để trống',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'], // path of error
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
