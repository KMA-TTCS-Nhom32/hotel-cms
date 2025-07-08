import { z } from 'zod';

export const provinceSchema = z.object({
  name: z.string({
    required_error: 'Tên Tỉnh/thành không được để trống',
  }),
  zip_code: z
    .string({
      required_error: 'Zipcode không được để trống',
    })
    .regex(/^\d+$/, {
      message: 'Zipcode chỉ được chứa số',
    })
    .min(4, {
      message: 'Zipcode phải có ít nhất 4 ký tự',
    })
    .max(6, {
      message: 'Zipcode không được quá 6 ký tự',
    }),
  slug: z.string({
    required_error: 'Slug không được để trống',
  }),
  translations: z
    .array(
      z.object({
        language: z.string({
          required_error: 'Ngôn ngữ không được để trống',
        }),
        name: z.string({
          required_error: 'Tên Tỉnh/thành không được để trống',
        }),
      }),
    )
    .optional(),
});

export type ProvinceFormValues = z.infer<typeof provinceSchema>;
