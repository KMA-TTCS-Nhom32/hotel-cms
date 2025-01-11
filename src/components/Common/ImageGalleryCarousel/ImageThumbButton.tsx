import { cn } from '@/lib/utils';

type ImageThumbButtonProps = {
  src: string;
  selected: boolean;
  onClick: () => void;
};

export const ImageThumbButton = ({ src, selected, onClick }: ImageThumbButtonProps) => {
  return (
    <div className='min-w-0 pl-3 flex-[0_0_30%]'>
      <button
        title='thumbnail button'
        className={cn(
          'appearance-none w-full h-16 rounded-md border-2 border-gray-300 bg-opacity-30 hover:bg-opacity-100 transition-all overflow-hidden',
          selected && 'border-primary bg-opacity-100',
        )}
        onClick={onClick}
      >
        <img src={src} alt='thumbnail' className='w-full h-full object-cover object-center' />
      </button>
    </div>
  );
};