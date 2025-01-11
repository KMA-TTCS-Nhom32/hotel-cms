import { create } from 'zustand';

export type BreadcrumbLinkItem = {
  label: string;
  to: string;
};

export type BreadcrumbStore = {
  breadcrumbs: BreadcrumbLinkItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbLinkItem[]) => void;
  onNavigate: (link: string, index: number, navigateFn: (link: string) => void) => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  onNavigate: (link, index, navigateFn) => {
    set((state) => ({ breadcrumbs: state.breadcrumbs.slice(0, index) }));
    navigateFn(link);
  },
}));
