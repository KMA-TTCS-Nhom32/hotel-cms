import { PawPrint } from 'lucide-react';

const EmptySection = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <PawPrint className='h-10 w-10' />
      <p className='text-lg font-semibold text-primary-foreground'>Không có dữ liệu</p>
    </div>
  );
};

export default EmptySection;
