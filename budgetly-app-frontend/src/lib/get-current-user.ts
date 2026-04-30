import { getUser } from '@/http/api'
import { cache } from 'react'

export const getCurrentUser = cache(getUser)
