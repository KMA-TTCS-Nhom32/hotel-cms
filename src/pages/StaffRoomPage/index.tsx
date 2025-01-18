import { getBranchDetailService } from '@/services/branches';
import { useUserStore } from '@/stores/user/userContext';
import { Amenity } from '@ahomevilla-hotel/node-sdk';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';
import { Text } from '@/components/ui/text';
import { DialogCustom } from '@/components/Common/CustomDialog';
import { RoomDetailSection } from '../HotelPage/HotelDetailPage/RoomDetailSection';
import LoadingSection from '@/components/Common/LoadingSection';
import { Option } from '@/components/ui/multiple-selector';
import { getAmenitiesService } from '@/services/amenities';
import BookingPage from '../BookingPage';
import { Button } from '@/components/ui/button';
import { getRoomsByBranchIdService } from '@/services/room';
import { toast } from 'sonner';
import { CreateUpdateBookingForm } from './CreateUpdateBookingForm';

const StaffRoomPage = () => {
  const { user } = useUserStore((state) => state);

  const { data, loading, refresh } = useRequest(
    () => {
      if (!user?.working_at) return Promise.resolve(undefined);
      return getBranchDetailService(user.working_at.id);
    },
    {
      refreshDeps: [user],
    },
  );

  const createUpdateDialog = DialogCustom.useDialog();
  const createBookingDialog = DialogCustom.useDialog();

  const { data: getAmenitiesResponse, loading: fetchingAmenities } = useRequest(() =>
    getAmenitiesService({
      pageSize: 100,
    }),
  );

  const { data: rooms } = useRequest(
    () => {
      if (!user?.working_at) return Promise.resolve(undefined);
      return getRoomsByBranchIdService(user.working_at.id);
    },
    {
      onError: () => {
        toast.error('Lỗi khi lấy danh sách phòng');
      },
    },
  );

  const formatAmenities = (amenities: Amenity[]): Option[] => {
    return amenities.map((amenity) => ({
      label: amenity.name,
      value: amenity.id,
    }));
  };

  const amenityOtions: { hotel: Option[]; room: Option[] } = useMemo(() => {
    if (!getAmenitiesResponse) return { hotel: [], room: [] };

    const [hotelAmenities, roomAmenities] = getAmenitiesResponse.data.reduce(
      (acc, amenity) => {
        if (amenity.type === 'PROPERTY' || amenity.type === 'SERVICE') {
          acc[0].push({
            label: amenity.name,
            value: amenity.id,
          });
        } else {
          acc[1].push({
            label: amenity.name,
            value: amenity.id,
          });
        }
        return acc;
      },
      [[], []] as [Option[], Option[]],
    );

    return {
      hotel: hotelAmenities,
      room: roomAmenities,
    };
  }, [getAmenitiesResponse]);

  if (loading) {
    return <LoadingSection />;
  }

  if (!data) {
    return (
      <div className='flex justify-center items-center h-96'>
        <Text type='heading3-semi-bold'>Không tìm thấy chi nhánh</Text>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-8'>
      <RoomDetailSection
        branchId={data.id}
        allRoomAmenities={amenityOtions.room}
        roomDetails={data.rooms}
        refreshRequest={refresh}
      />

      <div>
        <div className='flex items-center justify-between gap-5 mt-6 mb-4'>
          <Text type='heading3-semi-bold'>Đơn đặt phòng</Text>
          <Button onClick={createBookingDialog.open}>Tạo đơn đặt phòng</Button>
        </div>
        <BookingPage branchId={data.id} />
      </div>

      <DialogCustom dialog={createBookingDialog} header='Tạo đơn đặt phòng'>
        {rooms && (
          <CreateUpdateBookingForm
            rooms={rooms.filter((room) => room.status === 'AVAILABLE')}
            onRequestSuccess={() => {
              refresh();
              createBookingDialog.close();
            }}
            onCancel={createBookingDialog.close}
          />
        )}
      </DialogCustom>
    </div>
  );
};

export default StaffRoomPage;
