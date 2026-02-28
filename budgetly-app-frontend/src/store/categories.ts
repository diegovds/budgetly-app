import { GetCategory200CategoriesItem } from '@/http/api'
import { create } from 'zustand'

type CategoriesState = {
  categories: GetCategory200CategoriesItem[] | []
  setCategories: (categories: GetCategory200CategoriesItem[]) => void
  clearCategories: () => void
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  clearCategories: () => set({ categories: [] }),
}))
