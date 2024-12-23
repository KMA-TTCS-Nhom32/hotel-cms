import { ReactNode } from 'react';

import SearchBar, { SearchBarProps } from './SearchBar';
import CreateButton, { CreateButtonProps } from './CreateButton';
import { cn } from '@/lib/utils';

export type TopSectionProps = SearchBarProps &
  CreateButtonProps & {
    className?: string;
    classNameSearchBar?: string;
    extra?: ReactNode;
    side?: 'left' | 'right';
  };

const TopSection = ({
  className,
  classNameSearchBar,
  placeholder,
  value,
  extra,
  side = 'left',
  onChange,
  onClick,
}: TopSectionProps) => {
  const sideClass = side === 'left' ? 'justify-start' : 'justify-end';

  return (
    <div className='w-full py-6'>
      <div className={cn('flex items-center gap-4', sideClass, className)}>
        {extra}
        <SearchBar
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={classNameSearchBar}
        />
        <CreateButton onClick={onClick} />
      </div>
    </div>
  );
};

export default TopSection;
