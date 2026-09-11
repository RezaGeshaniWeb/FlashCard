import { Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { keys: 'Space', action: 'Flip card' },
  { keys: '1–4', action: 'Rate Again / Hard / Good / Easy' },
  { keys: 'B', action: 'Bookmark' },
] as const;

export function KeyboardShortcuts() {
  return (
    <details className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-foreground">
        <Keyboard className="h-4 w-4 text-muted-foreground" aria-hidden />
        Keyboard shortcuts
      </summary>
      <ul className="mt-3 flex flex-col gap-2 text-muted-foreground">
        {SHORTCUTS.map((item) => (
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
