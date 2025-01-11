import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Branch,
  FilterBranchesDto,
  SortBranchDto,
  UpdateBranchDto,
} from '@ahomevilla-hotel/node-sdk';
import { useDebounce, useRequest } from 'ahooks';
import { toast } from 'sonner';

import { deleteBranchService, getBranchesService, updateBranchService } from '@/services/branches';
import { SortDto } from '@/lib/types';

import TopSection from '@/components/Common/TopSection';
import { getProvincesService } from '@/services/provinces';
import LoadingSection from '@/components/Common/LoadingSection';
import { Modal } from '@/components/ui/modal';
import ConfirmDeleteDialog from '@/components/Common/ConfirmDeleteDialog';
import { SortingOption, SortingSelect } from '@/components/Common/SortingSelect';
import { PaginationComponent } from '@/components/ui/normal-pagination';
import { BasicSelect, SelectOption } from '@/components/Common/BasicSelect';

import HotelForm from './HotelForm';
import HotelCard from './HotelCard';

const options: SortingOption[] = [
  {
    value: 'name',
    label: 'Tên khách sạn',
  },
  {
    value: 'rating',
    label: 'Đánh giá',
  },
  {
    value: 'createdAt',
    label: 'Ngày tạo',
  },
];

const HotelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = useMemo(() => {
    return searchParams.get('slug');
  }, [searchParams]);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [openCreateUpdateDialog, setOpenCreateUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortDto[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, {
    wait: 500,
  });

  const { data: provincesResponse } = useRequest(
    () => {
      return getProvincesService({
        page: 1,
        pageSize: 64,
      });
    },
    {
      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu tỉnh/thành');
      },
    },
  );

  const {
    data: branchPaginationResponse,
    loading,
    refresh,
  } = useRequest(
    () => {
      return getBranchesService({
        page,
        pageSize: 6,
        filters: JSON.stringify({
          keyword: searchTerm,
          provinceSlug: slug,
        } as FilterBranchesDto),
        sort: JSON.stringify(sorting as SortBranchDto[]),
      });
    },
    {
      refreshDeps: [debouncedSearchTerm, slug, page, sorting],

      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu');
      },
    },
  );

  const provinceOptions: SelectOption[] = useMemo(() => {
    return provincesResponse?.data
      ? provincesResponse.data.map((province) => ({
          id: province.id,
          value: province.slug,
          label: province.name,
        }))
      : [];
  }, [provincesResponse]);

  const { run: handleDeleteHotel, loading: deleteLoading } = useRequest(deleteBranchService, {
    manual: true,
    onSuccess: () => {
      refresh();
      closeDelete();
      toast.success('Xóa khách sạn thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa khách sạn');
    },
  });

  const { run: handleUpdateHotelStatus, loading: updateStatusLoading } = useRequest(
    (id: string, currentStatus: boolean) => {
      return updateBranchService(id, {
        is_active: !currentStatus,
      } as UpdateBranchDto);
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        closeChangeStatus();
        toast.success('Cập nhật trạng thái khách sạn thành công');
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái khách sạn');
      },
    },
  );

  const openUpdate = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpenCreateUpdateDialog(true);
  };

  const openCreate = () => {
    setOpenCreateUpdateDialog(true);
  };

  const openDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpenDeleteDialog(true);
  };

  const openChangeStatus = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpenChangeStatusDialog(true);
  };

  const closeCreateUpdate = () => {
    setSelectedBranch(null);
    setOpenCreateUpdateDialog(false);
  };

  const closeDelete = () => {
    setSelectedBranch(null);
    setOpenDeleteDialog(false);
  };

  const closeChangeStatus = () => {
    setSelectedBranch(null);
    setOpenChangeStatusDialog(false);
  };

  const onRequestSuccess = () => {
    refresh();
    closeCreateUpdate();
  };

  const onConfirmDelete = () => {
    if (selectedBranch) {
      handleDeleteHotel(selectedBranch.id);
    }
  };

  const onConfirmChangeStatus = () => {
    if (selectedBranch) {
      handleUpdateHotelStatus(selectedBranch.id, selectedBranch.is_active);
    }
  };

  const onChangeProvinceSlug = (slug: string) => {
    setSearchParams({ slug });
  };

  return (
    <div className='w-full'>
      <div className='w-full flex items-center justify-between'>
        <TopSection
          placeholder='Tên chi nhánh/khách sạn...'
          value={searchTerm}
          onChange={setSearchTerm}
          onClick={openCreate}
          className='w-auto'
        />

        <div className='max-w-1/2 flex items-center gap-3'>
          <BasicSelect
            defaultValue={slug ?? undefined}
            options={provinceOptions}
            placeholder='Chọn khu vực'
            onValueChange={onChangeProvinceSlug}
          />

          <SortingSelect
            orderByOptions={options}
            onSortingChange={(orderBy, order) => setSorting([{ orderBy, order }])}
          />
        </div>
      </div>

      {!provincesResponse || !branchPaginationResponse || loading ? (
        <LoadingSection />
      ) : (
        <>
          <div className='grid grid-cols-3 gap-4'>
            {branchPaginationResponse.data.map((branch) => (
              <HotelCard
                key={branch.id}
                hotel={branch}
                onOpenChangeStatusDialog={() => openChangeStatus(branch)}
                onOpenDeleteDialog={() => openDelete(branch)}
                onOpenUpdateDialog={() => openUpdate(branch)}
              />
            ))}

            <Modal
              isOpen={openCreateUpdateDialog}
              onClose={closeCreateUpdate}
              title={selectedBranch ? 'Cập nhật khách sạn' : 'Tạo khách sạn mới'}
              className='min-w-[600px]'
              disableClickOutside
            >
              <HotelForm
                data={selectedBranch}
                onRequestSuccess={onRequestSuccess}
                provinces={provinceOptions}
                onCancel={closeCreateUpdate}
              />
            </Modal>
          </div>

          <div className='w-full mt-3 flex justify-center'>
            <PaginationComponent
              page={page}
              pageSize={6}
              total={branchPaginationResponse.meta.total!}
              onChangePage={setPage}
            />
          </div>
        </>
      )}

      <ConfirmDeleteDialog
        title='Xác nhận xóa khách sạn'
        openDeleteDialog={openDeleteDialog}
        closeDelete={closeDelete}
        onConfirmDelete={onConfirmDelete}
        deleteLoading={deleteLoading}
      >
        <p>{`Bạn có chắc chắn muốn xóa khách sạn ${selectedBranch?.name}?`}</p>
        <i>Xóa khách sạn sẽ đồng thời xóa các phòng thuộc khách sạn này</i>
      </ConfirmDeleteDialog>

      <ConfirmDeleteDialog
        title='Đổi trạng thái khách sạn'
        openDeleteDialog={openChangeStatusDialog}
        closeDelete={closeChangeStatus}
        deleteLoading={updateStatusLoading}
        onConfirmDelete={onConfirmChangeStatus}
        confirmText={selectedBranch?.is_active ? 'Tạm dừng' : 'Kích hoạt'}
      >
        <p>
          {`Bạn có chắc chắn muốn ${
            selectedBranch?.is_active ? 'tạm dừng' : 'kích hoạt'
          } khách sạn ${selectedBranch?.name}?`}
        </p>
      </ConfirmDeleteDialog>
    </div>
  );
};

export default HotelPage;
