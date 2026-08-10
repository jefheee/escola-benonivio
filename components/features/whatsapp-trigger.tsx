'use client';

import { ReactNode } from 'react';
import { useWhatsAppDialog } from '@/components/providers/whatsapp-dialog-provider';

interface WhatsAppTriggerProps {
  children: ReactNode;
  className?: string;
}

export default function WhatsAppTrigger({ children, className }: WhatsAppTriggerProps) {
  const { openWhatsAppDialog } = useWhatsAppDialog();

  return (
    <button
      onClick={openWhatsAppDialog}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
