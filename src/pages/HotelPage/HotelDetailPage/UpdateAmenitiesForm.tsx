import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// import { Amenity } from '@ahomevilla-hotel/node-sdk';
import {
  UpdateBranchAmenitiesFormValues,
  updateBranchAmenitiesSchema,
} from '@/lib/validators/branch';
import { updateBranchService } from '@/services/branches';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Button } from '@/components/ui/button';

interface UpdateAmenitiesFormProps {
  branchId: string;
  currentAmenities: Option[];
  allAmenities: Option[];
  onCloseDialog: () => void;
  onSuccessfulUpdate: () => void;
}

export const UpdateAmenitiesForm = ({
  branchId,
  currentAmenities,
  allAmenities,
  onCloseDialog,
  onSuccessfulUpdate,
}: UpdateAmenitiesFormProps) => {
  const form = useForm<UpdateBranchAmenitiesFormValues>({
    resolver: zodResolver(updateBranchAmenitiesSchema),
    defaultValues: {
      amenities: currentAmenities,
    },
  });

  const onSubmit = async (values: UpdateBranchAmenitiesFormValues) => {
    try {
      await updateBranchService(branchId, {
        amenityIds: values.amenities.map((amenity) => amenity.value),
      });

      toast.success('Cập nhật tiện ích thành công');
      onSuccessfulUpdate();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật tiện ích');
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4 h-auto'>
        <FormField
          control={form.control}
          name='amenities'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiện ích</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={allAmenities}
                  placeholder='Chọn tiện ích...'
                  emptyIndicator={
                    <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                      no results found.
                    </p>
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCloseDialog} className='w-full'>
            Hủy
          </Button>

          <Button
            type='submit'
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            className='w-full'
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
};
