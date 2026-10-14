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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🚭</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Nosmokvng
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Cap Sans Tabac
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Une envie est une vague, pas un ordre
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Right action : SOS Emergency button */}
        <div className="flex items-center gap-3">
          <Link
            href="/sos"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse-slow"
          >
            <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
            <span>J'ai envie de fumer</span>
          </Link>
          
          <Link
            href="/parametres"
            className="hidden sm:flex p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
            title="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
