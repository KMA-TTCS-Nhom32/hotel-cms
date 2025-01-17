import { z } from 'zod';

export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export type Option = z.infer<typeof optionSchema>;

export const priceSchema = z
  .number({
    required_error: 'Giá không được để trống',
  })
  .refine(
    (value) => {
      const priceString = value.toString();
      return priceString.length >= 5 && priceString.length <= 12;
    },
    {
      message: 'Giá phải có độ dài từ 5 đến 12 chữ số',
    },
  )
  .refine(
    (value) => {
      return Number.isInteger(value) && value >= 0;
    },
    {
      message: 'Giá phải là số nguyên dương',
    },
  );

export const optionalPriceSchema = z
  .number()
  .nullable()
  .refine(
    (value) => {
      if (value === null) return true;
      const priceString = value.toString();
      return priceString.length >= 5 && priceString.length <= 12;
    },
    {
      message: 'Giá phải có độ dài từ 5 đến 12 chữ số',
    },
  )
  .refine(
    (value) => {
      if (value === null) return true;
      return Number.isInteger(value) && value >= 0;
    },
    {
      message: 'Giá phải là số nguyên dương',
    },
  );
