'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Flame, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Settings, 
  PhoneCall, 
  CheckCircle2,
  HeartCrack
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Tableau de bord', icon: ShieldCheck },
    { href: '/parcours', label: 'Parcours 30j', icon: Calendar },
    { href: '/journal', label: 'Journal des envies', icon: BookOpen },
    { href: '/strategies', label: 'Stratégies', icon: Sparkles },
    { href: '/checkin', label: 'Check-in du jour', icon: CheckCircle2 },
    { href: '/faux-pas', label: 'Faux pas', icon: HeartCrack },
    { href: '/urgence', label: 'Soutien', icon: PhoneCall },
    { href: '/parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-base sm:text-lg">🚭</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Nosmokvng
              </span>
              <span className="hidden xs:inline text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Bénin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Une envie est une vague, pas un ordre
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right actions : SOS Button & Quick Settings */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile compact SOS button */}
          <Link
            href="/sos"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-md shadow-rose-500/25 active:scale-95 transition-all animate-pulse-slow"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 fill-amber-200 shrink-0" />
            <span className="sm:hidden">SOS Crise</span>
            <span className="hidden sm:inline">J'ai envie de fumer</span>
          </Link>
          
          <Link
            href="/parametres"
            className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
            title="Paramètres"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
