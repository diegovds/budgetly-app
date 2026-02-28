import { GetAccount200AccountsItem } from '@/http/api'
import { create } from 'zustand'

type AccountsState = {
  accounts: GetAccount200AccountsItem[] | []
  setAccounts: (accounts: GetAccount200AccountsItem[]) => void
  clearAccounts: () => void
}

export const useAccountsStore = create<AccountsState>((set) => ({
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  clearAccounts: () => set({ accounts: [] }),
}))
