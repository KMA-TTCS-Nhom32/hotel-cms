import { OccupancyRateResponseDto } from '@ahomevilla-hotel/node-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OccupancyChartProps {
  data: OccupancyRateResponseDto;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const ROOM_TYPE_LABELS = {
  STANDARD: 'Phòng Tiêu Chuẩn',
  SUPERIOR: 'Phòng Superior',
  DELUXE: 'Phòng Deluxe',
};

export function OccupancyChart({ data }: Readonly<OccupancyChartProps>) {
  const pieData = Object.entries(data.byRoomType).map(([type, rate]) => ({
    name: ROOM_TYPE_LABELS[type as keyof typeof ROOM_TYPE_LABELS],
    value: rate,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-lg border bg-background p-2 shadow-sm'>
          <div className='grid grid-cols-2 gap-2'>
            <span className='font-medium'>Loại phòng:</span>
            <span>{payload[0].name}</span>
            <span className='font-medium'>Tỉ lệ:</span>
            <span>{payload[0].value.toFixed(1)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỉ lệ lấp đầy theo loại phòng</CardTitle>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-muted-foreground'>
            Tỉ lệ lấp đầy trung bình: {data.rate.toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Pie Chart */}
          <div className='h-[400px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill='white'
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline='central'
                      >
                        {`${value.toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={150}
                  dataKey='value'
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className='grid gap-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-2xl font-bold'>{data.totalRooms}</div>
                <p className='text-xs text-muted-foreground'>Tổng số phòng</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-2xl font-bold'>{data.occupiedRooms}</div>
                <p className='text-xs text-muted-foreground'>Số phòng đã được đặt</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-2xl font-bold'>{data.rate.toFixed(1)}%</div>
                <p className='text-xs text-muted-foreground'>Tỉ lệ lấp đầy trung bình</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
