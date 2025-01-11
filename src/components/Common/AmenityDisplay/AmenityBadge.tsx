import { Text } from '@/components/ui/text';
import { Amenity } from '@ahomevilla-hotel/node-sdk';

interface AmenityBadgeProps {
  amenity: Amenity;
}

const AmenityBadge = ({ amenity }: AmenityBadgeProps) => {
  return (
    <div className='px-3 py-1 flex items-center gap-1.5 rounded-full bg-primary-light'>
      <div className='w-5 h-5 flex items-center justify-center'>
        <img src={amenity.icon?.url} alt='icon' className='w-5 h-auto' />
      </div>
      <Text type='body2' className='text-primary'>{amenity.name}</Text>
    </div>
  );
};

export default AmenityBadge;
