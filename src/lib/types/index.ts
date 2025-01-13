export type Paging = {
  page: number;
  pageSize: number;
};

export type SortDto = {
  orderBy: string;
  order: 'asc' | 'desc';
};

export type OptionWithIcon<T> = {
  value: T;
  label: string;
  icon: React.ElementType;
};