import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { BookingTypeEnum, HotelRoom } from '@ahomevilla-hotel/node-sdk';

import { createBookingAtHotelService } from '@/services/booking';
import { CreateBookingFormValues, createBookingSchema } from '@/lib/validators/booking';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputNumber, InputText } from '@/components/Common/FormFields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDateRangePicker } from '../DashboardPage/components/DateRangePicker';
import { format } from 'date-fns';

interface CreateUpdateBookingFormProps {
  rooms: HotelRoom[];
  onRequestSuccess?: () => void;
  onCancel: () => void;
}

export const CreateUpdateBookingForm = ({
  rooms,
  onRequestSuccess,
  onCancel,
}: CreateUpdateBookingFormProps) => {
  const form = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      type: BookingTypeEnum.Hourly,
      number_of_guests: 1,
      adults: 1,
      children: 0,
      infants: 0,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    setValue,
    control,
  } = form;

  const { run } = useRequest(createBookingAtHotelService, {
    manual: true,
    onSuccess: () => {
      toast.success('Tạo đơn đặt phòng thành công!');
      onRequestSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    },
  });

  return (
    <ScrollArea className='w-full h-full pr-2.5 -mr-2.5 max-h-[600px] hidden-scrollbar'>
      <Form {...form}>
        <form onSubmit={handleSubmit(run)} className='space-y-4 px-[1px]'>
          <div className='grid grid-cols-2 gap-4'>
            <Select onValueChange={(value) => setValue('roomId', value)} value={watch('roomId')}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn phòng' />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => setValue('type', value as BookingTypeEnum)}
              value={watch('type')}
            >
              <SelectTrigger>
                <SelectValue placeholder='Loại đặt phòng' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BookingTypeEnum.Hourly}>Theo giờ</SelectItem>
                <SelectItem value={BookingTypeEnum.Daily}>Theo ngày</SelectItem>
                <SelectItem value={BookingTypeEnum.Nightly}>Qua đêm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch('type') === BookingTypeEnum.Daily && (
            <CalendarDateRangePicker
              dateRange={undefined}
              setDateRange={(dateRange) => {
                setValue('start_date', dateRange?.from ? format(dateRange.from, 'dd-MM-yyyy') : '');
                setValue('end_date', dateRange?.to ? format(dateRange.to, 'dd-MM-yyy') : '');
              }}
            />
          )}
          <div className='grid grid-cols-2 gap-4'>
            <InputText control={control} name='start_date' label='Ngày bắt đầu' type='date' />
            <InputText control={control} name='end_date' label='Ngày kết thúc' type='date' />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <InputText control={control} name='start_time' label='Giờ bắt đầu' type='time' />
            <InputText control={control} name='end_time' label='Giờ kết thúc' type='time' />
          </div>

          <InputText
            control={control}
            name='check_in_time'
            label='Thời gian check-in'
            type='datetime-local'
          />

          <div className='grid grid-cols-2 gap-4'>
            <InputText
              control={control}
              name='name'
              label='Tên khách hàng'
              placeholder='Nhập tên khách hàng'
            />
            <InputText
              control={control}
              name='phone'
              label='Số điện thoại'
              placeholder='Nhập số điện thoại'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <InputNumber control={control} name='number_of_guests' label='Tổng số khách' min={1} />
            <InputNumber control={control} name='adults' label='Số người lớn' min={1} />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <InputNumber control={control} name='children' label='Số trẻ em' min={0} />
            <InputNumber control={control} name='infants' label='Số trẻ sơ sinh' min={0} />
          </div>

          <InputText
            control={control}
            name='special_requests'
            label='Yêu cầu đặc biệt'
            placeholder='Nhập yêu cầu đặc biệt'
            isTextArea
          />

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Hủy
            </Button>

            <Button type='submit' loading={isSubmitting} disabled={isSubmitting}>
              Tạo đơn
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};
