'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useImportFlashcards } from '@/features/flashcards/hooks/useFlashcards';

const importSchema = z.object({
  format: z.enum(['csv', 'json', 'markdown']),
  content: z.string().min(1, 'Paste or upload content to import'),
});

type ImportFormValues = z.infer<typeof importSchema>;

const FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV (front,back)' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
];

const PLACEHOLDERS: Record<ImportFormValues['format'], string> = {
  csv: 'front,back\nhola,hello\ngracias,thank you',
  json: '[{"front":"hola","back":"hello"}]',
  markdown: '## hola\nhello\n\n## gracias\nthank you',
};

export interface ImportCardsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
}

export function ImportCardsDialog({
  open,
  onOpenChange,
  deckId,
}: ImportCardsDialogProps) {
  const importCards = useImportFlashcards(deckId);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ImportFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      format: 'csv',
      content: '',
    },
  });

  const format = watch('format');

  const onSubmit = handleSubmit(async (values) => {
    await importCards.mutateAsync(values);
    reset({ format: values.format, content: '' });
    setFileName(null);
    onOpenChange(false);
  });

  const onFileChange = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setValue('content', text, { shouldValidate: true });
    setFileName(file.name);

    const lower = file.name.toLowerCase();
    if (lower.endsWith('.json')) {
      setValue('format', 'json');
    } else if (lower.endsWith('.md') || lower.endsWith('.markdown')) {
      setValue('format', 'markdown');
    } else if (lower.endsWith('.csv') || lower.endsWith('.txt')) {
      setValue('format', 'csv');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setFileName(null);
        }
      }}
      title="Import cards"
      description="Paste CSV, JSON, or Markdown, or upload a file."
      className="max-w-xl"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Select
          label="Format"
          options={FORMAT_OPTIONS}
          error={errors.format?.message}
          {...register('format')}
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="import-file"
            className="text-sm font-medium text-foreground"
          >
            Upload file
          </label>
          <input
            id="import-file"
            type="file"
            accept=".csv,.json,.md,.markdown,.txt,text/csv,application/json,text/markdown"
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:opacity-90"
            aria-label="Upload import file"
            onChange={(e) => {
              void onFileChange(e.target.files?.[0] ?? null);
            }}
          />
          {fileName ? (
            <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>
          ) : null}
        </div>
        <Textarea
          label="Content"
          required
          rows={10}
          placeholder={PLACEHOLDERS[format]}
          error={errors.content?.message}
          {...register('content')}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importCards.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" loading={importCards.isPending}>
            Import
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
