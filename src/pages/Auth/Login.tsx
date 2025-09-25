import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { login, clearError } from '../../store/slices/authSlice'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Eye, EyeOff, Loader2, User, Lock, Facebook, Twitter } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login({ email: data.email, password: data.password })).unwrap()
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
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kirish</h1>
          </div>

          {/* Form Card */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800">Xush kelibsiz</CardTitle>
              <p className="text-gray-600 mt-2">Hisobingizga kirish uchun tizimga kiring</p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {/* Email Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Emailni kiriting"
                      className="pl-10 h-12 border-gray-300 rounded-lg"
                      {...register('email', {
                        required: 'Email kiritilishi shart',
                        pattern: {
                          value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                          message: 'Yaroqli email kiriting'
                        }
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
                      {...register('password', {
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

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Meni eslab qol
                  </Label>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Kirilmoqda...
                    </>
                  ) : (
                    'Kirish'
                  )}
                </Button>

                {/* Social Login */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Yoki, quyidagi orqali kirish</p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full border-2 hover:bg-blue-50"
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full border-2 hover:bg-red-50"
                    >
                      <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">G</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full border-2 hover:bg-gray-50"
                    >
                      <Twitter className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hisobingiz yo'qmi?{' '}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={handleClearError}
                    >
                      Ro'yxatdan o'ting
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Illustration */}
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
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-purple-600" />
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
                
                {/* Credit card illustration */}
                <div className="w-20 h-12 bg-blue-500 rounded-lg mx-auto relative">
                  <div className="absolute inset-1 bg-white rounded-md flex items-center justify-center">
                    <div className="w-12 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
