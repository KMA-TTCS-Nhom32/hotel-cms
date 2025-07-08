import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Amenity, CreateAmenityDto, UpdateAmenityDto } from '@ahomevilla-hotel/node-sdk';

import { AmenityFormValues, amenitySchema } from '@/lib/validators/amenity';
import { uploadIconService } from '@/services/images';
import { createAmenityService, updateAmenityService } from '@/services/amenities';
import { InputSimpleSelect } from '@/components/Common/FormFields';
import { LanguageList } from '@/lib/constants';
import { Plus, Trash2 } from 'lucide-react';
import { Text } from '@/components/ui/text';

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
      translations: data?.translations ?? [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'translations',
  });

  const maxTranslations = LanguageList.length;
  const languageOptions = LanguageList.map((lang) => ({ label: lang, value: lang }));

  const onSubmit = async (values: AmenityFormValues) => {
    try {
      if (values.icon) {
        const formData = new FormData();
        formData.append('icon', values.icon);

        const uploadedIcon = await uploadIconService(formData);

        if (data) {
          await updateAmenityService(data.id, {
            ...values,
            icon: {
              publicId: uploadedIcon.publicId,
              url: uploadedIcon.url,
            },
          } as UpdateAmenityDto);
        }

        await createAmenityService({
          ...values,
          icon: {
            publicId: uploadedIcon.publicId,
            url: uploadedIcon.url,
          },
        } as CreateAmenityDto);
      }

      await updateAmenityService(data?.id!, values as UpdateAmenityDto);

      toast.success(`${data?.id ? 'Cập nhật' : 'Tạo mới'} tiện ích thành công!`);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      onRequestSuccess?.();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='h-full w-full space-y-4'>
        <FormField
          control={control}
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
          control={control}
          name='name'
          label='Tên tiện ích'
          placeholder='Nhập tên tiện ích'
        />
        <InputText<AmenityFormValues>
          control={control}
          name='slug'
          label='Slug'
          placeholder='Nhập slug'
        />
        <FormField
          control={control}
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
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <Text type='title1-semi-bold'>Ngôn ngữ</Text>
            <Button
              type='button'
              className='w-10 h-10 p-0 rounded-md'
              variant='outline'
              size='icon'
              onClick={() => append({ language: '', name: '' })}
              disabled={fields.length >= maxTranslations}
            >
              <Plus className='!w-5 !h-5' />
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className='grid grid-cols-5 gap-3 items-center'>
              <InputSimpleSelect<AmenityFormValues>
                control={control}
                name={`translations.${index}.language`}
                label='Ngôn ngữ'
                options={languageOptions}
                placeholder='Chọn ngôn ngữ'
                className='col-span-2'
                enableDefault
              />
              <div className='col-span-3 flex gap-2 items-end'>
                <InputText<AmenityFormValues>
                  control={control}
                  name={`translations.${index}.name`}
                  label='Tên tiện ích'
                  placeholder='Nhập tên'
                  className='flex-1'
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='w-9 h-9 p-0 rounded-md'
                  onClick={() => remove(index)}
                >
                  <Trash2 className='!w-5 !h-5' />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='w-full'>
          {data ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </form>
    </Form>
  );
};

export default AmenityForm;
