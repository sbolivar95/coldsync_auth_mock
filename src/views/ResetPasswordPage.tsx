import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResetPasswordPage() {
  const nav = useNavigate()

  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // When user lands here from the email link, Supabase should establish a session.
    // We just check if we have one.
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setHasSession(!!data.session)
      setReady(true)
    })()
  }, [])

  const canSubmit =
    password.length >= 6 &&
    confirm.length >= 6 &&
    password === confirm &&
    !loading

  if (!ready) return null

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Set a new password</h1>

        {!hasSession && (
          <p className='text-sm text-red-600'>
            This reset link is invalid or expired. Please request a new reset
            email.
          </p>
        )}

        <div className='space-y-2'>
          <Label>New password</Label>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
            disabled={!hasSession}
          />
        </div>

        <div className='space-y-2'>
          <Label>Confirm new password</Label>
          <Input
            type='password'
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete='new-password'
            disabled={!hasSession}
          />
        </div>

        {password && confirm && password !== confirm && (
          <p className='text-sm text-red-600'>Passwords do not match.</p>
        )}

        {err && <p className='text-sm text-red-600'>{err}</p>}
        {msg && <p className='text-sm'>{msg}</p>}

        <Button
          className='w-full'
          disabled={!hasSession || !canSubmit}
          onClick={async () => {
            setErr(null)
            setMsg(null)
            setLoading(true)
            try {
              const { error } = await supabase.auth.updateUser({ password })
              if (error) throw error

              setMsg('Password updated. Redirecting to login...')
              // Optional: sign out so they re-login cleanly
              await supabase.auth.signOut()

              setTimeout(() => nav('/login', { replace: true }), 800)
            } catch (e: any) {
              setErr(e?.message ?? 'Failed to update password')
            } finally {
              setLoading(false)
            }
          }}
        >
          Update password
        </Button>

        <div className='text-sm flex justify-between'>
          <Link
            className='underline'
            to='/login'
          >
            Back to login
          </Link>
          <Link
            className='underline'
            to='/forgot-password'
          >
            Request new link
          </Link>
        </div>
      </Card>
    </div>
  )
}
