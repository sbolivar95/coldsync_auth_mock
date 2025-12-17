import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { InviteCodeCard } from '@/components/InviteCodeCard'

export function AppHome() {
  const { user, membership, signOut } = useAuth()

  return (
    <div className='min-h-screen p-6 space-y-4 max-w-3xl mx-auto'>
      <Card className='p-6 space-y-2'>
        <h1 className='text-xl font-semibold'>Protected App</h1>
        <p className='text-sm'>Signed in as: {user?.email}</p>
        <p className='text-sm'>
          Org: <span className='font-mono'>{membership?.org_id}</span> — Role:{' '}
          <span className='font-semibold'>{membership?.role}</span>
        </p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </Card>

      <InviteCodeCard />
    </div>
  )
}
