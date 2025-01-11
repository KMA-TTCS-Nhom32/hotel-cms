import { Link } from 'react-router-dom';
import { Branch } from '@ahomevilla-hotel/node-sdk';
import { IterationCw, MapPin, PencilLine, PhoneCall, Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ROUTE_PATH } from '@/routes/route.constant';
import { Button } from '@/components/ui/button';

interface HotelCardProps {
  hotel: Branch;
  onOpenChangeStatusDialog: () => void;
  onOpenDeleteDialog: () => void;
  onOpenUpdateDialog: () => void;
}

const HotelCard = ({
  hotel,
  onOpenChangeStatusDialog,
  onOpenDeleteDialog,
  onOpenUpdateDialog,
}: HotelCardProps) => {
  const link = `${ROUTE_PATH.HOTEL}/${hotel.slug}`;

  return (
    <Card className='w-full bg-sidebar p-0'>
      <div className='relative h-[240px] w-full'>
        <Link to={link} className='w-full'>
          <img
            alt='thumbnail'
            src={hotel.thumbnail.url}
            className='h-full w-full max-h-[240px] rounded-t-xl object-cover object-center'
          />
        </Link>
        <div
          className={cn(
            'absolute top-3 right-3 px-3 py-1.5 rounded-full bg-orange-400 text-orange-900 flex items-center gap-2',
            hotel.is_active && 'bg-emerald-200 text-emerald-800',
          )}
        >
          <span>
            {/* create big svg dot here */}
            <svg width='8' height='8' viewBox='0 0 8 8' fill='currentColor'>
              <circle cx='4' cy='4' r='4' />
            </svg>
          </span>
          <p className='body2'>{hotel.is_active ? 'Đang hoạt động' : 'Tạm dừng hoạt động'}</p>
        </div>
      </div>
      <CardHeader className='p-5 pt-3 pb-0'>
        <CardDescription>Khu vực: {hotel.province?.name}</CardDescription>
        <CardTitle className='text-primary hover:underline'>
          <Link to={link}>{hotel.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 p-5'>
        <div className='flex items-center gap-3'>
          <MapPin className='w-6 h-6' />
          <p className='body-1'>{hotel.address}</p>
        </div>
        <div className='flex items-center gap-3'>
          <PhoneCall className='w-5 h-5' />
          <p className='body11'>{hotel.phone}</p>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between px-5'>
        <Button className='bg-green-500 hover:bg-green-600' onClick={onOpenUpdateDialog}>
          <PencilLine className='w-6 h-6' />
          <p className='body2'>Chỉnh sửa</p>
        </Button>

        <Button className='px-3' onClick={onOpenChangeStatusDialog}>
          <IterationCw className='w-6 h-6' />
          <p className='body2'>Đổi trạng thái</p>
        </Button>

        <Button variant='destructive' className='px-3' onClick={onOpenDeleteDialog}>
          <Trash2 className='w-6 h-6' />
          <p className='body2'>Xóa</p>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
