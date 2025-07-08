import { z } from 'zod';
import { iconFileSchema } from './image';

export type AmenityType = 'ROOM' | 'PROPERTY' | 'SERVICE';

export const amenitySchema = z.object({
  name: z
    .string({
      required_error: 'Tên tiện ích không được để trống',
    })
    .min(1, 'Tên tiện ích không được để trống')
    .max(100, 'Tên tiện ích không được vượt quá 100 ký tự'),
  slug: z
    .string({
      required_error: 'Slug không được để trống',
    })
    .min(1, 'Slug không được để trống')
    .max(100, 'Slug không được vượt quá 100 ký tự'),
  type: z
    .string({
      required_error: 'Vui lòng chọn loại tiện ích',
    })
    .refine(
      (value) => {
        return ['ROOM', 'PROPERTY', 'SERVICE'].includes(value);
      },
      {
        message: 'Loại tiện ích không hợp lệ',
      },
    ),
  icon: iconFileSchema.optional(),
  translations: z
    .array(
      z.object({
        language: z
          .string({
            required_error: 'Ngôn ngữ không được để trống',
          })
          .min(1, 'Ngôn ngữ không được để trống'),
        name: z
          .string({
            required_error: 'Tên tiện ích không được để trống',
          })
          .min(1, 'Tên tiện ích không được để trống')
          .max(100, 'Tên tiện ích không được vượt quá 100 ký tự'),
      }),
    )
    .optional(),
});

export type AmenityFormValues = z.infer<typeof amenitySchema>;
