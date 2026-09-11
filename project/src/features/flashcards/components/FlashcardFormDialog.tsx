'use client';

import { useEffect } from 'react';
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
import type { Flashcard } from '@/types';

const cardFormSchema = z.object({
  front: z.string().trim().min(1, 'Front is required'),
  back: z.string().trim().min(1, 'Back is required'),
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
      'Enter a valid image URL',
    ),
  audioUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || z.string().url().safeParse(value).success,
      'Enter a valid audio URL',
    ),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

const DIFFICULTY_OPTIONS = DIFFICULTY_LEVELS.map((level) => ({
  value: level,
  label: level.charAt(0).toUpperCase() + level.slice(1),
}));

export interface FlashcardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  card?: Flashcard | null;
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function FlashcardFormDialog({
  open,
  onOpenChange,
  deckId,
  card,
}: FlashcardFormDialogProps) {
  const createCard = useCreateFlashcard(deckId);
  const updateCard = useUpdateFlashcard();
  const isEdit = Boolean(card);

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
      title={isEdit ? 'Edit card' : 'Add card'}
      description={
        isEdit
          ? 'Update the front, back, and optional details.'
          : 'Create a new flashcard in this deck.'
      }
      className="max-w-xl"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Textarea
          label="Front"
          required
          rows={3}
          error={errors.front?.message}
          {...register('front')}
        />
        <Textarea
          label="Back"
          required
          rows={3}
          error={errors.back?.message}
          {...register('back')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Hint"
            error={errors.hint?.message}
            {...register('hint')}
          />
          <Select
            label="Difficulty"
            options={DIFFICULTY_OPTIONS}
            error={errors.difficulty?.message}
            {...register('difficulty')}
          />
        </div>
        <Input
          label="Example"
          error={errors.example?.message}
          {...register('example')}
        />
        <Input
          label="Tags"
          hint="Comma-separated"
          error={errors.tags?.message}
          {...register('tags')}
        />
        <Textarea
          label="Notes"
          rows={2}
          error={errors.notes?.message}
          {...register('notes')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Image URL"
            type="url"
            placeholder="https://"
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
          <Input
            label="Audio URL"
            type="url"
            placeholder="https://"
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
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            {isEdit ? 'Save changes' : 'Add card'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
