import { DialogDescription } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { ScrollArea } from './scroll-area';

interface ModalProps {
  title?: string | React.ReactNode;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  disableClickOutside?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  disableClickOutside,
  header,
  footer,
  className,
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        onInteractOutside={(e) => {
          if (disableClickOutside) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={className}
      >
        <ScrollArea className='max-h-[75vh] pr-3 overflow-y-hidden'>
          {(title || header) && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {header}
            </DialogHeader>
          )}
          {children}
          {(footer || description) && (
            <DialogFooter>
              <DialogDescription>{description}</DialogDescription>
              {footer}
            </DialogFooter>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
