'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Flame, 
  BookOpen, 
  Calendar, 
  Menu
} from 'lucide-react';
import { useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/parcours', label: 'Parcours', icon: Calendar },
    { href: '/sos', label: 'SOS', icon: Flame, isSpecial: true },
    { href: '/journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <>
      {/* Slide-over menu for extra items on mobile */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex flex-col justify-end"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
            <h3 className="text-base font-bold text-white px-2">Navigation complète</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/strategies"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white"
              >
                <span className="text-xl">✨</span>
                <span className="text-sm font-semibold">Stratégies</span>
              </Link>
              <Link 
                href="/checkin"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white"
              >
                <span className="text-xl">📝</span>
                <span className="text-sm font-semibold">Check-in du jour</span>
              </Link>
              <Link 
                href="/faux-pas"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white"
              >
                <span className="text-xl">🤝</span>
                <span className="text-sm font-semibold">Faux pas / Relance</span>
              </Link>
              <Link 
                href="/urgence"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white"
              >
                <span className="text-xl">📞</span>
                <span className="text-sm font-semibold">Aide & Soutien</span>
              </Link>
              <Link 
                href="/parametres"
                onClick={() => setShowMoreMenu(false)}
                className="col-span-2 flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white"
              >
                <span className="text-xl">⚙️</span>
                <span className="text-sm font-semibold">Paramètres & Données</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom bar on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-slate-800/90 py-2 px-3 backdrop-blur-lg">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            if (tab.isSpecial) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center justify-center -mt-6 group"
                >
                  <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 p-3 group-hover:scale-105 group-active:scale-95 transition-all">
                    <Icon className="w-6 h-6 fill-white" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-400 mt-1">SOS 10 min</span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
}
