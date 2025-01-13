import { Snail } from 'lucide-react';
import { Text } from '../ui/text';

interface NotFoundSectionProps {
  content: string;
}

export const NotFoundSection = ({ content }: NotFoundSectionProps) => {
  return (
    <div className='w-full h-[400px] flex flex-col items-center justify-center gap-6'>
      <Snail className='!w-40 !h-40 text-accent' />
      <div className='text-center text-sidebar-foreground'>
        <Text type='heading3-bold'>404</Text>
        <Text type='title1-semi-bold' className='mt-3'>{content}</Text>
      </div>
    </div>
  );
};
