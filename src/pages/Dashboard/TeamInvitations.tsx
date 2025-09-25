// removed unused useEffect
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listInvitations, sendInvitation } from '../../../api/invitations.api'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

type FormValues = { email: string }

const statusToStyle: Record<string, string> = {
  PENDING: 'bg-gray-200 text-gray-800',
  ACCEPTED: 'bg-green-200 text-green-800',
  EXPIRED: 'bg-red-200 text-red-800',
}

export default function TeamInvitations() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['invitations'],
    queryFn: listInvitations,
  })

  const mutation = useMutation({
    mutationFn: (email: string) => sendInvitation(email),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
    }
  })

  const onSubmit = (values: FormValues) => mutation.mutate(values.email)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yangi taklif yuborish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <Input type="email" placeholder="email@example.com" required {...register('email')} />
            <Button type="submit" disabled={mutation.isPending}>Taklif yuborish</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yuborilgan takliflar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Yuklanmoqda...</div>
          ) : (
            <div className="space-y-3">
              {data?.length ? data.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                  <div className="space-y-1">
                    <div className="font-medium">{inv.email}</div>
                    <div className="text-xs text-gray-500">Muddati: {new Date(inv.expiresAt).toLocaleString()}</div>
                  </div>
                  <Badge className={statusToStyle[inv.status]}>{inv.status}</Badge>
                </div>
              )) : (
                <div className="text-sm text-gray-500">Hozircha takliflar yo'q</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


