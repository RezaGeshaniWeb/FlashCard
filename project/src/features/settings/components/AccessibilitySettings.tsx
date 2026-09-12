'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { useT } from '@/i18n';

const STORAGE_KEY = 'flashmaster_a11y';

interface A11yPrefs {
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
}

const DEFAULTS: A11yPrefs = {
  reducedMotion: false,
  largeText: false,
  highContrast: false,
};

function loadPrefs(): A11yPrefs {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as A11yPrefs) };
  } catch {
    return DEFAULTS;
  }
}

function applyPrefs(prefs: A11yPrefs) {
  const root = document.documentElement;
  root.classList.toggle('reduce-motion', prefs.reducedMotion);
  root.classList.toggle('large-text', prefs.largeText);
  root.classList.toggle('high-contrast', prefs.highContrast);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function AccessibilitySettings() {
  const t = useT();
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULTS);

  useEffect(() => {
    const loaded = loadPrefs();
    applyPrefs(loaded);
    // Hydrate after mount to avoid SSR/localStorage mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client localStorage hydrate
    setPrefs(loaded);
  }, []);

  const update = (patch: Partial<A11yPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      applyPrefs(next);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.a11yTitle')}</CardTitle>
        <CardDescription>{t('settings.a11yDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Switch
          checked={prefs.reducedMotion}
          onCheckedChange={(v) => update({ reducedMotion: v })}
          label={t('settings.reduceMotion')}
          description={t('settings.reduceMotionDesc')}
        />
        <Switch
          checked={prefs.largeText}
          onCheckedChange={(v) => update({ largeText: v })}
          label={t('settings.largerText')}
          description={t('settings.largerTextDesc')}
        />
        <Switch
          checked={prefs.highContrast}
          onCheckedChange={(v) => update({ highContrast: v })}
          label={t('settings.highContrast')}
          description={t('settings.highContrastDesc')}
        />
        <Select
          label={t('settings.keyboardFocus')}
          options={[
            { value: 'default', label: t('settings.focusDefault') },
            { value: 'strong', label: t('settings.focusStrong') },
          ]}
          value="default"
          onChange={() => undefined}
          hint={t('settings.focusHint')}
        />
      </CardContent>
    </Card>
  );
}
