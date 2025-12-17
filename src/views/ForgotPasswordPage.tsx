import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordPage() {
  const { sendResetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Reset password</h1>

        <div className='space-y-2'>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@email.com'
          />
        </div>

        {err && <p className='text-sm text-red-600'>{err}</p>}
        {msg && <p className='text-sm'>{msg}</p>}

        <Button
          className='w-full'
          onClick={async () => {
            setErr(null)
            setMsg(null)
            try {
              await sendResetPassword(email)
              setMsg('If that email exists, you’ll receive a reset link.')
            } catch (e: any) {
              setErr(e.message ?? 'Failed')
            }
          }}
        >
          Send reset link
        </Button>

        <div className='text-sm'>
          <Link
            className='underline'
            to='/login'
          >
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  )
}
