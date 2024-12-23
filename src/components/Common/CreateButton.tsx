import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

export interface CreateButtonProps {
  onClick?: () => void;
}

const CreateButton = ({ onClick }: CreateButtonProps) => {
  return (
    <Button onClick={onClick} className='h-auto px-4 min-h-10 rounded-full gap-3'>
      <Plus className='h-6 w-6' />
      <span>Tạo mới</span>
    </Button>
  );
};

export default CreateButton;
