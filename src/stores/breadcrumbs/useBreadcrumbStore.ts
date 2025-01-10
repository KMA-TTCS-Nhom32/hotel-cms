import { create } from 'zustand';

export type BreadcrumbLinkItem = {
  label: string;
  to: string;
};

export type BreadcrumbStore = {
  breadcrumbs: BreadcrumbLinkItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbLinkItem[]) => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
