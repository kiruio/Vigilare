import { create } from 'zustand'

export interface StatusState {
  siteState: 'loading' | 'error' | 'allError' | 'normal' | 'wrong';
  siteOverview: {
    count: number;
    okCount: number;
    downCount: number;
  } | null;
  changeSiteState: (val: StatusState['siteState']) => void;
  changeSiteOverview: (val: StatusState['siteOverview']) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  siteState: 'loading',
  siteOverview: null,
  changeSiteState: (val) => set({ siteState: val }),
  changeSiteOverview: (val) => set({ siteOverview: val }),
}))