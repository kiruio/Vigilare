/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { ProcessedData } from '../model';

interface StatusState {
	siteState: 'loading' | 'error' | 'allError' | 'normal' | 'wrong';
	siteOverview: {
		count: number;
		okCount: number;
		downCount: number;
	} | null;
	siteDatas: ProcessedData[] | null;
	changeSiteDatas: (val: StatusState['siteDatas']) => void;
	changeSiteState: (val: StatusState['siteState']) => void;
	changeSiteOverview: (val: StatusState['siteOverview']) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
	siteState: 'loading',
	siteOverview: null,
	siteDatas: null,
	changeSiteDatas: (val) => set({ siteDatas: val }),
	changeSiteState: (val) => set({ siteState: val }),
	changeSiteOverview: (val) => set({ siteOverview: val }),
}));
