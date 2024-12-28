import { useForm } from 'react-hook-form';
import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProvinceFormValues, provinceSchema } from '@/lib/validators/province';
import { CreateProvinceDto, Province, UpdateProvinceDto } from '@ahomevilla-hotel/node-sdk';
import { createProvinceService, updateProvinceService } from '@/services/provinces';
import { Form } from '@/components/ui/form';
import { InputText } from '@/components/Common/FormFields';
import { Button } from '@/components/ui/button';

interface CreateUpdateFormProps {
  data: Province | null;
  onRequestSuccess?: () => void;
}

const CreateUpdateForm = ({ data, onRequestSuccess }: CreateUpdateFormProps) => {
  const form = useForm<ProvinceFormValues>({
    resolver: zodResolver(provinceSchema),
    defaultValues: {
      name: data?.name ?? '',
      zip_code: data?.zip_code ?? '',
      slug: data?.slug ?? '',
    },
  });

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
        <InputText<ProvinceFormValues>
          control={form.control}
          name='name'
          label='Tên tỉnh/thành'
          placeholder='Nhập tên tỉnh/thành'
        />
        <InputText<ProvinceFormValues>
          control={form.control}
          name='zip_code'
          label='Zipcode'
          placeholder='Nhập zipcode'
        />
        <InputText<ProvinceFormValues>
          control={form.control}
          name='slug'
          label='Slug'
          placeholder='Nhập slug'
        />
        <Button type='submit' loading={loading} disabled={loading} className='w-full'>
          {data?.id ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateUpdateForm;
