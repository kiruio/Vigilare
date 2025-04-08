import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CacheState {
  siteData: any
  changeSiteData: (val: any) => void
  removeSiteData: () => void
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set) => ({
      siteData: null,
      changeSiteData: (val) => set({ siteData: val }),
      removeSiteData: () => set({ siteData: null }),
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
)