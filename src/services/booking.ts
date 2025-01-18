import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  Booking,
  BookingsPaginationResultDto,
  CreateBookingAtHotelDto,
  QueryBookingsDto,
  UpdateBookingStatusDto,
} from '@ahomevilla-hotel/node-sdk';

export const getBookingsService = (params: QueryBookingsDto) => {
  return privateRequest(request.get, API_PATH.BOOKINGS, {
    params,
  }) as Promise<BookingsPaginationResultDto>;
};

export const createBookingAtHotelService = (data: CreateBookingAtHotelDto) => {
  return privateRequest(request.post, API_PATH.BOOKINGS, {
    data,
  }) as Promise<Booking>;
};

export const updateBookingStatusService = (id: string, data: UpdateBookingStatusDto) => {
  return privateRequest(request.patch, `${API_PATH.BOOKINGS}/update-status/${id}`, {
    data,
  }) as Promise<Booking>;
};
