'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    console.log('Login values:', values)
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm pb-16">
      <h1 className="mb-2 text-3xl font-bold text-primary">Login</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your email below to login to your account.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full font-medium bg-[#064E3B] hover:bg-[#064E3B]/80">
            Login
          </Button>
        </form>
      </Form>
    </div>
  )
}
