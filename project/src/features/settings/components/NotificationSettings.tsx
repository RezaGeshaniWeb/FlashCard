'use client';

import type { UserSettings } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { useT } from '@/i18n';

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
  const t = useT();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notificationsTitle')}</CardTitle>
        <CardDescription>
          {t('settings.notificationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Switch
          checked={settings.notificationsEnabled}
          disabled={isSaving}
          onCheckedChange={(checked) =>
            onUpdate({ notificationsEnabled: checked })
          }
          label={t('settings.enableNotifications')}
          description={t('settings.enableNotificationsDesc')}
        />
      </CardContent>
    </Card>
  );
}
