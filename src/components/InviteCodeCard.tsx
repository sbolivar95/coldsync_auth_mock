import { useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type RoleOption = 'DRIVER' | 'STAFF' | 'ADMIN' | 'OWNER'

export function InviteCodeCard() {
  const { membership } = useAuth()

  const isOwner = membership?.role === 'OWNER'
  const orgId = membership?.org_id ?? null

  const [minutes, setMinutes] = useState<number>(60)
  const [role, setRole] = useState<RoleOption>('STAFF')

  const [code, setCode] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const canGenerate = useMemo(() => {
    return (
      !!orgId && isOwner && minutes >= 5 && minutes <= 7 * 24 * 60 && !loading
    )
  }, [orgId, isOwner, minutes, loading])

  if (!membership) return null

  return (
    <Card className='p-6 space-y-4'>
      <div className='space-y-1'>
        <h2 className='text-base font-semibold'>Invite a teammate</h2>
        <p className='text-sm opacity-80'>
          Generates a one-time code. The code can be used once before it
          expires.
        </p>
      </div>

      <div className='text-sm'>
        <div className='opacity-80'>Org ID</div>
        <div className='font-mono break-all'>{orgId}</div>
      </div>

      {!isOwner ? (
        <p className='text-sm opacity-80'>
          Only <span className='font-semibold'>OWNER</span> can generate invite
          codes.
        </p>
      ) : (
        <>
          <div className='grid gap-3'>
            <div className='space-y-2'>
              <Label>Expires in (minutes)</Label>
              <Input
                type='number'
                min={5}
                max={10080}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
              <p className='text-xs opacity-70'>Min 5, max 10080 (7 days).</p>
            </div>

            <div className='space-y-2'>
              <Label>Role for the join</Label>
              <div className='flex gap-2'>
                {(['ADMIN', 'STAFF', 'DRIVER'] as RoleOption[]).map((r) => (
                  <Button
                    key={r}
                    type='button'
                    variant={role === r ? 'default' : 'outline'}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {err && <p className='text-sm text-red-600'>{err}</p>}

          <Button
            className='w-full'
            disabled={!canGenerate}
            onClick={async () => {
              setErr(null)
              setCode(null)
              setLoading(true)

              try {
                const { data, error } = await supabase.rpc(
                  'create_one_time_join_code',
                  {
                    p_org_id: orgId,
                    p_role: role,
                    p_expires_in_minutes: minutes,
                  }
                )

                if (error) throw error

                // RPC returns text
                setCode(String(data))
              } catch (e: any) {
                setErr(e?.message ?? 'Failed to generate code')
              } finally {
                setLoading(false)
              }
            }}
          >
            Generate one-time code
          </Button>

          {code && (
            <div className='rounded-lg border p-4 space-y-2'>
              <div className='text-sm opacity-80'>Invite code</div>
              <div className='flex items-center gap-2'>
                <div className='font-mono text-lg tracking-widest'>{code}</div>
                <Button
                  type='button'
                  variant='outline'
                  onClick={async () => {
                    await navigator.clipboard.writeText(code)
                  }}
                >
                  Copy
                </Button>
              </div>
              <p className='text-xs opacity-70'>
                Expires in {minutes} minutes. Use it once at{' '}
                <span className='font-mono'>/onboarding/join</span>.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
