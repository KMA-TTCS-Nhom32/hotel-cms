import { useForm } from 'react-hook-form';
import { HotelRoom, HotelRoomStatusEnum } from '@ahomevilla-hotel/node-sdk';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import { RoomFormValues, roomschema } from '@/lib/validators/room';
import { createRoomService, updateRoomService } from '@/services/room';
import { SelectOption } from '@/components/Common/BasicSelect';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Form } from '@/components/ui/form';
import { InputSimpleSelect, InputText } from '@/components/Common/FormFields';
import { Button } from '@/components/ui/button';
import { RoomStatusOptions } from '@/constants';

interface CreateUpdateRoomFormProps {
  data: HotelRoom | null;
  onFinishedRequest: () => void;
  roomDetails: SelectOption[];
  onCancelDialog: () => void;
}

export const CreateUpdateRoomForm = ({
  data,
  onFinishedRequest,
  roomDetails,
  onCancelDialog,
}: CreateUpdateRoomFormProps) => {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomschema),
    defaultValues: {
      detailId: data?.detailId ?? undefined,
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      status: data?.status ?? HotelRoomStatusEnum.Maintenance,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: RoomFormValues) => {
    try {
      if (data) {
        const updatePayload = {
          ...values,
          ...(values.slug !== data.slug ? { slug: values.slug } : {}),
        };
        await updateRoomService(data.id, updatePayload);
      } else {
        await createRoomService(values);
      }

      toast.success(`${data ? 'Cập nhật' : 'Tạo mới'} phòng thành công`);
      onFinishedRequest();
    } catch (error: any) {
      console.error(error);
      if (error.statusCode === 409) {
        toast.error('Phòng với slug này đã tồn tại');
        return;
      }
      toast.error(`Có lỗi xảy ra khi ${data ? 'cập nhật' : 'tạo mới'} phòng`);
    }
  };

  return (
    <ScrollArea className='w-full h-full pr-2.5 -mr-2.5 max-h-[600px] hidden-scrollbar'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4 px-[1px]'>
          <InputSimpleSelect<RoomFormValues>
            control={control}
            name='detailId'
            label='Loại phòng'
            options={roomDetails}
            placeholder='Chọn loại phòng'
          />

          <div className='w-full grid grid-cols-3 gap-3'>
            <InputText<RoomFormValues>
              control={control}
              name='name'
              label='Tên phòng'
              placeholder='Nhập tên phòng'
            />
            <InputText<RoomFormValues>
              control={control}
              name='slug'
              label='Slug'
              placeholder='Nhập slug'
            />
            <InputSimpleSelect<RoomFormValues>
              control={control}
              name='status'
              label='Trạng thái'
              options={RoomStatusOptions}
              placeholder='Đặt trạng thái phòng'
            />
          </div>
          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={onCancelDialog} className='w-full'>
              Hủy
            </Button>

            <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='w-full'>
              {data ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};
