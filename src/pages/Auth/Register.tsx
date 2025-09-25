import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { register as registerThunk, clearError } from '../../store/slices/authSlice'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react'

interface RegisterFormData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerThunk({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      })).unwrap()
      navigate('/')
    } catch (error) {
      // Error is handled by Redux
    }
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-8">
        <div className="relative">
          {/* Background shapes */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-300 rounded-full opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-indigo-300 rounded-full opacity-50"></div>
          
          {/* Main illustration */}
          <div className="relative z-10">
            <div className="w-80 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-200">
              <div className="text-center">
                {/* Person illustration */}
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                {/* Phone illustration */}
                <div className="w-16 h-24 bg-blue-600 rounded-2xl mx-auto mb-4 relative">
                  <div className="w-full h-full bg-white rounded-xl m-1 flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Documents illustration */}
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-10 bg-blue-500 rounded-lg"></div>
                  <div className="w-8 h-10 bg-green-500 rounded-lg"></div>
                  <div className="w-8 h-10 bg-purple-500 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ro'yxatdan o'tish</h1>
          </div>

          {/* Form Card */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800">Hisob yaratish</CardTitle>
              <p className="text-gray-600 mt-2">Bizga qo'shiling va vazifalaringizni samarali boshqaring</p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {/* First Name Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Ismni kiriting"
                      className="pl-10 h-12 border-gray-300 rounded-lg"
                      {...formRegister('firstName', {
                        required: 'Ism kiritilishi shart',
                        minLength: {
                          value: 2,
                          message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Familiyani kiriting"
                      className="pl-10 h-12 border-gray-300 rounded-lg"
                      {...formRegister('lastName', {
                        required: 'Familiya kiritilishi shart',
                        minLength: {
                          value: 2,
                          message: 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Foydalanuvchi nomini kiriting"
                      className="pl-10 h-12 border-gray-300 rounded-lg"
                      {...formRegister('username', {
                        required: 'Foydalanuvchi nomi kiritilishi shart',
                        minLength: {
                          value: 3,
                          message: 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email manzilini kiriting"
                      className="pl-10 h-12 border-gray-300 rounded-lg"
                      {...formRegister('email', {
                        required: 'Email kiritilishi shart',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Noto\'g\'ri email manzil',
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Parolni kiriting"
                      className="pl-10 pr-10 h-12 border-gray-300 rounded-lg"
                      {...formRegister('password', {
                        required: 'Parol kiritilishi shart',
                        minLength: {
                          value: 6,
                          message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
                        },
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Parolni tasdiqlang"
                      className="pl-10 pr-10 h-12 border-gray-300 rounded-lg"
                      {...formRegister('confirmPassword', {
                        required: 'Parolni tasdiqlang',
                        validate: (value) =>
                          value === password || 'Parollar mos kelmaydi',
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
Men barcha shartlarga rozi bo'laman
                  </Label>
                </div>

                {/* Register Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={isLoading || !agreeToTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Hisob yaratilmoqda...
                    </>
                  ) : (
                    'Ro\'yxatdan o\'tish'
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hisobingiz bormi?{' '}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={handleClearError}
                    >
                      Kirish
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
