'use client';

import type { UserSettings } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';

export interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdate: (patch: Partial<UserSettings>) => void;
  isSaving?: boolean;
}

export function NotificationSettings({
  settings,
  onUpdate,
  isSaving = false,
}: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Reminders for reviews, goals, and achievements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Switch
          checked={settings.notificationsEnabled}
          disabled={isSaving}
          onCheckedChange={(checked) =>
            onUpdate({ notificationsEnabled: checked })
          }
          label="Enable notifications"
          description="Daily review reminders and goal alerts"
        />
      </CardContent>
    </Card>
  );
}
