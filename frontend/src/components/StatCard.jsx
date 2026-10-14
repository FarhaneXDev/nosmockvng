import { TrendingUp, Shield, Banknote, CheckCircle, Heart } from 'lucide-react';

const ICON_MAP = {
  Banknote,
  Shield,
  CheckCircle,
  TrendingUp,
  Heart,
};

export default function StatCard({ title, value, unit, subtitle, icon = 'Shield', color = 'emerald' }) {
  const IconComponent = ICON_MAP[icon] || Shield;

  const colorStyles = {
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      valColor: 'text-emerald-400',
    },
    amber: {
      bg: 'from-amber-500/10 to-yellow-500/5',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/20 text-amber-400',
      valColor: 'text-amber-400',
    },
    blue: {
      bg: 'from-blue-500/10 to-cyan-500/5',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/20 text-blue-400',
      valColor: 'text-blue-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-indigo-500/5',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/20 text-purple-400',
      valColor: 'text-purple-400',
    },
  }[color] || {
    bg: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    valColor: 'text-emerald-400',
  };

  // Format value if number
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('fr-FR')
    : String(value);

  return (
    <div className={`p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br ${colorStyles.bg} border ${colorStyles.border} transition-all duration-200 shadow-md flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
          {title}
        </span>
        <div className={`p-1.5 sm:p-2 rounded-xl ${colorStyles.iconBg} shrink-0`}>
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
        <span className={`text-xl sm:text-3xl font-black ${colorStyles.valColor} font-mono tracking-tight`}>
          {formattedValue}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-bold text-slate-300">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-[10px] sm:text-xs text-slate-400 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
