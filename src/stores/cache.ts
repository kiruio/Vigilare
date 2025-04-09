/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MonitorData } from '../utils/getSiteData';

interface Cache {
	data: MonitorData | null;
	timestamp: number;
}

interface CacheState {
	siteData: Cache;
	changeSiteData: (val: any) => void;
	removeSiteData: () => void;
}

export const useCacheStore = create<CacheState>()(
	persist(
		(set) => ({
			siteData: { data: null, timestamp: 0 },
			changeSiteData: (val) => set({ siteData: val }),
			removeSiteData: () => set({ siteData: { data: null, timestamp: 0 } }),
		}),
		{
			name: 'siteDataCache',
			storage: {
				getItem: (name) => JSON.parse(localStorage.getItem(name)!),
				setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name) => localStorage.removeItem(name),
			},
		}
	)
);
