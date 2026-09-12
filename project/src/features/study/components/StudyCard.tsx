'use client';

import { useState } from 'react';
import { Bookmark, StickyNote } from 'lucide-react';
import type { Flashcard } from '@/types';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useT } from '@/i18n';

export interface StudyCardProps {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  onBookmark: () => void;
  onSaveNotes?: (notes: string) => Promise<void> | void;
  notesSaving?: boolean;
  examMode?: boolean;
}

export function StudyCard({
  card,
  flipped,
  onFlip,
  onBookmark,
  onSaveNotes,
  notesSaving = false,
  examMode = false,
}: StudyCardProps) {
  const t = useT();
  // Parent should remount with key={card.id} so draft resets per card.
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState(card.notes ?? '');

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{card.difficulty}</Badge>
          {card.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {onSaveNotes ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setNotesOpen((open) => !open)}
              aria-label={
                notesOpen ? t('study.hideNotes') : t('study.showNotes')
              }
              aria-pressed={notesOpen}
            >
              <StickyNote
                className={cn(
                  'h-5 w-5',
                  (notesOpen || card.notes) && 'text-primary',
                )}
                aria-hidden
              />
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onBookmark}
            aria-label={
              card.isBookmarked
                ? t('study.removeBookmark')
                : t('study.bookmark')
            }
            aria-pressed={card.isBookmarked}
          >
            <Bookmark
              className={cn(
                'h-5 w-5',
                card.isBookmarked && 'fill-primary text-primary',
              )}
              aria-hidden
            />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={onFlip}
        disabled={examMode && flipped}
        aria-label={
          flipped ? t('study.showFrontAria') : t('study.flipAria')
        }
        className={cn(
          'flip-card min-h-[280px] w-full cursor-pointer rounded-lg border border-border bg-transparent text-start shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          examMode && flipped && 'cursor-default',
        )}
      >
        <div
          className={cn(
            'flip-card-inner relative min-h-[280px] w-full',
            flipped && 'is-flipped',
          )}
        >
          <div
            className={cn(
              'flip-card-face absolute inset-0 flex flex-col justify-center gap-3 rounded-lg bg-card p-8',
              flipped && 'pointer-events-none',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('study.front')}
            </p>
            <p className="text-xl font-semibold leading-relaxed text-foreground md:text-2xl">
              {card.front}
            </p>
            {card.hint ? (
              <p className="text-sm text-muted-foreground">
                {t('study.hintPrefix', { hint: card.hint })}
              </p>
            ) : null}
            {!examMode ? (
              <p className="mt-4 text-xs text-muted-foreground">
                {t('study.flipHint')}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              'flip-card-face flip-card-back absolute inset-0 flex flex-col justify-center gap-3 rounded-lg bg-card p-8',
              !flipped && 'pointer-events-none',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('study.back')}
            </p>
            <p className="text-xl font-semibold leading-relaxed text-foreground md:text-2xl">
              {card.back}
            </p>
            {card.example ? (
              <p className="text-sm text-muted-foreground">
                {t('study.examplePrefix', { example: card.example })}
              </p>
            ) : null}
            {card.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.imageUrl}
                alt=""
                className="mt-2 max-h-40 w-full rounded-md object-contain"
              />
            ) : null}
            {card.audioUrl ? (
              <audio
                controls
                src={card.audioUrl}
                className="mt-2 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {t('study.audioUnsupported')}
              </audio>
            ) : null}
          </div>
        </div>
      </button>

      {notesOpen && onSaveNotes ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm animate-slide-up">
          <Textarea
            label={t('study.notes')}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={3}
            hint={t('study.notesHint')}
            aria-label={t('study.notes')}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setNotesDraft(card.notes ?? '');
                setNotesOpen(false);
              }}
              aria-label={t('study.cancelNotes')}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              loading={notesSaving}
              onClick={() => void onSaveNotes(notesDraft)}
              aria-label={t('study.saveNotes')}
            >
              {t('study.saveNotes')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
