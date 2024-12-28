import { useState } from 'react';

import { useDebounce, useRequest } from 'ahooks';
import { toast } from 'sonner';
import { ColumnDef, RowModel, SortingState } from '@tanstack/react-table';
import { Amenity, FilterAmenityDto, SortAmenityDto } from '@ahomevilla-hotel/node-sdk';

import { DefaultPaging } from '@/lib/constants';
import { deleteAmenityService, getAmenitiesService } from '@/services/amenities';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import TopSection from '@/components/Common/TopSection';
import ConfirmDeleteDialog from '@/components/Common/ConfirmDeleteDialog';
import { Modal } from '@/components/ui/modal';
import AmenityForm from './AmenityForm';

const AmenityPage = () => {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [openCreateUpdateDialog, setOpenCreateUpdateDialog] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, {
    wait: 500,
  });

  const {
    data: amenitiesPaginationResponse,
    loading,
    refresh,
  } = useRequest(
    () => {
      return getAmenitiesService({
        page,
        pageSize: DefaultPaging.pageSize,
        filters: JSON.stringify({
          search: searchTerm,
        } as FilterAmenityDto),
        sort: JSON.stringify(
          sorting.map((sort) => {
            return {
              orderBy: sort.id,
              order: sort.desc ? 'desc' : 'asc',
            } as SortAmenityDto;
          }),
        ),
      });
    },
    {
      refreshDeps: [debouncedSearchTerm, page, sorting],
      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu');
      },
    },
  );

  const openUpdate = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setOpenCreateUpdateDialog(true);
  };

  const openCreate = () => {
    setOpenCreateUpdateDialog(true);
  };

  const openDelete = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setOpenDeleteDialog(true);
  };

  const closeCreateUpdate = () => {
    setSelectedAmenity(null);
    setOpenCreateUpdateDialog(false);
  };

  const closeDelete = () => {
    setSelectedAmenity(null);
    setOpenDeleteDialog(false);
  };

  const onConfirmDelete = () => {
    if (!selectedAmenity) {
      handleDeleteAmenity(idsToDelete);
      return;
    }
    handleDeleteAmenity([selectedAmenity.id]);
  };

  const onRequestSuccess = () => {
    refresh();
    closeCreateUpdate();
  };

  const { run: handleDeleteAmenity, loading: deleteLoading } = useRequest(
    (ids: string[]) => {
      const promises = ids.map((id) => deleteAmenityService(id));
      return Promise.all(promises);
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        closeDelete();
        toast.success('Xóa tiện ích thành công');
      },
    },
  );

  const onDeleteSelectedRows = (data: RowModel<Amenity>) => {
    const ids = data.rows.map((item) => item.original.id);
    setIdsToDelete(ids);
    setOpenDeleteDialog(true);
  };

  const columns: ColumnDef<Amenity>[] = [
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
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => (
        <div>
          <img alt='icon' src={row.original.icon?.url} className='h-7 w-auto' />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên tiện ích' />,
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.name}</Text>,
    },
    {
      accessorKey: 'slug',
      header: () => <span className='text-base'>Slug</span>,
      cell: ({ row }) => <p>{row.original.slug}</p>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại' />,
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.type}</Text>,
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
        data={amenitiesPaginationResponse?.data ?? []}
        loading={loading}
        manualPagination
        page={page - 1}
        total={amenitiesPaginationResponse?.meta.total ?? 0}
        onChangePage={(newPage) => setPage(newPage + 1)}
        onSortingChange={setSorting}
        enableDeleteSelectedRows
        deleteSelectedRows={onDeleteSelectedRows}
        toolbarExtra={
          <TopSection
            placeholder='Tên tiện ích...'
            value={searchTerm}
            onChange={setSearchTerm}
            onClick={openCreate}
          />
        }
      />

      <Modal
        isOpen={openCreateUpdateDialog}
        onClose={closeCreateUpdate}
        title={selectedAmenity ? 'Cập nhật tiện ích' : 'Tạo tiện ích mới'}
      >
        <AmenityForm data={selectedAmenity} onRequestSuccess={onRequestSuccess} />
      </Modal>

      <ConfirmDeleteDialog
        title='Xác nhận xóa tiện ích'
        openDeleteDialog={openDeleteDialog}
        closeDelete={closeDelete}
        onConfirmDelete={onConfirmDelete}
        deleteLoading={deleteLoading}
      >
        <p>
          {`Bạn có chắc chắn muốn xóa ${idsToDelete.length} tiện ích ${
            selectedAmenity ? selectedAmenity.name : ''
          }?`}
        </p>
      </ConfirmDeleteDialog>
    </div>
  );
};

export default AmenityPage;
