import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  AnalyticsSummaryDto,
  GetAnalyticsQueryDto,
  OccupancyRateResponseDto,
  RevenueTimelineDto,
  RoomPerformanceDto,
} from '@ahomevilla-hotel/node-sdk';

export const getSummaryService = (params: GetAnalyticsQueryDto) => {
  return privateRequest(request.get, `${API_PATH.ANALYTICS}/summary`, {
    params,
  }) as Promise<AnalyticsSummaryDto>;
};

export const getRevenueService = (params: GetAnalyticsQueryDto) => {
  return privateRequest(request.get, `${API_PATH.ANALYTICS}/revenue`, {
    params,
  }) as Promise<RevenueTimelineDto>;
};

export const getOccupancyService = (params: GetAnalyticsQueryDto) => {
  return privateRequest(request.get, `${API_PATH.ANALYTICS}/occupancy`, {
    params,
  }) as Promise<OccupancyRateResponseDto>;
};

export const getRoomPerformanceService = (params: GetAnalyticsQueryDto) => {
  return privateRequest(request.get, `${API_PATH.ANALYTICS}/room-performance`, {
    params,
  }) as Promise<RoomPerformanceDto[]>;
};
