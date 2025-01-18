import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@ahomevilla-hotel/node-sdk';

import { BlockUserFormValues, blockUserSchema } from '@/lib/validators/user';
import { blockOrUnblockUserService } from '@/services/user';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputText } from '@/components/Common/FormFields';

interface BlockUserFormProps {
  data: User;
  onRequestSuccess: () => void;
  onCancelDialog: () => void;
}

export const BlockUserForm = ({ data, onRequestSuccess, onCancelDialog }: BlockUserFormProps) => {
  const form = useForm<BlockUserFormValues>({
    resolver: zodResolver(blockUserSchema),
    defaultValues: {
      reason: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: BlockUserFormValues) => {
    try {
      await blockOrUnblockUserService(data.id, {
        reason: values.reason,
        action: data.is_blocked ? 'UNBLOCK' : 'BLOCK',
      });

      toast.success(`${data.is_blocked ? 'Bỏ chặn' : 'Chặn'} người dùng ${data.name} thành công`);
      onRequestSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thực hiện thao tác');
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
        <InputText<BlockUserFormValues>
          control={control}
          name='reason'
          label='Lý do'
          placeholder='Nhập lý do...'
          isTextArea
        />

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCancelDialog} className='w-full'>
            Hủy
          </Button>

          <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='w-full'>
            {data.is_blocked ? 'Bỏ chặn' : 'Chặn'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
