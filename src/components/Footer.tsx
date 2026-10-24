import React from 'react';
import { BookOpen, ShieldCheck, Users, ShoppingBag, HeartHandshake, Sparkles, Globe, Cloud, Headphones } from 'lucide-react';
import { useMurottal } from '../context/MurottalContext';

interface FooterProps {
  onOpenGcpFacilitator?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGcpFacilitator }) => {
  const { setIsStudioModalOpen } = useMurottal();
  return (
    <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-800/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg border border-emerald-300/30">
                <span className="font-serif font-black text-xl text-emerald-950">4B</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white">
                ABDICity<span className="text-amber-400 font-sans text-sm font-semibold ml-1">.cloud</span>
              </h2>
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Aplikasi Berjamaah Dakwah Islamicity 4B Kaffah: Berdakwah, Bersyariah, Berjamaah, Bermuamalah. Ekosistem digital terpadu umat Islam modern.
            </p>
          </div>

          {/* 4 Pilar Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-serif tracking-wide border-b border-emerald-800 pb-1">
              4 Pilar Kaffah
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> 1. Berdakwah (Quran & AI Ustadz)
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 2. Bersyariah (Zakat & Akad AI)
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Users className="w-3.5 h-3.5 text-amber-400" /> 3. Berjamaah (Masjid & Wakaf)
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> 4. Bermuamalah (Marketplace Syariah)
              </li>
            </ul>
          </div>

          {/* Fitur AI */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-serif tracking-wide border-b border-emerald-800 pb-1">
              Fitur Cerdas AI & Cloud
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Konsultasi Fiqih & Syariah
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Pemindai Kamera Produk Halal
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Analisis Kepatuhan Akad
              </li>
              <li 
                onClick={onOpenGcpFacilitator}
                className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors cursor-pointer font-semibold"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Fasilitator GCP Cerdas (DevOps & Arsitek ABDI)
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-amber-400" /> Peta Arah Kiblat & Jadwal Sholat
              </li>
            </ul>
          </div>

          {/* Mission & Quote */}
          <div className="space-y-3 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/60">
            <h3 className="text-sm font-bold text-amber-300 font-serif">Amanah & Keberkahan</h3>
            <p className="text-xs text-emerald-200 leading-relaxed italic">
              "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya." (HR. Ahmad)
            </p>
            <div className="text-[10px] text-emerald-400 font-mono pt-1">
              © 2026 ABDICity.cloud • Islamicity 4B Network
            </div>
          </div>

        </div>

        <div className="border-t border-emerald-800/50 pt-6 text-center text-xs text-emerald-400">
          ABDICity.cloud — Platform Aplikasi Berjamaah Dakwah Islamicity 4B Kaffah
        </div>

      </div>
    </footer>
  );
};
