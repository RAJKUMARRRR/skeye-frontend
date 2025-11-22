import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { registerSchema, type RegisterFormData } from '../../../lib/validations/auth'
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
import { Zap, ArrowRight, Shield, Sparkles, AlertCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'

export function SignUpForm() {
  const { signUp, setActive } = useSignUp()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues:{
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleGoogleSignUp = async () => {
    if (!signUp) return

    setIsGoogleLoading(true)
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin + '/',
      })
    } catch (err: any) {
      console.error('Google sign-up error:', err)
      toast.error('Failed to sign up with Google')
      setIsGoogleLoading(false)
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    if (!signUp) return

    setIsLoading(true)
    try {
      // Split name into first and last name
      const nameParts = data.name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName,
        lastName,
      })

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
      toast.success('Verification code sent to your email')
    } catch (err: any) {
      console.error('Sign-up error:', err)
      const errorMessage = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Failed to create account'
      form.setError('root', {
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp || !verificationCode) return

    setIsLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Account created successfully!')
        navigate('/')
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      toast.error(err?.errors?.[0]?.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  // If pending verification, show verification form
  if (pendingVerification) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-accent font-bold">Skeye</span>
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify your email
              </h2>
              <p className="text-gray-600">
                We sent a verification code to <span className="font-medium">{form.getValues('email')}</span>
              </p>
            </div>

            <form onSubmit={handleVerification} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verify & Continue
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })
                    toast.success('New code sent!')
                  } catch (err) {
                    toast.error('Failed to resend code')
                  }
                }}
                className="w-full text-sm text-accent hover:text-accent-600 font-medium"
              >
                Resend code
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Feature Image/Gradient */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-dark items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

          <div className="text-center text-white space-y-6 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-2xl backdrop-blur-sm mb-4 border border-accent/30">
              <Mail className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-4xl font-bold">
              Almost There!
            </h3>
            <p className="text-gray-400 text-lg max-w-md">
              Check your inbox for the verification code to complete your registration.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-accent font-bold">Skeye</span>
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Start managing your fleet with confidence
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-error text-xs" />
                    </FormItem>
                  )}
                />

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
                          placeholder="you@example.com"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">
                        Confirm Password
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className="w-full h-11 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Redirecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:text-accent-600 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Side - Feature Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-dark items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="text-center text-white space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-2xl backdrop-blur-sm mb-4 border border-accent/30">
            <Zap className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-4xl font-bold">
            Join Thousands of<br /><span className="text-accent">Fleet Managers</span>
          </h3>
          <p className="text-gray-400 text-lg max-w-md">
            Get started with real-time tracking, driver management, and powerful analytics.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            {[
              { icon: Shield, label: 'Secure' },
              { icon: Zap, label: 'Fast' },
              { icon: Sparkles, label: 'Reliable' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
