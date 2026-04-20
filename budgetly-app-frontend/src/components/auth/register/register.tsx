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
    <div className="flex w-full flex-col gap-8 lg:flex-row">
      {/* Branding panel */}
      <div className="from-primary/20 via-primary/10 to-background relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br p-8 lg:flex-1 lg:p-12">
        <div className="border-primary/20 absolute -top-12 -right-12 size-48 rounded-full border" />
        <div className="border-primary/10 absolute -top-6 -right-6 size-48 rounded-full border" />
        <div className="border-primary/10 absolute -bottom-16 -left-16 size-64 rounded-full border" />

        <div className="relative">
          <p className="text-primary mb-3 text-xs font-semibold uppercase tracking-widest">
            Crie sua conta grátis
          </p>
          <h1 className="text-foreground mb-4 text-4xl leading-tight font-(family-name:--font-serif-display) md:text-5xl lg:text-6xl">
            Controle
            <br />
            suas <span className="text-primary">Finanças</span>
            <br />
            com clareza
          </h1>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            O primeiro passo para a liberdade financeira é entender para onde seu dinheiro está indo.
          </p>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3 lg:mt-0">
          {[
            { value: 'Grátis', label: 'Para sempre' },
            { value: '2 min', label: 'Para configurar' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/40 rounded-xl border border-white/5 p-4 backdrop-blur-sm">
              <p className="text-primary text-2xl font-semibold">{stat.value}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="bg-card flex flex-col items-center justify-center rounded-2xl p-6 lg:min-w-sm lg:p-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Criar conta</h2>
            <p className="text-muted-foreground text-sm">
              Preencha seus dados para começar.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Nome completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ex: Maria Silva"
                          className="pr-10"
                          {...field}
                        />
                        <User className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="pr-10"
                          {...field}
                        />
                        <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid items-start gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Senha</FormLabel>
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
                            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Confirmar senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pr-10"
                            {...field}
                          />
                          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-center text-sm">
                  {error.message}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isPending || isSuccess}>
                {isPending ? 'Criando...' : 'Criar conta'}
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
