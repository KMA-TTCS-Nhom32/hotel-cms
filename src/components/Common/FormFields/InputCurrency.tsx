import { InputHTMLAttributes, useEffect, useState } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type InputCurrencyProps<TFieldValues extends FieldValues> = {
  className?: string;
  control?: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  isLoading?: boolean;
  description?: string;
  min?: number;
  max?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'form' | 'type' | 'min' | 'max'>;

const formatCurrency = (value: number | null): string => {
  if (value === null) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseCurrency = (value: string): number | null => {
  if (!value) return null;
  const numberStr = value.replace(/\./g, '');
  const number = parseFloat(numberStr);
  return isNaN(number) ? null : number;
};

export function InputCurrency<TFieldValues extends FieldValues>({
  className,
  control,
  name,
  label,
  isLoading,
  description,
  onChange,
  disabled,
  min,
  max,
  ...props
}: InputCurrencyProps<TFieldValues>) {
  const [displayValue, setDisplayValue] = useState<string>('');

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        // Update display value when field value changes
        useEffect(() => {
          setDisplayValue(formatCurrency(field.value));
        }, [field.value]);

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                {...props}
                value={displayValue}
                type="text"
                inputMode="numeric"
                disabled={isLoading || disabled}
                className={cn(error && 'border-destructive')}
                onChange={(e) => {
                  // Only allow digits and dots
                  const sanitizedValue = e.target.value.replace(/[^\d.]/g, '');
                  const numericValue = parseCurrency(sanitizedValue);
                  
                  // Update display value
                  setDisplayValue(sanitizedValue);
                  
                  // Update form value with numeric value
                  field.onChange(numericValue);
                  onChange?.(e);
                }}
                onBlur={(e) => {
                  // Format on blur
                  const numericValue = parseCurrency(displayValue);
                  setDisplayValue(formatCurrency(numericValue));
                  field.onBlur();
                }}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
