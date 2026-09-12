'use client';

import { Keyboard } from 'lucide-react';
import { useT } from '@/i18n';

export function KeyboardShortcuts() {
  const t = useT();

  const shortcuts = [
    { keys: 'Space', action: t('study.shortcutFlip') },
    { keys: '1–4', action: t('study.shortcutRate') },
    { keys: 'B', action: t('study.shortcutBookmark') },
  ] as const;

  return (
    <details className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-foreground">
        <Keyboard className="h-4 w-4 text-muted-foreground" aria-hidden />
        {t('study.shortcuts')}
      </summary>
      <ul className="mt-3 flex flex-col gap-2 text-muted-foreground">
        {shortcuts.map((item) => (
          <li key={item.keys} className="flex items-center justify-between gap-4">
            <span>{item.action}</span>
            <kbd className="rounded border border-border bg-card px-2 py-0.5 font-mono text-xs text-foreground">
              {item.keys}
            </kbd>
          </li>
        ))}
      </ul>
    </details>
  );
}
