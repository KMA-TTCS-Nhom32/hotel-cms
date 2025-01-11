import { z } from 'zod';
import { imageFileSchema, imageListSchema } from './image';
import { optionSchema, priceSchema } from './common';

export const roomDetailSchema = z.object({
  name: z.string({
    required_error: 'Tên loại phòng không được để trống',
  }),
  slug: z.string({
    required_error: 'Slug không được để trống',
  }),
  thumbnail: imageFileSchema.optional(),
  images: imageListSchema.nullable(),
  description: z.string({
    required_error: 'Mô tả không được để trống',
  }),
  room_type: z.string({
    required_error: 'Loại phòng không được để trống',
  }),
  bed_type: z.string({
    required_error: 'Loại giường không được để trống',
  }),
  amenities: z.array(optionSchema).min(1, {
    message: 'Vui lòng chọn ít nhất một tiện ích',
  }),
  max_adults: z
    .number({
      required_error: 'Số người lớn tối đa không được để trống',
    })
    .min(1, 'Số người lớn tối đa phải lớn hơn 0'),
  max_children: z
    .number({
      required_error: 'Số trẻ em tối đa không được để trống',
    })
    .min(0, 'Số trẻ em tối đa phải lớn hơn hoặc bằng 0'),
  base_price_per_hour: priceSchema,
  base_price_per_night: priceSchema,
  base_price_per_day: priceSchema,
});

export type RoomDetailFormValues = z.infer<typeof roomDetailSchema>;
