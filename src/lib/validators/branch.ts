import { z } from 'zod';
import { imageFileSchema, imageListSchema } from './image';
import { RegexValidation } from './auth';

export const branchSchema = z.object({
  provinceId: z.string({
    required_error: 'Vui lòng chọn tỉnh/thành',
  }),
  name: z.string({
    required_error: 'Tên chi nhánh không được để trống',
  }),
  slug: z.string({
    required_error: 'Slug không được để trống',
  }),
  phone: z
    .string({
      required_error: 'Số điện thoại không được để trống',
    })
    .refine(
      (value) => {
        return RegexValidation.phone.test(value);
      },
      {
        message: 'Số điện thoại không hợp lệ',
      },
    ),
  description: z.string({
    required_error: 'Mô tả không được để trống',
  }),
  address: z.string({
    required_error: 'Địa chỉ không được để trống',
  }),
  //   location: z.object({
  //     latitude: z.number(),
  //     longitude: z.number(),
  //   }),
  thumbnail: imageFileSchema.optional(),
  images: imageListSchema.nullable(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const updateBranchAmenitiesSchema = z.object({
  amenities: z.array(optionSchema).min(1, {
    message: 'Vui lòng chọn ít nhất một tiện ích',
  }),
});

export type UpdateBranchAmenitiesFormValues = z.infer<typeof updateBranchAmenitiesSchema>;
