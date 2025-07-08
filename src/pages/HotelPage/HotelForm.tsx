import { useState } from 'react';

import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Branch,
  CreateBranchDto,
  Image,
  NearBy,
  UpdateBranchDto,
} from '@ahomevilla-hotel/node-sdk';

import { BranchFormValues, branchSchema } from '@/lib/validators/branch';
import { uploadImagesService } from '@/services/images';
import { createBranchService, updateBranchService } from '@/services/branches';
import { LanguageList } from '@/lib/constants';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudUpload, Trash2, GlobeIcon, Plus, Stars } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { InputText, InputSimpleSelect } from '@/components/Common/FormFields';
import { Button } from '@/components/ui/button';
import { SelectOption } from '@/components/Common/BasicSelect';
import { Text } from '@/components/ui/text';

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

// Utility function to remove accents from a string
const removeAccents = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

const HotelForm = ({ data, provinces, onRequestSuccess, onCancel }: HotelFormProps) => {
  const [currentImages, setCurrentImages] = useState<Image[]>(data ? data.images : []);
  const [activeTab, setActiveTab] = useState('main');

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
      translations: data?.translations ?? [],
    },
  });

  const { control, handleSubmit, setValue, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'translations',
  });

  const maxTranslations = LanguageList.length;
  const languageOptions = LanguageList.map((lang) => ({ label: lang, value: lang }));

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

    if (payload.translations) {
      payload.translations = payload.translations.map((t) => ({
        ...t,
        nearBy: t.nearBy ? t.nearBy : [{} as NearBy],
      }));
    }

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
    <Form {...form}>
      <form onSubmit={handleSubmit(run)} className='w-full space-y-4'>
        <Tabs
          defaultValue='main'
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full mt-4'
        >
          <div className='flex items-center justify-between mb-4'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='main' className='flex items-center gap-2'>
                <span>Thông tin cơ bản</span>
              </TabsTrigger>
              <TabsTrigger value='translations' className='flex items-center gap-2'>
                <GlobeIcon className='h-4 w-4' />
                <span>Bản dịch</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='main' className='space-y-4'>
            <FormField
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
              name='name'
              label='Tên khách sạn'
              placeholder='Nhập tên khách sạn'
              onBlur={(e) => {
                const inputValue = e.target.value;
                if (inputValue) {
                  const noAccentsName = removeAccents(inputValue);
                  // Auto-generate slug if it's empty
                  if (!getValues('slug')) {
                    setValue('slug', noAccentsName.toLowerCase().replace(/\s+/g, '-'));
                  }

                  // Auto-generate EN translation if none exists
                  const translations = getValues('translations');
                  if (!translations || translations.length === 0) {
                    append({
                      language: 'EN',
                      name: noAccentsName,
                      address: '',
                      description: '',
                    });
                  }
                }
              }}
            />
            <InputText<BranchFormValues>
              control={control}
              name='slug'
              label='Slug'
              placeholder='Nhập slug'
            />
            <InputText<BranchFormValues>
              control={control}
              name='phone'
              label='Số điện thoại'
              placeholder='Nhập số điện thoại'
            />
            <InputText<BranchFormValues>
              control={control}
              name='description'
              label='Mô tả'
              placeholder='Nhập mô tả'
              isTextArea
            />
            <InputText<BranchFormValues>
              control={control}
              name='address'
              label='Địa chỉ'
              placeholder='Nhập địa chỉ'
            />
            {/* <div className='grid grid-cols-2 gap-3'>
                <InputText<BranchFormValues>
                  control={control}
                  name='location.latitude'
                  label='Vĩ độ'
                  placeholder='Nhập latitude'
                />
                <InputText<BranchFormValues>
                  control={control}
                  name='location.longitude'
                  label='Kinh độ'
                  placeholder='Nhập longitude'
                />
              </div> */}
          </TabsContent>

          <TabsContent value='translations' className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <Text type='title1-semi-bold'>Bản dịch</Text>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => {
                  append({ language: '', name: '', address: '', description: '' });
                  setActiveTab('translations');
                }}
                disabled={fields.length >= maxTranslations}
                className='flex items-center gap-1'
              >
                <Plus className='h-4 w-4' /> Thêm bản dịch
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 bg-muted/30 rounded-lg'>
                <GlobeIcon className='h-12 w-12 text-muted-foreground mb-3' />
                <Text type='title1-semi-bold' className='text-muted-foreground mb-2'>
                  Chưa có bản dịch nào
                </Text>
                <Button
                  variant='outline'
                  onClick={() => {
                    append({ language: '', name: '', address: '', description: '' });
                  }}
                >
                  Thêm bản dịch
                </Button>
              </div>
            ) : (
              <div className='space-y-8'>
                {fields.map((field, index) => (
                  <div key={field.id} className='p-5 border rounded-lg space-y-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <div className='flex items-center gap-2'>
                        <GlobeIcon className='h-5 w-5 text-muted-foreground' />
                        <Text type='caption1-semi-bold'>Bản dịch {index + 1}</Text>
                      </div>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => remove(index)}
                        className='h-8'
                      >
                        <Trash2 className='h-4 w-4 mr-1' /> Xóa
                      </Button>
                    </div>

                    <InputSimpleSelect<BranchFormValues>
                      control={control}
                      name={`translations.${index}.language`}
                      label='Ngôn ngữ'
                      options={languageOptions}
                      placeholder='Chọn ngôn ngữ'
                    />

                    <InputText<BranchFormValues>
                      control={control}
                      name={`translations.${index}.name`}
                      label='Tên khách sạn'
                      placeholder='Input hotel name'
                      suffix={
                        getValues('name') && (
                          <Button
                            type='button'
                            className='w-full'
                            onClick={() => {
                              const noAccentsName = removeAccents(getValues('name'));
                              setValue(`translations.${index}.name`, noAccentsName);
                            }}
                          >
                            <Stars className='!h-5 !w-5' />
                          </Button>
                        )
                      }
                    />

                    <InputText<BranchFormValues>
                      control={control}
                      name={`translations.${index}.address`}
                      label='Địa chỉ'
                      placeholder='Input address'
                      suffix={
                        getValues('address') && (
                          <Button
                            type='button'
                            className='w-full'
                            onClick={() => {
                              const noAccentsAddress = removeAccents(getValues('address'));
                              setValue(`translations.${index}.address`, noAccentsAddress);
                            }}
                          >
                            <Stars className='!h-5 !w-5' />
                          </Button>
                        )
                      }
                    />

                    <InputText<BranchFormValues>
                      control={control}
                      name={`translations.${index}.description`}
                      label='Mô tả'
                      placeholder='Description'
                      isTextArea
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className='flex justify-end gap-3 mt-8'>
          <Button type='button' variant='outline' onClick={onCancel} className='w-full'>
            Hủy
          </Button>

          <Button type='submit' loading={loading} disabled={loading} className='w-full'>
            {data ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HotelForm;
