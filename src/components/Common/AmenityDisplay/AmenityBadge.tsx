import { Amenity } from '@ahomevilla-hotel/node-sdk';

interface AmenityBadgeProps {
  amenity: Amenity;
}

const AmenityBadge = ({ amenity }: AmenityBadgeProps) => {
  return (
    <div className='px-1.5 py-1 flex items-center gap-1 rounded-full bg-primary-foreground'>
      {amenity.name}
    </div>
  );
};

export default AmenityBadge;
