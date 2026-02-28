'use client'

import { GetCategoryTypes200Item } from '@/http/api'
import { useCategoryTypesStore } from '@/store/category-type'
import { useEffect } from 'react'

type Props = {
  categoryTypes: GetCategoryTypes200Item[] | []
}

export const StoreCategoryTypes = ({ categoryTypes }: Props) => {
  const { setCategoryTypes } = useCategoryTypesStore()

  useEffect(() => {
    setCategoryTypes(categoryTypes)
  }, [setCategoryTypes, categoryTypes])

  return null
}
