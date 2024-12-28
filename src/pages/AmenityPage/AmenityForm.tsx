import { useRequest } from 'ahooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Amenity, CreateAmenityDto, UpdateAmenityDto } from '@ahomevilla-hotel/node-sdk';

import { AmenityFormValues, amenitySchema } from '@/lib/validators/amenity';
import { uploadIconService } from '@/services/images';
import { createAmenityService, updateAmenityService } from '@/services/amenities';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UploadImageButton } from '@/components/Common/UploadImageButton';
import { InputText } from '@/components/Common/FormFields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface AmenityFormProps {
  data: Amenity | null;
  onRequestSuccess?: () => void;
}

const AmenityForm = ({ data, onRequestSuccess }: AmenityFormProps) => {
  const form = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      type: data?.type ?? 'ROOM',
      icon: undefined,
    },
  });

  const handleCreateUpdate = async (values: AmenityFormValues) => {
    if (values.icon) {
      const formData = new FormData();
      formData.append('icon', values.icon);

      const uploadedIcon = await uploadIconService(formData);

      if (data) {
        return await updateAmenityService(data.id, {
          ...values,
          icon: {
            publicId: uploadedIcon.publicId,
            url: uploadedIcon.url,
          },
        } as UpdateAmenityDto);
      }

      return await createAmenityService({
        ...values,
        icon: {
          publicId: uploadedIcon.publicId,
          url: uploadedIcon.url,
        },
      } as CreateAmenityDto);
    }

    return await updateAmenityService(data?.id!, values as UpdateAmenityDto);
  };

  const { run, loading } = useRequest(handleCreateUpdate, {
    manual: true,
    onSuccess: () => {
      toast.success(`${data?.id ? 'Cập nhật' : 'Tạo mới'} tiện ích thành công!`);
      onRequestSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    },
  });

  const disableSubmitButton = () => {
    const { name, slug, type, icon } = form.getValues();
    if (!data || icon) {
      return false;
    }

    return data.name === name && data.slug === slug && data.type === type;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(run)} className='w-full space-y-4'>
        <FormField
          control={form.control}
          name='icon'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadImageButton
                  initialImage={data?.icon?.url}
                  onImageChange={(file) => {
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InputText<AmenityFormValues>
          control={form.control}
          name='name'
          label='Tên tiện ích'
          placeholder='Nhập tên tiện ích'
        />
        <InputText<AmenityFormValues>
          control={form.control}
          name='slug'
          label='Slug'
          placeholder='Nhập slug'
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại tiện ích</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='ROOM'>ROOM</SelectItem>
                  <SelectItem value='PROPERTY'>PROPERTY</SelectItem>
                  <SelectItem value='SERVICE'>SERVICE</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          loading={loading}
          disabled={loading || disableSubmitButton()}
          className='w-full'
        >
          {data ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </form>
    </Form>
  );
};

export default AmenityForm;
