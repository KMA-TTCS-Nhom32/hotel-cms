import { RoomDetail } from '@ahomevilla-hotel/node-sdk';

import { Text } from '@/components/ui/text';
import { DialogCustom } from '@/components/Common/CustomDialog';
import { useState } from 'react';
import CreateButton from '@/components/Common/CreateButton';

interface RoomDetailSectionProps {
  roomDetails: RoomDetail[];
}

export const RoomDetailSection = ({ roomDetails }: RoomDetailSectionProps) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  const createUpdateDialog = DialogCustom.useDialog();

  return (
    <div className='w-full mt-8'>
      <div className='flex items-center gap-5'>
        <Text type='heading3-semi-bold'>Loại phòng</Text>
        <CreateButton onClick={createUpdateDialog.open} />
      </div>

      <DialogCustom
        dialog={createUpdateDialog}
        header={selectedRoom ? 'Cập nhật thông tin loại phòng' : 'Tạo loại phòng'}
        className='min-w-[800px]'
      >
        <div>Content</div>
      </DialogCustom>
    </div>
  );
};
