import { useMemo } from 'react';

import { useRequest } from 'ahooks';
import { useParams } from 'react-router-dom';
import { Amenity } from '@ahomevilla-hotel/node-sdk';

import { ROUTE_PATH } from '@/routes/route.constant';
import { getBranchDetailService } from '@/services/branches';
import { useBreadcrumbStore } from '@/stores/breadcrumbs/useBreadcrumbStore';
import LoadingSection from '@/components/Common/LoadingSection';
import ImageGalleryCarousel from '@/components/Common/ImageGalleryCarousel';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';
import AmenityBadge from '@/components/Common/AmenityDisplay/AmenityBadge';
import { DialogCustom } from '@/components/Common/CustomDialog';
import { UpdateAmenitiesForm } from './UpdateAmenitiesForm';
import { getAmenitiesService } from '@/services/amenities';
import { Option } from '@/components/ui/multiple-selector';

const RoomDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { setBreadcrumbs } = useBreadcrumbStore((state) => state);

  const slug = useMemo(() => {
    return params.slug;
  }, [params]);

  const { data, loading, refresh } = useRequest(
    () => {
      if (!slug) return Promise.resolve(undefined);
      return getBranchDetailService(slug);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setBreadcrumbs([{ label: data.name, to: `${ROUTE_PATH.HOTEL}/${data.slug}` }]);
      },
      refreshDeps: [slug],
    },
  );

  const { data: getAmenitiesResponse, loading: fetchingAmenities } = useRequest(() =>
    getAmenitiesService({
      pageSize: 100,
      filters: JSON.stringify({
        types: ['PROPERTY'],
      }),
    }),
  );

  const updateAmenitiesDialog = DialogCustom.useDialog();

  console.log(getAmenitiesResponse);

  const formatAmenities = (amenities: Amenity[]): Option[] => {
    return amenities.map((amenity) => ({
      label: amenity.name,
      value: amenity.id,
    }));
  };

  const amenityOtions: Option[] = useMemo(() => {
    if (!getAmenitiesResponse) return [];

    return formatAmenities(getAmenitiesResponse.data);
  }, [getAmenitiesResponse]);

  if (loading || fetchingAmenities) return <LoadingSection />;

  if (!data) return <div>Không tìm thấy chi nhánh</div>;

  return (
    <div className='w-full'>
      <div className='flex flex-col lg:flex-row gap-6'>
        <ImageGalleryCarousel slides={[data.thumbnail, ...data.images]} />

        <div className='flex-1 flex flex-col gap-6'>
          <Text type='heading3-semi-bold'>{data?.name}</Text>

          <div>
            <Text type='heading6-bold'>Tiện ích</Text>
            <div className='mt-3 flex flex-wrap gap-3'>
              <Button
                className='rounded-full h-[36px] w-[36px] p-0'
                onClick={updateAmenitiesDialog.open}
              >
                <PencilLine className='h-5 w-5' />
              </Button>
              {data?.amenities.map((amenity) => (
                <AmenityBadge key={amenity.id} amenity={amenity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DialogCustom dialog={updateAmenitiesDialog} header='Cập nhật tiện ích'>
        <UpdateAmenitiesForm
          branchId={data.id}
          currentAmenities={formatAmenities(data.amenities)}
          allAmenities={amenityOtions}
          onCloseDialog={updateAmenitiesDialog.close}
          onSuccessfulUpdate={() => {
            updateAmenitiesDialog.close();
            refresh();
          }}
        />
      </DialogCustom>
    </div>
  );
};

export default RoomDetailPage;
