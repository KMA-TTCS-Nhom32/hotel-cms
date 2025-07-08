import { NearBy } from '@ahomevilla-hotel/node-sdk';

export type BranchNearBys = {
  defaults: NearBy[];
  translations: {
    language: string;
    nearBy: NearBy[];
  }[];
};
