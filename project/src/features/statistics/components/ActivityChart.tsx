'use client';

import {
  Area,
  AreaChart,
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

export interface ActivityChartProps {
  activity: DailyActivity[];
}

export function ActivityChart({ activity }: ActivityChartProps) {
  const t = useT();
  const data = activity.slice(-30).map((d) => ({
    date: formatDate(d.date, 'MMM d'),
    reviews: d.reviews,
    minutes: d.studyMinutes,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics.dailyActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title={t('statistics.noActivityData')}
            description={t('statistics.activityHint')}
            className="border-0 py-10"
          />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="reviewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reviews"
                  stroke="var(--primary)"
                  fill="url(#reviewsFill)"
                  strokeWidth={2}
                  name={t('statistics.reviews')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
