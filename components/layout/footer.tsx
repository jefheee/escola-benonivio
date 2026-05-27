import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ShieldAlert } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { SCHOOL_INFO, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-8">
          
          {/* Brand/About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2 rounded-lg bg-[#1B2F78]/30 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                {SCHOOL_INFO.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm font-medium">
              Espaço educativo focado na formação de cidadãos conscientes, críticos e preparados para os desafios do futuro.
            </p>
            <div className="flex items-center space-x-3 text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl w-fit">
              <ShieldAlert className="h-4 w-4 text-[#F90000] shrink-0" />
              <span>Código INEP/MEC: {SCHOOL_INFO.inep}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-white tracking-wider text-sm uppercase">Navegação</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#F90000] transition-colors font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-white tracking-wider text-sm uppercase">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#F90000] shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.address.full}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#F90000] shrink-0" />
                <a href={`tel:${SCHOOL_INFO.phone.replace(/\D/g, "")}`} className="hover:text-[#F90000] transition-colors font-medium">
                  {SCHOOL_INFO.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#F90000] shrink-0" />
                <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-[#F90000] transition-colors font-medium">
                  {SCHOOL_INFO.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <InstagramIcon className="h-4 w-4 text-[#F90000] shrink-0" />
                <a href={SCHOOL_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F90000] transition-colors font-medium">
                  {SCHOOL_INFO.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} {SCHOOL_INFO.name}. Todos os direitos reservados.</p>
          <div className="flex space-x-4">
            <a href="https://wa.me/5548988354422" target="_blank" rel="noopener noreferrer" className="hover:text-[#F90000] transition-colors font-bold">
              Falar com a Secretaria
            </a>
            <span>•</span>
            <a href="#avisos" className="hover:text-[#F90000] transition-colors font-bold">
              Avisos Importantes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
