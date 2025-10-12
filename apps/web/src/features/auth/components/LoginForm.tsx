import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { loginSchema, type LoginFormData } from '../../../lib/validations/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@fleet/ui-web'
import { Zap, ArrowRight, Shield, Sparkles, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err) {
      form.setError('root', {
        message: 'Invalid email or password',
      })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-sidebar rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fleet<span className="text-accent">Hub</span>
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to access your fleet management platform
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {form.formState.errors.root && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{form.formState.errors.root.message}</p>
                </div>
              )}

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@fleet.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-error text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-error text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2 mb-2">
              <Shield className="w-4 h-4 text-accent mt-0.5" />
              <p className="text-xs font-medium text-gray-700">Demo Credentials</p>
            </div>
            <div className="space-y-1 text-xs text-gray-600 ml-6">
              <p>admin@fleet.com / admin123</p>
              <p>manager@fleet.com / manager123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sidebar to-sidebar-dark items-center justify-center p-12">
        <div className="text-center text-white space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
            <Zap className="w-10 h-10" />
          </div>
          <h3 className="text-4xl font-bold">
            Manage Your Fleet<br />With Confidence
          </h3>
          <p className="text-sidebar-text-muted text-lg max-w-md">
            Real-time tracking, driver management, and analytics all in one powerful platform.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            {[
              { icon: Shield, label: 'Secure' },
              { icon: Zap, label: 'Fast' },
              { icon: Sparkles, label: 'Reliable' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <feature.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
