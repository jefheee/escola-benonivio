export const SCHOOL_INFO = {
  name: "EEB Professor Benonívio João Martins",
  shortName: "EEB Benonívio",
  inep: "000042004047", // updated as requested: 000042004047
  phone: "(48) 3665-5774",
  email: "benonivio@sed.sc.gov.br",
  whatsapp: "https://wa.me/5548988354422",
  instagramHandle: "@escolabenonivio",
  instagramUrl: "https://instagram.com/escolabenonivio",
  address: {
    street: "Rua Monsenhor Roberto Landel Moura",
    number: "S/N",
    neighborhood: "Brejaru I", // updated: Brejaru I
    city: "Palhoça",
    state: "SC",
    zipCode: "88133-490",
    full: "Rua Monsenhor Roberto Landel Moura, S/N - Brejaru I, Palhoça - SC, CEP 88133-490"
  }
};

export const NAV_ITEMS = [
  { label: "Início", href: "/" },
  { label: "Avisos", href: "/avisos" },
  { label: "Turmas", href: "/turmas" },
  { label: "Sobre", href: "/sobre" },
  { label: "Acervo", href: "/acervo" },
  { label: "Documentos", href: "/documentos" }
] as const;
