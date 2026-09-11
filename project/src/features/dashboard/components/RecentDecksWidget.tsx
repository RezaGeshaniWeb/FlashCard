import Link from 'next/link';
import { Layers } from 'lucide-react';
import { ROUTES } from '@/constants';
import type { DeckWithCounts } from '@/types';
import { formatRelative } from '@/utils/dates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export interface RecentDecksWidgetProps {
  decks: DeckWithCounts[];
}

export function RecentDecksWidget({ decks }: RecentDecksWidgetProps) {
  const recent = decks.slice(0, 5);

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent decks</CardTitle>
        <Link
          href={ROUTES.DECKS}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            title="No decks yet"
            description="Create a deck to start studying."
            icon={<Layers className="h-6 w-6" aria-hidden />}
            className="border-0 py-8"
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((deck) => (
              <li key={deck.id}>
                <Link
                  href={ROUTES.DECK_DETAIL(deck.id)}
                  className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: deck.color }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {deck.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatRelative(deck.updatedAt)}
                    </p>
                  </div>
                  <Badge variant="neutral">{deck.cardCount} cards</Badge>
                  {deck.dueCount > 0 ? (
                    <Badge variant="warning">{deck.dueCount} due</Badge>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
