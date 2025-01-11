import { API_PATH } from '@/api/constant';
import { privateRequest, request } from '@/api/request';
import {
  Branch,
  BranchDetail,
  BranchesPaginationResultDto,
  CreateBranchDto,
  QueryBranchesDto,
  UpdateBranchDto,
} from '@ahomevilla-hotel/node-sdk';

export const getBranchesService = (params: QueryBranchesDto) => {
  return privateRequest(request.get, API_PATH.BRANCHES, {
    params,
  }) as Promise<BranchesPaginationResultDto>;
};

export const getBranchDetailService = (idOrSlug: string) => {
  return request.get<BranchDetail>(`${API_PATH.BRANCHES}/${idOrSlug}`);
};

export const createBranchService = (data: CreateBranchDto) => {
  return privateRequest(request.post, API_PATH.BRANCHES, {
    data,
  }) as Promise<Branch>;
};

export const updateBranchService = (id: string, data: UpdateBranchDto) => {
  return privateRequest(request.patch, `${API_PATH.BRANCHES}/${id}`, {
    data,
  }) as Promise<Branch>;
};

export const deleteBranchService = (id: string) => {
  return privateRequest(request.delete, `${API_PATH.BRANCHES}/${id}`);
};

export const restoreBranchService = (id: string) => {
  return privateRequest(request.post, `${API_PATH.BRANCHES}/${id}/restore`);
};

export const getDeletedBranchesService = () => {
  return privateRequest(request.get, `${API_PATH.BRANCHES}/deleted`) as Promise<Branch[]>;
};
