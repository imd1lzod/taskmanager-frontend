import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { updateProfile } from '../../store/slices/authSlice'
import { UpdateProfileData } from '../../types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { Save, User, Palette } from 'lucide-react'

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || undefined,
    },
  })

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      await dispatch(updateProfile(data)).unwrap()
    } catch (error) {
      // Error is handled by Redux
    }
  }

  const handlePickAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Faqat rasm fayllari (JPG, PNG, GIF) ruxsat etiladi.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Rasm hajmi 2MB dan katta bo\'lmasligi kerak.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setAvatarPreview(base64)
      setValue('avatar', base64, { shouldDirty: true })
    }
    reader.readAsDataURL(file)
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you would update the theme here
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-600 mt-2">
          Hisob sozlamalari va imkoniyatlarni boshqaring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="mr-2 h-6 w-6 text-blue-600" />
                Profil Ma'lumotlari
              </CardTitle>
              <CardDescription className="text-gray-600">
                Shaxsiy ma'lumotlaringiz va profil tafsilotlarini yangilang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {user?.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <Button variant="outline" size="sm" type="button" onClick={handlePickAvatar}>
                      Avatar O'zgartirish
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG yoki GIF. Maksimal hajm 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">To'liq Ism</Label>
                    <Input
                      id="name"
                      {...register('name', {
                        required: 'Ism kiritilishi shart',
                        minLength: {
                          value: 2,
                          message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Manzil</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email kiritilishi shart',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Noto\'g\'ri email manzil',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Palette className="mr-2 h-6 w-6 text-purple-600" />
                Ko'rinish
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ilovaning ko'rinishi va hissiyotini sozlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Qorong'u Rejim</Label>
                  <p className="text-sm text-muted-foreground">
                    Yorug' va qorong'u mavzular o'rtasida almashtiring
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base">Mavzu Rangi</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    O'zingizga yoqadigan aksent rangni tanlang
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      'bg-blue-500',
                      'bg-green-500',
                      'bg-purple-500',
                      'bg-red-500',
                      'bg-yellow-500',
                      'bg-pink-500',
                    ].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${color} ring-2 ring-offset-2 ring-primary`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hisob</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">A'zo bo'lgan vaqti</p>
                <p className="text-muted-foreground">
                  {user ? new Date().toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Oxirgi yangilanish</p>
                <p className="text-muted-foreground">
                  {user ? new Date().toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imkoniyatlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email xabarnomalari</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ish stoli xabarnomalari</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avtomatik saqlash</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
