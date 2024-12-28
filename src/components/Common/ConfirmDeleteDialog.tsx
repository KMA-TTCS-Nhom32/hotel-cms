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
}

const ConfirmDeleteDialog = ({
  title = 'Xác nhận xóa',
  header,
  openDeleteDialog,
  closeDelete,
  onConfirmDelete,
  children,
  deleteLoading,
}: ConfirmDeleteDialogProps) => {
  return (
    <Modal
      isOpen={openDeleteDialog}
      onClose={closeDelete}
      title={title}
      header={header}
      footer={
        <div className='flex gap-4'>
          <Button onClick={closeDelete}>Hủy</Button>
          <Button variant='destructive' onClick={onConfirmDelete} disabled={deleteLoading}>
            Xóa
          </Button>
        </div>
      }
    >
      {children}
    </Modal>
  );
};

export default ConfirmDeleteDialog;
