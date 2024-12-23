import { useState } from 'react';
import { toast } from 'sonner';
import { useDebounce, useRequest } from 'ahooks';
import { useNavigate } from 'react-router-dom';

import TopSection from '@/components/Common/TopSection';
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import { getProvincesService } from '@/services/provinces';
import { FilterProvincesDto, Province } from '@ahomevilla-hotel/node-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/ui/modal';
import CreateUpdateForm from './CreateUpdateForm';
import { Button } from '@/components/ui/button';
import { ROUTE_PATH } from '@/routes/route.constant';

const BranchPage = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [openCreateUpdateDialog, setOpenCreateUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, {
    wait: 500,
  });

  const navigate = useNavigate();

  const {
    data: provincesResponse,
    loading,
    refresh,
  } = useRequest(
    () => {
      return getProvincesService({
        page: 1,
        pageSize: 64,
        filters: JSON.stringify({
          keyword: searchTerm,
        } as FilterProvincesDto),
      });
    },
    {
      refreshDeps: [debouncedSearchTerm],

      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu');
      },
    },
  );

  const openUpdate = (province: Province) => {
    setSelectedProvince(province);
    setOpenCreateUpdateDialog(true);
  };

  const openCreate = () => {
    setOpenCreateUpdateDialog(true);
  };

  const openDelete = (province: Province) => {
    setSelectedProvince(province);
    setOpenDeleteDialog(true);
  };

  const closeCreateUpdate = () => {
    setSelectedProvince(null);
    setOpenCreateUpdateDialog(false);
  };

  const closeDelete = () => {
    setSelectedProvince(null);
    setOpenDeleteDialog(false);
  };

  const onRequestSuccess = () => {
    refresh();
    closeCreateUpdate();
  };

  const onRowClick = (row: Province) => {
    navigate(`${ROUTE_PATH.HOTEL}?slug=${row.slug}`);
  }

  const columns: ColumnDef<Province>[] = [
    {
      id: 'order',
      header: () => null,
      cell: ({ row }) => <div>{row.index}</div>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tỉnh/thành' />,
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.name}</Text>,
    },
    {
      accessorKey: 'zip_code',
      header: () => <span className='text-base'>Zipcode</span>,
      cell: ({ row }) => <p>{row.original.zip_code}</p>,
    },
    {
      accessorKey: 'slug',
      header: () => <span className='text-base'>Slug</span>,
      cell: ({ row }) => <p>{row.original.slug}</p>,
    },
    {
      accessorKey: 'branch_count',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng chi nhánh' />,
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.name}</Text>,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} onUpdate={openUpdate} onDelete={openDelete} />
      ),
    },
  ];

  return (
    <div className='w-full'>
      <DataTable
        columns={columns}
        data={provincesResponse?.data ?? []}
        loading={loading}
        onRowClick={onRowClick}
        toolbarExtra={
          <TopSection
            placeholder='Tên tỉnh/thành...'
            value={searchTerm}
            onChange={setSearchTerm}
            onClick={openCreate}
          />
        }
      />
      <Modal
        isOpen={openCreateUpdateDialog}
        onClose={closeCreateUpdate}
        title={selectedProvince ? 'Cập nhật tỉnh/thành' : 'Tạo mới tỉnh/thành'}
      >
        <CreateUpdateForm data={selectedProvince} onRequestSuccess={onRequestSuccess} />
      </Modal>

      <Modal
        isOpen={openDeleteDialog}
        onClose={closeDelete}
        title='Xác nhận xóa tỉnh/thành'
        header='Bạn có chắc chắn muốn xóa tỉnh/thành này không?'
        footer={
          <div className='flex gap-4'>
            <Button onClick={closeDelete}>Hủy</Button>
            <Button variant='destructive' onClick={closeDelete}>
              Xóa
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default BranchPage;
