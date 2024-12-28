import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

interface ConfirmDeleteDialogProps {
  title?: string;
  header?: string | ReactNode;
  openDeleteDialog: boolean;
  closeDelete: () => void;
  onConfirmDelete: () => void;
  children?: ReactNode;
  deleteLoading: boolean;
  confirmText?: string;
}

const ConfirmDeleteDialog = ({
  title = 'Xác nhận xóa',
  header,
  openDeleteDialog,
  closeDelete,
  onConfirmDelete,
  children,
  deleteLoading,
  confirmText = 'Xóa',
}: ConfirmDeleteDialogProps) => {
  return (
    <Modal
      isOpen={openDeleteDialog}
      onClose={closeDelete}
      title={title}
      header={header}
      footer={
        <div className='flex gap-4'>
          <Button variant='outline' onClick={closeDelete}>
            Hủy
          </Button>
          <Button variant='destructive' onClick={onConfirmDelete} disabled={deleteLoading}>
            {confirmText}
          </Button>
        </div>
      }
    >
      {children}
    </Modal>
  );
};

export default ConfirmDeleteDialog;
