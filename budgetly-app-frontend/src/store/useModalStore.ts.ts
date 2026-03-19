import {
  GetAccount200AccountsItem,
  GetCategory200CategoriesItem,
  GetTransactions200TransactionsItem,
} from '@/http/api';
import { create } from 'zustand';

type ModalData =
  | { type: 'transaction'; data: GetTransactions200TransactionsItem }
  | { type: 'category'; data: GetCategory200CategoriesItem }
  | { type: 'account'; data: GetAccount200AccountsItem }
  | null

interface ModalState {
  isOpen: boolean
  whoOpened: string
  element: ModalData
  setIsOpen: (isOpen: boolean) => void
  setWhoOpened: (whoOpened: string) => void
  setElement: (element: ModalData) => void
  toggleIsOpen: () => void
  toggleWhoOpened: () => void
  toggleElement: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  whoOpened: '',
  element: null,
  setIsOpen: (value) => set({ isOpen: value }),
  setWhoOpened: (value) => set({ whoOpened: value }),
  setElement: (value) => set({ element: value }),
  toggleIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleWhoOpened: () => set({ whoOpened: '' }),
  toggleElement: () => set({ element: null }),
}))
