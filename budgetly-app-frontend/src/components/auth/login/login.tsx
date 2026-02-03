'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  remember: z.boolean().optional(),
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
      remember: false,
    },
  })

  function onSubmit(data: LoginFormData) {
    mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <>
      {/* LEFT / DESKTOP */}
      <div className="relative hidden flex-col justify-between bg-slate-900 text-white lg:flex lg:flex-1">
        <div className="relative z-10 px-12 py-10 text-xl font-bold">
          FinanceManager
        </div>

        <div className="relative z-10 max-w-xl px-12 py-20">
          <h1 className="mb-6 text-5xl font-black">
            Garanta seu Futuro Financeiro
          </h1>
          <p className="text-lg text-slate-300">
            Gerencie seu patrimônio com confiança e controle total.
          </p>
        </div>
      </div>

      {/* RIGHT / FORM */}
      <div className="bg-background flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Acesse sua conta
            </h2>
            <p className="text-muted-foreground text-sm">
              Insira seus dados para continuar
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="nome@empresa.com"
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

              {/* PASSWORD */}
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

              {/* OPTIONS */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Manter-me conectado
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="#"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={isPending || isSuccess}
              >
                Entrar
              </Button>
            </form>
          </Form>

          <div className="text-muted-foreground text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary font-bold">
              Criar conta
            </Link>
          </div>

          <p className="text-muted-foreground text-center text-xs">
            © 2024 FinanceManager. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </>
  )
}
