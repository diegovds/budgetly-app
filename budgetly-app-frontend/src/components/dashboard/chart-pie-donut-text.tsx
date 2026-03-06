'use client'

import { Label, Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  const data = [
    ...chartData.categories.map((c, i) => ({
      ...c,
      category: `${c.category}:`,
      fill: `var(--chart-${i + 1})`,
    })),
    {
      category: 'Outras:',
      percentage: chartData.othersPercentage,
      fill: `var(--chart-5)`,
    },
  ]

  return (
    <Card className="flex w-full flex-1 flex-col p-4">
      <CardHeader className="items-center p-0">
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>
          Total de despesas: {formatCurrency(chartData.totalExpenses)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => `${Number(value).toFixed(2)}%`}
                />
              }
            />
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          className="fill-foreground text-base font-medium"
                        >
                          Despesas
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
      <CardFooter className="flex flex-col gap-4 p-0">
        {data.map((category, index) => (
          <div
            key={index}
            className="grid w-full grid-cols-2 text-xs font-semibold"
          >
            <div className="flex items-center gap-2 self-start">
              <div
                className={`size-3 rounded-full`}
                style={{ backgroundColor: category.fill }}
              />
              <p>{category.category.slice(0, -1)}</p>
            </div>
            <p className="text-end">{category.percentage.toFixed(2)}%</p>
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}
