import React from "react";
import {
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Music,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-sm text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-lg font-bold text-white">
              <div className="rounded-xl bg-amber-500 p-2 text-slate-950">
                <Music className="h-5 w-5" aria-hidden="true" />
              </div>
              <span>Empório da Música</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Sua loja especializada em instrumentos musicais de alta qualidade
              em Campo Grande/MS. Atendimento consultivo e suporte por IA.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Garantia Oficial &amp; Compra Segura</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">Navegação</h2>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#catalog"
                  className="transition-colors hover:text-amber-400"
                >
                  Catálogo de Instrumentos
                </a>
              </li>
              <li>
                <a
                  href="#promotions"
                  className="transition-colors hover:text-amber-400"
                >
                  Promoções Ativas
                </a>
              </li>
              <li>
                <a
                  href="#policies"
                  className="transition-colors hover:text-amber-400"
                >
                  Políticas da Loja
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="transition-colors hover:text-amber-400"
                >
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          {/* Store Info & Location */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">
              Atendimento
            </h2>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <span>
                  Rua 14 de Maio, 3200 — Centro
                  <br />
                  Campo Grande/MS
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <span>Seg - Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  className="h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <a
                  href="tel:+556733210000"
                  className="transition-colors hover:text-amber-400"
                >
                  (67) 3321-0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <a
                  href="mailto:contato@emporiodamusica.com.br"
                  className="break-all transition-colors hover:text-amber-400"
                >
                  contato@emporiodamusica.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Badges */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">
              Formas de Pagamento
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                <CreditCard
                  className="h-4 w-4 text-amber-400"
                  aria-hidden="true"
                />
                <span>PIX (5% de Desconto À Vista)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                <CreditCard
                  className="h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <span>Cartão de Crédito em até 12x</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                <CreditCard
                  className="h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <span>Boleto Bancário</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © 2008–2026 Empório da Música Instrumentos Musicais Ltda. Todos os
            direitos reservados.
          </p>
          <p className="text-[11px]">
            Desenvolvido com FastAPI, React &amp; Google Gemini
          </p>
        </div>
      </div>
    </footer>
  );
};
