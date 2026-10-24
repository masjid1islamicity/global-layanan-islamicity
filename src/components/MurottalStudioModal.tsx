import React, { useState } from 'react';
import { useMurottal } from '../context/MurottalContext';
import {
  MUROTTAL_SURAHS,
  MUROTTAL_QARI_LIST,
  MurottalSurah
} from '../data/murottalData';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Volume1,
  RotateCw,
  Sparkles,
  Headphones,
  Calendar,
  Clock,
  Bell,
  BellRing,
  Check,
  Copy,
  Radio,
  Sliders,
  BookOpen,
  Search,
  CheckCircle2,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';

export const MurottalStudioModal: React.FC = () => {
  const {
    currentSurah,
    currentQari,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isLooping,
    autoNext,
    config,
    isStudioModalOpen,
    playSurah,
    togglePlay,
    playNextSurah,
    playPrevSurah,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleLoop,
    toggleAutoNext,
    setQari,
    updateConfig,
    triggerPrayerAutoPlay,
    setIsStudioModalOpen
  } = useMurottal();

  const [activeTab, setActiveTab] = useState<'player' | 'surahs' | 'prayers' | 'qaris'>('player');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'prayer' | 'juz30'>('all');
  const [copiedAyah, setCopiedAyah] = useState(false);
  const [simulatedPrayerToast, setSimulatedPrayerToast] = useState<string | null>(null);

  if (!isStudioModalOpen) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleCopyAyah = () => {
    const text = `"${currentSurah.sampleAyahArabic}"\n\n"${currentSurah.sampleAyahTranslation}" (QS. ${currentSurah.latinName}: Ayat Pilihan)\n\nLantunan Murottal: ${currentQari.name} - via ABDICity.cloud`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(true);
    setTimeout(() => setCopiedAyah(false), 2000);
  };

  // Filtered surahs list
  const filteredSurahs = MUROTTAL_SURAHS.filter((surah) => {
    const matchSearch =
      surah.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery);

    if (!matchSearch) return false;
    if (filterTag === 'prayer') return surah.recommendedPrayer !== 'Kapan Saja';
    if (filterTag === 'juz30') return surah.number >= 78;
    return true;
  });

  const handleSimulatePrayer = (prayerName: 'Subuh' | 'Dzuhur' | 'Ashar' | 'Maghrib' | 'Isya') => {
    triggerPrayerAutoPlay(prayerName);
    const surahId = config.prayerMapping[prayerName];
    const targetSurah = MUROTTAL_SURAHS.find((s) => s.number === surahId) || currentSurah;
    setSimulatedPrayerToast(`🕌 Simulasi Berhasil: Lantunan QS. ${targetSurah.latinName} diputar untuk waktu ${prayerName}!`);
    setTimeout(() => setSimulatedPrayerToast(null), 4000);
  };

  const handlePrayerSurahChange = (prayer: 'Subuh' | 'Dzuhur' | 'Ashar' | 'Maghrib' | 'Isya', surahNumber: number) => {
    updateConfig({
      prayerMapping: {
        ...config.prayerMapping,
        [prayer]: surahNumber
      }
    });
  };

  const handlePrayerToggle = (prayer: 'Subuh' | 'Dzuhur' | 'Ashar' | 'Maghrib' | 'Isya') => {
    updateConfig({
      prayerToggles: {
        ...config.prayerToggles,
        [prayer]: !config.prayerToggles[prayer]
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 w-full max-w-4xl rounded-3xl border-2 border-emerald-700/80 shadow-2xl text-emerald-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/80 flex items-center justify-between gap-4 bg-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-amber-300 shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-white text-base sm:text-lg">
                  Studio Murottal Al-Qur'an & Jadwal Sholat
                </h2>
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  4B Terpadu
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                Lantunan ayat suci otomatis tersinkronisasi waktu sholat berjamaah
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStudioModalOpen(false)}
            className="p-2 text-emerald-400 hover:text-white rounded-full hover:bg-emerald-800/60 transition-colors"
            title="Tutup Studio Murottal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-emerald-800/80 px-4 sm:px-6 bg-emerald-950/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('player')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'player'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-emerald-400 hover:text-emerald-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Sedang Diputar & Tadabbur</span>
          </button>

          <button
            onClick={() => setActiveTab('prayers')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'prayers'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-emerald-400 hover:text-emerald-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Sinkronisasi Jadwal Sholat</span>
            {config.autoPlayEnabled && (
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('surahs')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'surahs'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-emerald-400 hover:text-emerald-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Daftar Surah ({MUROTTAL_SURAHS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qaris')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'qaris'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-emerald-400 hover:text-emerald-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Pilihan Qari ({MUROTTAL_QARI_LIST.length})</span>
          </button>
        </div>

        {/* Simulated Toast */}
        {simulatedPrayerToast && (
          <div className="bg-amber-500 text-emerald-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
            <span>{simulatedPrayerToast}</span>
            <button onClick={() => setSimulatedPrayerToast(null)} className="p-0.5 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: PLAYER & TADABBUR AYAT */}
          {activeTab === 'player' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Visual Medallion & Surah Details */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4 bg-emerald-900/40 p-6 rounded-3xl border border-emerald-800/80">
                {/* Quran Medallion with pulsing glow */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-emerald-950 via-teal-900 to-emerald-800 border-4 border-amber-400/80 shadow-2xl flex items-center justify-center p-4">
                  <div className={`absolute inset-0 rounded-full border border-amber-300/30 ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`} />
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-emerald-950 border border-emerald-700/60 flex flex-col items-center justify-center p-4 relative z-10 shadow-inner">
                    <span className="text-[10px] text-amber-300 font-mono tracking-widest uppercase">
                      SURAH KE-{currentSurah.number}
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-amber-200 my-1">
                      {currentSurah.nameArabic}
                    </h3>
                    <span className="font-bold text-xs text-white">
                      QS. {currentSurah.latinName}
                    </span>
                    <span className="text-[10px] text-emerald-300 italic">
                      "{currentSurah.meaning}"
                    </span>
                  </div>

                  {/* Pulsing indicator when playing */}
                  {isPlaying && (
                    <div className="absolute -bottom-2 bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                      MEMUTAR
                    </div>
                  )}
                </div>

                <div className="w-full space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs bg-emerald-800/70 text-emerald-200 px-2 py-0.5 rounded-md">
                      {currentSurah.revelation}
                    </span>
                    <span className="text-xs bg-emerald-800/70 text-emerald-200 px-2 py-0.5 rounded-md">
                      {currentSurah.ayahCount} Ayat
                    </span>
                    {currentSurah.recommendedPrayer !== 'Kapan Saja' && (
                      <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md font-bold">
                        Waktu Sholat {currentSurah.recommendedPrayer}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-emerald-300 pt-1">
                    Qari: <strong className="text-white">{currentQari.flag} {currentQari.name}</strong>
                  </div>
                </div>

                {/* Keutamaan (Fadhilah) Box */}
                <div className="w-full bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/80 text-left text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fadhilah & Sunnah Sholat:</span>
                  </div>
                  <p className="text-emerald-200 leading-relaxed text-[11px]">
                    {currentSurah.fadhilah}
                  </p>
                </div>
              </div>

              {/* Right Column: Audio Scrubber Controls & Tadabbur Verses */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Featured Verse Display with Tadabbur */}
                <div className="bg-emerald-900/40 p-5 rounded-3xl border border-emerald-800/80 space-y-3 relative group">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-emerald-800/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      Lantunan Ayat Pilihan Tadabbur
                    </span>
                    <button
                      onClick={handleCopyAyah}
                      className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white px-2 py-1 rounded hover:bg-emerald-800 transition-colors"
                      title="Salin Ayat & Makna"
                    >
                      {copiedAyah ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAyah ? 'Tersalin' : 'Salin Ayat'}</span>
                    </button>
                  </div>

                  <p className="text-right font-serif text-lg sm:text-xl text-amber-100 font-bold leading-loose tracking-wide pt-1">
                    {currentSurah.sampleAyahArabic}
                  </p>
                  
                  <div className="space-y-1 pt-1">
                    <p className="text-xs text-emerald-300 font-sans italic">
                      "{currentSurah.sampleAyahLatin}"
                    </p>
                    <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                      "{currentSurah.sampleAyahTranslation}"
                    </p>
                  </div>
                </div>

                {/* Audio Seek Scrubber */}
                <div className="space-y-2 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-emerald-400">Total: {formatTime(duration)}</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-2 bg-emerald-900 rounded-lg cursor-pointer"
                  />

                  {/* Playback Controls Toolbar */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Left: Loop & Next */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={toggleLoop}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                          isLooping
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                            : 'bg-emerald-900/60 text-emerald-400 border-emerald-800 hover:text-white'
                        }`}
                        title="Ulangi Surah Ini"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={toggleAutoNext}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          autoNext
                            ? 'bg-emerald-800 text-emerald-200 border-emerald-700'
                            : 'bg-emerald-950/60 text-emerald-500 border-emerald-800'
                        }`}
                        title="Putar Otomatis Surah Berikutnya"
                      >
                        Auto-Next {autoNext ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    {/* Center: Main Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={playPrevSurah}
                        className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-900 rounded-full transition-all"
                        title="Surah Sebelumnya"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>

                      <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-lg transition-all transform active:scale-95"
                        title={isPlaying ? 'Jeda' : 'Putar'}
                      >
                        {isLoading ? (
                          <RotateCw className="w-6 h-6 animate-spin text-emerald-950" />
                        ) : isPlaying ? (
                          <Pause className="w-6 h-6 fill-emerald-950" />
                        ) : (
                          <Play className="w-6 h-6 fill-emerald-950 ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={playNextSurah}
                        className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-900 rounded-full transition-all"
                        title="Surah Berikutnya"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Right: Playback Speed Chips */}
                    <div className="flex items-center gap-1">
                      {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setPlaybackRate(rate)}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                            playbackRate === rate
                              ? 'bg-amber-400 text-emerald-950 shadow-sm'
                              : 'bg-emerald-900/80 text-emerald-300 hover:text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider in Studio */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900">
                    <button onClick={toggleMute} className="text-emerald-300 hover:text-white">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-24 accent-amber-400 h-1 bg-emerald-900 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-emerald-400 w-8 text-right">
                      {Math.round((isMuted ? 0 : volume) * 100)}%
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PENGATURAN SINKRONISASI JADWAL SHOLAT */}
          {activeTab === 'prayers' && (
            <div className="space-y-6">
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-emerald-900/70 via-teal-900/60 to-emerald-950 p-5 rounded-3xl border border-amber-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
                    <h3 className="font-bold text-white text-base">
                      Integrasi Lantunan Murottal Jadwal Sholat
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-200 max-w-xl">
                    Sistem akan memutar ayat-ayat Al-Qur'an secara otomatis ketika waktu sholat tiba (atau menjelang sholat), menghadirkan suasana tenang dan syiar Islami kaffah di perangkat Anda.
                  </p>
                </div>

                {/* Master Autoplay Switch */}
                <div className="bg-emerald-950/90 p-3 rounded-2xl border border-emerald-700 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">Auto-Play Sholat</span>
                    <span className="text-[10px] text-emerald-300">
                      {config.autoPlayEnabled ? 'Aktif Otomatis' : 'Dimatikan'}
                    </span>
                  </div>
                  <button
                    onClick={() => updateConfig({ autoPlayEnabled: !config.autoPlayEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      config.autoPlayEnabled ? 'bg-amber-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-md ${
                        config.autoPlayEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Timing Selection Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-200 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Waktu Pemutaran Murottal:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'adzan_arrival',
                      label: 'Saat Waktu Sholat Tiba',
                      desc: 'Tepat saat jam masuk sholat berkumandang bersamaan dengan alarm adzan.'
                    },
                    {
                      id: 'tarhim_pre',
                      label: 'Tarhim Pra-Sholat (5 Menit Sebelum)',
                      desc: 'Mengingatkan jamaah berwudhu dan bersiap sholat berjamaah.'
                    },
                    {
                      id: 'after_adzan',
                      label: 'Pasca Adzan (Tadabbur Menuju Iqamah)',
                      desc: 'Mengiringi waktu mustajab doa antara adzan dan iqamah.'
                    }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateConfig({ playTiming: mode.id as any })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        config.playTiming === mode.id
                          ? 'bg-emerald-900 border-amber-400 text-white shadow-md'
                          : 'bg-emerald-950/50 border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{mode.label}</span>
                        {config.playTiming === mode.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-300 mt-1 leading-snug">
                        {mode.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix of 5 Daily Prayers Configuration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="w-4 h-4" />
                    Konfigurasi Surah Khusus Tiap Waktu Sholat:
                  </h4>
                  <span className="text-[11px] text-emerald-400">
                    Klik "Uji Putar" untuk mencoba secara langsung
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'] as const).map((prayer) => {
                    const isEnabled = config.prayerToggles[prayer] !== false;
                    const assignedSurahNum = config.prayerMapping[prayer];
                    const currentAssignedSurah = MUROTTAL_SURAHS.find((s) => s.number === assignedSurahNum) || MUROTTAL_SURAHS[0];

                    return (
                      <div
                        key={prayer}
                        className={`p-4 rounded-2xl border transition-all ${
                          isEnabled
                            ? 'bg-emerald-900/50 border-emerald-700/80 shadow-inner'
                            : 'bg-emerald-950/30 border-emerald-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-amber-300 text-base">
                              Sholat {prayer}
                            </span>
                            <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                              {prayer === 'Subuh' && 'Fajar & Rezeki'}
                              {prayer === 'Dzuhur' && 'Siang & Syukur'}
                              {prayer === 'Ashar' && 'Petang & Kelapangan'}
                              {prayer === 'Maghrib' && 'Malam & Perlindungan'}
                              {prayer === 'Isya' && 'Ketenangan Jiwa'}
                            </span>
                          </div>

                          {/* Toggle switch for this prayer */}
                          <button
                            onClick={() => handlePrayerToggle(prayer)}
                            className={`w-10 h-5 rounded-full transition-all relative ${
                              isEnabled ? 'bg-amber-400' : 'bg-gray-600'
                            }`}
                            title={`Aktifkan lantunan untuk sholat ${prayer}`}
                          >
                            <div
                              className={`w-4 h-4 bg-emerald-950 rounded-full absolute top-0.5 transition-all shadow-sm ${
                                isEnabled ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Surah Selector for this prayer */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] text-emerald-300 font-semibold">Surah Pilihan:</label>
                            <span className="font-serif text-amber-200 text-xs">
                              {currentAssignedSurah.nameArabic}
                            </span>
                          </div>

                          <select
                            value={assignedSurahNum}
                            onChange={(e) => handlePrayerSurahChange(prayer, parseInt(e.target.value))}
                            disabled={!isEnabled}
                            className="w-full bg-emerald-950 text-white border border-emerald-700 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                          >
                            {MUROTTAL_SURAHS.map((s) => (
                              <option key={s.number} value={s.number}>
                                QS. {s.number}. {s.latinName} ({s.meaning}) - {s.revelation}
                              </option>
                            ))}
                          </select>

                          <p className="text-[11px] text-emerald-300 italic pt-0.5 line-clamp-1">
                            {currentAssignedSurah.fadhilah}
                          </p>
                        </div>

                        {/* Test Button */}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleSimulatePrayer(prayer)}
                            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-emerald-950" />
                            <span>Uji Putar Waktu {prayer}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DAFTAR SURAH MUROTTAL */}
          {activeTab === 'surahs' && (
            <div className="space-y-4">
              
              {/* Search & Filter Header */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari surah (misal: Al-Mulk, Yasin)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-emerald-900/60 border border-emerald-700 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
                  <button
                    onClick={() => setFilterTag('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterTag === 'all'
                        ? 'bg-amber-400 text-emerald-950 shadow-sm'
                        : 'bg-emerald-900/60 text-emerald-300 hover:text-white'
                    }`}
                  >
                    Semua ({MUROTTAL_SURAHS.length})
                  </button>
                  <button
                    onClick={() => setFilterTag('prayer')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterTag === 'prayer'
                        ? 'bg-amber-400 text-emerald-950 shadow-sm'
                        : 'bg-emerald-900/60 text-emerald-300 hover:text-white'
                    }`}
                  >
                    Fadhilah Sholat
                  </button>
                  <button
                    onClick={() => setFilterTag('juz30')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterTag === 'juz30'
                        ? 'bg-amber-400 text-emerald-950 shadow-sm'
                        : 'bg-emerald-900/60 text-emerald-300 hover:text-white'
                    }`}
                  >
                    Juz 'Amma
                  </button>
                </div>
              </div>

              {/* Grid of Surah Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSurahs.map((surah) => {
                  const isCurrent = currentSurah.number === surah.number;

                  return (
                    <div
                      key={surah.number}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-emerald-900 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-emerald-950/60 border-emerald-800/80 hover:bg-emerald-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 border ${
                            isCurrent
                              ? 'bg-amber-400 text-emerald-950 border-amber-300'
                              : 'bg-emerald-900 text-emerald-200 border-emerald-700'
                          }`}
                        >
                          {surah.number}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-white truncate">
                              QS. {surah.latinName}
                            </h4>
                            <span className="font-serif text-amber-300 text-xs">
                              {surah.nameArabic}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-300 truncate">
                            {surah.meaning} • {surah.ayahCount} Ayat • {surah.revelation}
                          </p>
                          {surah.recommendedPrayer !== 'Kapan Saja' && (
                            <span className="inline-block mt-0.5 text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-medium">
                              Sholat {surah.recommendedPrayer}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            if (isCurrent) {
                              togglePlay();
                            } else {
                              playSurah(surah);
                            }
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${
                            isCurrent && isPlaying
                              ? 'bg-amber-400 text-emerald-950'
                              : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                          }`}
                          title={isCurrent && isPlaying ? 'Jeda' : `Putar QS. ${surah.latinName}`}
                        >
                          {isCurrent && isPlaying ? (
                            <Pause className="w-4 h-4 fill-emerald-950" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: PILIHAN QARI INTERNASIONAL */}
          {activeTab === 'qaris' && (
            <div className="space-y-4">
              <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/80">
                <h3 className="font-bold text-white text-sm">
                  Pilihan Qari & Imam Masjidil Haram Makkah / Madinah
                </h3>
                <p className="text-xs text-emerald-300">
                  Pilih lantunan suara syaikh favorit Anda. Lantunan akan disesuaikan secara real-time untuk seluruh surah dan jadwal sholat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MUROTTAL_QARI_LIST.map((qari) => {
                  const isSelected = currentQari.id === qari.id;

                  return (
                    <div
                      key={qari.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-900 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-emerald-950/60 border-emerald-800/80 hover:bg-emerald-900/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={qari.avatar}
                          alt={qari.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-white text-sm">
                              {qari.name}
                            </h4>
                            <span className="text-base" title={qari.country}>{qari.flag}</span>
                          </div>
                          <span className="text-[11px] text-amber-300 block font-medium">
                            {qari.title}
                          </span>
                          <p className="text-[11px] text-emerald-300 mt-1 leading-snug">
                            {qari.styleDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-emerald-800/60">
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Format Audio: MP3 128kbps High Clarity
                        </span>
                        <button
                          onClick={() => setQari(qari.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isSelected
                              ? 'bg-amber-400 text-emerald-950 shadow-sm'
                              : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Qari Aktif</span>
                            </>
                          ) : (
                            <span>Pilih Qari Ini</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-emerald-800/80 bg-emerald-950/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>
              Aktif: <strong>QS. {currentSurah.latinName}</strong> oleh <strong>{currentQari.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStudioModalOpen(false)}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all"
            >
              Tutup Studio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
