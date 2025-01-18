import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Booking, BookingStatusEnum } from '@ahomevilla-hotel/node-sdk';
import { UpdateBookingStatusFormValues, updateBookingStatusSchema } from '@/lib/validators/booking';
import { toast } from 'sonner';
import { updateBookingStatusService } from '@/services/booking';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputSimpleSelect } from '@/components/Common/FormFields';

interface UpdateStatusFormProps {
  data: Booking;
  onRequestSuccess: () => void;
  onCancelDialog: () => void;
}

export const UpdateStatusForm = ({
  data,
  onRequestSuccess,
  onCancelDialog,
}: UpdateStatusFormProps) => {
  const form = useForm<UpdateBookingStatusFormValues>({
    resolver: zodResolver(updateBookingStatusSchema),
    defaultValues: {
      status: data.status,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: UpdateBookingStatusFormValues) => {
    try {
      await updateBookingStatusService(data.id, {
        status: values.status as BookingStatusEnum,
      });
      toast.success('Cập nhật trạng thái đơn đặt phòng thành công');
      onRequestSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
        <InputSimpleSelect<UpdateBookingStatusFormValues>
          control={control}
          name='status'
          label='Trạng thái'
          options={[
            { label: 'Chờ xác nhận', value: BookingStatusEnum.Pending },
            { label: 'Đã xác nhận', value: BookingStatusEnum.Completed },
            { label: 'Đã hoàn thành', value: BookingStatusEnum.Completed },
            { label: 'Đã hủy', value: BookingStatusEnum.Cancelled },
          ]}
          placeholder='Chọn trạng thái'
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
