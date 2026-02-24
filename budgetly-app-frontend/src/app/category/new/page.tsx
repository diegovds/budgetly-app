import { getAuthState } from '@/actions/get-auth-state'
import { NewCategory } from '@/components/category/new-category'
import { getCategoryTypes } from '@/http/api'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Nova categoria',
}

export default async function NewCategoryPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const categoryTypes = await getCategoryTypes()

  return (
    <div className="flex w-full items-center justify-center">
      <NewCategory categoryTypes={categoryTypes} />
    </div>
  )
}
