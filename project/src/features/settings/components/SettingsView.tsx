'use client';

import { useSettings } from '../hooks/useSettings';
import { ThemeSettings } from './ThemeSettings';
import { NotificationSettings } from './NotificationSettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import { DataExportImport } from './DataExportImport';
import { DeleteAccountSection } from './DeleteAccountSection';
import { ChangePasswordForm } from './ChangePasswordForm';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

export function SettingsView() {
  const {
    settings,
    user,
    isLoading,
    isError,
    refetch,
    updateSettings,
    changePassword,
    deleteAccount,
    exportData,
    importData,
  } = useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <ErrorState title="Could not load settings" onRetry={refetch} />
    );
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theme, notifications, accessibility, and data controls.
        </p>
      </div>

      <ThemeSettings
        settings={settings}
        isSaving={updateSettings.isPending}
        onUpdate={(patch) => updateSettings.mutate(patch)}
      />

      <NotificationSettings
        settings={settings}
        isSaving={updateSettings.isPending}
        onUpdate={(patch) => updateSettings.mutate(patch)}
      />

      <AccessibilitySettings />

      <ChangePasswordForm
        isSubmitting={changePassword.isPending}
        onSubmit={(values) => changePassword.mutateAsync(values)}
      />

      <DataExportImport
        isExporting={exportData.isPending}
        isImporting={importData.isPending}
        onExport={() => exportData.mutateAsync()}
        onImport={(input) => importData.mutateAsync(input)}
      />

      <DeleteAccountSection
        confirmEmail={user?.email}
        isDeleting={deleteAccount.isPending}
        onDelete={() => deleteAccount.mutateAsync()}
      />
    </div>
  );
}
