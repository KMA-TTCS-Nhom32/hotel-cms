import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce, useRequest } from 'ahooks';
import { useNavigate } from 'react-router-dom';

import TopSection from '@/components/Common/TopSection';
import {
  DataTable,
  DataTableColumnHeaderSecondary,
  DataTableRowActions,
} from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import { deleteProvinceService, getProvincesService } from '@/services/provinces';
import { FilterProvincesDto, Province } from '@ahomevilla-hotel/node-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/ui/modal';
import CreateUpdateForm from './ProvinceForm';
import { ROUTE_PATH } from '@/routes/route.constant';
import ConfirmDeleteDialog from '@/components/Common/ConfirmDeleteDialog';
import { useTranslationStore } from '@/stores/translation/useTranslationStore';
import { Button } from '@/components/ui/button';

const BranchPage = () => {
  const { terms } = useTranslationStore((state) => state);
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

  const { run: handleDeleteProvince, loading: deleteLoading } = useRequest(deleteProvinceService, {
    manual: true,
    onSuccess: () => {
      refresh();
      closeDelete();
      toast.success('Xóa tỉnh/thành thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa tỉnh/thành');
    },
  });

  const provinces = useMemo(() => {
    const terms_province_name = terms.filter((term) => term.term === 'province_name');

    return provincesResponse?.data
      ? provincesResponse.data.map((province) => ({
          ...province,
          name:
            terms_province_name.find((term) => term.context === province.slug)?.translation
              .content ?? province.name,
        }))
      : [];
  }, [provincesResponse]);

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

  const onConfirmDelete = () => {
    if (selectedProvince) {
      handleDeleteProvince(selectedProvince.id);
    }
  };

  const onRequestSuccess = () => {
    refresh();
    closeCreateUpdate();
  };

  const onRowClick = (row: Province) => {
    navigate(`${ROUTE_PATH.HOTEL}?slug=${row.slug}`);
  };

  const columns: ColumnDef<Province>[] = [
    {
      id: 'order',
      header: () => null,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      //   id: 'Tỉnh/thành',
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Tỉnh/thành' />,
      cell: ({ row }) => (
        <Button variant='ghost' className='p-1' onClick={() => onRowClick(row.original)}>
          <Text type='title1-semi-bold'>{row.original.name}</Text>
        </Button>
      ),
    },
    {
      //   id: 'Zipcode',
      accessorKey: 'zip_code',
      header: () => <span className='text-base'>Zipcode</span>,
      enableSorting: true,
    },
    {
      //   id: 'Slug',
      accessorKey: 'slug',
      header: () => <span className='text-base'>Slug</span>,
    },
    {
      id: '_count',
      accessorKey: '_count.branches',
      header: ({ column }) => (
        <DataTableColumnHeaderSecondary column={column} title='Số lượng chi nhánh' />
      ),
      cell: ({ row }) => (
        <Text type='title1-semi-bold'>{row.original._count?.branches as number}</Text>
      ),
      sortingFn: 'basic',
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
        data={provinces}
        loading={loading}
        // onRowClick={onRowClick}
        extraLeft={
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

      <ConfirmDeleteDialog
        title='Xác nhận xóa tỉnh/thành'
        openDeleteDialog={openDeleteDialog}
        closeDelete={closeDelete}
        onConfirmDelete={onConfirmDelete}
        deleteLoading={deleteLoading}
      >
        <p>{`Bạn có chắc chắn muốn xóa tỉnh/thành ${selectedProvince?.name}?`}</p>
      </ConfirmDeleteDialog>
    </div>
  );
};

export default BranchPage;
