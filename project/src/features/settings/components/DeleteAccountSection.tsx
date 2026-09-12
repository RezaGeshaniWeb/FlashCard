'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { useT } from '@/i18n';

export interface DeleteAccountSectionProps {
  onDelete: () => Promise<unknown>;
  isDeleting?: boolean;
  confirmEmail?: string;
}

export function DeleteAccountSection({
  onDelete,
  isDeleting = false,
  confirmEmail = '',
}: DeleteAccountSectionProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  const canConfirm =
    confirmEmail.length === 0 ||
    email.trim().toLowerCase() === confirmEmail.toLowerCase();

  return (
    <>
      <Card className="border-danger/40">
        <CardHeader>
          <CardTitle className="text-danger">{t('settings.dangerTitle')}</CardTitle>
          <CardDescription>{t('settings.dangerDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="danger"
            onClick={() => setOpen(true)}
            aria-label={t('settings.deleteAccount')}
          >
            {t('settings.deleteAccount')}
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={t('settings.deleteDialogTitle')}
        description={t('settings.deleteDialogDescription')}
      >
        <Input
          label={t('settings.confirmEmail')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={confirmEmail || 'you@example.com'}
          autoComplete="email"
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={!canConfirm}
            loading={isDeleting}
            onClick={() => void onDelete()}
            aria-label={t('settings.deleteForever')}
          >
            {t('settings.deleteForever')}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
