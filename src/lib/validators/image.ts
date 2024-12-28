import { z } from 'zod';
export const imageSizeLimit = 5 * 1024 * 1024; // 5MB
const iconSizeLimit = 1 * 1024 * 1024; // 1MB
export const maxImageAmount = 5;
export const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const imageSchema = z.object({
  url: z.string({
    required_error: 'Ảnh không được để trống',
  }),
  publicId: z.string({
    required_error: 'Ảnh không được để trống',
  }),
});

export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      allowedImageTypes.includes(file.type),
    { message: 'Vui lòng chọn định dạng ảnh' },
  )
  .refine((file) => file.size <= imageSizeLimit, {
    message: 'Kích thước ảnh không được lớn hơn 5MB',
  });

export const imageListSchema = z
  .instanceof(FileList)
  .refine((list) => list.length > 0, 'Chọn ít nhất 1 ảnh')
  .refine((list) => list.length <= maxImageAmount, `Chọn tối đa ${maxImageAmount} ảnh`)
  .refine((list) => {
    for (const file of list) {
      if (!allowedImageTypes.includes(file.type)) {
        return false;
      }
    }
    return true;
  })
  .refine(
    (list) => {
      return Array.from(list).every((file) => file.size <= imageSizeLimit);
    },
    {
      message: "Kích thước ảnh không được lớn hơn 5MB",
    }
  )
  ;

export const iconFileSchema = z
  .instanceof(File)
  .refine((file) => [...allowedImageTypes, 'image/svg'].includes(file.type), {
    message: 'Vui lòng chọn định dạng svg, png, webp, jpg',
  })
  .refine((file) => file.size <= iconSizeLimit, {
    message: 'Kích thước icon không được lớn hơn 1MB',
  });
