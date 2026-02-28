import { GetAccountTypes200Item } from '@/http/api'
import { create } from 'zustand'

type AccountTypesState = {
  accountTypes: GetAccountTypes200Item[] | []
  setAccountTypes: (accountTypes: GetAccountTypes200Item[]) => void
  clearAccountTypes: () => void
}

export const useAccountTypesStore = create<AccountTypesState>((set) => ({
  accountTypes: [],
  setAccountTypes: (accountTypes) => set({ accountTypes }),
  clearAccountTypes: () => set({ accountTypes: [] }),
}))
