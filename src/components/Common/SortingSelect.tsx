import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortingOption = {
  value: string;
  label: string;
};

interface SortingSelectProps {
  orderByOptions: SortingOption[];
  onSortingChange: (orderBy: string, order: 'asc' | 'desc') => void;
}

export function SortingSelect({ orderByOptions, onSortingChange }: SortingSelectProps) {
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<('asc' | 'desc') | undefined>(undefined);

  useEffect(() => {
    if (orderBy && order) {
      onSortingChange(orderBy, order);
    }
  }, [orderBy, order, onSortingChange]);

  const handleOrderByChange = (value: string) => {
    setOrderBy(value);
    setOrder(undefined);
  };

  return (
    <div className='flex gap-3'>
      <Select value={orderBy} onValueChange={handleOrderByChange}>
        <SelectTrigger className='w-[180px] h-10'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          {orderByOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={order}
        onValueChange={(value) => setOrder(value as 'asc' | 'desc')}
        disabled={!orderBy}
      >
        <SelectTrigger className='w-[120px] h-10'>
          <SelectValue placeholder='Order' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='asc'>Tăng dần</SelectItem>
          <SelectItem value='desc'>Giảm dần</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
