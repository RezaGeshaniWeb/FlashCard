import type { Metadata } from 'next';
import { StatisticsView } from '@/features/statistics/components/StatisticsView';

export const metadata: Metadata = {
  title: 'Statistics',
};

export default function StatisticsPage() {
  return <StatisticsView />;
}
