import React, { useState } from 'react';
import { useMurottal } from '../context/MurottalContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  Radio,
  Sparkles,
  BellRing,
  X,
  Clock,
  Music,
  Headphones,
  RotateCw
} from 'lucide-react';

export const MurottalFloatingPlayer: React.FC = () => {
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
    activePrayerNotification,
    togglePlay,
    playNextSurah,
    playPrevSurah,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleLoop,
    setIsStudioModalOpen,
    dismissPrayerNotification
  } = useMurottal();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  // If collapsed to small floating bubble
  if (isCollapsed) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom duration-200">
        <div className="bg-gradient-to-r from-emerald-950 to-teal-950 text-white rounded-full p-2 border-2 border-amber-400/80 shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <button
            onClick={() => setIsStudioModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-1 hover:opacity-90 transition-opacity"
            title="Buka Pemutar Murottal Sholat"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 relative">
              <Headphones className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div className="text-left text-xs max-w-[130px] truncate">
              <span className="font-bold text-amber-300 block truncate">
                {currentSurah.latinName}
              </span>
              <span className="text-[10px] text-emerald-300 block truncate">
                {currentQari.name.split(' ')[0]} {currentQari.name.split(' ')[1] || ''}
              </span>
            </div>
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md transition-all"
            title={isPlaying ? 'Jeda Murottal' : 'Putar Murottal'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-emerald-950" /> : <Play className="w-3.5 h-3.5 fill-emerald-950 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 text-emerald-400 hover:text-white rounded-full hover:bg-emerald-800/50 transition-colors"
            title="Perbesar Kontrol Pemutar"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Active Prayer Arrival Toast Alert */}
      {activePrayerNotification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white p-3.5 rounded-2xl border-2 border-amber-400 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 flex-shrink-0 animate-bounce">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-400 text-emerald-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">
                    WAKTU SHOLAT {activePrayerNotification.prayerName.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-300">Telah Masuk</span>
                </div>
                <div className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                  <span>Lantunan: QS. {activePrayerNotification.latinName}</span>
                  <span className="font-serif text-amber-300 text-xs">{activePrayerNotification.surahName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsStudioModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1"
              >
                <span>Buka</span>
              </button>
              <button
                onClick={dismissPrayerNotification}
                className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800/60"
                title="Tutup Notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Docked Persistent Audio Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-950/95 via-teal-950/95 to-emerald-950/95 backdrop-blur-md border-t border-emerald-800/80 text-white shadow-2xl transition-all">
        {/* Progress Seek Scrubber Bar (Top edge) */}
        <div className="relative group w-full h-1.5 bg-emerald-900/60 cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all relative"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="w-3 h-3 bg-white border border-amber-500 rounded-full absolute right-0 top-1/2 -translate-y-1/2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Geser posisi lantunan ayat"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Surah Info & Wave Visualizer */}
          <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs md:max-w-sm">
            {/* Spinning/Pulsing Quran Icon */}
            <button
              onClick={() => setIsStudioModalOpen(true)}
              className="relative w-10 h-10 rounded-xl bg-emerald-900 border border-amber-400/50 flex items-center justify-center flex-shrink-0 group overflow-hidden shadow-inner"
              title="Buka Studio Murottal Lengkap"
            >
              <div className={`w-full h-full flex items-center justify-center transition-transform ${isPlaying ? 'scale-105' : ''}`}>
                <Headphones className="w-5 h-5 text-amber-400" />
              </div>
              {/* Animated Sound Wave Bars */}
              {isPlaying && (
                <div className="absolute inset-x-1 bottom-1 flex items-end justify-center gap-0.5 h-3">
                  <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3" />
                  <span className="w-1 bg-amber-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
                  <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
                </div>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-white truncate hover:text-amber-300 cursor-pointer transition-colors" onClick={() => setIsStudioModalOpen(true)}>
                  {currentSurah.number}. QS. {currentSurah.latinName}
                </span>
                <span className="font-serif text-amber-300 text-xs hidden sm:inline">
                  {currentSurah.nameArabic}
                </span>
                {currentSurah.recommendedPrayer !== 'Kapan Saja' && (
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-medium">
                    Sholat {currentSurah.recommendedPrayer}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-300 truncate flex items-center gap-1.5">
                <span>{currentQari.flag} {currentQari.name}</span>
                <span className="text-emerald-500">•</span>
                <span className="font-mono text-emerald-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Center: Main Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={playPrevSurah}
              className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-900/60 rounded-full transition-all"
              title="Surah Sebelumnya"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold transition-all shadow-lg transform active:scale-95 ${
                isLoading
                  ? 'bg-amber-400/50 cursor-wait'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 hover:shadow-amber-500/20'
              }`}
              title={isPlaying ? 'Jeda Murottal (Spasi)' : 'Putar Lantunan Murottal'}
            >
              {isLoading ? (
                <RotateCw className="w-5 h-5 animate-spin text-emerald-950" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-emerald-950" />
              ) : (
                <Play className="w-5 h-5 fill-emerald-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={playNextSurah}
              className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-900/60 rounded-full transition-all"
              title="Surah Berikutnya"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Loop surah toggle */}
            <button
              onClick={toggleLoop}
              className={`p-1.5 rounded-full text-xs transition-all hidden md:flex items-center gap-1 ${
                isLooping
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-emerald-400 hover:text-white'
              }`}
              title={isLooping ? 'Ulangi Surah: Aktif' : 'Ulangi Surah: Nonaktif'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLooping ? 'rotate-180' : ''}`} />
            </button>

            {/* Playback speed toggle */}
            <button
              onClick={() => {
                const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 0.75 : 1.0;
                setPlaybackRate(nextRate);
              }}
              className="hidden lg:flex items-center text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-900/70 border border-emerald-700 text-emerald-200 hover:text-amber-300"
              title="Kecepatan Lantunan (Tadabbur/Tahsin)"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Right: Volume & Expand & Minimize Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-emerald-300 hover:text-white p-1 rounded-full transition-colors"
                title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-300" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-20 accent-amber-400 h-1 bg-emerald-900 rounded-lg cursor-pointer"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>

            {/* Full Studio Button */}
            <button
              onClick={() => setIsStudioModalOpen(true)}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 font-bold px-3 py-1.5 rounded-xl text-xs transition-all border border-emerald-700/80 flex items-center gap-1.5 shadow-sm"
              title="Buka Studio Murottal Al-Quran & Pengaturan Jadwal Sholat"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Studio Murottal</span>
            </button>

            {/* Minimize / Collapse Button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-900/60 rounded-full transition-colors"
              title="Kecilkan Pemutar ke Sudut"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
