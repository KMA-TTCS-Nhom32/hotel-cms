import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { User, UserRoleEnum } from '@ahomevilla-hotel/node-sdk';
import { UpdateUserFormValues, updateUserSchema } from '@/lib/validators/user';
import { toast } from 'sonner';
import { updateUserService } from '@/services/user';
import { InputSimpleSelect } from '@/components/Common/FormFields';
import { SelectOption } from '@/components/Common/BasicSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

interface UpdateUserFormProps {
  data: User;
  branchOptions: SelectOption[];
  onRequestSuccess: () => void;
  onCancelDialog: () => void;
}

export const UpdateUserForm = ({
  data,
  branchOptions,
  onRequestSuccess,
  onCancelDialog,
}: UpdateUserFormProps) => {
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      branchId: data.working_at ? data.working_at.id : undefined,
      role: data.role !== UserRoleEnum.User ? data.role : undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: UpdateUserFormValues) => {
    try {
      await updateUserService(data.id, values);

      toast.success('Cập nhật quyền hạn thành công');
      onRequestSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật quyền hạn');
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
        <InputSimpleSelect<UpdateUserFormValues>
          control={control}
          name='branchId'
          label='Chi nhánh làm việc'
          options={branchOptions}
          placeholder='Chọn Chi nhánh làm việc'
        />
        <InputSimpleSelect<UpdateUserFormValues>
          control={control}
          name='role'
          label='Quyền hạn'
          options={[
            {
              label: 'Admin',
              value: UserRoleEnum.Admin,
            },
            {
              label: 'Nhân viên',
              value: UserRoleEnum.Staff,
            },
          ]}
          placeholder='Chọn quyền hạn'
        />
        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCancelDialog} className='w-full'>
            Hủy
          </Button>

          <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='w-full'>
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
};
