import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SelectOption } from '../BasicSelect';

type InputSimpleSelectProps<TFieldValues extends FieldValues> = {
  className?: string;
  control?: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  isLoading?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  enableDefault?: boolean;
};

export function InputSimpleSelect<TFieldValues extends FieldValues>({
  className,
  control,
  name,
  label,
  options,
  placeholder = 'Select an option',
  description,
  isLoading,
  disabled,
  triggerClassName,
  enableDefault = false,
}: Readonly<InputSimpleSelectProps<TFieldValues>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={enableDefault ? options[0].value : undefined}
          >
            <FormControl>
              <SelectTrigger
                className={cn('w-full', triggerClassName)}
                disabled={isLoading || disabled}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id ?? option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
