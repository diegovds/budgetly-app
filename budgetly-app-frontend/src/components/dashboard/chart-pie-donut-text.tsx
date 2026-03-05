'use client'

import { Cell, Label, Pie, PieChart } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { GetDashboardGettopexpensecategories200 } from '@/http/api'
import { formatCurrency } from '@/utils/format'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--chart-3)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

type ChartPieDonutTextProps = {
  chartData: GetDashboardGettopexpensecategories200
}

export function ChartPieDonutText({ chartData }: ChartPieDonutTextProps) {
  return (
    <Card className="flex flex-1 flex-col p-4">
      <CardHeader className="items-center p-0">
        <CardTitle>Gastos por categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => `${value}%`}
            />
            <Pie
              data={[
                ...chartData.categories,
                { category: 'Outros', percentage: chartData.othersPercentage },
              ]}
              dataKey="percentage"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.categories.map((_, index) => (
                <Cell key={index} fill={`var(--chart-${index + 1})`} />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {formatCurrency(chartData.totalExpenses)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Despesas
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
