import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function JoinOrgPage() {
  const nav = useNavigate()
  const { refreshMembership } = useAuth()
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Join organization</h1>

        <div className='space-y-2'>
          <Label>One-time code</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {err && <p className='text-sm text-red-600'>{err}</p>}

        <Button
          type='button'
          className='w-full'
          disabled={loading}
          onClick={async () => {
            console.log('JOIN CLICKED', { code })

            setErr(null)
            setLoading(true)
            try {
              const clean = code.trim().toUpperCase()
              console.log('about to call rpc', clean)

              const res = await supabase.rpc('join_org_with_code', {
                p_code: clean,
              })
              console.log('rpc returned', res)

              if (res.error) throw res.error

              await refreshMembership()
              nav('/app', { replace: true })
            } catch (e: any) {
              console.error('join failed', e)
              setErr(e?.message ?? 'Failed to join')
            } finally {
              setLoading(false)
            }
          }}
        >
          Join
        </Button>
      </Card>
    </div>
  )
}
