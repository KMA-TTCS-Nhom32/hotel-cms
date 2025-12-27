import { useForm, useFieldArray } from 'react-hook-form';
import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProvinceFormValues, provinceSchema } from '@/lib/validators/province';
import { CreateProvinceDto, Province, UpdateProvinceDto } from '@ahomevilla-hotel/node-sdk';
import { createProvinceService, updateProvinceService } from '@/services/provinces';
import { Form } from '@/components/ui/form';
import { InputText, InputSimpleSelect } from '@/components/Common/FormFields';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Plus, Trash2 } from 'lucide-react';
import { LanguageList } from '@/lib/constants';

interface CreateUpdateFormProps {
  data: Province | null;
  onRequestSuccess?: () => void;
}

// Utility function to remove accents from a string
const removeAccents = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

const CreateUpdateForm = ({ data, onRequestSuccess }: CreateUpdateFormProps) => {
  const form = useForm<ProvinceFormValues>({
    resolver: zodResolver(provinceSchema),
    defaultValues: {
      name: data?.name ?? '',
      zip_code: data?.zip_code ?? '',
      slug: data?.slug ?? '',
      translations: data?.translations.filter((t) => t.language !== 'VI') ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'translations',
  });

  const maxTranslations = LanguageList.length;
  const languageOptions = LanguageList.map((lang) => ({ label: lang, value: lang }));

  const { run, loading } = useRequest(
    (values: ProvinceFormValues) => {
      if (data?.id) {
        return updateProvinceService(data.id, values as UpdateProvinceDto);
      }
      return createProvinceService(values as CreateProvinceDto);
    },
    {
      manual: true,
      onSuccess: () => {
        toast.success(`${data?.id ? 'Cập nhật' : 'Tạo mới'} tỉnh/thành thành công!`);
        onRequestSuccess?.();
      },
      onError: (error) => {
        console.error(error);
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(run)} className='w-full space-y-4'>
        <div className='grid grid-cols-5 gap-3'>
          <InputText<ProvinceFormValues>
            control={form.control}
            name='name'
            label='Tên tỉnh/thành'
            placeholder='Nhập tên tỉnh/thành'
            className='col-span-3'
            onBlur={(e) => {
              const inputValue = e.target.value;
              if (inputValue) {
                const noAccentsName = removeAccents(inputValue);
                if (fields.length > 0) {
                  // Update the first element of the translations array
                  form.setValue(`translations.0`, {
                    language: 'EN',
                    name: noAccentsName,
                  });
                } else {
                  // Initialize the translations array with the first element
                  append({ language: 'EN', name: noAccentsName });
                }
              }
            }}
          />
          <InputText<ProvinceFormValues>
            control={form.control}
            name='zip_code'
            label='Zipcode'
            placeholder='Nhập zipcode'
            className='col-span-2'
          />
        </div>

        <InputText<ProvinceFormValues>
          control={form.control}
          name='slug'
          label='Slug'
          placeholder='Nhập slug'
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
              <InputSimpleSelect<ProvinceFormValues>
                control={form.control}
                name={`translations.${index}.language`}
                label='Ngôn ngữ'
                options={languageOptions}
                placeholder='Chọn ngôn ngữ'
                className='col-span-2'
              />
              <div className='col-span-3 flex gap-2 items-end'>
                <InputText<ProvinceFormValues>
                  control={form.control}
                  name={`translations.${index}.name`}
                  label='Tên tỉnh/thành'
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

        <Button type='submit' loading={loading} disabled={loading} className='w-full'>
          {data?.id ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateUpdateForm;
