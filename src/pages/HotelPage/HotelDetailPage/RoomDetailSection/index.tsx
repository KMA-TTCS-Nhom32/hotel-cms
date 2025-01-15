import { RoomDetail } from '@ahomevilla-hotel/node-sdk';

import { Text } from '@/components/ui/text';
import { DialogCustom } from '@/components/Common/CustomDialog';
import { useEffect, useState } from 'react';
import CreateButton from '@/components/Common/CreateButton';
import { Option } from '@/components/ui/multiple-selector';
import { CreateUpdateRoomDetailForm } from './CreateUpdateRoomDetailForm';
import { RoomDetailCard } from './RoomDetailCard';
import { UpdatePriceForm } from './UpdatePriceForm';
import { PreviewDetail } from './PreviewDetail';

interface RoomDetailSectionProps {
  branchId: string;
  roomDetails: RoomDetail[];
  allRoomAmenities: Option[];
  refreshRequest: () => void;
}

export const RoomDetailSection = ({
  branchId,
  roomDetails,
  allRoomAmenities,
  refreshRequest,
}: RoomDetailSectionProps) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [count, setCount] = useState(1);

  const createUpdateDialog = DialogCustom.useDialog();
  const updatePriceDialog = DialogCustom.useDialog();
  const previewDialog = DialogCustom.useDialog();

  const openUpdate = (roomDetail: RoomDetail) => {
    setSelectedRoom(roomDetail);
    createUpdateDialog.open();
  };

  const openUpdatePrice = (roomDetail: RoomDetail) => {
    setSelectedRoom(roomDetail);
    updatePriceDialog.open();
  };

  const openPreview = (roomDetail: RoomDetail) => {
    setSelectedRoom(roomDetail);
    previewDialog.open();
  };

  useEffect(() => {
    setCount(count + 1);
  }, [selectedRoom]);

  console.log('count', count);

  return (
    <div className='w-full mt-8'>
      <div className='flex items-center gap-5'>
        <Text type='heading3-semi-bold'>Loại phòng</Text>
        <CreateButton onClick={createUpdateDialog.open} />
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4'>
        {roomDetails.map((roomDetail) => (
          <RoomDetailCard
            key={roomDetail.id}
            data={roomDetail}
            onOpenUpdateDialog={() => openUpdate(roomDetail)}
            onOpenUpdatePriceDialog={() => openUpdatePrice(roomDetail)}
            onOpenPreviewDialog={() => openPreview(roomDetail)}
          />
        ))}
      </div>

      <DialogCustom
        dialog={createUpdateDialog}
        header={selectedRoom ? 'Cập nhật thông tin loại phòng' : 'Tạo loại phòng'}
        className='min-w-[800px]'
      >
        <CreateUpdateRoomDetailForm
          branchId={branchId}
          data={selectedRoom}
          allAmenities={allRoomAmenities}
          onCancelDialog={createUpdateDialog.close}
          onSuccessfullRequest={() => {
            createUpdateDialog.close();
            refreshRequest();
          }}
        />
      </DialogCustom>

      <DialogCustom
        dialog={updatePriceDialog}
        header='Cập nhật giá phòng'
        className='min-w-[800px]'
      >
        {selectedRoom && (
          <UpdatePriceForm
            branchId={branchId}
            data={selectedRoom}
            onCloseDialog={updatePriceDialog.close}
            onFinishedUpdate={() => {
              updatePriceDialog.close();
              refreshRequest();
            }}
          />
        )}
      </DialogCustom>

      <DialogCustom dialog={previewDialog} className='w-full max-w-[1024px] p-0'>
        {selectedRoom && <PreviewDetail data={selectedRoom} />}
      </DialogCustom>
    </div>
  );
};
