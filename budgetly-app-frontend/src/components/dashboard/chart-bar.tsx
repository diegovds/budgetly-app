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
import { GetDashboardLastmonthsincomeexpense200Item } from '@/http/api'
import { formatCurrency } from '@/utils/format'

type ChartBarProps = {
  chartData: GetDashboardLastmonthsincomeexpense200Item[]
}

const chartConfig = {
  income: {
    label: 'Receitas',
    color: 'var(--chart-1)',
  },
  expense: {
    label: 'Despesas',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function ChartBar({ chartData }: ChartBarProps) {
  return (
    <Card className="flex-2 p-4">
      <CardHeader className="px-0">
        <CardTitle>Receitas vs Despesas</CardTitle>
        <CardDescription>
          {chartData[0].monthLabel} {chartData[0].year} -{' '}
          {chartData[chartData.length - 1].monthLabel}{' '}
          {chartData[chartData.length - 1].year}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-16/8 w-full md:aspect-16/6"
        >
          <BarChart accessibilityLayer data={chartData}>
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
                  indicator="dashed"
                  formatter={(value, name) => {
                    const formatted = formatCurrency(Number(value))

                    if (name === 'income') {
                      return ['Receita: ', formatted]
                    }

                    if (name === 'expense') {
                      return ['Despesa: ', formatted]
                    }

                    return [name, formatted]
                  }}
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
