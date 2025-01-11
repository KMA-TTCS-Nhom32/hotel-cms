import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RoomDetail } from '@ahomevilla-hotel/node-sdk';

import { RoomDetailFormValues, roomDetailSchema } from '@/lib/validators/room-detail';

interface CreateUpdateRoomDetailFormProps {
  data: RoomDetail | null;
}

export const CreateUpdateRoomDetailForm = ({ data }: CreateUpdateRoomDetailFormProps) => {
  const form = useForm<RoomDetailFormValues>({
    resolver: zodResolver(roomDetailSchema),
    defaultValues: {
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      description: data?.description ?? '',
      amenities: [],
      base_price_per_day: 0,
      base_price_per_hour: 0,
      base_price_per_night: 0,
      room_type: data?.room_type ?? '',
      bed_type: data?.bed_type ?? '',
      max_adults: data?.max_adults ?? 0,
      max_children: data?.max_children ?? 0,
      thumbnail: undefined,
      images: null,
    },
  });

  return <div>CreateUpdateRoomDetailForm</div>;
};
