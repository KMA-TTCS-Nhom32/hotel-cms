export type Paging = {
  page: number;
  pageSize: number;
};

export type SortDto = {
  orderBy: string;
  order: 'asc' | 'desc';
};
