import { useState } from 'react';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload, Trash2, GlobeIcon, Plus } from 'lucide-react';

import {
  RoomDetail,
  UpdateRoomDetailDto,
  Image,
  CreateRoomDetailDto,
} from '@ahomevilla-hotel/node-sdk';

import { RoomDetailFormValues, roomDetailSchema } from '@/lib/validators/room-detail';
import { toast } from 'sonner';
import { uploadImagesService } from '@/services/images';
import { createRoomDetailService, updateRoomDetailService } from '@/services/room-detail';
import { LanguageList } from '@/lib/constants';

import { BedTypeOptions, RoomTypeOptions } from '@/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  InputText,
  InputSimpleSelect,
  InputNumber,
  InputCurrency,
} from '@/components/Common/FormFields';
import { UploadImageButton } from '@/components/Common/UploadImageButton';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-uploader';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateUpdateRoomDetailFormProps {
  branchId: string;
  data: RoomDetail | null;
  allAmenities: Option[];
  onCancelDialog: () => void;
  onSuccessfullRequest: () => void;
}

export const CreateUpdateRoomDetailForm = ({
  branchId,
  data,
  allAmenities,
  onCancelDialog,
  onSuccessfullRequest,
}: CreateUpdateRoomDetailFormProps) => {
  const [currentImages, setCurrentImages] = useState<Image[]>(data ? data.images : []);
  const [activeTab, setActiveTab] = useState('main');

  const form = useForm<RoomDetailFormValues>({
    resolver: zodResolver(roomDetailSchema),
    defaultValues: {
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      description: data?.description ?? '',
      amenities: data?.amenities
        ? data.amenities.map((amenity) => ({
            label: amenity.name,
            value: amenity.id,
          }))
        : [],
      base_price_per_day: Number(data?.base_price_per_day) ?? 0,
      base_price_per_hour: Number(data?.base_price_per_hour) ?? 0,
      base_price_per_night: Number(data?.base_price_per_night) ?? 0,
      room_type: data?.room_type ?? '',
      bed_type: data?.bed_type ?? '',
      area: data?.area ?? 0,
      max_adults: data?.max_adults ?? 0,
      max_children: data?.max_children ?? 0,
      thumbnail: undefined,
      images: null,
      translations: data?.translations.filter((t) => t.language !== 'VI'),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const {
    fields: translationFields,
    append: appendTranslation,
    remove: removeTranslation,
  } = useFieldArray({
    control,
    name: 'translations',
  });

  const languageOptions = LanguageList.map((lang) => ({ label: lang, value: lang }));
  const usedLanguages = ['VI', ...(translationFields?.map((t) => t.language) || [])];
  const hasAvailableLanguages = usedLanguages.length < LanguageList.length;

  const handleCreateUpdate = async (values: RoomDetailFormValues) => {
    console.log('update');
    try {
      const {
        thumbnail,
        images,
        base_price_per_day,
        base_price_per_hour,
        base_price_per_night,
        amenities,
        translations,
        ...props
      } = values;

      const payload = {
        ...props,
        translations: translations?.filter((t) => t.language !== 'Vi'),
      } as UpdateRoomDetailDto;

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

      if (amenities.length > 0) {
        payload.amenityIds = amenities.map((amenity) => amenity.value);
      }
      if (data) {
        payload.images?.push(...currentImages);
        await updateRoomDetailService(data.id, payload);

        toast.success('Cập nhật loại phòng thành công');
        onSuccessfullRequest();
        return;
      }

      await createRoomDetailService({
        ...payload,
        branchId,
        thumbnail: payload.thumbnail as Image,
        images: payload.images as Image[],
        base_price_per_hour: String(base_price_per_hour),
        base_price_per_night: String(base_price_per_night),
        base_price_per_day: String(base_price_per_day),
      } as unknown as CreateRoomDetailDto);

      toast.success('Thêm loại phòng thành công');
      onSuccessfullRequest();
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin phòng');
    }
  };

  return (
    <ScrollArea className='w-full h-full pr-2.5 -mr-2.5 hidden-scrollbar'>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleCreateUpdate)} className='w-full space-y-4 px-[1px]'>
          <Tabs defaultValue='main' value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='main' className='flex items-center gap-2'>
                <span>Thông tin chính</span>
              </TabsTrigger>
              <TabsTrigger value='translations' className='flex items-center gap-2'>
                <GlobeIcon className='h-4 w-4' />
                <span>Bản dịch</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='main' className='space-y-4 mt-4'>
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
                    <FormLabel>Ảnh phòng</FormLabel>

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
                              <span className='font-semibold'>Click để tải ảnh</span>
                              &nbsp; hoặc kéo thả
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              hỗ trợ định dạng SVG, PNG, JPG, WEBP
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

              <div className='grid grid-cols-2 gap-3'>
                <InputText<RoomDetailFormValues>
                  control={control}
                  name='name'
                  label='Tên loại phòng'
                  placeholder='Nhập tên loại phòng'
                />
                <InputText<RoomDetailFormValues>
                  control={control}
                  name='slug'
                  label='Slug'
                  placeholder='Nhập slug.VD: deluxe-city-view-room'
                />
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <InputSimpleSelect<RoomDetailFormValues>
                  control={control}
                  name='room_type'
                  label='Phân hạng phòng'
                  placeholder='Chọn loại phòng'
                  options={RoomTypeOptions}
                />
                <InputSimpleSelect<RoomDetailFormValues>
                  control={control}
                  name='bed_type'
                  label='Loại giường'
                  placeholder='Chọn loại giường'
                  options={BedTypeOptions}
                />
                <InputCurrency<RoomDetailFormValues>
                  control={control}
                  name='area'
                  label='Diện tích phòng(m2)'
                  placeholder='VD: 25'
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <InputNumber<RoomDetailFormValues>
                  control={control}
                  name='max_adults'
                  label='Số người lớn'
                  placeholder='VD: 2'
                />
                <InputNumber<RoomDetailFormValues>
                  control={control}
                  name='max_children'
                  label='Số trẻ em'
                  placeholder='VD: 2'
                />
              </div>

              <InputText<RoomDetailFormValues>
                control={control}
                name='description'
                label='Mô tả'
                placeholder='Nhập mô tả'
                isTextArea
              />

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

              <div className={cn('grid grid-cols-3 gap-3', data && 'hidden')}>
                <InputCurrency<RoomDetailFormValues>
                  control={control}
                  name='base_price_per_hour'
                  label='Giá theo giờ'
                  placeholder='VD: 100.000'
                />
                <InputCurrency<RoomDetailFormValues>
                  control={control}
                  name='base_price_per_night'
                  label='Giá theo đêm'
                  placeholder='VD: 300.000'
                />
                <InputCurrency<RoomDetailFormValues>
                  control={control}
                  name='base_price_per_day'
                  label='Giá theo ngày'
                  placeholder='VD: 800.000'
                />
              </div>
            </TabsContent>

            <TabsContent value='translations' className='space-y-4 mt-4'>
              <div className='flex items-center justify-between mb-4'>
                <Text type='title1-semi-bold'>Bản dịch</Text>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    appendTranslation({
                      language: '',
                      name: '',
                      description: '',
                    });
                    setActiveTab('translations');
                  }}
                  disabled={!hasAvailableLanguages}
                  className='flex items-center gap-1'
                >
                  <Plus className='h-4 w-4' /> Thêm bản dịch
                </Button>
              </div>

              {translationFields.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-10 bg-muted/30 rounded-lg'>
                  <GlobeIcon className='h-12 w-12 text-muted-foreground mb-3' />
                  <Text type='title1-semi-bold' className='text-muted-foreground mb-2'>
                    Chưa có bản dịch nào
                  </Text>
                  <Button
                    variant='outline'
                    onClick={() => {
                      appendTranslation({ language: '', name: '', description: '' });
                    }}
                  >
                    Thêm bản dịch
                  </Button>
                </div>
              ) : (
                <div className='space-y-6'>
                  {translationFields.map((field, index) => (
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
                          onClick={() => removeTranslation(index)}
                          className='h-8'
                        >
                          <Trash2 className='h-4 w-4 mr-1' /> Xóa
                        </Button>
                      </div>

                      <InputSimpleSelect<RoomDetailFormValues>
                        control={control}
                        name={`translations.${index}.language`}
                        label='Ngôn ngữ'
                        options={languageOptions}
                        placeholder='Chọn ngôn ngữ'
                      />

                      <InputText<RoomDetailFormValues>
                        control={control}
                        name={`translations.${index}.name`}
                        label='Tên'
                        placeholder='Nhập tên loại phòng'
                      />

                      <InputText<RoomDetailFormValues>
                        control={control}
                        name={`translations.${index}.description`}
                        label='Mô tả'
                        placeholder='Nhập mô tả'
                        isTextArea
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={onCancelDialog} className='w-full'>
              Hủy
            </Button>

            <Button type='submit' loading={isSubmitting} disabled={isSubmitting} className='w-full'>
              {data ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};
