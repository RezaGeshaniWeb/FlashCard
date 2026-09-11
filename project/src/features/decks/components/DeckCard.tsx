'use client';

import Link from 'next/link';
import {
  Archive,
  Copy,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/ui/Dropdown';
import { ROUTES } from '@/constants';
import {
  useArchiveDeck,
  useDeleteDeck,
  useDuplicateDeck,
  useFavoriteDeck,
} from '@/features/decks/hooks/useDecks';
import type { DeckWithCounts } from '@/types';
import { cn } from '@/utils/cn';

export interface DeckCardProps {
  deck: DeckWithCounts;
  onEdit: (deck: DeckWithCounts) => void;
}

export function DeckCard({ deck, onEdit }: DeckCardProps) {
  const favorite = useFavoriteDeck();
  const archive = useArchiveDeck();
  const duplicate = useDuplicateDeck();
  const remove = useDeleteDeck();

  const busy =
    favorite.isPending ||
    archive.isPending ||
    duplicate.isPending ||
    remove.isPending;

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="relative pb-2">
        <div
          className="absolute top-0 left-0 h-1 w-full rounded-t-lg"
          style={{ backgroundColor: deck.color }}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-2 pt-1">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">
              <Link
                href={ROUTES.DECK_DETAIL(deck.id)}
                className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {deck.title}
              </Link>
            </CardTitle>
            {deck.description ? (
              <CardDescription className="mt-1 line-clamp-2">
                {deck.description}
              </CardDescription>
            ) : null}
          </div>
          <Dropdown>
            <DropdownTrigger aria-label={`Actions for ${deck.title}`}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                <MoreVertical className="h-4 w-4" aria-hidden />
              </span>
            </DropdownTrigger>
            <DropdownMenu align="end">
              <DropdownItem onSelect={() => onEdit(deck)} disabled={busy}>
                <Pencil className="mr-2 h-4 w-4" aria-hidden />
                Edit
              </DropdownItem>
              <DropdownItem
                onSelect={() =>
                  favorite.mutate({
                    id: deck.id,
                    isFavorite: !deck.isFavorite,
                  })
                }
                disabled={busy}
              >
                <Star className="mr-2 h-4 w-4" aria-hidden />
                {deck.isFavorite ? 'Unfavorite' : 'Favorite'}
              </DropdownItem>
              <DropdownItem
                onSelect={() => duplicate.mutate(deck.id)}
                disabled={busy}
              >
                <Copy className="mr-2 h-4 w-4" aria-hidden />
                Duplicate
              </DropdownItem>
              <DropdownItem
                onSelect={() => archive.mutate(deck.id)}
                disabled={busy}
              >
                <Archive className="mr-2 h-4 w-4" aria-hidden />
                {deck.isArchived ? 'Unarchive' : 'Archive'}
              </DropdownItem>
              <DropdownItem
                danger
                onSelect={() => {
                  if (
                    window.confirm(
                      `Delete “${deck.title}”? This cannot be undone.`,
                    )
                  ) {
                    remove.mutate(deck.id);
                  }
                }}
                disabled={busy}
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{deck.cardCount} cards</Badge>
          <Badge variant={deck.dueCount > 0 ? 'warning' : 'success'}>
            {deck.dueCount} due
          </Badge>
          {deck.isFavorite ? <Badge variant="default">Favorite</Badge> : null}
          {deck.isArchived ? <Badge variant="outline">Archived</Badge> : null}
        </div>
        {deck.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {deck.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link
          href={ROUTES.DECK_DETAIL(deck.id)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
        >
          Open deck
        </Link>
      </CardFooter>
    </Card>
  );
}
