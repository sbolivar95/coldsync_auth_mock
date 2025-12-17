import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RegisterPage() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Create account</h1>

        <div className='space-y-2'>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
          />
        </div>

        <div className='space-y-2'>
          <Label>Password</Label>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
          />
        </div>

        {err && <p className='text-sm text-red-600'>{err}</p>}

        <Button
          className='w-full'
          disabled={loading}
          onClick={async () => {
            setErr(null)
            setLoading(true)
            try {
              await signUp(email, password)
              nav('/login', { replace: true })
            } catch (e: any) {
              setErr(e?.message ?? 'Sign up failed')
            } finally {
              setLoading(false)
            }
          }}
        >
          Create account
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
