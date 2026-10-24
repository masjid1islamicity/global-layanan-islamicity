import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MOSQUE_LIST } from '../data/mockData';
import { Mosque } from '../types';
import { MapPin, Navigation, Search, Phone, Users, ExternalLink, Key, Sparkles, CheckCircle2 } from 'lucide-react';

interface PetaMasjidMapProps {
  onOpenInfaqModal: (campaignTitle?: string, presetAmount?: number) => void;
  onSelectMosqueBoard: (mosque: Mosque) => void;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function MosqueMarker({
  mosque,
  isSelected,
  onSelect,
  onOpenInfaqModal,
  onOpenBoard
}: {
  key?: string;
  mosque: Mosque;
  isSelected: boolean;
  onSelect: () => void;
  onOpenInfaqModal: (title?: string, amount?: number) => void;
  onOpenBoard: (m: Mosque) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: mosque.lat, lng: mosque.lng }}
        title={mosque.name}
        onClick={onSelect}
      >
        <Pin
          background={isSelected ? '#d97706' : '#065f46'}
          glyphColor="#ffffff"
          borderColor={isSelected ? '#fef3c7' : '#022c22'}
          scale={isSelected ? 1.25 : 1.0}
        >
          <span style={{ fontSize: '13px' }}>🕌</span>
        </Pin>
      </AdvancedMarker>

      {isSelected && (
        <InfoWindow
          anchor={marker}
          onCloseClick={onSelect}
          headerContent={<strong className="text-emerald-950 font-serif text-xs leading-tight">{mosque.name}</strong>}
        >
          <div className="p-1 space-y-2 max-w-xs text-xs font-sans">
            <img src={mosque.image} alt={mosque.name} className="w-full h-24 object-cover rounded-lg border border-emerald-100" />
            <p className="text-gray-600 text-[11px] flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{mosque.address}, {mosque.city} ({mosque.distanceKm} km)</span>
            </p>
            <div className="bg-emerald-50/80 p-2 rounded-lg text-[10px] space-y-0.5 text-emerald-900 border border-emerald-100">
              <p><strong>Khathib:</strong> {mosque.qhatibJumatThisWeek}</p>
              <p><strong>Kapasitas:</strong> {mosque.capacity} Jamaah</p>
            </div>
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => onOpenBoard(mosque)}
                className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold py-1.5 px-2 rounded-lg text-[10px] transition-all"
              >
                Papan Digital
              </button>
              <button
                onClick={() => onOpenInfaqModal(`Infaq Kas ${mosque.name}`, 50000)}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] transition-all"
              >
                Infaq Kas
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold p-1.5 rounded-lg text-[10px] flex items-center justify-center transition-all"
                title="Petunjuk Arah Google Maps"
              >
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export const PetaMasjidMap: React.FC<PetaMasjidMapProps> = ({ onOpenInfaqModal, onSelectMosqueBoard }) => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(MOSQUE_LIST[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<'all' | 'freeMeal' | 'ambulance'>('all');

  const filteredMosques = MOSQUE_LIST.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.address.toLowerCase().includes(searchQuery.toLowerCase()) || m.city.toLowerCase().includes(searchQuery.toLowerCase());
    if (facilityFilter === 'freeMeal') return matchesSearch && m.hasFreeJumatMeal;
    if (facilityFilter === 'ambulance') return matchesSearch && m.hasAmbulance;
    return matchesSearch;
  });

  const centerPos = selectedMosque ? { lat: selectedMosque.lat, lng: selectedMosque.lng } : { lat: -6.185, lng: 106.82 };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari masjid terdekat di peta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setFacilityFilter('all')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              facilityFilter === 'all' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Semua ({MOSQUE_LIST.length})
          </button>
          <button
            onClick={() => setFacilityFilter('freeMeal')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              facilityFilter === 'freeMeal' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Makan Jum'at Berkah
          </button>
          <button
            onClick={() => setFacilityFilter('ambulance')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              facilityFilter === 'ambulance' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Ambulans Siaga 24/7
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden relative min-h-[460px] flex flex-col">
          <div className="bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold border-b border-emerald-800">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Peta Lokasi Masjid Ekosistem ABDICity</span>
            </span>
            <span className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-mono">
              Google Maps API Active
            </span>
          </div>

          {!hasValidKey ? (
            <div className="p-6 bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-md">
                <Key className="w-7 h-7" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-base font-bold text-emerald-950 font-serif">Google Maps API Key Required</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Untuk mengaktifkan peta interaktif Google Maps secara langsung, tambahkan API key Anda ke dalam **Secrets** AI Studio.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs max-w-md w-full text-left text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Langkah Mudah Pengaktifan:</span>
                </div>
                <ol className="list-decimal list-inside text-gray-700 space-y-1 text-[11px] leading-relaxed">
                  <li>Dapatkan API Key di Google Maps Platform Console.</li>
                  <li>Buka <strong>Settings (⚙️)</strong> di pojok kanan atas UI AI Studio.</li>
                  <li>Pilih menu <strong>Secrets</strong>.</li>
                  <li>Ketik nama secret: <code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">GOOGLE_MAPS_PLATFORM_KEY</code></li>
                  <li>Paste API Key Anda dan tekan <strong>Enter</strong>.</li>
                </ol>
              </div>

              {/* Interactive Fallback Preview Cards */}
              <div className="w-full pt-2">
                <div className="text-left text-xs font-bold text-emerald-900 mb-2 flex items-center justify-between">
                  <span>Pratinjau Lokasi Masjid ({filteredMosques.length} Terdaftar):</span>
                  <span className="text-[10px] text-gray-500 font-normal">Klik untuk memilih masjid</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {filteredMosques.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMosque(m)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedMosque?.id === m.id
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-md'
                          : 'bg-white hover:bg-emerald-50 text-gray-800 border-emerald-200'
                      }`}
                    >
                      <div className="font-bold text-xs leading-tight font-serif">{m.name}</div>
                      <div className="text-[10px] opacity-80 mt-1 flex items-center justify-between">
                        <span>📍 {m.city} ({m.distanceKm} km)</span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="underline hover:text-amber-300 font-bold"
                        >
                          Buka Google Maps ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[480px] relative">
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  defaultCenter={centerPos}
                  center={centerPos}
                  defaultZoom={12}
                  zoom={13}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {filteredMosques.map((mosque) => (
                    <MosqueMarker
                      key={mosque.id}
                      mosque={mosque}
                      isSelected={selectedMosque?.id === mosque.id}
                      onSelect={() => setSelectedMosque(mosque)}
                      onOpenInfaqModal={onOpenInfaqModal}
                      onOpenBoard={onSelectMosqueBoard}
                    />
                  ))}
                </Map>
              </APIProvider>
            </div>
          )}
        </div>

        {/* Sidebar List of Mosques */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-emerald-100 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <h4 className="font-bold text-emerald-950 font-serif text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Daftar Masjid Terdekat</span>
            </h4>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {filteredMosques.length} Terdaftar
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredMosques.map((m) => {
              const isSelected = selectedMosque?.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMosque(m)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                      : 'bg-gray-50/60 hover:bg-emerald-50/40 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-emerald-950 text-xs font-serif leading-tight">{m.name}</h5>
                      <p className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{m.city} • {m.distanceKm} km</span>
                      </p>
                    </div>
                    {isSelected && (
                      <span className="bg-amber-400 text-emerald-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                        TERPILIH
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
                    {m.hasFreeJumatMeal && (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                        🍚 Makan Jum'at
                      </span>
                    )}
                    {m.hasAmbulance && (
                      <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold">
                        🚑 Ambulans
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-emerald-100 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMosqueBoard(m);
                      }}
                      className="flex-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold py-1.5 rounded-lg text-[10px] text-center transition-all"
                    >
                      Papan Digital
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-1.5 rounded-lg text-[10px] text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Rute</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
