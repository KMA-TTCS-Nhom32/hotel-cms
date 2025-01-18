import { BookingTypeEnum } from '@ahomevilla-hotel/node-sdk';
import { z } from 'zod';

export const updateBookingStatusSchema = z.object({
  status: z.string().min(1, 'Vui lòng chọn trạng thái'),
});

export const createBookingSchema = z.object({
  roomId: z.string().min(1, 'Vui lòng chọn phòng'),
  type: z.nativeEnum(BookingTypeEnum),
  start_date: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  end_date: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  start_time: z.string().min(1, 'Vui lòng chọn giờ bắt đầu'),
  end_time: z.string().min(1, 'Vui lòng chọn giờ kết thúc'),
  name: z.string().optional(),
  phone: z.string().optional(),
  number_of_guests: z.number().min(1, 'Số lượng khách không hợp lệ'),
  adults: z.number().min(1, 'Số lượng người lớn không hợp lệ'),
  children: z.number().min(0, 'Số lượng trẻ em không hợp lệ'),
  infants: z.number().min(0, 'Số lượng trẻ sơ sinh không hợp lệ'),
  special_requests: z.string().optional(),
  guest_details: z.any().optional(),
  check_in_time: z.string().min(1, 'Vui lòng chọn thời gian check-in'),
});

export type UpdateBookingStatusFormValues = z.infer<typeof updateBookingStatusSchema>;
export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
