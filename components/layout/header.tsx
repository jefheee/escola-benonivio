'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageSquare, Menu, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { SCHOOL_INFO, NAV_ITEMS } from "@/lib/constants";
import { useWhatsAppDialog } from "@/components/providers/whatsapp-dialog-provider";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { openWhatsAppDialog } = useWhatsAppDialog();

  return (
    <header className="bg-pure-white border-b border-soft-border shadow-sm sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Brand (Left Column) */}
        <div className="flex justify-start items-center">
          <Link href="/" className="flex items-center gap-3 outline-none">
            <Image
              src="/assets/icon/logobeno1.png"
              alt="Logo EEB Benonívio"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <span className="font-display text-xl font-bold text-primary whitespace-nowrap">
              EEB Prof. Benonívio
            </span>
          </Link>
        </div>

        {/* Navigation Links (Desktop - Middle Column) */}
        <nav className="hidden md:flex justify-center items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors duration-200 pb-1 text-sm font-semibold outline-none",
                  isActive
                    ? "text-primary border-b-2 border-secondary"
                    : "text-slate-text hover:text-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Trailing CTA (Right Column / Mobile menu button) */}
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={openWhatsAppDialog}
            className="bg-secondary text-white px-6 py-2.5 rounded hover:opacity-90 transition-all shadow-sm hidden md:flex items-center gap-2 text-sm font-bold outline-none"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Fale Conosco</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary p-2 hover:text-secondary transition-colors outline-none"
            aria-label="Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 top-[73px] bottom-0 z-40 bg-white border-t border-soft-border md:hidden transition-all duration-300 ease-in-out flex flex-col justify-between p-6",
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col space-y-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-bold p-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary bg-slate-50"
                    : "text-slate-text hover:text-secondary hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile CTA */}
        <div className="mt-auto space-y-4">
          <button
            onClick={() => {
              setIsOpen(false);
              openWhatsAppDialog();
            }}
            className="w-full justify-center inline-flex items-center space-x-2 bg-secondary text-white font-bold p-4 rounded-xl transition-all shadow-md outline-none"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Secretaria (WhatsApp)</span>
          </button>
          
          <div className="text-center text-xs text-slate-500">
            <p className="font-bold text-primary">{SCHOOL_INFO.name}</p>
            <p className="mt-1">{SCHOOL_INFO.address.full}</p>
            <p className="mt-1.5 text-slate-400 font-bold flex items-center justify-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span>benonivio@sed.sc.gov.br</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
