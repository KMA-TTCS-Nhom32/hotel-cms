import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RoomDetailCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export const BasicTooltip = ({ children, content }: RoomDetailCardProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='bg-sidebar-accent'>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
