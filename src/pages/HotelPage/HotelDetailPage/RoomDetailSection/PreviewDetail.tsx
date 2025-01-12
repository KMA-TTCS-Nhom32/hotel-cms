import { useState } from 'react';
import { BedDouble, Scan, Users } from 'lucide-react';
import { BookingTypeEnum, RoomDetail } from '@ahomevilla-hotel/node-sdk';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageGalleryCarousel from '@/components/Common/ImageGalleryCarousel';
import { Separator } from '@/components/ui/separator';
import AmenityBadge from '@/components/Common/AmenityDisplay/AmenityBadge';
import { BasicSelect } from '@/components/Common/BasicSelect';
import { formatCurrency } from '@/lib/utils';

interface PreviewDetailProps {
  data: RoomDetail;
}

const PRICE_MAPPING = {
  [BookingTypeEnum.Hourly]: {
    special: 'special_price_per_hour',
    base: 'base_price_per_hour',
  },
  [BookingTypeEnum.Daily]: {
    special: 'special_price_per_day',
    base: 'base_price_per_day',
  },
  [BookingTypeEnum.Nightly]: {
    special: 'special_price_per_night',
    base: 'base_price_per_night',
  },
} as const;

const getPrice = (bookingType: BookingTypeEnum, data: RoomDetail) => {
  const { special, base } = PRICE_MAPPING[bookingType];
  return data[special] ?? data[base];
};

const getBasePrice = (bookingType: BookingTypeEnum, data: RoomDetail) => {
  const { special, base } = PRICE_MAPPING[bookingType];
  return data[special] ? data[base] : '';
};

export const PreviewDetail = ({ data }: PreviewDetailProps) => {
  const [selectPriceType, setSelectPriceType] = useState<BookingTypeEnum>(BookingTypeEnum.Hourly);

  return (
    <Card className='w-full bg-sidebar p-0'>
      <CardHeader>
        <CardTitle>
          <Text type='heading4-bold'>{data.name}</Text>
        </CardTitle>
      </CardHeader>

      <div className='flex'>
        <div className='h-auto bg-background'>
          <ImageGalleryCarousel
            slides={[data.thumbnail, ...data.images]}
            className='rounded-none bg-background'
            thumbContainerClassName='p-3 mt-0 bg-background'
          />
        </div>
        <div className='flex-1 relative'>
          <ScrollArea className='w-full h-full pr-2.5 -mr-2.5 max-h-[400px] hidden-scrollbar pb-16'>
            <div className='px-3 w-full space-y-5 pb-6'>
              <Text type='body1' className='text-justify'>
                {data.description}
              </Text>
              <Separator />
              <div className='flex flex-col gap-3'>
                <Text type='title1-semi-bold' className='font-medium'>
                  Chi tiết phòng
                </Text>
                <div className='flex items-center gap-3'>
                  <Scan className='!w-6 !h-6 text-primary' />
                  <Text type='body1'>{data.area}m&#178;</Text>
                </div>
                <div className='flex items-center gap-3'>
                  <BedDouble className='!w-6 !h-6 text-primary' />
                  <Text type='body1'>
                    Giường {data.bed_type === 'DOUBLE' ? 'Twin' : data.bed_type}
                  </Text>
                </div>
                <div className='flex items-center gap-3'>
                  <Users className='!w-6 !h-6 text-primary' />
                  <Text type='body1'>{data.max_adults + data.max_children} người</Text>
                </div>
              </div>
              <Separator />
              <div className='flex flex-col gap-3'>
                <Text type='title1-semi-bold' className='font-medium'>
                  Tiện nghi phòng
                </Text>

                <div className='flex flex-wrap gap-3'>
                  {data.amenities.map((amenity) => (
                    <AmenityBadge key={amenity.id} amenity={amenity} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <div
            className='absolute bottom-0 w-full h-16 px-3 flex items-center justify-between'
            style={{
              boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className='flex items-center gap-3'>
              <Text type='heading4-semi-bold' className='text-primary'>
                {formatCurrency(getPrice(selectPriceType, data))}
              </Text>
              <Text type='heading5-medium' className='text-muted-foreground custom-line-through'>
                {formatCurrency(getBasePrice(selectPriceType, data))}
              </Text>
            </div>

            <BasicSelect
              defaultValue={selectPriceType}
              onValueChange={(value) => setSelectPriceType(value as BookingTypeEnum)}
              options={[
                { value: BookingTypeEnum.Hourly, label: 'Giá nghỉ giờ' },
                { value: BookingTypeEnum.Daily, label: 'Giá theo ngày' },
                { value: BookingTypeEnum.Nightly, label: 'Giá nghỉ đêm' },
              ]}
              className='h-12 w-[160px]'
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
