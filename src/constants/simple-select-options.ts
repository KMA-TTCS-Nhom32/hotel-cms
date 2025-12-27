import { SelectOption } from '@/components/Common/BasicSelect';
import { OptionWithIcon } from '@/lib/types';
import { HotelRoomStatusEnum } from '@ahomevilla-hotel/node-sdk';
import { CheckCircle, Construction, NotebookPen, TentTree } from 'lucide-react';

export const RoomTypeOptions: SelectOption[] = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'DELUXE', label: 'Deluxe' },
  { value: 'SUPERIOR', label: 'Superior' },
];

export const BedTypeOptions: SelectOption[] = [
  { value: 'SINGLE', label: 'Giường Single' },
  { value: 'DOUBLE', label: 'Giường Double' },
  { value: 'KING', label: 'Giường King' },
  { value: 'QUEEN', label: 'Giường Queen' },
];

export const RoomStatusOptions: OptionWithIcon<HotelRoomStatusEnum>[] = [
  { value: HotelRoomStatusEnum.Available, label: 'Đang hoạt động', icon: CheckCircle },
  // { value: HotelRoomStatusEnum.Booked, label: 'Đã đặt', icon: NotebookPen },
  { value: HotelRoomStatusEnum.Maintenance, label: 'Bảo trì', icon: Construction },
  // { value: HotelRoomStatusEnum.Occupied, label: 'Đang sử dụng', icon: TentTree },
];
