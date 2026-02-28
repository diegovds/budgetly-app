'use client'

import { GetCategory200CategoriesItem } from '@/http/api'
import { useCategoriesStore } from '@/store/categories'
import { useEffect } from 'react'

type Props = {
  categories: GetCategory200CategoriesItem[] | []
}

export const StoreCategories = ({ categories }: Props) => {
  const { setCategories } = useCategoriesStore()

  useEffect(() => {
    setCategories(categories)
  }, [setCategories, categories])

  return null
}
