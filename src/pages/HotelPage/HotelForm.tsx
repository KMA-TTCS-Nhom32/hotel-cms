import { useState } from 'react';

import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Branch, CreateBranchDto, Image, UpdateBranchDto } from '@ahomevilla-hotel/node-sdk';

import { BranchFormValues, branchSchema } from '@/lib/validators/branch';
import { uploadImagesService } from '@/services/images';
import { createBranchService, updateBranchService } from '@/services/branches';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { UploadImageButton } from '@/components/Common/UploadImageButton';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CloudUpload, Trash2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { InputText } from '@/components/Common/FormFields';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { SelectOption } from '@/components/Common/BasicSelect';

// type Location = {
//   latitude: number;
//   longitude: number;
// };

interface HotelFormProps {
  data: Branch | null;
  provinces: SelectOption[];
  onRequestSuccess?: () => void;
  onCancel: () => void;
}

const HotelForm = ({ data, provinces, onRequestSuccess, onCancel }: HotelFormProps) => {
  const [currentImages, setCurrentImages] = useState<Image[]>(data ? data.images : []);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      provinceId: data?.provinceId ?? '',
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      phone: data?.phone ?? '',
      description: data?.description ?? '',
      address: data?.address ?? '',
      //   location: data?.location ?? { latitude: 0, longitude: 0 },
      thumbnail: undefined,
      images: null,
    },
  });

  const handleCreateUpdate = async (values: BranchFormValues) => {
    const { thumbnail, images, ...props } = values;
    const payload = {
      ...props,
    } as UpdateBranchDto;

    if (thumbnail) {
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('images', thumbnail);
      const uploadedThumbnail = await uploadImagesService(thumbnailFormData);
      payload.thumbnail = uploadedThumbnail[0];
    }
    if (images) {
      const imagesFormData = new FormData();
      for (const element of images) {
        imagesFormData.append('images', element);
      }
      const uploadedImages = await uploadImagesService(imagesFormData);
      payload.images = uploadedImages;
    }

    console.log('payload', payload);

    if (data) {
      payload.images?.push(...currentImages);
      return await updateBranchService(data.id, payload);
    }

    return await createBranchService(payload as CreateBranchDto);
  };

  const { run, loading } = useRequest(handleCreateUpdate, {
    manual: true,
    onSuccess: () => {
      toast.success(`${data?.id ? 'Cập nhật' : 'Tạo mới'} khách sạn thành công!`);
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
        <form onSubmit={form.handleSubmit(run)} className='w-full space-y-4 px-[1px]'>
          <FormField
            control={form.control}
            name='provinceId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khu vực</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn khu vực của khách sạn' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id!}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='thumbnail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <UploadImageButton
                    initialImage={data?.thumbnail?.url}
                    onImageChange={(file) => {
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Ảnh khách sạn</FormLabel>

                {/* Display current images */}
                {data && (
                  <div className='grid grid-cols-4 gap-2'>
                    {currentImages.map((image) => (
                      <div
                        key={image.publicId}
                        className='relative w-full h-20 bg-background rounded-lg overflow-hidden'
                      >
                        <img
                          src={image.url}
                          alt={image.publicId}
                          className='w-full h-full object-cover'
                        />
                        <button
                          title='Remove image'
                          type='button'
                          className='absolute top-1 right-1 p-1 hover:bg-gray-200 rounded-full'
                          onClick={() => {
                            setCurrentImages((prev) =>
                              prev.filter((img) => img.publicId !== image.publicId),
                            );
                          }}
                        >
                          <Trash2 className='w-4 h-4 text-red-600' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <FormControl>
                  <div className='px-[1px]'>
                    <FileUploader
                      value={field.value ?? null}
                      onValueChange={field.onChange}
                      reSelect={true}
                      className='w-full h-full bg-background rounded-lg outline-dashed outline-1 outline-white'
                    >
                      <FileInput className='flex items-center justify-center flex-col pt-4 pb-2 w-full'>
                        <CloudUpload className='w-8 h-8 mb-3 text-gray-500 dark:text-gray-400' />
                        <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                          <span className='font-semibold'>Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          SVG, PNG, JPG or WEBP
                        </p>
                      </FileInput>
                      <FileUploaderContent className='pt-3 w-full flex-row gap-2'>
                        {field.value &&
                          Array.from(field.value).map((file, i) => (
                            <FileUploaderItem
                              key={file.name}
                              index={i}
                              aria-roledescription={`file ${i + 1} containing ${file.name}`}
                              className='p-0 size-20'
                            >
                              <AspectRatio className='size-full'>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className='object-cover rounded-md w-full h-auto'
                                />
                              </AspectRatio>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InputText<BranchFormValues>
            control={form.control}
            name='name'
            label='Tên khách sạn'
            placeholder='Nhập tên khách sạn'
          />
          <InputText<BranchFormValues>
            control={form.control}
            name='slug'
            label='Slug'
            placeholder='Nhập slug'
          />
          <InputText<BranchFormValues>
            control={form.control}
            name='phone'
            label='Số điện thoại'
            placeholder='Nhập số điện thoại'
          />
          <InputText<BranchFormValues>
            control={form.control}
            name='description'
            label='Mô tả'
            placeholder='Nhập mô tả'
            isTextArea
          />
          <InputText<BranchFormValues>
            control={form.control}
            name='address'
            label='Địa chỉ'
            placeholder='Nhập địa chỉ'
          />
          {/* <div className='grid grid-cols-2 gap-3'>
            <InputText<BranchFormValues>
              control={form.control}
              name='location.latitude'
              label='Vĩ độ'
              placeholder='Nhập latitude'
            />
            <InputText<BranchFormValues>
              control={form.control}
              name='location.longitude'
              label='Kinh độ'
              placeholder='Nhập longitude'
            />
          </div> */}
          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={onCancel} className='w-full'>
              Hủy
            </Button>

            <Button type='submit' loading={loading} disabled={loading} className='w-full'>
              {data ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default HotelForm;
