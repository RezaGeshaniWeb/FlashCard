'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { UserExportData } from '@/types';
import type { ImportDataInput } from '../services/settings-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useT } from '@/i18n';

export interface DataExportImportProps {
  onExport: () => Promise<UserExportData>;
  onImport: (input: ImportDataInput) => Promise<unknown>;
  isExporting?: boolean;
  isImporting?: boolean;
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataExportImport({
  onExport,
  onImport,
  isExporting = false,
  isImporting = false,
}: DataExportImportProps) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const data = await onExport();
      downloadJson(data, `flashmaster-export-${Date.now()}.json`);
      toast.success(t('settings.exportDownloaded'));
    } catch {
      toast.error(t('settings.exportFailed'));
    } finally {
      setBusy(false);
    }
  };

  const handleImportFile = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !Array.isArray((parsed as { decks?: unknown }).decks)
      ) {
        throw new Error(t('settings.invalidExportFile'));
      }
      const exportData = parsed as UserExportData | ImportDataInput;
      const decks =
        'decks' in exportData
          ? (exportData as UserExportData).decks.map((deck) => ({
              title: deck.title,
              description: deck.description,
              color: deck.color,
              tags: deck.tags,
              flashcards:
                'flashcards' in exportData &&
                Array.isArray((exportData as UserExportData).flashcards)
                  ? (exportData as UserExportData).flashcards
                      .filter((c) => c.deckId === deck.id)
                      .map((c) => ({
                        front: c.front,
                        back: c.back,
                        hint: c.hint,
                        example: c.example,
                        tags: c.tags,
                        difficulty: c.difficulty,
                        notes: c.notes,
                      }))
                  : (exportData as ImportDataInput).decks.find(
                      (d) => d.title === deck.title,
                    )?.flashcards,
            }))
          : (exportData as ImportDataInput).decks;

      await onImport({ decks });
    } catch {
      toast.error(t('settings.importFailed'));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.dataTitle')}</CardTitle>
        <CardDescription>{t('settings.dataDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          loading={busy || isExporting}
          onClick={() => void handleExport()}
          aria-label={t('settings.exportJson')}
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('settings.exportJson')}
        </Button>
        <Button
          type="button"
          variant="outline"
          loading={busy || isImporting}
          onClick={() => inputRef.current?.click()}
          aria-label={t('settings.importJson')}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {t('settings.importJson')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
          }}
        />
      </CardContent>
    </Card>
  );
}
