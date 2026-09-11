'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';

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
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  const canConfirm =
    confirmEmail.length === 0 ||
    email.trim().toLowerCase() === confirmEmail.toLowerCase();

  return (
    <>
      <Card className="border-danger/40">
        <CardHeader>
          <CardTitle className="text-danger">Danger zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all study data. This cannot be
            undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="danger"
            onClick={() => setOpen(true)}
            aria-label="Delete account"
          >
            Delete account
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete account?"
        description="Type your email to confirm permanent deletion."
      >
        <Input
          label="Confirm email"
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
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={!canConfirm}
            loading={isDeleting}
            onClick={() => void onDelete()}
            aria-label="Confirm delete account"
          >
            Delete forever
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
