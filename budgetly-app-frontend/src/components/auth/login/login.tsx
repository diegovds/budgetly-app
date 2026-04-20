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
      {/* Branding panel */}
      <div className="from-primary/20 via-primary/10 to-background relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br p-8 lg:flex-1 lg:p-12">
        {/* Geometric decorations */}
        <div className="border-primary/20 absolute -top-12 -right-12 size-48 rounded-full border" />
        <div className="border-primary/10 absolute -top-6 -right-6 size-48 rounded-full border" />
        <div className="border-primary/10 absolute -bottom-16 -left-16 size-64 rounded-full border" />

        <div className="relative">
          <p className="text-primary mb-3 text-xs font-semibold uppercase tracking-widest">
            Bem-vindo de volta
          </p>
          <h1
            className="text-foreground mb-4 text-4xl leading-tight font-(family-name:--font-serif-display) md:text-5xl lg:text-6xl"
          >
            Garanta seu
            <br />
            <span className="text-primary">Futuro</span>
            <br />
            Financeiro
          </h1>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Acompanhe receitas, despesas e conquiste seus objetivos financeiros com clareza.
          </p>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3 lg:mt-0">
          {[
            { value: '100%', label: 'Controle total' },
            { value: '30s', label: 'Para começar' },
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
            <h2 className="text-2xl font-semibold">Acesse sua conta</h2>
            <p className="text-muted-foreground text-sm">
              Insira seus dados para continuar
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="nome@empresa.com"
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
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-center text-sm">
                  {error.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isSuccess}
              >
                {isPending ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
