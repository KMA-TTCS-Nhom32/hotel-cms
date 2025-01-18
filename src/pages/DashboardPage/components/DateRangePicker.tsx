import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface CalendarDateRangePickerProps {
  className?: string;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  dateRange,
  setDateRange,
}: Readonly<CalendarDateRangePickerProps>) {
  // set default date range to last 30 days
  useEffect(() => {
    if (!dateRange) {
      const now = new Date();
      const from = new Date(now);
      from.setDate(from.getDate() - 30);
      setDateRange({ from, to: now });
    }
  }, []);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal h-full',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='end'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(date) => setDateRange(date)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
