'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';

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
        <CardTitle>Accessibility</CardTitle>
        <CardDescription>
          Motion, text size, and contrast preferences (stored locally).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Switch
          checked={prefs.reducedMotion}
          onCheckedChange={(v) => update({ reducedMotion: v })}
          label="Reduce motion"
          description="Minimize animations and transitions"
        />
        <Switch
          checked={prefs.largeText}
          onCheckedChange={(v) => update({ largeText: v })}
          label="Larger text"
          description="Increase base font size"
        />
        <Switch
          checked={prefs.highContrast}
          onCheckedChange={(v) => update({ highContrast: v })}
          label="High contrast"
          description="Strengthen borders and text contrast"
        />
        <Select
          label="Keyboard focus"
          options={[
            { value: 'default', label: 'Default focus ring' },
            { value: 'strong', label: 'Strong focus ring' },
          ]}
          value="default"
          onChange={() => undefined}
          hint="Focus rings are always visible for keyboard users"
        />
      </CardContent>
    </Card>
  );
}
