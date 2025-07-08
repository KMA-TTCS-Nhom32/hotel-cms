import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectOption = {
  id?: string;
  value: string;
  label: string;
};

interface BasicSelectProps {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  className?: string;
}

export const BasicSelect = ({
  label,
  defaultValue,
  placeholder = 'Chọn',
  options,
  onValueChange,
  className,
}: BasicSelectProps) => {
  return (
    <div className='flex flex-col space-y-2'>
      {label && <label className='mb-2 block text-sm font-medium'>{label}</label>}
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger type='button' className={cn('max-w-[200px] h-10', className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id ?? option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
