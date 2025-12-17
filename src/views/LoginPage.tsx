import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any
  const from = loc.state?.from ?? '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Login</h1>

        <div className='space-y-2'>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@email.com'
          />
        </div>

        <div className='space-y-2'>
          <Label>Password</Label>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              await signIn(email, password)
              nav(from, { replace: true })
            } catch (e: any) {
              setErr(e.message ?? 'Login failed')
            } finally {
              setLoading(false)
            }
          }}
        >
          Sign in
        </Button>

        <div className='flex justify-between text-sm'>
          <Link
            className='underline'
            to='/register'
          >
            Create account
          </Link>
          <Link
            className='underline'
            to='/forgot-password'
          >
            Forgot password?
          </Link>
        </div>
      </Card>
    </div>
  )
}
