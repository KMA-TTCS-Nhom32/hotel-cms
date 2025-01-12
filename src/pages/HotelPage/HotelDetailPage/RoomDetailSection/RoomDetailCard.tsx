import { RoomDetail } from '@ahomevilla-hotel/node-sdk';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { BedDouble, CircleDollarSign, PencilLine, Scan, Users } from 'lucide-react';
import AmenityBadge from '@/components/Common/AmenityDisplay/AmenityBadge';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BasicTooltip } from '@/components/Common/BasicTooltip';

interface RoomDetailCardProps {
  data: RoomDetail;
  onOpenUpdateDialog: () => void;
  onOpenUpdatePriceDialog: () => void;
  onOpenPreviewDialog: () => void;
}

export const RoomDetailCard = ({
  data,
  onOpenUpdateDialog,
  onOpenUpdatePriceDialog,
  onOpenPreviewDialog,
}: RoomDetailCardProps) => {
  return (
    <Card className='w-full bg-sidebar p-0 border border-solid border-sidebar hover:border-primary'>
      <CardHeader className='p-3 space-y-3'>
        <CardTitle>{data.name}</CardTitle>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Scan className='!w-5 !h-5' />
            <Text>{data.area}m&#178;</Text>
          </div>
          <div className='flex items-center gap-3'>
            <BedDouble className='!w-5 !h-5' />
            <Text>Giường {data.bed_type === 'DOUBLE' ? 'Twin' : data.bed_type}</Text>
          </div>
          <div className='flex items-center gap-3'>
            <Users className='!w-5 !h-5' />
            <Text>{data.max_adults + data.max_children} người</Text>
          </div>
        </div>
      </CardHeader>
      <CardContent className=' w-full p-0'>
        <button className='appearance-none h-[240px] w-full' onClick={onOpenPreviewDialog}>
          <img
            alt='thumbnail'
            src={data.thumbnail.url}
            className='h-full w-full max-h-[240px] object-cover object-center'
          />
        </button>
        <div className='p-3 pb-0 h-[120px] border-b border-solid border-b-sidebar-border'>
          <div className='flex flex-wrap gap-3'>
            {data.amenities.map((amenity) => (
              <AmenityBadge key={amenity.id} amenity={amenity} />
            ))}
          </div>
        </div>
        <div className='p-3 flex items-center justify-between'>
          <BasicTooltip content={<Text>Chỉnh sửa giá</Text>}>
            <Button
              variant='ghost'
              className='p-0 rounded-full px-3'
              onClick={onOpenUpdatePriceDialog}
            >
              <CircleDollarSign className='!w-6 !h-6 text-primary' />
              <div className='flex items-center gap-2'>
                <Text type='heading4-semi-bold' className='text-primary'>
                  {formatCurrency(data.special_price_per_hour ?? data.base_price_per_hour)}
                </Text>
                <Text type='title1-semi-bold'>/ giờ</Text>
              </div>
            </Button>
          </BasicTooltip>
          <Button className='bg-green-500 hover:bg-green-600' onClick={onOpenUpdateDialog}>
            <PencilLine className='w-6 h-6' />
            <p className='body2'>Chỉnh sửa</p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
