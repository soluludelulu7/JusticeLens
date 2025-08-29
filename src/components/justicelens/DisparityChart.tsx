"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// NOTE: This component uses mock data for demonstration purposes.
// The `detectBias` AI flow returns a text summary, not structured data for charting.
// In a real-world application, you would parse the summary or adjust the AI flow to get structured data.
const mockData = [
  { group: 'Group A', sentenceLength: 4.5, color: "var(--color-chart-1)" },
  { group: 'Group B', sentenceLength: 7.2, color: "var(--color-chart-2)" },
  { group: 'Group C', sentenceLength: 4.8, color: "var(--color-chart-1)" },
  { group: 'Group D', sentenceLength: 6.9, color: "var(--color-chart-2)" },
];

export function DisparityChart() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Sentencing Disparities</CardTitle>
        <CardDescription>Average sentence length by demographic group (mock data).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="group" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis unit=" yrs" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                        contentStyle={{
                            background: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        }}
                    />
                    <Bar dataKey="sentenceLength" name="Avg. Sentence" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
