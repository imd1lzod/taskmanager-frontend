import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { acceptInvitation, validateInvitation } from '../../../api/invitations.api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

type FormValues = { name: string; password: string; avatar?: string }

export default function AcceptInvitation() {
  const { token } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['validate-inv', token],
    queryFn: () => validateInvitation(token as string),
    enabled: !!token,
  })

  const { register, handleSubmit } = useForm<FormValues>()

  const mutation = useMutation({
    mutationFn: (v: FormValues) => acceptInvitation(token as string, v),
    onSuccess: () => navigate('/login')
  })

  if (isLoading) return <div className="p-6">Tekshirilmoqda...</div>
  if (isError) return <div className="p-6 text-red-600">Taklif yaroqsiz yoki muddati tugagan.</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Taklifni qabul qilish</CardTitle>
          <div className="text-sm text-gray-500">Email: {data?.data?.email}</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-3">
            <Input placeholder="Ism" required {...register('name')} />
            <Input placeholder="Parol" type="password" required {...register('password')} />
            <Input placeholder="Avatar URL (ixtiyoriy)" {...register('avatar')} />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>Ro'yxatdan o'tish</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


