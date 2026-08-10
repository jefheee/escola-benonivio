import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldCheck, Mail } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { SCHOOL_INFO, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-soft-border w-full relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute bottom-0 right-0 -z-10 w-48 h-48 opacity-[0.03] pointer-events-none transform translate-x-1/4 translate-y-1/4">
        <svg className="w-full h-full fill-primary" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="50,0 100,100 0,100"></polygon>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        
        {/* Coluna 1: Brand & Logo */}
        <div className="space-y-4 flex flex-col justify-start">
          <div className="flex items-center gap-3">
            <Image
              alt="Logo EEB Benonívio"
              src="/assets/icon/logobeno1.png"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <span className="font-display text-xl font-bold text-primary">
              EEB Prof. Benonívio
            </span>
          </div>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            © {currentYear} {SCHOOL_INFO.name}.<br />
            Educação Pública de Qualidade.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-soft-border px-3 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="h-4 w-4 text-[#F90000] shrink-0" />
            <span>MEC: {SCHOOL_INFO.inep}</span>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Links Rápidos</h4>
          <div className="flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-500 hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SCHOOL_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-secondary transition-colors duration-200 hover:translate-x-1 inline-block font-semibold flex items-center gap-1.5"
            >
              <InstagramIcon className="h-4 w-4 shrink-0" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Coluna 3: Contatos & Localização */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Contato & Endereço</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-semibold">
            {SCHOOL_INFO.address.street}, {SCHOOL_INFO.address.number}<br />
            {SCHOOL_INFO.address.neighborhood} - {SCHOOL_INFO.address.city}/{SCHOOL_INFO.address.state}<br />
            CEP: {SCHOOL_INFO.address.zipCode}
          </p>
          
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Phone className="h-4 w-4 text-secondary" />
              <a href={`tel:${SCHOOL_INFO.phone.replace(/\D/g, "")}`} className="hover:underline">
                {SCHOOL_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Mail className="h-4 w-4 text-secondary" />
              <a href="mailto:benonivio@sed.sc.gov.br" className="hover:underline">
                benonivio@sed.sc.gov.br
              </a>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00185f] bg-white border border-soft-border px-3 py-1.5 rounded-lg w-fit transition-colors font-semibold outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-slate-400"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Área Restrita</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
