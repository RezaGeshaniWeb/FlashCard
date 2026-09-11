'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import type { UserSettings } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';

export interface ThemeSettingsProps {
  settings: UserSettings;
  onUpdate: (patch: Partial<UserSettings>) => void;
  isSaving?: boolean;
}

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export function ThemeSettings({
  settings,
  onUpdate,
  isSaving = false,
}: ThemeSettingsProps) {
  const { setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance & locale</CardTitle>
        <CardDescription>
          Theme, language, timezone, and daily review goal.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Theme"
          options={THEME_OPTIONS}
          value={settings.theme}
          disabled={isSaving}
          onChange={(e) => {
            const theme = e.target.value as UserSettings['theme'];
            setTheme(theme);
            onUpdate({ theme });
          }}
        />
        <Select
          label="Language"
          options={LANGUAGE_OPTIONS}
          value={settings.language}
          disabled={isSaving}
          onChange={(e) => onUpdate({ language: e.target.value })}
        />
        <Select
          label="Timezone"
          options={Array.from(
            new Set([
              settings.timezone,
              'UTC',
              'America/New_York',
              'Europe/London',
              'Asia/Tehran',
            ]),
          ).map((tz) => ({ value: tz, label: tz }))}
          value={settings.timezone}
          disabled={isSaving}
          onChange={(e) => onUpdate({ timezone: e.target.value })}
        />
        <Select
          label="Daily goal (cards)"
          options={[10, 20, 30, 50, 100].map((n) => ({
            value: String(n),
            label: String(n),
          }))}
          value={String(settings.dailyGoal)}
          disabled={isSaving}
          onChange={(e) => onUpdate({ dailyGoal: Number(e.target.value) })}
        />
      </CardContent>
    </Card>
  );
}
