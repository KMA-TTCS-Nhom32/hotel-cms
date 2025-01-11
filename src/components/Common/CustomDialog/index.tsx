import { Modal } from '@/components/ui/modal';
import { DialogInstance, useDialog } from './use-dialog';

interface DialogComponent
  extends React.FC<{
    dialog?: DialogInstance;
    children?: React.ReactNode;
    onClickOutside?: () => void;
    header?: React.ReactNode;
    className?: string;
  }> {
  useDialog: typeof useDialog;
}

export const DialogCustom: DialogComponent = ({ dialog, children, header, className }) => {
  const dialogInstance = useDialog(dialog);

  return (
    <Modal
      isOpen={dialogInstance.isOpen}
      onClose={() => {
        dialogInstance?.close();
      }}
      header={header}
      className={className}
    >
      <div>{children}</div>
    </Modal>
  );
};

// This enables the `Dialog.useDialog()` API
DialogCustom.useDialog = useDialog;
