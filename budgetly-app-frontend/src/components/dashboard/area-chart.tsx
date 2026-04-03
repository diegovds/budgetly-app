'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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
  getDashboardBalancelastmonths,
  GetDashboardBalancelastmonths200Item,
} from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'

const chartConfig = {
  accumulatedBalance: {
    label: 'Saldo:',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartArea() {
  const { data, isLoading } = useQuery<GetDashboardBalancelastmonths200Item[]>({
    queryKey: ['chart-area'],
    queryFn: () => getDashboardBalancelastmonths(),
  })

  return (
    <Card className="rounded p-4">
      <CardHeader className="px-0">
        <CardTitle>Evolução do Saldo</CardTitle>
        <CardDescription>Saldo dos últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent
        className={`px-0 ${isLoading ? 'bg-accent animate-pulse rounded' : ''}`}
      >
        <ChartContainer
          config={chartConfig}
          className="aspect-16/6 w-full md:aspect-16/3"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
            <Area
              dataKey="accumulatedBalance"
              type="monotone"
              fill="var(--color-accumulatedBalance)"
              fillOpacity={0.4}
              stroke="var(--color-accumulatedBalance)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
