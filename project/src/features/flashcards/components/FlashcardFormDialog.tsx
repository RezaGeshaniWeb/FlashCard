'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { DIFFICULTY_LEVELS } from '@/constants';
import {
  useCreateFlashcard,
  useUpdateFlashcard,
} from '@/features/flashcards/hooks/useFlashcards';
import { useT, type TranslateFn } from '@/i18n';
import type { Flashcard } from '@/types';

function createCardFormSchema(t: TranslateFn) {
  return z.object({
    front: z.string().trim().min(1, t('flashcards.frontRequired')),
    back: z.string().trim().min(1, t('flashcards.backRequired')),
    hint: z.string().trim(),
    example: z.string().trim(),
    tags: z.string(),
    difficulty: z.enum(DIFFICULTY_LEVELS),
    notes: z.string().trim(),
    imageUrl: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || z.string().url().safeParse(value).success,
        t('flashcards.imageUrlInvalid'),
      ),
    audioUrl: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || z.string().url().safeParse(value).success,
        t('flashcards.audioUrlInvalid'),
      ),
  });
}

type CardFormValues = z.infer<ReturnType<typeof createCardFormSchema>>;

const DIFFICULTY_LABEL_KEYS = {
  beginner: 'common.difficultyBeginner',
  intermediate: 'common.difficultyIntermediate',
  advanced: 'common.difficultyAdvanced',
} as const;

export interface FlashcardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  card?: Flashcard | null;
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function FlashcardFormDialog({
  open,
  onOpenChange,
  deckId,
  card,
}: FlashcardFormDialogProps) {
  const t = useT();
  const createCard = useCreateFlashcard(deckId);
  const updateCard = useUpdateFlashcard();
  const isEdit = Boolean(card);
  const cardFormSchema = useMemo(() => createCardFormSchema(t), [t]);

  const difficultyOptions = useMemo(
    () =>
      DIFFICULTY_LEVELS.map((level) => ({
        value: level,
        label: t(DIFFICULTY_LABEL_KEYS[level]),
      })),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      front: '',
      back: '',
      hint: '',
      example: '',
      tags: '',
      difficulty: 'beginner',
      notes: '',
      imageUrl: '',
      audioUrl: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      front: card?.front ?? '',
      back: card?.back ?? '',
      hint: card?.hint ?? '',
      example: card?.example ?? '',
      tags: card?.tags?.join(', ') ?? '',
      difficulty: card?.difficulty ?? 'beginner',
      notes: card?.notes ?? '',
      imageUrl: card?.imageUrl ?? '',
      audioUrl: card?.audioUrl ?? '',
    });
  }, [open, card, reset]);

  const pending = createCard.isPending || updateCard.isPending;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      front: values.front,
      back: values.back,
      hint: values.hint || undefined,
      example: values.example || undefined,
      tags: parseTags(values.tags),
      difficulty: values.difficulty,
      notes: values.notes || undefined,
      imageUrl: values.imageUrl || undefined,
      audioUrl: values.audioUrl || undefined,
    };

    if (card) {
      await updateCard.mutateAsync({ id: card.id, input: payload });
    } else {
      await createCard.mutateAsync(payload);
    }
    onOpenChange(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('flashcards.editTitle') : t('flashcards.addTitle')}
      description={
        isEdit
          ? t('flashcards.editDescription')
          : t('flashcards.addDescription')
      }
      className="max-w-xl"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Textarea
          label={t('flashcards.front')}
          required
          rows={3}
          error={errors.front?.message}
          {...register('front')}
        />
        <Textarea
          label={t('flashcards.back')}
          required
          rows={3}
          error={errors.back?.message}
          {...register('back')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('flashcards.hint')}
            error={errors.hint?.message}
            {...register('hint')}
          />
          <Select
            label={t('flashcards.difficulty')}
            options={difficultyOptions}
            error={errors.difficulty?.message}
            {...register('difficulty')}
          />
        </div>
        <Input
          label={t('flashcards.example')}
          error={errors.example?.message}
          {...register('example')}
        />
        <Input
          label={t('common.tags')}
          placeholder={t('decks.tagsPlaceholder')}
          error={errors.tags?.message}
          {...register('tags')}
        />
        <Textarea
          label={t('flashcards.notes')}
          rows={2}
          error={errors.notes?.message}
          {...register('notes')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('flashcards.imageUrl')}
            type="url"
            placeholder={t('flashcards.urlPlaceholder')}
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
          <Input
            label={t('flashcards.audioUrl')}
            type="url"
            placeholder={t('flashcards.urlPlaceholder')}
            error={errors.audioUrl?.message}
            {...register('audioUrl')}
          />
        </div>
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
            {isEdit ? t('common.saveChanges') : t('flashcards.addCard')}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
