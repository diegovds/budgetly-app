'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  getDashboardLastmonthsincomeexpense,
  GetDashboardLastmonthsincomeexpense200Item,
} from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'

const chartConfig = {
  income: {
    label: 'Receitas:',
    color: 'var(--chart-1)',
  },
  expense: {
    label: 'Despesas:',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function ChartBar() {
  const { data, isLoading } = useQuery<
    GetDashboardLastmonthsincomeexpense200Item[]
  >({
    queryKey: ['chart-bar'],
    queryFn: () => getDashboardLastmonthsincomeexpense(),
  })

  return (
    <Card className="w-full flex-2 rounded p-4">
      <CardHeader className="px-0">
        <CardTitle>Receitas vs Despesas</CardTitle>

        <CardDescription
          className={`${isLoading ? 'bg-accent w-fit animate-pulse rounded text-transparent' : ''}`}
        >
          {data ? (
            <>
              {data[0].monthLabel} {data[0].year} -{' '}
              {data[data.length - 1].monthLabel} {data[data.length - 1].year}
            </>
          ) : (
            'Nov 2025 - Abr 2026'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent
        className={`px-0 ${isLoading ? 'bg-accent animate-pulse rounded' : ''}`}
      >
        <ChartContainer
          config={chartConfig}
          className={`aspect-16/8 w-full md:aspect-16/5 ${isLoading ? 'invisible' : ''}`}
        >
          <BarChart
            accessibilityLayer
            data={data}
            key={isLoading ? 'loading' : 'loaded'}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
