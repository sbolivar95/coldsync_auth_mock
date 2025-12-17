import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function EnsureOrgAfterLogin({
  children,
}: {
  children: React.ReactNode
}) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    ;(async () => {
      const pending = localStorage.getItem('pending_org_name')
      const { data } = await supabase.auth.getSession()

      if (pending && data.session) {
        const { error } = await supabase.rpc(
          'create_org_and_owner_membership',
          { org_name: pending }
        )
        if (!error) localStorage.removeItem('pending_org_name')
      }
      setDone(true)
    })()
  }, [])

  if (!done) return null
  return <>{children}</>
}
