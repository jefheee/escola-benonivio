'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import WhatsAppDialog from '../features/whatsapp-dialog';

interface WhatsAppDialogContextType {
  openWhatsAppDialog: () => void;
  closeWhatsAppDialog: () => void;
}

const WhatsAppDialogContext = createContext<WhatsAppDialogContextType | undefined>(undefined);

export function WhatsAppDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsAppDialog = () => setIsOpen(true);
  const closeWhatsAppDialog = () => setIsOpen(false);

  return (
    <WhatsAppDialogContext.Provider value={{ openWhatsAppDialog, closeWhatsAppDialog }}>
      {children}
      <WhatsAppDialog isOpen={isOpen} onClose={closeWhatsAppDialog} />
    </WhatsAppDialogContext.Provider>
  );
}

export function useWhatsAppDialog() {
  const context = useContext(WhatsAppDialogContext);
  if (!context) {
    throw new Error('useWhatsAppDialog deve ser usado dentro de um WhatsAppDialogProvider');
  }
  return context;
}
