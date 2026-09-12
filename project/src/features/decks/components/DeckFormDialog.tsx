'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  useCreateDeck,
  useUpdateDeck,
} from '@/features/decks/hooks/useDecks';
import { useT, type TranslateFn } from '@/i18n';
import type { Deck, DeckWithCounts } from '@/types';

const DECK_COLORS = [
  '#0d9488',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
] as const;

function createDeckFormSchema(t: TranslateFn) {
  return z.object({
    title: z.string().trim().min(1, t('decks.titleRequired')).max(200),
    description: z.string().trim().max(2000),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, t('decks.pickColor')),
    tags: z.string(),
  });
}

type DeckFormValues = z.infer<ReturnType<typeof createDeckFormSchema>>;

export interface DeckFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck?: Deck | DeckWithCounts | null;
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function DeckFormDialog({
  open,
  onOpenChange,
  deck,
}: DeckFormDialogProps) {
  const t = useT();
  const createDeck = useCreateDeck();
  const updateDeck = useUpdateDeck();
  const isEdit = Boolean(deck);
  const deckFormSchema = useMemo(() => createDeckFormSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      title: '',
      description: '',
      color: DECK_COLORS[0],
      tags: '',
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (!open) return;
    reset({
      title: deck?.title ?? '',
      description: deck?.description ?? '',
      color: deck?.color ?? DECK_COLORS[0],
      tags: deck?.tags?.join(', ') ?? '',
    });
  }, [open, deck, reset]);

  const pending = createDeck.isPending || updateDeck.isPending;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      color: values.color,
      tags: parseTags(values.tags),
    };

    if (deck) {
      await updateDeck.mutateAsync({ id: deck.id, input: payload });
    } else {
      await createDeck.mutateAsync(payload);
    }
    onOpenChange(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('decks.editTitle') : t('decks.createTitle')}
      description={
        isEdit ? t('decks.editDescription') : t('decks.createDescription')
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t('decks.title')}
          required
          error={errors.title?.message}
          {...register('title')}
        />
        <Textarea
          label={t('decks.description')}
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-foreground">
            {t('decks.color')}
          </legend>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label={t('decks.colorAria')}
          >
            {DECK_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                role="radio"
                aria-checked={selectedColor === color}
                aria-label={`${t('decks.color')} ${color}`}
                className="h-8 w-8 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  backgroundColor: color,
                  borderColor:
                    selectedColor === color ? 'var(--foreground)' : 'transparent',
                  transform: selectedColor === color ? 'scale(1.1)' : undefined,
                }}
                onClick={() => setValue('color', color, { shouldValidate: true })}
              />
            ))}
          </div>
          {errors.color?.message ? (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.color.message}
            </p>
          ) : null}
        </fieldset>
        <Input
          label={t('decks.tags')}
          placeholder={t('decks.tagsPlaceholder')}
          error={errors.tags?.message}
          {...register('tags')}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={pending}>
            {isEdit ? t('common.saveChanges') : t('decks.submitCreate')}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
