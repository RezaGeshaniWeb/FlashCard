'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import type { UserSettings } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useLocale, useT, type Locale } from '@/i18n';

export interface ThemeSettingsProps {
  settings: UserSettings;
  onUpdate: (patch: Partial<UserSettings>) => void;
  isSaving?: boolean;
}

export function ThemeSettings({
  settings,
  onUpdate,
  isSaving = false,
}: ThemeSettingsProps) {
  const { setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const t = useT();

  const themeOptions = [
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
    { value: 'system', label: t('settings.themeSystem') },
  ];

  const languageOptions = [
    { value: 'en', label: t('settings.langEn') },
    { value: 'fa', label: t('settings.langFa') },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.appearanceTitle')}</CardTitle>
        <CardDescription>{t('settings.appearanceDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t('settings.theme')}
          options={themeOptions}
          value={settings.theme}
          disabled={isSaving}
          onChange={(e) => {
            const theme = e.target.value as UserSettings['theme'];
            setTheme(theme);
            onUpdate({ theme });
          }}
        />
        <Select
          label={t('settings.language')}
          options={languageOptions}
          value={locale}
          disabled={isSaving}
          onChange={(e) => {
            const language = e.target.value as Locale;
            setLocale(language);
            onUpdate({ language });
          }}
        />
        <Select
          label={t('settings.timezone')}
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
          label={t('settings.dailyGoal')}
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
