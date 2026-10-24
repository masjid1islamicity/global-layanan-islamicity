import React, { useState } from 'react';
import { MOSQUE_LIST, CAMPAIGN_LIST } from '../data/mockData';
import { Mosque } from '../types';
import { Users, MapPin, Heart, CheckCircle2, Phone, Calendar, ArrowUpRight, Plus, UserCheck, Megaphone, Map, CalendarDays } from 'lucide-react';
import { PapanMasjidDigital } from './PapanMasjidDigital';
import { PetaMasjidMap } from './PetaMasjidMap';
import { MasjidEventCalendar } from './MasjidEventCalendar';
import { VolunteerOpportunities } from './VolunteerOpportunities';

interface PillarBerjamaahProps {
  onOpenInfaqModal: (campaignTitle?: string, presetAmount?: number) => void;
}

export const PillarBerjamaah: React.FC<PillarBerjamaahProps> = ({ onOpenInfaqModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'peta-masjid' | 'event-calendar' | 'papan-digital' | 'masjid-finder' | 'crowdfunding' | 'relawan'>('peta-masjid');

  // Masjid Filter State
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<'all' | 'freeMeal' | 'ambulance'>('all');
  const [masjidSearch, setMasjidSearch] = useState('');
  const [selectedMosqueBoard, setSelectedMosqueBoard] = useState<Mosque | null>(null);

  // Relawan Registration Form
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerDivision, setVolunteerDivision] = useState('Tim Media & Live Stream Dakwah');
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);

  const filteredMosques = MOSQUE_LIST.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(masjidSearch.toLowerCase()) || m.address.toLowerCase().includes(masjidSearch.toLowerCase());
    if (selectedFacilityFilter === 'freeMeal') return matchesSearch && m.hasFreeJumatMeal;
    if (selectedFacilityFilter === 'ambulance') return matchesSearch && m.hasAmbulance;
    return matchesSearch;
  });

  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone) return;
    setVolunteerSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Subtab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('peta-masjid')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'peta-masjid'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span>Peta Masjid Terdekat</span>
          </button>

          <button
            onClick={() => setActiveSubTab('event-calendar')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'event-calendar'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Kalender Agenda Masjid</span>
          </button>

          <button
            onClick={() => setActiveSubTab('papan-digital')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'papan-digital'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <span>Papan Masjid Digital</span>
          </button>

          <button
            onClick={() => setActiveSubTab('masjid-finder')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'masjid-finder'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Direktori Masjid & Jamaah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('crowdfunding')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'crowdfunding'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Wakaf & Infaq Berjamaah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('relawan')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'relawan'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Users className="w-4 h-4 text-teal-400" />
            <span>Sahabat & Relawan Masjid</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 0: PETA MASJID TERDEKAT (GOOGLE MAPS) */}
      {activeSubTab === 'peta-masjid' && (
        <PetaMasjidMap
          onOpenInfaqModal={onOpenInfaqModal}
          onSelectMosqueBoard={(mosque) => setSelectedMosqueBoard(mosque)}
        />
      )}

      {/* SUBTAB: KALENDER AGENDA MASJID */}
      {activeSubTab === 'event-calendar' && (
        <MasjidEventCalendar onOpenInfaqModal={onOpenInfaqModal} />
      )}

      {/* SUBTAB 1: PAPAN MASJID DIGITAL */}
      {activeSubTab === 'papan-digital' && (
        <PapanMasjidDigital onOpenInfaqModal={onOpenInfaqModal} />
      )}

      {/* SUBTAB 1: MASJID FINDER & DIGITAL BOARD */}
      {activeSubTab === 'masjid-finder' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Cari Masjid (contoh: Masjid Agung, Ar-Rahman)..."
              value={masjidSearch}
              onChange={(e) => setMasjidSearch(e.target.value)}
              className="w-full md:w-80 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
            />

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setSelectedFacilityFilter('all')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedFacilityFilter === 'all' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                Semua Masjid
              </button>
              <button
                onClick={() => setSelectedFacilityFilter('freeMeal')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedFacilityFilter === 'freeMeal' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                Makan Siang Berkah Jum'at
              </button>
              <button
                onClick={() => setSelectedFacilityFilter('ambulance')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedFacilityFilter === 'ambulance' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                Ambulans 24 Jam
              </button>
            </div>
          </div>

          {/* Mosque Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMosques.map((mosque) => (
              <div key={mosque.id} className="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img src={mosque.image} alt={mosque.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-700">
                      {mosque.distanceKm} km dari lokasi Anda
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-emerald-950 text-base leading-tight font-serif">{mosque.name}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{mosque.address}, {mosque.city}</span>
                    </p>

                    <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-xs space-y-1">
                      <div className="text-emerald-900 font-bold text-[11px] uppercase tracking-wider">Petugas Salat Jum'at:</div>
                      <p className="text-gray-700"><strong>Khathib:</strong> {mosque.qhatibJumatThisWeek}</p>
                      <p className="text-gray-700"><strong>Imam:</strong> {mosque.imajJumatThisWeek}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mosque.facilities.map((fac, i) => (
                        <span key={i} className="text-[10px] bg-emerald-100/60 text-emerald-800 font-medium px-2 py-0.5 rounded-md">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMosqueBoard(mosque)}
                    className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs py-2.5 rounded-xl transition-all text-center"
                  >
                    Papan Digital Masjid
                  </button>
                  <button
                    onClick={() => onOpenInfaqModal(`Infaq Kas ${mosque.name}`, 50000)}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl transition-all text-center"
                  >
                    Infaq Masjid
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Digital Mosque Board Modal */}
          {selectedMosqueBoard && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl border border-emerald-200 shadow-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setSelectedMosqueBoard(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold p-2 text-sm"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 font-serif font-black flex items-center justify-center text-xl">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-emerald-950 font-serif">{selectedMosqueBoard.name}</h3>
                    <p className="text-xs text-gray-500">Papan Pengumuman Digital & Laporan Keuangan Transparan</p>
                  </div>
                </div>

                {/* Cash Report */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">Saldo Kas Masjid</span>
                    <span className="text-base font-extrabold font-mono text-emerald-900 block mt-0.5">
                      Rp {selectedMosqueBoard.cashBalance.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Kapasitas Jamaah</span>
                    <span className="text-base font-extrabold font-mono text-amber-950 block mt-0.5">
                      {selectedMosqueBoard.capacity} Orang
                    </span>
                  </div>

                  <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-teal-800 font-bold block uppercase">Kontak DKM</span>
                    <span className="text-xs font-bold font-mono text-teal-950 block mt-1 flex items-center justify-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedMosqueBoard.contactPhone}
                    </span>
                  </div>
                </div>

                {/* Agenda Rutin */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-emerald-950 text-sm font-serif">Agenda Rutin Pengajian & Kegiatan:</h4>
                  <div className="space-y-1.5 text-gray-700">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span><strong>Kajian Subuh Sabtu:</strong> Tafsir Al-Qur'an Tematik</span>
                      <span className="text-[10px] font-bold text-emerald-700">Sabtu 05:00</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span><strong>TPA Santri Anak:</strong> Tahsin & Hafalan Juz Amma</span>
                      <span className="text-[10px] font-bold text-emerald-700">Senin - Kamis 16:00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => {
                      setSelectedMosqueBoard(null);
                      onOpenInfaqModal(`Infaq Kas ${selectedMosqueBoard.name}`, 100000);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    Salurkan Infaq ke Kas Masjid Ini
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CROWDFUNDING WAKAF */}
      {activeSubTab === 'crowdfunding' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-emerald-950 font-serif text-xl">Wakaf & Infaq Berjamaah ABDICity</h3>
            <p className="text-xs text-gray-600">Gotong royong membangun sarana dakwah, ambulans gratis, dan kesejahteraan ummat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAMPAIGN_LIST.map((c) => {
              const percentage = Math.min(100, Math.round((c.collectedAmount / c.targetAmount) * 100));

              return (
                <div key={c.id} className="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-amber-400 text-emerald-950 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                        {c.deadlineDays} Hari Lagi
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        {c.category}
                      </span>
                      <h4 className="font-bold text-emerald-950 text-base leading-snug">{c.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{c.description}</p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-emerald-800">Terkumpul: Rp {c.collectedAmount.toLocaleString('id-ID')}</span>
                          <span className="text-amber-600">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onOpenInfaqModal(c.title, 50000)}
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-amber-300" />
                      <span>Salurkan Wakaf Sekarang</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PELUANG RELAWAN & KHADIMUL MASJID */}
      {activeSubTab === 'relawan' && <VolunteerOpportunities />}
    </div>
  );
};
