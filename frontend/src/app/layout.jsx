import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Nosmokvng · Cap Sans Tabac | Parcours d’arrêt du tabac',
  description: 'Application moderne et bienveillante d’accompagnement à l’arrêt du tabac. Protocole anti-envie 10 minutes, suivi des progrès, parcours 30 jours.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-12">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
