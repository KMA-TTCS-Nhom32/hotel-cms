import { AnalyticsSummaryDto } from '@ahomevilla-hotel/node-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type BookingStat = {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageStayDuration: number;
};

interface SummaryCardsProps {
  data?: AnalyticsSummaryDto;
}

export function SummaryCards({ data }: Readonly<SummaryCardsProps>) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(data?.revenue.totalRevenue ?? 0)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Occupancy Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{data?.occupancyRate.toFixed(1)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {(data?.bookingStats as BookingStat).totalBookings ?? 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Cancellation Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{data?.cancellationRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}

export const SummaryCardsSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Skeleton className='w-1/2 bg-gray-300 h-6' />
          </CardHeader>
          <CardContent>
            <Skeleton className='w-full bg-gray-300 h-10' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
