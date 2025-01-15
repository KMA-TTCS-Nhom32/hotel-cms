'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanstackTable,
  Row,
  Column,
  TableState,
  RowModel,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from './dropdown-menu';
import { Button } from './button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  EyeOff,
  MoreHorizontal,
  Settings2,
  Trash,
  X,
} from 'lucide-react';

import EmptySection from '../Common/EmptySection';
import TopSection, { TopSectionProps } from '../Common/TopSection';
import { cn } from '@/lib/utils';
import LoadingSection from '../Common/LoadingSection';
import { useUpdateEffect } from 'ahooks';
import { Input } from './input';
import { SelectOption } from '../Common/BasicSelect';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

export type DataTableViewOptions = {
  id: string;
  title: string;
};

interface DataTableViewOptionsProps<TData> {
  table: TanstackTable<TData>;
  viewOptions?: DataTableViewOptions[];
}

export function DataTableViewOptions<TData>({
  table,
  viewOptions,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex'>
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>Ẩn cột</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {viewOptions?.find((option) => option.id === column.id)?.title ?? column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  if (table.getFilteredRowModel().rows.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        Đang chọn {table.getFilteredSelectedRowModel().rows.length} hàng trong tổng số{' '}
        {table.getFilteredRowModel().rows.length}.
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Hàng mỗi trang</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm font-medium'>
          Trang {table.getState().pagination.pageIndex + 1} trên {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Tới đầu trang</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Trang trước</span>
            <ChevronLeft />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Trang sau</span>
            <ChevronRight />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Tới cuối trang</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

type DataTableRowAction<TData> = {
  title: string;
  onClick: (row: TData) => void;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onUpdate?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  extraActions?: DataTableRowAction<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  onUpdate,
  onDelete,
  extraActions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <MoreHorizontal />
          <span className='sr-only'>Mở menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => onUpdate?.(row.original)}>Cập nhật</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete?.(row.original)}>
          Xóa
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        {extraActions?.map((action) => (
          <DropdownMenuItem key={action.title} onClick={() => action.onClick(row.original)}>
            {action.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FilterField = {
  key: string;
  title: string;
  options: SelectOption[];
};

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>;
  extraLeft?: React.ReactNode;
  enableDeleteSelectedRows?: boolean;
  deleteSelectedRows?: (data: RowModel<TData>) => void;
  enableBuiltinFilter?: boolean;
  builtinFilterPlaceholder?: string;
  builtinFilterSearchKey?: string;
  filterFields?: FilterField[];
  viewOptions?: DataTableViewOptions[];
}

export function DataTableToolbar<TData>({
  table,
  extraLeft,
  enableDeleteSelectedRows = false,
  deleteSelectedRows,
  enableBuiltinFilter = false,
  builtinFilterPlaceholder = 'Tìm kiếm...',
  builtinFilterSearchKey = 'name',
  filterFields = [],
  viewOptions,
}: Readonly<DataTableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleDeleteSelectedRows = () => {
    if (deleteSelectedRows) {
      deleteSelectedRows(table.getFilteredSelectedRowModel());
    }
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        {extraLeft}
        {enableBuiltinFilter && (
          <Input
            placeholder={builtinFilterPlaceholder}
            value={(table.getColumn(builtinFilterSearchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(builtinFilterSearchKey)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        {filterFields.map((field) => (
          <>
            {table.getColumn(field.key) && (
              <DataTableFacetedFilter
                column={table.getColumn(field.key)}
                title={field.title}
                options={field.options}
              />
            )}
          </>
        ))}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-4'>
        {enableDeleteSelectedRows &&
          (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
            <Button variant='destructive' className='h-8 gap-3' onClick={handleDeleteSelectedRows}>
              <Trash />
              Xóa
            </Button>
          )}
        <DataTableViewOptions table={table} viewOptions={viewOptions} />
      </div>
    </div>
  );
}

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className, 'text-base')}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='-ml-3 h-8 data-[state=open]:bg-accent'>
            <span className='text-base'>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className='h-3.5 w-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className='h-3.5 w-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className='h-3.5 w-3.5 text-muted-foreground/70' />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface DataTableColumnHeaderSecondaryProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  align?: 'left' | 'center' | 'right';
}

export function DataTableColumnHeaderSecondary<TData, TValue>({
  column,
  title,
    align = 'left',
}: DataTableColumnHeaderSecondaryProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={`text-base flex justify-${align} text-${align}`}>{title}</div>;
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      className={`-ml-3 h-8 data-[state=open]:bg-accent w-auto justify-self-${align}`}
      onClick={column.getToggleSortingHandler()}
    >
      <span className={`text-base text-${align}`}>{title}</span>
      {column.getIsSorted() === 'desc' ? (
        <ArrowDown />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUp />
      ) : (
        <ChevronsUpDown />
      )}
    </Button>
  );
}

interface DataTableProps<TData, TValue> extends Omit<DataTableToolbarProps<TData>, 'table'> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  manualPagination?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  deleteSelectedRows?: (data: RowModel<TData>) => void;
  onChangePage?: (page: number) => void;
  onRowClick?: (row: TData) => void;
  onSortingChange?: (sorting: SortingState) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  manualPagination = false,
  page = 0,
  pageSize = 10,
  total,
  onChangePage,
  onRowClick,
  onSortingChange,
  ...props
}: Readonly<DataTableProps<TData, TValue>>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: manualPagination ? page : 0,
        pageSize: pageSize,
      },
    },
    // Configure features based on pagination mode
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // Manual pagination settings
    manualPagination,
    manualSorting: manualPagination,
    manualFiltering: manualPagination,
    // pageCount: manualPagination ? Math.ceil((total || 0) / pageSize) : undefined,
    rowCount: total,

    // Event handlers
    enableRowSelection: true,
    enableMultiSort: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (manualPagination && onChangePage && typeof updater === 'function') {
        const { pageIndex } = updater({ pageIndex: page, pageSize });
        onChangePage(pageIndex);
      }
    },
  });

  useUpdateEffect(() => {
    onSortingChange?.(sorting);
  }, [sorting]);

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} {...props} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-40 text-center'>
                  <LoadingSection />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-40 text-center'>
                      <EmptySection />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
