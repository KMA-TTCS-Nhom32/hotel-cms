import { HotelRoomStatusEnum } from '@ahomevilla-hotel/node-sdk';
import { z } from 'zod';

export const roomschema = z.object({
  detailId: z.string({
    required_error: 'Vui lòng chọn loại phòng',
  }),
  name: z.string({
    required_error: 'Tên phòng không được để trống',
  }),
  slug: z.string({
    required_error: 'Slug không được để trống',
  }),
  status: z.nativeEnum(HotelRoomStatusEnum, {
    required_error: 'Trạng thái không được để trống',
    invalid_type_error: 'Trạng thái không hợp lệ',
  }),
});

export type RoomFormValues = z.infer<typeof roomschema>;
