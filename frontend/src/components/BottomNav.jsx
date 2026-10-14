'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Flame, 
  BookOpen, 
  Calendar, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/sos', label: 'SOS 10m', icon: Flame, isSpecial: true },
    { href: '/parcours', label: 'Parcours', icon: Calendar },
  ];

  return (
    <>
      {/* Mobile Menu Bottom Sheet */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex flex-col justify-end animate-fadeIn"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto pb-safe shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <h3 className="text-sm font-bold text-white">Menu complet Nosmokvng</h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link 
                href="/strategies"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 active:scale-95 transition-transform"
              >
                <span className="text-xl">✨</span>
                <div>
                  <span className="text-xs font-bold block text-white">Stratégies</span>
                  <span className="text-[10px] text-slate-400">Souffle & PAUSE</span>
                </div>
              </Link>

              <Link 
                href="/checkin"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 active:scale-95 transition-transform"
              >
                <span className="text-xl">📝</span>
                <div>
                  <span className="text-xs font-bold block text-white">Check-in</span>
                  <span className="text-[10px] text-slate-400">Matin & Soir</span>
                </div>
              </Link>

              <Link 
                href="/faux-pas"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 active:scale-95 transition-transform"
              >
                <span className="text-xl">🤝</span>
                <div>
                  <span className="text-xs font-bold block text-white">Faux pas</span>
                  <span className="text-[10px] text-slate-400">Reprise sans honte</span>
                </div>
              </Link>

              <Link 
                href="/urgence"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 active:scale-95 transition-transform"
              >
                <span className="text-xl">📞</span>
                <div>
                  <span className="text-xs font-bold block text-white">Aide Bénin</span>
                  <span className="text-[10px] text-slate-400">136, 112 & proche</span>
                </div>
              </Link>

              <Link 
                href="/parametres"
                onClick={() => setShowMoreMenu(false)}
                className="col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚙️</span>
                  <div>
                    <span className="text-xs font-bold block text-white">Paramètres & FCFA</span>
                    <span className="text-[10px] text-slate-400">Prix paquet, fuseau Bénin, export</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">Gérer →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-slate-800/90 pb-safe backdrop-blur-xl">
        <div className="flex items-center justify-around h-15 px-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            if (tab.isSpecial) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center justify-center -mt-5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 p-2.5 group-hover:scale-105 active:scale-95 transition-transform border-2 border-slate-950">
                    <Icon className="w-6 h-6 fill-white text-white" />
                  </div>
                  <span className="text-[10px] font-black text-rose-400 mt-0.5 tracking-tight">SOS 10 min</span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-2 rounded-xl transition-colors ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center justify-center min-w-[54px] py-1 px-2 rounded-xl text-slate-400 hover:text-slate-200"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
}
