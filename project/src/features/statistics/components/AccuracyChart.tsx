'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyActivity } from '@/types';
import { formatDate } from '@/utils/dates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useT } from '@/i18n';

export interface AccuracyChartProps {
  activity: DailyActivity[];
}

export function AccuracyChart({ activity }: AccuracyChartProps) {
  const t = useT();
  const data = activity.slice(-14).map((d) => ({
    date: formatDate(d.date, 'MMM d'),
    accuracy: Math.round(d.accuracy * (d.accuracy <= 1 ? 100 : 1)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics.accuracyTrend')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title={t('statistics.noAccuracyData')}
            description={t('statistics.accuracyHint')}
            className="border-0 py-10"
          />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value}%`,
                    t('statistics.accuracy'),
                  ]}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="accuracy"
                  fill="var(--success)"
                  radius={[4, 4, 0, 0]}
                  name={t('statistics.accuracy')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
