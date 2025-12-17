import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Country = { id: number; name: string }

export function CreateOrgPage() {
  const nav = useNavigate()
  const { refreshMembership } = useAuth()

  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)

  const [comercialName, setComercialName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [city, setCity] = useState('')
  const [countryId, setCountryId] = useState<number | null>(null)

  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setCountriesLoading(true)
      const { data } = await supabase
        .from('countries')
        .select('id, name')
        .order('name')
      setCountries((data ?? []) as Country[])
      setCountriesLoading(false)
    })()
  }, [])

  const canSubmit = useMemo(
    () => comercialName.trim() && legalName.trim() && countryId && !loading,
    [comercialName, legalName, countryId, loading]
  )

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <Card className='w-full max-w-md p-6 space-y-4'>
        <h1 className='text-xl font-semibold'>Create organization</h1>

        <div className='space-y-2'>
          <Label>Commercial name</Label>
          <Input
            value={comercialName}
            onChange={(e) => setComercialName(e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>Legal name</Label>
          <Input
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>City (optional)</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>Base country</Label>
          <Select
            value={countryId ? String(countryId) : ''}
            onValueChange={(v) => setCountryId(Number(v))}
            disabled={countriesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  countriesLoading ? 'Loading...' : 'Select a country'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem
                  key={c.id}
                  value={String(c.id)}
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {err && <p className='text-sm text-red-600'>{err}</p>}

        <Button
          className='w-full'
          disabled={!canSubmit}
          onClick={async () => {
            setErr(null)
            setLoading(true)
            try {
              const { error } = await supabase.rpc(
                'create_org_and_owner_membership',
                {
                  p_comercial_name: comercialName.trim(),
                  p_legal_name: legalName.trim(),
                  p_base_country_id: countryId!,
                  p_city: city.trim() ? city.trim() : null,
                }
              )
              if (error) throw error

              await refreshMembership()
              nav('/app', { replace: true })
            } catch (e: any) {
              setErr(e?.message ?? 'Failed to create organization')
            } finally {
              setLoading(false)
            }
          }}
        >
          Create
        </Button>

        <div className='text-sm'>
          <Link
            className='underline'
            to='/onboarding'
          >
            Back
          </Link>
        </div>
      </Card>
    </div>
  )
}
