import { GetCategoryTypes200Item } from '@/http/api'
import { create } from 'zustand'

type categoryTypesState = {
  categoryTypes: GetCategoryTypes200Item[] | []
  setCategoryTypes: (categoryTypes: GetCategoryTypes200Item[]) => void
  clearCategoryTypes: () => void
}

export const useCategoryTypesStore = create<categoryTypesState>((set) => ({
  categoryTypes: [],
  setCategoryTypes: (categoryTypes) => set({ categoryTypes }),
  clearCategoryTypes: () => set({ categoryTypes: [] }),
}))
