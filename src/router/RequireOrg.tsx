import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/auth'

export function RequireOrg() {
  const { membership, membershipLoading } = useAuth()
  if (membershipLoading) return null
  if (!membership)
    return (
      <Navigate
        to='/onboarding'
        replace
      />
    )
  return <Outlet />
}
