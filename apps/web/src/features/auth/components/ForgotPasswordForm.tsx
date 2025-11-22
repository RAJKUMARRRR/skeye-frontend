import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import { z } from 'zod'
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
import { KeyRound, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const resetCodeSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
type ResetCodeFormData = z.infer<typeof resetCodeSchema>

export function ForgotPasswordForm() {
  const { signIn, setActive } = useSignIn()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [complete, setComplete] = useState(false)

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const resetForm = useForm<ResetCodeFormData>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: {
      code: '',
      newPassword: '',
    },
  })

  const onEmailSubmit = async (data: ForgotPasswordFormData) => {
    if (!signIn) return

    setIsLoading(true)
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      })
      setSuccessfulCreation(true)
      toast.success('Password reset code sent to your email')
    } catch (err: any) {
      console.error('Password reset error:', err)
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Failed to send reset code. Please try again.'
      emailForm.setError('root', {
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onResetSubmit = async (data: ResetCodeFormData) => {
    if (!signIn) return

    setIsLoading(true)
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.newPassword,
      })

      if (result.status === 'complete') {
        // Set the session as active
        await setActive({ session: result.createdSessionId })
        toast.success('Password reset successfully!')
        // Redirect to dashboard
        navigate('/')
      } else {
        console.log('Reset status:', result.status)
      }
    } catch (err: any) {
      console.error('Reset verification error:', err)
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Invalid code or password. Please try again.'
      resetForm.setError('root', {
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Success screen
  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Password Reset Successfully
          </h2>
          <p className="text-gray-600 mb-8">
            Your password has been changed. You can now sign in with your new password.
          </p>
          <Link to="/login">
            <Button className="w-full h-11">
              <span className="flex items-center justify-center gap-2">
                Back to Sign In
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Reset code and new password form
  if (successfulCreation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                <KeyRound className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-accent font-bold">Skeye</span>
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600">
              We sent a password reset code to your email address. Enter the code and your new password below.
            </p>
          </div>

          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
              {resetForm.formState.errors.root && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{resetForm.formState.errors.root.message}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Reset Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter the code from your email"
                  autoComplete="off"
                  autoFocus
                  {...resetForm.register('code')}
                />
                {resetForm.formState.errors.code && (
                  <p className="text-error text-xs">{resetForm.formState.errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  {...resetForm.register('newPassword')}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-error text-xs">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setSuccessfulCreation(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  // Email form
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
              <KeyRound className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-accent font-bold">Skeye</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot your password?
          </h2>
          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
            {emailForm.formState.errors.root && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{emailForm.formState.errors.root.message}</p>
              </div>
            )}

            <FormField
              control={emailForm.control}
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
                      autoComplete="email"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-error text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending code...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Reset Code
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
