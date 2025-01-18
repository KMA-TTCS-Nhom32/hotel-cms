import { RoomPerformanceDto } from '@ahomevilla-hotel/node-sdk';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon } from 'lucide-react';

interface RoomPerformanceTableProps {
  data: RoomPerformanceDto[];
}

const ROOM_TYPE_LABELS = {
  STANDARD: 'Phòng Tiêu Chuẩn',
  SUPERIOR: 'Phòng Superior',
  DELUXE: 'Phòng Deluxe',
};

export function RoomPerformanceTable({ data }: Readonly<RoomPerformanceTableProps>) {
  // Calculate averages for comparison
  const avgOccupancy = data.reduce((sum, room) => sum + room.average_occupancy, 0) / data.length;
  const avgRevenue = data.reduce((sum, room) => sum + room.total_revenue, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3Icon className='h-5 w-5' />
          Hiệu suất phòng
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-3 mb-6'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>{data.length}</div>
              <p className='text-xs text-muted-foreground'>Tổng số phòng</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>
                {formatCurrency(data.reduce((sum, room) => sum + room.total_revenue, 0))}
              </div>
              <p className='text-xs text-muted-foreground'>Tổng doanh thu</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>
                {(
                  data.reduce((sum, room) => sum + room.average_occupancy, 0) / data.length
                ).toFixed(1)}
                %
              </div>
              <p className='text-xs text-muted-foreground'>Tỉ lệ lấp đầy trung bình</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Table */}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phòng</TableHead>
                <TableHead>Loại phòng</TableHead>
                <TableHead className='text-right'>Số lượt đặt</TableHead>
                <TableHead className='text-right'>Doanh thu</TableHead>
                <TableHead className='text-right'>Tỉ lệ lấp đầy</TableHead>
                <TableHead className='text-right'>Tỉ lệ hủy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className='font-medium'>{room.name}</TableCell>
                  <TableCell>{ROOM_TYPE_LABELS[room.room_type]}</TableCell>
                  <TableCell className='text-right'>{room.bookings_count}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      {formatCurrency(room.total_revenue)}
                      {room.total_revenue > avgRevenue ? (
                        <ArrowUpIcon className='h-4 w-4 text-green-500' />
                      ) : (
                        <ArrowDownIcon className='h-4 w-4 text-red-500' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      {room.average_occupancy.toFixed(1)}%
                      {room.average_occupancy > avgOccupancy ? (
                        <ArrowUpIcon className='h-4 w-4 text-green-500' />
                      ) : (
                        <ArrowDownIcon className='h-4 w-4 text-red-500' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        room.cancellation_rate > 10
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {room.cancellation_rate.toFixed(1)}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
