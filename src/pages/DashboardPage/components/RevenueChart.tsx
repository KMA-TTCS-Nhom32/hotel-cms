import { useMemo } from 'react';
import { RevenueTimelineDto } from '@ahomevilla-hotel/node-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueChartProps {
  data: RevenueTimelineDto;
}

export function RevenueChart({ data }: Readonly<RevenueChartProps>) {
  const chartData = useMemo(() => {
    return data
      ? Object.entries(data.monthlyRevenue).map(([month, revenue]) => ({
          month,
          revenue,
        }))
      : [];
  }, [data]);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-lg border bg-background p-2 shadow-sm'>
          <div className='grid grid-cols-2 gap-2'>
            <span className='font-medium'>Tháng:</span>
            <span>{label}</span>
            <span className='font-medium'>Doanh thu:</span>
            <span>{formatCurrency(payload[0].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-muted-foreground'>
            Tổng doanh thu: {formatCurrency(data?.totalRevenue ?? 0)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year}`;
                }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                label={{
                  value: 'Doanh thu (VND)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey='revenue' fill='#8884d8' name='Doanh thu' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Distribution */}
        <div className='mt-6'>
          <h4 className='mb-4 text-sm font-medium'>Phân bố theo loại phòng</h4>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {data?.byRoomType.map((type) => (
              <Card key={type.roomType}>
                <CardContent className='p-4'>
                  <div className='text-sm font-medium'>{type.roomType}</div>
                  <div className='mt-1 text-2xl font-bold'>{formatCurrency(type.revenue)}</div>
                  <div className='mt-1 text-xs text-muted-foreground'>
                    {type.bookingsCount} đặt phòng • {type.percentageOfTotal.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
