import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { UpdateBranchNearByFormValues, updateBranchNearBySchema } from '@/lib/validators/branch';
import { toast } from 'sonner';
import { LanguageList } from '@/lib/constants';
import { BranchNearBys } from './types';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobeIcon, Plus, Trash2, Stars } from 'lucide-react';
import { Text } from '@/components/ui/text';
import { InputSimpleSelect } from '@/components/Common/FormFields';

interface UpdateNearByFormProps {
  branchNearBys: BranchNearBys;
  updateNearByService: (nearByData: BranchNearBys) => Promise<any>;
  onCloseDialog: () => void;
  onSuccessfulUpdate: () => void;
}

export function UpdateNearByForm({
  updateNearByService,
  branchNearBys,
  onCloseDialog,
  onSuccessfulUpdate,
}: UpdateNearByFormProps) {
  const [activeTab, setActiveTab] = useState('main');
  
  const form = useForm<UpdateBranchNearByFormValues>({
    resolver: zodResolver(updateBranchNearBySchema),
    defaultValues: {
      nearBy: branchNearBys.defaults,
      translations: branchNearBys.translations,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = form;

  // Default (VI) nearby locations
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nearBy',
  });

  // Translations field array
  const { fields: translationFields, append: appendTranslation, remove: removeTranslation } = useFieldArray({
    control,
    name: 'translations',
  });

  const languageOptions = LanguageList.map((lang) => ({ label: lang, value: lang }));
  const usedLanguages = ['VI', ...(translationFields?.map(t => t.language) || [])];
  const hasAvailableLanguages = usedLanguages.length < LanguageList.length;

  const onSubmit = async (values: UpdateBranchNearByFormValues) => {
    try {
      await updateNearByService({
        defaults: values.nearBy,
        translations: values.translations || [],
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main" className="flex items-center gap-2">
              <span>Thông tin chính</span>
            </TabsTrigger>
            <TabsTrigger value="translations" className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" />
              <span>Bản dịch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-4 mt-4">
            {/* Default nearBy items (VI) */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 items-center">
                <FormField
                  control={control}
                  name={`nearBy.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Tên địa điểm</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên địa điểm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name={`nearBy.${index}.distance`}
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>Khoảng cách</FormLabel>
                      <FormControl>
                        <Input placeholder="Khoảng cách. VD: 1km" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="mt-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ name: '', distance: '' })}
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm địa điểm
            </Button>
          </TabsContent>

          <TabsContent value="translations" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <Text type="title1-semi-bold">Bản dịch</Text>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  appendTranslation({ 
                    language: '', 
                    nearBy: []
                  });
                  setActiveTab('translations');
                }}
                disabled={!hasAvailableLanguages}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Thêm bản dịch
              </Button>
            </div>

            {translationFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 bg-muted/30 rounded-lg">
                <GlobeIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <Text type="title1-semi-bold" className="text-muted-foreground mb-2">
                  Chưa có bản dịch nào
                </Text>
                <Button
                  variant="outline"
                  onClick={() => {
                    appendTranslation({ language: '', nearBy: [] });
                  }}
                >
                  Thêm bản dịch
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {translationFields.map((field, index) => (
                  <div key={field.id} className="p-5 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <GlobeIcon className="h-5 w-5 text-muted-foreground" />
                        <Text type="caption1-semi-bold">Bản dịch {index + 1}</Text>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTranslation(index)}
                        className="h-8"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                    </div>

                    <InputSimpleSelect<UpdateBranchNearByFormValues>
                      control={control}
                      name={`translations.${index}.language`}
                      label="Ngôn ngữ"
                      options={languageOptions}
                      placeholder="Chọn ngôn ngữ"
                    />
                    
                    {/* NearBy items for this language */}
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <Text type="title1-semi-bold">Địa điểm gần đó</Text>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentTranslation = form.getValues(`translations.${index}`);
                            const nearBy = currentTranslation?.nearBy || [];
                            setValue(`translations.${index}.nearBy`, [
                              ...nearBy,
                              { name: '', distance: '' }
                            ]);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Thêm địa điểm
                        </Button>
                      </div>
                      
                      {/* Field array for this translation's nearBy */}
                      <FormField
                        control={control}
                        name={`translations.${index}.nearBy`}
                        render={({ field: { value = [] } }) => (
                          <FormItem>
                            {value.length === 0 ? (
                              <div className="text-center py-4 bg-muted/20 rounded-md">
                                <Text className="text-muted-foreground">Chưa có địa điểm nào được thêm</Text>
                              </div>
                            ) : (
                              value.map((_, nearByIndex) => (
                                <div key={nearByIndex} className="flex space-x-2 items-center mb-4">
                                  <FormField
                                    control={control}
                                    name={`translations.${index}.nearBy.${nearByIndex}.name`}
                                    render={({ field }) => (
                                      <FormItem className="flex-grow">
                                        <FormLabel>Tên địa điểm</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Tên địa điểm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={control}
                                    name={`translations.${index}.nearBy.${nearByIndex}.distance`}
                                    render={({ field }) => (
                                      <FormItem className="w-1/3">
                                        <FormLabel>Khoảng cách</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Khoảng cách" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    className="mt-8"
                                    onClick={() => {
                                      const updatedNearBy = [...value];
                                      updatedNearBy.splice(nearByIndex, 1);
                                      setValue(`translations.${index}.nearBy`, updatedNearBy);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCloseDialog}
            className="w-full sm:w-1/4"
          >
            Hủy
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-1/4"
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
