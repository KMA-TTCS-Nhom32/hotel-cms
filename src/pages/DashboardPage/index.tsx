import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { SummaryCards, SummaryCardsSkeleton } from './components/SummaryCards';
import { CalendarDateRangePicker } from './components/DateRangePicker';
import { RevenueChart } from './components/RevenueChart';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  getOccupancyService,
  getRevenueService,
  getRoomPerformanceService,
  getSummaryService,
} from '@/services/analytics';
import { getBranchesService } from '@/services/branches';
import { BasicSelect } from '@/components/Common/BasicSelect';
import LoadingSection from '@/components/Common/LoadingSection';
import { Text } from '@/components/ui/text';
import { OccupancyChart } from './components/OccupancyChart';
import { RoomPerformanceTable } from './components/RoomPerformanceTable';

const DashboardPage = () => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [branchId, setBranchId] = useState<string | undefined>();

  const { data: branchOptions, loading } = useRequest(
    () => {
      return getBranchesService({
        pageSize: 100,
      }).then(({ data }) => data.map((branch) => ({ label: branch.name, value: branch.id })));
    },
    {
      onSuccess: (data) => {
        if (data.length > 0) {
          setBranchId(data[0].value);
        }
      },
      onError: () => {
        toast.error('Lỗi khi lấy dữ liệu khách sạn');
      },
    },
  );

  const { data: summaryData, loading: getSummaryLoading } = useRequest(
    () => {
      if (!branchId || !date) return Promise.resolve(undefined);

      return getSummaryService({
        branchId,
        startDate: date?.from?.toISOString(),
        endDate: date?.to?.toISOString(),
        periodType: 'MONTHLY',
      });
    },
    {
      refreshDeps: [branchId, date],
    },
  );

  const { data: revenueData, loading: loadingRevenue } = useRequest(
    () => getRevenueService({ branchId }),
    {
      refreshDeps: [branchId],
    },
  );

  const { data: occupancyData, loading: loadingOccupancy } = useRequest(
    () => getOccupancyService({ branchId }),
    {
      refreshDeps: [branchId],
    },
  );

  const { data: roomPerformanceData, loading: loadingRoomPerformance } = useRequest(
    () => {
      if (!branchId || !date) return Promise.resolve(undefined);
      return getRoomPerformanceService({
        branchId,
        startDate: date?.from?.toISOString(),
        endDate: date?.to?.toISOString(),
      });
    },
    {
      refreshDeps: [branchId, date],
    },
  );

  return loading ? (
    <LoadingSection />
  ) : (
    <div className='w-full flex flex-col gap-4 p-6'>
      {/* Header with branch selection if needed */}
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>Phân tích - Thống kê</h2>

        {/* Branch selector would go here if needed */}
      </div>

      {/* Date Range and Period Type Selection */}
      <div className='flex items-center gap-4'>
        <BasicSelect
          options={branchOptions ?? []}
          defaultValue={branchOptions?.[0]?.value}
          onValueChange={(value) => setBranchId(value)}
          placeholder='Chọn khách sạn'
          className='max-w-none w-1/3'
        />
        <CalendarDateRangePicker dateRange={date} setDateRange={setDate} className='h-10' />
      </div>

      {/* Summary Cards */}
      {getSummaryLoading ? (
        <SummaryCardsSkeleton />
      ) : (
        <>{summaryData && <SummaryCards data={summaryData} />}</>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue='revenue' className='w-full'>
        <TabsList className='grid grid-cols-3 gap-4 !h-auto py-1.5 px-1.5 rounded-md'>
          <TabsTrigger value='revenue'>
            <Text type='title1-semi-bold'>Doanh thu</Text>
          </TabsTrigger>
          <TabsTrigger value='occupancy'>
            <Text type='title1-semi-bold'>Tỉ lệ lấp đầy</Text>
          </TabsTrigger>
          <TabsTrigger value='rooms'>
            <Text type='title1-semi-bold'>Hiệu suất phòng</Text>
          </TabsTrigger>
        </TabsList>

        {(loadingRevenue || loadingOccupancy || loadingRoomPerformance) && <LoadingSection />}

        {/* Revenue Tab Content */}
        {revenueData && (
          <TabsContent value='revenue'>
            <div className='grid gap-4'>
              <Card className='p-4'>
                <RevenueChart data={revenueData} />
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Occupancy Tab Content */}
        {occupancyData && (
          <TabsContent value='occupancy'>
            <div className='grid gap-4'>
              <Card className='p-4'>
                <OccupancyChart data={occupancyData} />
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Room Performance Tab Content */}
        {roomPerformanceData && (
          <TabsContent value='rooms'>
            <RoomPerformanceTable data={roomPerformanceData} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardPage;
