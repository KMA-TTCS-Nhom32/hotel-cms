import { z } from 'zod';
import { iconFileSchema } from './image';

export type AmenityType = 'ROOM' | 'PROPERTY' | 'SERVICE';

export const amenitySchema = z.object({
  name: z.string({
    required_error: 'Tên tiện ích không được để trống',
  }),
  slug: z.string({
    required_error: 'Slug không được để trống',
  }),
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
});

export type AmenityFormValues = z.infer<typeof amenitySchema>;
