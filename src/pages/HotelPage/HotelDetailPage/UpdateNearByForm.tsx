import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { NearBy } from '@ahomevilla-hotel/node-sdk';

import { UpdateBranchNearByFormValues, updateBranchNearBySchema } from '@/lib/validators/branch';
import { toast } from 'sonner';
import { updateBranchService } from '@/services/branches';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';

interface UpdateNearByFormProps {
  branchId: string;
  currentNearBys: NearBy[];
  onCloseDialog: () => void;
  onSuccessfulUpdate: () => void;
}

export const UpdateNearByForm = ({
  branchId,
  currentNearBys,
  onCloseDialog,
  onSuccessfulUpdate,
}: UpdateNearByFormProps) => {
  const form = useForm<UpdateBranchNearByFormValues>({
    resolver: zodResolver(updateBranchNearBySchema),
    defaultValues: {
      nearBy: currentNearBys.length ? currentNearBys : [{ name: '', distance: '' }],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'nearBy',
  });

  const onSubmit = async (values: UpdateBranchNearByFormValues) => {
    try {
      await updateBranchService(branchId, {
        nearBy: values.nearBy,
      });

      toast.success('Cập nhật địa điểm thành công');
      onSuccessfulUpdate();
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra khi cập nhật địa điểm');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
        <FormField
          control={control}
          name='nearBy'
          render={() => (
            <FormItem>
              <FormLabel>Địa điểm</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className='w-full grid grid-cols-[1fr_40px] gap-3'>
                  <div className='w-full'>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      <FormItem>
                        <FormField
                          control={control}
                          name={`nearBy.${index}.name`}
                          render={({ field }) => (
                            <>
                              <Input placeholder='Tên địa điểm. VD: Hồ Gươm' {...field} />
                              <FormMessage />
                            </>
                          )}
                        />
                      </FormItem>
                      <FormItem>
                        <FormField
                          control={control}
                          name={`nearBy.${index}.distance`}
                          render={({ field }) => (
                            <>
                              <Input placeholder='Khoảng cách. VD: 1km' {...field} />
                              <FormMessage />
                            </>
                          )}
                        />
                      </FormItem>
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button variant='destructive' type='button' onClick={() => remove(index)}>
                      <Trash className='!w-5 !h-5' />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  trigger('nearBy').then((isValid) => {
                    if (isValid) {
                      append({ name: '', distance: '' });
                    }
                  });
                }}
                className='w-1/3'
              >
                <Plus className='!w-5 !h-5' />
                Thêm địa điểm
              </Button>
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCloseDialog} className='w-full'>
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
