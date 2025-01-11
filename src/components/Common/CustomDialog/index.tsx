import { Modal } from '@/components/ui/modal';
import { DialogInstance, useDialog } from './use-dialog';

interface DialogComponent
  extends React.FC<{
    dialog?: DialogInstance;
    children?: React.ReactNode;
    onClickOutside?: () => void;
    header?: React.ReactNode;
  }> {
  useDialog: typeof useDialog;
}

export const DialogCustom: DialogComponent = ({ dialog, children, header }) => {
  const dialogInstance = useDialog(dialog);

  return (
    <Modal
      isOpen={dialogInstance.isOpen}
      onClose={() => {
        dialogInstance?.close();
      }}
      header={header}
    >
      <div>{children}</div>
    </Modal>
  );
};

// This enables the `Dialog.useDialog()` API
DialogCustom.useDialog = useDialog;
