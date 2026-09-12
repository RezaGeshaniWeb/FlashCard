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
import { useT } from '@/i18n';
import type { DeckWithCounts } from '@/types';
import { cn } from '@/utils/cn';

export interface DeckCardProps {
  deck: DeckWithCounts;
  onEdit: (deck: DeckWithCounts) => void;
}

export function DeckCard({ deck, onEdit }: DeckCardProps) {
  const t = useT();
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
          className="absolute top-0 start-0 h-1 w-full rounded-t-lg"
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
            <DropdownTrigger
              aria-label={t('decks.actionsAria', { title: deck.title })}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                <MoreVertical className="h-4 w-4" aria-hidden />
              </span>
            </DropdownTrigger>
            <DropdownMenu align="end">
              <DropdownItem onSelect={() => onEdit(deck)} disabled={busy}>
                <Pencil className="me-2 h-4 w-4" aria-hidden />
                {t('decks.edit')}
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
                <Star className="me-2 h-4 w-4" aria-hidden />
                {deck.isFavorite ? t('decks.unfavorite') : t('common.favorite')}
              </DropdownItem>
              <DropdownItem
                onSelect={() => duplicate.mutate(deck.id)}
                disabled={busy}
              >
                <Copy className="me-2 h-4 w-4" aria-hidden />
                {t('decks.duplicate')}
              </DropdownItem>
              <DropdownItem
                onSelect={() => archive.mutate(deck.id)}
                disabled={busy}
              >
                <Archive className="me-2 h-4 w-4" aria-hidden />
                {deck.isArchived ? t('decks.unarchive') : t('decks.archive')}
              </DropdownItem>
              <DropdownItem
                danger
                onSelect={() => {
                  if (
                    window.confirm(
                      t('decks.deleteConfirm', { title: deck.title }),
                    )
                  ) {
                    remove.mutate(deck.id);
                  }
                }}
                disabled={busy}
              >
                <Trash2 className="me-2 h-4 w-4" aria-hidden />
                {t('decks.delete')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">
            {t('common.cards', { count: deck.cardCount })}
          </Badge>
          <Badge variant={deck.dueCount > 0 ? 'warning' : 'success'}>
            {t('common.due', { count: deck.dueCount })}
          </Badge>
          {deck.isFavorite ? (
            <Badge variant="default">{t('common.favorite')}</Badge>
          ) : null}
          {deck.isArchived ? (
            <Badge variant="outline">{t('common.archived')}</Badge>
          ) : null}
        </div>
        {deck.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label={t('common.tags')}>
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
          {t('decks.openDeck')}
        </Link>
      </CardFooter>
    </Card>
  );
}
