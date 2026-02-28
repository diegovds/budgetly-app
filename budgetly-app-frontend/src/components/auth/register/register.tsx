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
    <div className="flex w-full flex-col-reverse gap-8 lg:flex-row">
      <div className="bg-accent flex flex-col items-center justify-center rounded-xl p-4 lg:min-w-lg">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-center text-2xl font-semibold md:text-left md:text-3xl">
              Criar conta
            </h2>
            <p className="text-muted-foreground text-center text-sm text-balance md:text-left lg:text-base">
              Preencha seus dados para começar a controlar suas finanças.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Nome completo
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ex: Maria Silva"
                          className="pr-10 text-xs md:text-base"
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
                    <FormLabel className="text-sm md:text-base">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="seu@email.com"
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

              <div className="grid items-start gap-4 sm:grid-cols-2">
                {/* Senha */}
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

                {/* Confirmar senha */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Confirmar senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pr-10 text-xs md:text-base"
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
                className="w-full text-xs md:text-sm"
                disabled={isPending || isSuccess}
              >
                Criar conta
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground text-center text-xs lg:text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-bold">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      <div className="from-accent via-primary to-background flex items-center justify-center rounded-xl bg-linear-to-br lg:flex-1">
        <div className="relative max-w-md rounded-xl bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-balance md:text-4xl">
            Alcance seus objetivos financeiros
          </h2>
          <p className="text-sm font-medium text-balance text-blue-100 md:text-base">
            O primeiro passo para a liberdade financeira é entender para onde
            seu dinheiro está indo.
          </p>
        </div>
      </div>
    </div>
  )
}
