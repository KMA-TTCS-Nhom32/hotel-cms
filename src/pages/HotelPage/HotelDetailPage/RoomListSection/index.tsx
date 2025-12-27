import { useState } from 'react';
import { HotelRoom, RoomDetail } from '@ahomevilla-hotel/node-sdk';
import { useRequest } from 'ahooks';
import { ColumnDef, RowModel } from '@tanstack/react-table';
import { toast } from 'sonner';

import { RoomStatusOptions } from '@/constants';
import { getRoomsByBranchIdService, softDeleteRoomService } from '@/services/room';

import { DialogCustom } from '@/components/Common/CustomDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import CreateButton from '@/components/Common/CreateButton';
import { CreateUpdateRoomForm } from './CreateUpdateRoomForm';
import ConfirmDeleteDialog from '@/components/Common/ConfirmDeleteDialog';

interface RoomListSectionProps {
  branchId: string;
  roomDetails: RoomDetail[];
}

export const RoomListSection = ({ branchId, roomDetails }: RoomListSectionProps) => {
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const createUpdateDialog = DialogCustom.useDialog();
  const deleteDialog = DialogCustom.useDialog();

  const roomDetailOptions = roomDetails.map((room) => ({ label: room.name, value: room.id }));

  const { data, loading, refresh } = useRequest(() => getRoomsByBranchIdService(branchId), {
    onError: () => {
      toast.error('Lỗi khi lấy dữ liệu');
    },
  });

  const { run: handleDeleteHotelRooms, loading: deleteLoading } = useRequest(
    (ids: string[]) => {
      const promises = ids.map((id) => softDeleteRoomService(id));
      return Promise.all(promises);
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        closeDelete();
        toast.success('Xóa phòng thành công');
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa phòng');
      },
    },
  );

  const openCreate = () => {
    createUpdateDialog.open();
  };

  const closeCreateUpdate = () => {
    setSelectedRoom(null);
    createUpdateDialog.close();
  };

  const openUpdate = (room: HotelRoom) => {
    setSelectedRoom(room);
    createUpdateDialog.open();
  };

  const openDelete = (room: HotelRoom) => {
    console.log('room', room);
    console.log(deleteDialog.isOpen);
    setSelectedRoom(room);
    deleteDialog.open();
  };

  const closeDelete = () => {
    setSelectedRoom(null);
    deleteDialog.close();
  };

  const onDeleteSelectedRows = (data: RowModel<HotelRoom>) => {
    const ids = data.rows.map((item) => item.original.id);
    setIdsToDelete(ids);
    deleteDialog.open();
  };

  const onConfirmDelete = () => {
    if (!selectedRoom) {
      handleDeleteHotelRooms(idsToDelete);
      return;
    }
    handleDeleteHotelRooms([selectedRoom.id]);
  };

  const columns: ColumnDef<HotelRoom>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='h-full flex items-center'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
            className='translate-y-[2px]'
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phòng' />,
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.name}</Text>,
    },
    {
      accessorKey: 'slug',
      header: () => <span className='text-base'>Slug</span>,
      cell: ({ row }) => <p>{row.original.slug}</p>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => {
        const status = RoomStatusOptions.find((status) => status.value === row.original.status);

        if (!status) {
          return null;
        }

        return (
          <div className='flex items-center'>
            {status.icon && <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
            <span>{status.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'detail.id',
      header: () => <span className='text-base'>Loại phòng</span>,
      cell: ({ row }) => (
        <Text type='title1-semi-bold'>
          {roomDetails.find((detail) => detail.id === row.original.detailId)?.name}
        </Text>
      ),
    },
    {
      accessorKey: '_count.bookings',
      header: () => <span className='text-base'>SL Đặt</span>,
      cell: ({ row }) => <p>{row.original._count?.bookings}</p>,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} onUpdate={openUpdate} onDelete={openDelete} />
      ),
    },
  ];

  return (
    <div className='w-full mt-8'>
      <div className='flex items-center gap-5'>
        <Text type='heading3-semi-bold'>Danh sách phòng</Text>
        <CreateButton onClick={openCreate} />
      </div>
      <div className='mt-6 w-full pb-10'>
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={loading}
          enableDeleteSelectedRows
          deleteSelectedRows={onDeleteSelectedRows}
          enableBuiltinFilter
          builtinFilterSearchKey='Tên'
          manualPagination={false}
          filterFields={[
            { key: 'Trạng thái', title: 'Trạng thái', options: RoomStatusOptions },
            {
              key: 'Loại phòng',
              title: 'Loại phòng',
              options: roomDetailOptions,
            },
          ]}
          viewOptions={[
            {
              id: 'name',
              title: 'Tên phòng',
            },
            {
              id: 'slug',
              title: 'Slug',
            },
            {
              id: 'status',
              title: 'Trạng thái',
            },
            {
              id: 'detail.id',
              title: 'Loại phòng',
            },
            {
              id: '_count.bookings',
              title: 'SL Đặt',
            },
          ]}
        />
      </div>

      <DialogCustom
        dialog={createUpdateDialog}
        header={selectedRoom ? 'Cập nhật phòng' : 'Tạo phòng'}
        className='min-w-[800px]'
      >
        <CreateUpdateRoomForm
          data={selectedRoom}
          roomDetails={roomDetailOptions}
          onCancelDialog={closeCreateUpdate}
          onFinishedRequest={() => {
            closeCreateUpdate();
            refresh();
          }}
        />
      </DialogCustom>

      <DialogCustom
        dialog={deleteDialog}
        header='Xác nhận xóa tỉnh/thành'
        isConfirmDelete
        onCloseDelete={closeDelete}
        onConfirmDelete={onConfirmDelete}
        deleteLoading={deleteLoading}
      >
        <p>{`Bạn có chắc chắn muốn xóa ${idsToDelete.length} phòng ${
          selectedRoom ? selectedRoom.name : ''
        }`}</p>
      </DialogCustom>
    </div>
  );
};
