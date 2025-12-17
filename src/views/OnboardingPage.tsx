import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function OnboardingPage() {
  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Welcome</h1>
        <p className='text-sm opacity-80'>
          You’re logged in, but you don’t belong to an organization yet.
        </p>

        <div className='grid gap-2'>
          <Button
            asChild
            className='w-full'
          >
            <Link to='/onboarding/create'>Create organization</Link>
          </Button>
          <Button
            asChild
            variant='outline'
            className='w-full'
          >
            <Link to='/onboarding/join'>Join with code</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
