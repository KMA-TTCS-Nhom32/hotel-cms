import { useState } from 'react';
import { toast } from 'sonner';

import { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  Booking,
  BookingPaymentStatusEnum,
  BookingStatusEnum,
  FilterBookingsDto,
  SortBookingsDto,
} from '@ahomevilla-hotel/node-sdk';
import { useDebounce, useRequest } from 'ahooks';
import { getBookingsService } from '@/services/booking';
import { DialogCustom } from '@/components/Common/CustomDialog';
import { DefaultPaging } from '@/lib/constants';
import {
  DataTable,
  DataTableColumnHeaderSecondary,
  DataTableRowActions,
} from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import SearchBar from '@/components/Common/SearchBar';
import { BasicSelect } from '@/components/Common/BasicSelect';
import { UpdateStatusForm } from './UpdateStatusForm';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const getStatusDisplay = (status: BookingStatusEnum) => {
  switch (status) {
    case BookingStatusEnum.Pending:
      return 'Chờ xác nhận';
    case BookingStatusEnum.WaitingForCheckIn:
      return 'Chờ check-in';
    case BookingStatusEnum.CheckedIn:
      return 'Đã check-in';
    case BookingStatusEnum.Completed:
      return 'Đã hoàn thành';
    case BookingStatusEnum.Cancelled:
      return 'Đã hủy';
    case BookingStatusEnum.Refunded:
      return 'Đã hoàn tiền';
    case BookingStatusEnum.Rejected:
      return 'Đã từ chối';
    default:
      return status;
  }
};

const getPaymentStatusDisplay = (status: BookingPaymentStatusEnum) => {
  switch (status) {
    case BookingPaymentStatusEnum.Unpaid:
      return 'Chưa thanh toán';
    case BookingPaymentStatusEnum.Paid:
      return 'Đã thanh toán';
    case BookingPaymentStatusEnum.Refunded:
      return 'Đã hoàn tiền';
    case BookingPaymentStatusEnum.Failed:
      return 'Thanh toán thất bại';
    default:
      return status;
  }
};

interface BookingPageProps {
  branchId?: string;
}

const BookingPage = ({ branchId }: BookingPageProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<BookingStatusEnum | undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, {
    wait: 500,
  });

  const updateDialog = DialogCustom.useDialog();

  const {
    data: bookingPaginationResponse,
    loading,
    refresh,
  } = useRequest(
    () => {
      return getBookingsService({
        page,
        pageSize: DefaultPaging.pageSize,
        filters: JSON.stringify({
          keyword: searchTerm,
          status,
          branchId,
        } as FilterBookingsDto),
        sort: JSON.stringify(
          sorting.map(
            (sort) =>
              ({
                orderBy: sort.id,
                order: sort.desc ? 'desc' : 'asc',
              } as SortBookingsDto),
          ),
        ),
      });
    },
    {
      refreshDeps: [debouncedSearchTerm, page, sorting, status],
      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu');
      },
    },
  );

  const openUpdate = (booking: Booking) => {
    setSelectedBooking(booking);
    updateDialog.open();
  };

  const closeDialog = () => {
    setSelectedBooking(null);
    updateDialog.close();
  };

  const columns: ColumnDef<Booking>[] = [
    // {
    //   id: 'order',
    //   header: () => null,
    //   cell: ({ row }) => <div>{row.index + 1}</div>,
    // },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeaderSecondary column={column} title='Mã đặt phòng' />
      ),
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.code}</Text>,
    },
    {
      accessorKey: 'user.name',
      header: () => <Text type='body1'>Khách hàng</Text>,
      cell: ({ row }) => (
        <Text type='body1'>
          {row.original.create_type === 'AT_HOTEL' ? 'Khách đặt trực tiếp' : row.original.user.name}
        </Text>
      ),
    },
    {
      accessorKey: 'user.phone',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='SĐT' />,
      cell: ({ row }) => <Text type='body1'>{row.original.user.phone}</Text>,
    },
    {
      accessorKey: 'check_in_time',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Check-in' />,
      cell: ({ row }) => (
        <Text type='body1'>
          {row.original.check_in_time ? formatDateTime(row.original.check_in_time) : 'Chờ'}
        </Text>
      ),
    },
    {
      accessorKey: 'check_out_time',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Check-out' />,
      cell: ({ row }) => (
        <Text type='body1'>
          {row.original.check_out_time ? formatDateTime(row.original.check_out_time) : 'Chờ'}
        </Text>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Tổng tiền' />,
      cell: ({ row }) => <Text type='body1'>{formatCurrency(row.original.total_amount)}</Text>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Trạng thái' />,
      cell: ({ row }) => <Text type='body1'>{getStatusDisplay(row.original.status)}</Text>,
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => (
        <DataTableColumnHeaderSecondary column={column} title='Trạng thái thanh toán' />
      ),
      cell: ({ row }) => (
        <Text type='body1'>{getPaymentStatusDisplay(row.original.payment_status)}</Text>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} onUpdate={openUpdate} />,
    },
  ];

  return (
    <div className='w-full'>
      <DataTable
        columns={columns}
        data={bookingPaginationResponse?.data ?? []}
        loading={loading}
        manualPagination
        page={page - 1}
        total={bookingPaginationResponse?.meta.total ?? 0}
        onChangePage={(newPage) => setPage(newPage + 1)}
        onSortingChange={setSorting}
        extraLeft={
          <>
            <SearchBar
              placeholder='Mã đặt phòng...'
              value={searchTerm}
              onChange={setSearchTerm}
              className='min-w-[200px]'
            />
            <BasicSelect
              placeholder='Chọn trạng thái'
              options={[
                { label: 'Chờ xác nhận', value: BookingStatusEnum.Pending },
                { label: 'Đã xác nhận', value: BookingStatusEnum.Completed },
                { label: 'Đã hoàn thành', value: BookingStatusEnum.Completed },
                { label: 'Đã hủy', value: BookingStatusEnum.Cancelled },
              ]}
              onValueChange={(value) => setStatus(value as BookingStatusEnum)}
            />
          </>
        }
      />

      <DialogCustom dialog={updateDialog} header='Cập nhật trạng thái đặt phòng'>
        {selectedBooking && (
          <UpdateStatusForm
            data={selectedBooking}
            onRequestSuccess={() => {
              refresh();
              closeDialog();
            }}
            onCancelDialog={closeDialog}
          />
        )}
      </DialogCustom>
    </div>
  );
};

export default BookingPage;
