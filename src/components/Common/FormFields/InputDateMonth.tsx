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

type InputDateMonthProps<TFieldValues extends FieldValues> = {
  className?: string;
  control?: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  isLoading?: boolean;
  description?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'form' | 'type'>;

const formatDateMonth = (value: string | null): string => {
  if (!value) return '';
  return value;
};

const isValidDate = (day: number, month: number): boolean => {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Check days in month
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
};

const getValidMonthsForDay = (day: number): number[] => {
  const validMonths: number[] = [];
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let month = 1; month <= 12; month++) {
    if (day <= daysInMonth[month - 1]) {
      validMonths.push(month);
    }
  }
  return validMonths;
};

const parseDateMonth = (value: string): string | null => {
  if (!value) return null;

  // Remove any non-digit characters
  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.length === 0) return null;

  // Handle day input (first 2 digits)
  if (digitsOnly.length <= 2) {
    const partialDay = parseInt(digitsOnly);
    if (partialDay > 31) return null;
    return digitsOnly;
  }

  const day = parseInt(digitsOnly.slice(0, 2));
  const validMonths = getValidMonthsForDay(day);

  // Handle third digit (first digit of month)
  if (digitsOnly.length === 3) {
    const firstMonthDigit = parseInt(digitsOnly[2]);
    // Check if any valid months start with this digit
    const isPossibleMonth = validMonths.some((month) => Math.floor(month / 10) === firstMonthDigit);
    if (!isPossibleMonth) return null;
    return `${digitsOnly.slice(0, 2)}/${digitsOnly[2]}`;
  }

  // Handle complete input (4 digits)
  if (digitsOnly.length >= 4) {
    const month = parseInt(digitsOnly.slice(2, 4));
    if (!validMonths.includes(month)) return null;
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
};

export function InputDateMonth<TFieldValues extends FieldValues>({
  className,
  control,
  name,
  label,
  isLoading,
  description,
  onChange,
  disabled,
  ...props
}: InputDateMonthProps<TFieldValues>) {
  const [displayValue, setDisplayValue] = useState<string>('');

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          setDisplayValue(formatDateMonth(field.value));
        }, [field.value]);

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                {...props}
                value={displayValue}
                placeholder='DD/MM'
                type='text'
                inputMode='numeric'
                maxLength={5}
                disabled={isLoading || disabled}
                className={cn(error && 'border-destructive')}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/[^\d/]/g, '');

                  // Handle backspace/deletion
                  if (sanitizedValue.length < displayValue.length) {
                    if (sanitizedValue.length <= 1) {
                      setDisplayValue('');
                      field.onChange('');
                      return;
                    }
                  }

                  const formattedValue = parseDateMonth(sanitizedValue);
                  if (formattedValue !== null) {
                    setDisplayValue(formattedValue);
                    field.onChange(formattedValue);
                    onChange?.(e);
                  }
                }}
                onBlur={(e) => {
                  const digitsOnly = displayValue.replace(/\D/g, '');
                  if (digitsOnly.length === 4) {
                    const day = parseInt(digitsOnly.slice(0, 2));
                    const month = parseInt(digitsOnly.slice(2, 4));
                    if (!isValidDate(day, month)) {
                      // Clear invalid date on blur
                      setDisplayValue('');
                      field.onChange('');
                    }
                  }
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
