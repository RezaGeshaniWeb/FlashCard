import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

export interface AccuracyWidgetProps {
  accuracy: number;
}

export function AccuracyWidget({ accuracy }: AccuracyWidgetProps) {
  const percent = Math.round(accuracy * (accuracy <= 1 ? 100 : 1));

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Accuracy
        </CardTitle>
        <Target className="h-4 w-4 text-success" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl font-semibold tabular-nums text-foreground">
          {percent}%
        </p>
        <Progress
          value={percent}
          label="Overall recall"
          showValue
          variant={percent >= 70 ? 'success' : percent >= 40 ? 'warning' : 'danger'}
        />
      </CardContent>
    </Card>
  );
}
