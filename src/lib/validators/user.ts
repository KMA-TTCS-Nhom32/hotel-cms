import { UserRoleEnum } from '@ahomevilla-hotel/node-sdk';
import { z } from 'zod';

export const updateUserSchema = z
  .object({
    branchId: z.string().optional(),
    role: z.nativeEnum(UserRoleEnum, {
      required_error: 'Quyền hạn không được để trống',
      invalid_type_error: 'Quyền hạn không hợp lệ',
    }),
  })
  .refine(
    (data) => {
      if (data.role === UserRoleEnum.Staff) {
        return data.branchId !== undefined;
      }
      return true;
    },
    {
      message: 'Vui lòng chọn khách sạn làm việc cho nhân viên',
      path: ['branchId'],
    },
  );

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const blockUserSchema = z.object({
  reason: z.string().min(1, 'Vui lòng nhập lý do'),
});

export type BlockUserFormValues = z.infer<typeof blockUserSchema>;
