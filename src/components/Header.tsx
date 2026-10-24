import React, { useState } from 'react';
import { PillarType } from '../types';
import { BookOpen, ShieldCheck, Users, ShoppingBag, HeartHandshake, MapPin, Sparkles, User, BarChart3, Cloud, Terminal, LocateFixed } from 'lucide-react';
import { findNearestCity } from '../utils/prayerCalculator';

interface HeaderProps {
  activePillar: PillarType;
  setActivePillar: (pillar: PillarType) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onOpenInfaqModal: () => void;
  onOpenUserProfile: () => void;
  onOpenGcpFacilitator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePillar,
  setActivePillar,
  selectedCity,
  setSelectedCity,
  onOpenInfaqModal,
  onOpenUserProfile,
  onOpenGcpFacilitator
}) => {
  const cities = [
    "Bandung",
    "Depok",
    "Jakarta Pusat",
    "Jakarta Selatan",
    "Makassar",
    "Medan",
    "Palembang",
    "Surabaya",
    "Yogyakarta"
  ];
  const [isLocating, setIsLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Fitur Geolocation tidak didukung pada browser ini.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { city } = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setSelectedCity(city);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Gagal mendeteksi lokasi GPS atau izin ditolak. Anda dapat memilih kota secara manual di daftar.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md text-emerald-50 border-b border-emerald-800/60 shadow-xl">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs border-b border-emerald-800/40 gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" /> ABDICity 4B Kaffah
          </span>
          <span className="hidden sm:inline text-emerald-300/80">
            Aplikasi Berjamaah Dakwah Islamicity • Berdakwah, Bersyariah, Berjamaah, Bermuamalah
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-emerald-200 bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-emerald-100 font-medium cursor-pointer focus:outline-none text-xs"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="bg-emerald-900 text-emerald-100">
                  {city}
                </option>
              ))}
            </select>
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              title="Deteksi Lokasi Device Saat Ini (GPS)"
              className="ml-1 p-0.5 hover:bg-emerald-800 text-amber-300 hover:text-amber-200 rounded transition-all"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : 'text-amber-300'}`} />
            </button>
          </div>

          <button
            onClick={onOpenGcpFacilitator}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-800 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-2.5 py-1 rounded-md border border-blue-400/40 shadow-sm transition-all transform active:scale-95 text-xs"
            title="Buka Fasilitator Google Cloud Platform (DevOps, Arsitektur, & FinOps)"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span className="hidden sm:inline">GCP Facilitator</span>
            <span className="sm:hidden">GCP</span>
          </button>

          <button
            onClick={onOpenInfaqModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold px-3 py-1 rounded-md shadow-md transition-all transform active:scale-95 text-xs"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Infaq</span>
          </button>

          <button
            onClick={onOpenUserProfile}
            className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-2.5 py-1 rounded-md border border-emerald-700/80 transition-all shadow-sm transform active:scale-95 text-xs"
            title="Lihat Profil Jamaah & Grafik Infaq"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Profil</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-300/30">
            <span className="font-serif font-black text-2xl text-emerald-950 tracking-tighter">4B</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                ABDICity<span className="text-amber-400 font-sans text-sm font-semibold ml-1">.cloud</span>
              </h1>
              <button
                onClick={onOpenGcpFacilitator}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30 text-[10px] font-mono transition-all"
                title="Buka Fasilitator Google Cloud Platform"
              >
                <Cloud className="w-3 h-3 text-blue-400" />
                <span>Google Cloud Run</span>
              </button>
            </div>
            <p className="text-xs text-emerald-300/90 font-medium">
              Platform Dakwah & Ekosistem Syariah Kaffah
            </p>
          </div>
        </div>

        {/* 4B Pillar Tabs */}
        <nav className="flex items-center gap-1.5 bg-emerald-900/80 p-1.5 rounded-xl border border-emerald-800 shadow-inner w-full md:w-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActivePillar('berdakwah')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activePillar === 'berdakwah'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/60'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>1. Berdakwah</span>
          </button>

          <button
            onClick={() => setActivePillar('bersyariah')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activePillar === 'bersyariah'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/60'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>2. Bersyariah</span>
          </button>

          <button
            onClick={() => setActivePillar('berjamaah')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activePillar === 'berjamaah'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/60'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-300" />
            <span>3. Berjamaah</span>
          </button>

          <button
            onClick={() => setActivePillar('bermuamalah')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activePillar === 'bermuamalah'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/60'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>4. Bermuamalah</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
