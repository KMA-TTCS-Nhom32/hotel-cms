import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoomDetail } from '@ahomevilla-hotel/node-sdk';
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { RoomDetailPriceFormValues, roomDetailPriceSchema } from '@/lib/validators/room-detail';
import { updateRoomDetailService } from '@/services/room-detail';
import {
  createRoomPriceHistoryService,
  updateRoomPriceHistoryService,
} from '@/services/room-price-history';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { InputCurrency, InputDateMonth } from '@/components/Common/FormFields';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UpdatePriceFormProps {
  branchId: string;
  data: RoomDetail;
  onCloseDialog: () => void;
  onFinishedUpdate: () => void;
}

export const UpdatePriceForm = ({
  branchId,
  data,
  onCloseDialog,
  onFinishedUpdate,
}: UpdatePriceFormProps) => {
  const form = useForm<RoomDetailPriceFormValues>({
    resolver: zodResolver(roomDetailPriceSchema),
    defaultValues: {
      base_price_per_hour: Number(data.base_price_per_hour),
      base_price_per_night: Number(data.base_price_per_night),
      base_price_per_day: Number(data.base_price_per_day),
      special_price_per_hour: data.special_price_per_hour
        ? Number(data.special_price_per_hour)
        : null,
      special_price_per_night: data.special_price_per_night
        ? Number(data.special_price_per_night)
        : null,
      special_price_per_day: data.special_price_per_day ? Number(data.special_price_per_day) : null,
      roomPriceHistories: data.roomPriceHistories
        ? data.roomPriceHistories.map((history) => ({
            ...history,
            effective_to: history.effective_to ? history.effective_to : undefined,
            price_per_hour: history.price_per_hour ? Number(history.price_per_hour) : null,
            price_per_night: history.price_per_night ? Number(history.price_per_night) : null,
            price_per_day: history.price_per_day ? Number(history.price_per_day) : null,
          }))
        : null,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'roomPriceHistories',
  });

  const onSubmit = async (values: RoomDetailPriceFormValues) => {
    try {
      const {
        base_price_per_hour,
        base_price_per_night,
        base_price_per_day,
        special_price_per_hour,
        special_price_per_night,
        special_price_per_day,
        roomPriceHistories,
      } = values;

      await updateRoomDetailService(data.id, {
        base_price_per_hour: String(base_price_per_hour),
        base_price_per_night: String(base_price_per_night),
        base_price_per_day: String(base_price_per_day),
        ...(special_price_per_hour &&
          special_price_per_hour !== 0 && {
            special_price_per_hour: String(special_price_per_hour),
          }),
        ...(special_price_per_night &&
          special_price_per_night !== 0 && {
            special_price_per_night: String(special_price_per_night),
          }),
        ...(special_price_per_day &&
          special_price_per_day !== 0 && {
            special_price_per_day: String(special_price_per_day),
          }),
      });

      const [oldPrices, newPrices] = roomPriceHistories
        ? roomPriceHistories.reduce(
            (acc, history) => {
              const [old, latest] = acc;
              if (history.id) {
                old.push(history);
              } else {
                latest.push(history);
              }
              return [old, latest];
            },
            [[], []] as [
              NonNullable<RoomDetailPriceFormValues['roomPriceHistories']>,
              NonNullable<RoomDetailPriceFormValues['roomPriceHistories']>,
            ],
          )
        : [[], []];

      function formatPayload(
        history: NonNullable<RoomDetailPriceFormValues['roomPriceHistories']>[number],
      ) {
        return {
          roomDetailId: data.id,
          name: history.name,
          description: history.description,
          effective_from: history.effective_from,
          effective_to:
            history.effective_to && history.effective_to.length > 0
              ? history.effective_to
              : undefined,
          price_per_hour:
            history.price_per_hour && history.price_per_hour !== 0
              ? String(history.price_per_hour)
              : undefined,
          price_per_night:
            history.price_per_night && history.price_per_night !== 0
              ? String(history.price_per_night)
              : undefined,
          price_per_day:
            history.price_per_day && history.price_per_day !== 0
              ? String(history.price_per_day)
              : undefined,
        };
      }

      const createRoomPriceHistoryRequests = newPrices.map((history) =>
        createRoomPriceHistoryService(formatPayload(history)),
      );

      const updateRoomPriceHistoryRequests = oldPrices.map((history) =>
        updateRoomPriceHistoryService(history.id!, formatPayload(history)),
      );

      await Promise.all([...createRoomPriceHistoryRequests, ...updateRoomPriceHistoryRequests]);

      toast.success('Cập nhật giá phòng thành công');

      onFinishedUpdate();
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra khi cập nhật giá phòng');
    }
  };

  return (
    <ScrollArea className='w-full h-full pr-2.5 -mr-2.5 max-h-[600px] hidden-scrollbar'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-6 px-[1px]'>
          <div>
            <Text type='title1-semi-bold'>Giá cơ bản</Text>
            <div className='grid grid-cols-3 gap-3'>
              <InputCurrency<RoomDetailPriceFormValues>
                control={control}
                name='base_price_per_hour'
                label='Giá theo giờ'
                placeholder='VD: 100.000'
              />
              <InputCurrency<RoomDetailPriceFormValues>
                control={control}
                name='base_price_per_night'
                label='Giá theo đêm'
                placeholder='VD: 300.000'
              />
              <InputCurrency<RoomDetailPriceFormValues>
                control={control}
                name='base_price_per_day'
                label='Giá theo ngày'
                placeholder='VD: 800.000'
              />
            </div>
          </div>

          <div>
            <Text type='title1-semi-bold'>Giá đặc biệt</Text>
            <div className='grid grid-cols-3 gap-3'>
              <InputCurrency<RoomDetailPriceFormValues>
                control={control}
                name='special_price_per_hour'
                label='Giá theo giờ'
                placeholder='VD: 100.000'
              />
              <InputCurrency<RoomDetailPriceFormValues>
                control={control}
                name='special_price_per_night'
                label='Giá theo đêm'
                placeholder='VD: 300.000'
              />
              <InputCurrency<RoomDetailPriceFormValues>
                control={control}
                name='special_price_per_day'
                label='Giá theo ngày'
                placeholder='VD: 800.000'
              />
            </div>
          </div>

          <div>
            <Text type='title1-semi-bold'>Ngày đặc biệt</Text>
            <FormField
              control={control}
              name='roomPriceHistories'
              render={() => (
                <FormItem>
                  <FormMessage />
                  {fields.map((field, index) => (
                    <div key={field.id} className='w-full space-y-3'>
                      <div className='w-full grid grid-cols-[1fr_200px] gap-2.5'>
                        <div className='w-full'>
                          <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <FormItem>
                              <FormField
                                control={control}
                                name={`roomPriceHistories.${index}.name`}
                                render={({ field }) => (
                                  <>
                                    <FormLabel>Tên ngày</FormLabel>
                                    <Input placeholder='Quốc Khánh' {...field} />
                                    <FormMessage />
                                  </>
                                )}
                              />
                            </FormItem>
                            <FormItem>
                              <FormField
                                control={control}
                                name={`roomPriceHistories.${index}.description`}
                                render={({ field }) => (
                                  <>
                                    <FormLabel>Mô tả</FormLabel>
                                    <Input placeholder='Mừng đại lễ' {...field} />
                                    <FormMessage />
                                  </>
                                )}
                              />
                            </FormItem>
                          </div>
                        </div>
                        <div className='w-full grid grid-cols-2 gap-2.5'>
                          <InputDateMonth<RoomDetailPriceFormValues>
                            control={form.control}
                            name={`roomPriceHistories.${index}.effective_from`}
                            label={'Từ ngày'}
                          />
                          <InputDateMonth<RoomDetailPriceFormValues>
                            control={form.control}
                            name={`roomPriceHistories.${index}.effective_to`}
                            label={'Đến'}
                          />
                        </div>
                      </div>
                      <div
                        className={cn('w-full grid', fields.length > 1 && 'grid-cols-[1fr_40px] gap-3')}
                      >
                        <div className='grid grid-cols-3 gap-3'>
                          <FormItem>
                            <InputCurrency<RoomDetailPriceFormValues>
                              control={control}
                              name={`roomPriceHistories.${index}.price_per_hour`}
                              label='Giá theo giờ'
                              placeholder='VD: 100.000'
                            />
                            {errors.roomPriceHistories?.[index]?.price_per_hour && (
                              <FormMessage>
                                {errors.roomPriceHistories[index]?.price_per_hour?.message}
                              </FormMessage>
                            )}
                          </FormItem>
                          <FormItem>
                            <InputCurrency<RoomDetailPriceFormValues>
                              control={control}
                              name={`roomPriceHistories.${index}.price_per_night`}
                              label='Giá theo đêm'
                              placeholder='VD: 300.000'
                            />
                          </FormItem>
                          <FormItem>
                            <InputCurrency<RoomDetailPriceFormValues>
                              control={control}
                              name={`roomPriceHistories.${index}.price_per_day`}
                              label='Giá theo ngày'
                              placeholder='VD: 800.000'
                            />
                          </FormItem>
                        </div>
                        {fields.length > 1 && (
                          <Button variant='destructive' type='button' className='mt-auto' onClick={() => remove(index)}>
                            <Trash className='!w-5 !h-5' />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={async () => {
                      const isValid = await trigger('roomPriceHistories');
                      if (fields.length === 0 || isValid) {
                        append({
                          name: '',
                          description: '',
                          effective_from: '',
                          effective_to: undefined,
                          price_per_hour: null,
                          price_per_night: null,
                          price_per_day: null,
                        });
                      }
                    }}
                    className='w-[calc(50%-110px)] mt-3'
                  >
                    <Plus className='!w-5 !h-5' />
                    Thêm ngày đặc biệt
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-3'>
            <Button type='button' variant='outline' onClick={onCloseDialog} className='w-1/2'>
              Hủy
            </Button>

            <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='w-1/2'>
              Cập nhật
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};
