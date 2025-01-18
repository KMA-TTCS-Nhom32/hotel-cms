import { useState } from 'react';
import { toast } from 'sonner';

import { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  FilterUserDto,
  SortUserDto,
  User,
  UserIdentifierTypeEnum,
  UserRoleEnum,
} from '@ahomevilla-hotel/node-sdk';
import { useDebounce, useRequest } from 'ahooks';
import { getUsersService } from '@/services/user';
import { DialogCustom } from '@/components/Common/CustomDialog';
import { DefaultPaging } from '@/lib/constants';
import {
  DataTable,
  DataTableColumnHeaderSecondary,
  DataTableRowActions,
} from '@/components/ui/data-table';
import { Text } from '@/components/ui/text';
import SearchBar from '@/components/Common/SearchBar';
import { getBranchesService } from '@/services/branches';
import { BasicSelect } from '@/components/Common/BasicSelect';
import { UpdateUserForm } from './UpdateUserForm';
import { BlockUserForm } from './BlockUserForm';

const getContactDisplay = (user: User, type: 'email' | 'phone'): string => {
  if (type === 'email') {
    if (!user.email) return 'Chưa có';
    const isVerified = user.identifier_type === UserIdentifierTypeEnum.Email && user.verified_email;
    return user.email + (!isVerified ? ' (Chưa xác thực)' : '');
  }

  if (!user.phone) return 'Chưa có';
  const isVerified = user.identifier_type === UserIdentifierTypeEnum.Phone && user.verified_phone;
  return user.phone + (!isVerified ? ' (Chưa xác thực)' : '');
};

const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlocked, setIsBlocked] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [branchId, setBranchId] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<UserRoleEnum[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, {
    wait: 500,
  });

  const updateDialog = DialogCustom.useDialog();
  const deleteDialog = DialogCustom.useDialog();
  const blockDialog = DialogCustom.useDialog();

  const {
    data: amenitiesPaginationResponse,
    loading,
    refresh,
  } = useRequest(
    () => {
      return getUsersService({
        page,
        pageSize: DefaultPaging.pageSize,
        filters: JSON.stringify({
          keyword: searchTerm,
          branchId,
          //   is_blocked: isBlocked,
          //   roles: roles as unknown as FilterUserDtoRolesEnum,
        } as FilterUserDto),
        sort: JSON.stringify(
          sorting.map((sort) => {
            return {
              orderBy: sort.id,
              order: sort.desc ? 'desc' : 'asc',
            } as SortUserDto;
          }),
        ),
      });
    },
    {
      refreshDeps: [debouncedSearchTerm, page, sorting, isBlocked, branchId, roles],
      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu');
      },
    },
  );

  const { data: getBranchResponse } = useRequest(() =>
    getBranchesService({
      pageSize: 100,
    }),
  );

  const branchOptions = getBranchResponse?.data
    ? getBranchResponse.data.map((branch) => ({
        label: branch.name,
        value: branch.id,
      }))
    : [];

  const openUpdate = (user: User) => {
    setSelectedUser(user);
    updateDialog.open();
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    deleteDialog.open();
  };

  const openBlock = (user: User) => {
    setSelectedUser(user);
    blockDialog.open();
  };

  const closeDialog = (type: 'update' | 'delete' | 'block') => {
    setSelectedUser(null);
    switch (type) {
      case 'update':
        updateDialog.close();
        break;
      case 'delete':
        deleteDialog.close();
        break;
      case 'block':
        blockDialog.close();
        break;
      default:
        break;
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'order',
      header: () => null,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Tên' />,
      cell: ({ row }) => <Text type='title1-semi-bold'>{row.original.name}</Text>,
      sortingFn: 'textCaseSensitive',
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Email' />,
      cell: ({ row }) => <Text type='body1'>{getContactDisplay(row.original, 'email')}</Text>,
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;

        // Handle cases where either email is null - put them at the top
        if (!a.email && !b.email) return 0;
        if (!a.email) return -1; // Changed from 1 to -1 to put null emails first
        if (!b.email) return 1; // Changed from -1 to 1 to put null emails first

        // First compare verification status
        const aVerified = a.identifier_type === UserIdentifierTypeEnum.Email && a.verified_email;
        const bVerified = b.identifier_type === UserIdentifierTypeEnum.Email && b.verified_email;

        if (aVerified && !bVerified) return -1;
        if (!aVerified && bVerified) return 1;

        // If verification status is the same, compare emails
        return a.email.localeCompare(b.email);
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='SĐT' />,
      cell: ({ row }) => <Text type='body1'>{getContactDisplay(row.original, 'phone')}</Text>,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Vai trò' />,
      accessorFn: (row) => row.role,
      cell: (role) => (
        <Text type='body1' className='capitalize'>
          {String(role.getValue())}
        </Text>
      ),
      sortingFn: 'text',
    },
    {
      accessorKey: 'working_at',
      header: ({ column }) => (
        <DataTableColumnHeaderSecondary column={column} title='Làm việc tại' />
      ),
      meta: {
        align: 'center',
      },
      accessorFn: (row) => row.working_at?.name ?? '',
      cell: (workingAt) => (
        <Text type='body1' className='max-w-[200px]'>
          {String(workingAt.getValue())}
        </Text>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.working_at?.name ?? '';
        const b = rowB.original.working_at?.name ?? '';

        return a.localeCompare(b);
      },
    },
    {
      accessorKey: '_count.bookings',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Đã đặt' />,
    },
    {
      accessorKey: 'is_blocked',
      header: ({ column }) => <DataTableColumnHeaderSecondary column={column} title='Trạng thái' />,
      cell: ({ row }) => <Text type='body1'>{row.original.is_blocked ? 'Bị chặn' : ''}</Text>,
      sortingFn: 'basic',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onUpdate={openUpdate}
          onDelete={openDelete}
          extraActions={[
            {
              title: row.original.is_blocked ? 'Bỏ chặn' : 'Chặn',
              onClick: () => openBlock(row.original),
            },
          ]}
        />
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
        extraLeft={
          <>
            <SearchBar
              placeholder='Tên người dùng...'
              value={searchTerm}
              onChange={setSearchTerm}
              className='min-w-[200px]'
            />
            <BasicSelect
              defaultValue={branchId}
              options={branchOptions}
              placeholder='Chọn Chi nhánh làm việc'
              onValueChange={setBranchId}
              className='min-w-[220px]'
            />
            <BasicSelect
              placeholder='Chọn vai trò'
              options={[
                { label: 'Admin', value: UserRoleEnum.Admin },
                { label: 'Nhân viên', value: UserRoleEnum.Staff },
                { label: 'Khách hàng', value: UserRoleEnum.User },
              ]}
              onValueChange={(value) => setRoles([value as UserRoleEnum])}
            />
          </>
        }
        viewOptions={[
          {
            id: 'name',
            title: 'Tên',
          },
          {
            id: 'email',
            title: 'Email',
          },
          {
            id: 'phone',
            title: 'SĐT',
          },
          {
            id: 'role',
            title: 'Vai trò',
          },
          {
            id: '_count.bookings',
            title: 'Đã đặt',
          },
          {
            id: 'is_blocked',
            title: 'Trạng thái',
          },
        ]}
      />

      <DialogCustom dialog={updateDialog} header='Cập nhật Quyền hạn'>
        {selectedUser && (
          <UpdateUserForm
            data={selectedUser}
            branchOptions={branchOptions}
            onRequestSuccess={refresh}
            onCancelDialog={() => closeDialog('update')}
          />
        )}
      </DialogCustom>

      <DialogCustom
        dialog={blockDialog}
        header={`${selectedUser?.is_blocked ? 'Bỏ chặn' : 'Chặn'} người dùng`}
      >
        {selectedUser && (
          <BlockUserForm
            data={selectedUser}
            onRequestSuccess={() => {
              refresh();
              closeDialog('block');
            }}
            onCancelDialog={() => closeDialog('block')}
          />
        )}
      </DialogCustom>
    </div>
  );
};

export default UserPage;
