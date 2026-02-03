'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Informe seu nome completo'),
    email: z.email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate, isPending, error, isSuccess } = useAuthMutation()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: RegisterFormData) {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <>
      {/* FORM SIDE */}
      <section className="bg-background flex w-full flex-1 items-center">
        <div className="w-full max-w-md space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
            <p className="text-muted-foreground">
              Preencha seus dados para começar a controlar suas finanças.
            </p>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ex: Maria Silva"
                          className="pr-10"
                          {...field}
                        />
                        <User className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="pr-10"
                          {...field}
                        />
                        <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid items-start gap-4 sm:grid-cols-2">
                {/* Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pr-10"
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

                {/* Confirmar senha */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pr-10"
                            {...field}
                          />
                          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isSuccess}
              >
                Criar conta
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground text-center text-sm">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </section>

      {/* BRAND / MARKETING SIDE */}
      <section className="from-primary relative hidden items-center justify-center overflow-hidden bg-linear-to-br via-blue-600 to-blue-800 lg:flex lg:flex-1">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-sm">
          <div className="mb-6 inline-flex rounded-full bg-white/20 p-4">
            📈
          </div>
          <h2 className="mb-4 text-2xl font-bold">
            Alcance seus objetivos financeiros
          </h2>
          <p className="text-lg text-blue-100">
            O primeiro passo para a liberdade financeira é entender para onde
            seu dinheiro está indo.
          </p>
          <div className="mt-6 text-sm text-blue-100">
            🔒 Dados criptografados e seguros
          </div>
        </div>
      </section>
    </>
  )
}
