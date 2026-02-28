'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthMutation } from '@/hooks/useAuthMutation'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate, isPending, error, isSuccess } = useAuthMutation()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: LoginFormData) {
    mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row">
      <div className="flex flex-col justify-center space-y-4 lg:flex-1">
        <h1 className="text-center text-2xl font-bold text-balance md:text-5xl lg:text-left">
          Garanta seu Futuro Financeiro
        </h1>
        <p className="text-muted-foreground text-center text-sm font-medium text-balance md:text-base lg:text-left">
          Faça login para acessar suas finanças e alcançar seus objetivos
        </p>
      </div>

      <div className="bg-accent flex flex-col items-center justify-center rounded-xl p-4 lg:min-w-lg">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-center text-2xl font-semibold md:text-left md:text-3xl">
              Acesse sua conta
            </h2>
            <p className="text-muted-foreground text-center text-sm md:text-left lg:text-base">
              Insira seus dados para continuar
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-xl border p-4"
            >
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="nome@empresa.com"
                          className="pr-10 text-xs md:text-base"
                          {...field}
                        />
                        <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pr-10 text-xs md:text-base"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-xs md:text-sm"
                disabled={isPending || isSuccess}
              >
                Entrar
              </Button>
            </form>
          </Form>

          <div className="text-muted-foreground text-center text-xs lg:text-sm">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary font-bold">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
