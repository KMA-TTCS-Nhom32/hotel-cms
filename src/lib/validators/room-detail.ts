import { z } from 'zod';
import { imageFileSchema, imageListSchema } from './image';
import { optionalPriceSchema, optionSchema, priceSchema } from './common';

const roomDetailTranslationSchema = z.object({
  language: z
    .string({
      required_error: 'Ngôn ngữ không được để trống',
    })
    .min(1, 'Ngôn ngữ không được để trống'),
  name: z
    .string({
      required_error: 'Tên loại phòng không được để trống',
    })
    .min(1, 'Tên loại phòng không được để trống'),
  description: z
    .string({
      required_error: 'Mô tả không được để trống',
    })
    .min(1, 'Mô tả không được để trống'),
});

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
  area: z.number({
    required_error: 'Diện tích không được để trống',
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
  translations: z.array(roomDetailTranslationSchema).optional(),
});

export type RoomDetailFormValues = z.infer<typeof roomDetailSchema>;

const priceHistory = z
  .object({
    id: z.string().optional(),
    name: z
      .string({
        required_error: 'Vui lòng điền tên ngày đặc biệt',
      })
      .min(1, 'Vui lòng nhập tên ngày đặc biệt'),
    description: z
      .string({
        required_error: 'Vui lòng nhập mô tả',
      })
      .min(1, 'Vui lòng nhập mô tả'),
    effective_from: z
      .string({
        required_error: 'Vui lòng chọn ngày bắt đầu',
      })
      .min(1, 'Vui lòng chọn ngày bắt đầu'),
    effective_to: z.string().optional(),
    price_per_hour: optionalPriceSchema,
    price_per_night: optionalPriceSchema,
    price_per_day: optionalPriceSchema,
  })
  .refine((data) => data.price_per_hour || data.price_per_night || data.price_per_day, {
    message: 'Vui lòng nhập ít nhất một loại giá',
    path: ['price_per_hour'], // This will show error on the price field
  });

export const roomDetailPriceSchema = z.object({
  base_price_per_hour: priceSchema,
  base_price_per_night: priceSchema,
  base_price_per_day: priceSchema,
  special_price_per_hour: optionalPriceSchema,
  special_price_per_night: optionalPriceSchema,
  special_price_per_day: optionalPriceSchema,
  roomPriceHistories: z
    .array(priceHistory)
    .nullable()
    .refine(
      (data) => !data || data.every((item) => item.name && item.description && item.effective_from),
      {
        message: 'Vui lòng điền đầy đủ thông tin cho mỗi ngày đặc biệt',
      },
    ),
});

export type RoomDetailPriceFormValues = z.infer<typeof roomDetailPriceSchema>;
