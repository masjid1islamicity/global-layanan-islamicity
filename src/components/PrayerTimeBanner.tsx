import React, { useState, useEffect, useRef } from 'react';
import { PrayerTime } from '../types';
import {
  Compass,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Calendar,
  Sun,
  Moon,
  Sparkles,
  Bell,
  BellRing,
  BellOff,
  Play,
  Square,
  X,
  Sliders,
  Clock,
  Megaphone,
  CheckCircle2,
  Volume1,
  LocateFixed
} from 'lucide-react';
import {
  CITIES_DATA,
  calculatePrayerTimes,
  formatIndonesianDate,
  getHijriDate,
  evaluatePrayerSchedule,
  findNearestCity
} from '../utils/prayerCalculator';

interface PrayerTimeBannerProps {
  selectedCity: string;
  onCityChange?: (city: string) => void;
}

export const PrayerTimeBanner: React.FC<PrayerTimeBannerProps> = ({ selectedCity, onCityChange }) => {
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Live device time updated every second
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [isLocating, setIsLocating] = useState(false);
  const [gpsDetectedCity, setGpsDetectedCity] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Attempt auto-detection once on mount if geolocation permission is granted
  useEffect(() => {
    if ('geolocation' in navigator && onCityChange) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { city } = findNearestCity(pos.coords.latitude, pos.coords.longitude);
          setGpsDetectedCity(city);
          onCityChange(city);
        },
        () => {
          // silently continue
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

  const handleDetectDeviceLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Perangkat Anda tidak mendukung fitur Geolocation.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { city } = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setGpsDetectedCity(city);
        if (onCityChange) {
          onCityChange(city);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Gagal mendeteksi lokasi GPS atau izin ditolak. Anda dapat memilih kota secara manual di daftar.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const currentCityData = CITIES_DATA[selectedCity] || CITIES_DATA["Depok"] || CITIES_DATA["Jakarta Pusat"];
  const qiblaAngle = currentCityData.qibla;

  // Calculate dynamic prayer times for today for the active city
  const rawTimes = calculatePrayerTimes(
    currentCityData.lat,
    currentCityData.lng,
    currentCityData.timezone,
    currentTime
  );

  // Evaluate dynamic active & next prayer (giving the orange highlight to the upcoming prayer)
  const statusResult = evaluatePrayerSchedule(rawTimes, currentTime);
  const prayerTimes: PrayerTime[] = statusResult.prayerTimes;
  const countdown = statusResult.countdownText;
  const nextPrayerName = statusResult.nextPrayerName;
  const isTomorrow = statusResult.isTomorrow;

  // Notification & Adzan Alarm States
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);
  const [soundMode, setSoundMode] = useState<'adzan' | 'chime' | 'mute'>('adzan');
  const [desktopNotifGranted, setDesktopNotifGranted] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAdzanModal, setShowAdzanModal] = useState(false);
  const [activeAdzanPrayer, setActiveAdzanPrayer] = useState<string>('Maghrib');
  const [iqamahCountdown, setIqamahCountdown] = useState<number>(600); // 10 minutes for Iqamah
  const [isAdzanAudioPlaying, setIsAdzanAudioPlaying] = useState(false);

  // Per-Prayer Alarm Toggles
  const [prayerNotifConfig, setPrayerNotifConfig] = useState<Record<string, boolean>>({
    Subuh: true,
    Dzuhur: true,
    Ashar: true,
    Maghrib: true,
    Isya: true,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Check desktop notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setDesktopNotifGranted(Notification.permission === 'granted');
    }
  }, []);

  // Daily Wisdom Quote
  const dailyAyah = {
    arabic: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ",
    translation: "Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.",
    source: "QS. Al-Ma'idah [5]: 2"
  };

  // Iqamah timer effect when Adzan modal is active
  useEffect(() => {
    let timer: any;
    if (showAdzanModal && iqamahCountdown > 0) {
      timer = setInterval(() => {
        setIqamahCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showAdzanModal, iqamahCountdown]);

  // Web Audio API Synthesizer for Adzan & Chime Tones
  const playAdzanSound = (modeOverride?: 'adzan' | 'chime' | 'mute') => {
    const activeMode = modeOverride || soundMode;
    if (activeMode === 'mute') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsAdzanAudioPlaying(true);

      if (activeMode === 'chime') {
        // Spiritual 3-note chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.4);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.4 + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.4);
          osc.stop(ctx.currentTime + idx * 0.4 + 1.5);
        });

        setTimeout(() => setIsAdzanAudioPlaying(false), 2200);
      } else {
        // Takbir Melody Simulation ("Allahu Akbar, Allahu Akbar")
        const takbirNotes = [
          { f: 392.00, d: 0.9, delay: 0 },    // G4 (Al-)
          { f: 440.00, d: 1.1, delay: 0.9 },  // A4 (la-)
          { f: 349.23, d: 1.3, delay: 2.0 },  // F4 (hu Ak-)
          { f: 392.00, d: 2.2, delay: 3.3 },  // G4 (-bar)

          { f: 392.00, d: 0.9, delay: 5.8 },  // G4 (Al-)
          { f: 440.00, d: 1.1, delay: 6.7 },  // A4 (la-)
          { f: 349.23, d: 1.3, delay: 7.8 },  // F4 (hu Ak-)
          { f: 392.00, d: 2.8, delay: 9.1 },  // G4 (-bar)
        ];

        takbirNotes.forEach((n) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.delay);
          gain.gain.setValueAtTime(0, ctx.currentTime + n.delay);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + n.delay + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + n.delay);
          osc.stop(ctx.currentTime + n.delay + n.d);
        });

        setTimeout(() => setIsAdzanAudioPlaying(false), 12000);
      }
    } catch (e) {
      console.error('Audio synth error:', e);
      setIsAdzanAudioPlaying(false);
    }
  };

  const stopAdzanSound = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsAdzanAudioPlaying(false);
  };

  // Trigger Adzan Notification
  const triggerAdzanAlert = (prayerName: string = 'Maghrib') => {
    setActiveAdzanPrayer(prayerName);
    setShowAdzanModal(true);
    setIqamahCountdown(600); // 10 minutes

    // Play Audio
    if (isNotifEnabled) {
      playAdzanSound();
    }

    // Trigger Browser Desktop Notification if enabled
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🕌 Telah Masuk Waktu Sholat ${prayerName}`, {
          body: `Waktu Sholat ${prayerName} untuk wilayah ${selectedCity} dan sekitarnya telah tiba. Mari tunaikan sholat berjamaah.`,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.log('Notification dispatch skipped:', err);
      }
    }
  };

  const requestDesktopNotifPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser Anda tidak mendukung Notifikasi Desktop.');
      return;
    }
    const perm = await Notification.requestPermission();
    setDesktopNotifGranted(perm === 'granted');
    if (perm === 'granted') {
      alert('Notifikasi Desktop Berhasil Diaktifkan! Anda akan menerima pengingat saat adzan berkumandang.');
    }
  };

  const handleCopyAyah = () => {
    const text = `"${dailyAyah.arabic}"\n\n"${dailyAyah.translation}" (${dailyAyah.source}) - via ABDICity.cloud`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  const formatIqamahTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-emerald-100 border-b border-emerald-800/80 shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Prayer Schedule Grid & Notification Controls */}
          <div className="lg:col-span-7 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800/80 shadow-inner space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-200">
                  {formatIndonesianDate(currentTime)} • <span className="text-amber-300 font-serif">{getHijriDate(currentTime)}</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} {currentCityData.timezone === 8 ? 'WITA' : 'WIB'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-xs text-amber-300 font-medium">
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Menuju {nextPrayerName}{isTomorrow ? ' (Besok)' : ''}: <strong className="font-mono text-white">{countdown}</strong></span>
                </div>

                {/* GPS Device Location Sync Button */}
                <button
                  onClick={handleDetectDeviceLocation}
                  disabled={isLocating}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                    gpsDetectedCity === selectedCity
                      ? 'bg-emerald-800/80 text-emerald-200 border-emerald-600 hover:bg-emerald-700'
                      : 'bg-emerald-950/80 text-amber-300 border-amber-500/30 hover:bg-emerald-900'
                  }`}
                  title="Deteksi Posisi Lokasi GPS Device Saat Ini"
                >
                  <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
                  <span className="hidden sm:inline">
                    {isLocating ? 'Mencari...' : gpsDetectedCity === selectedCity ? 'GPS Aktif' : 'Lokasi Device'}
                  </span>
                </button>

                {/* Notif Settings Quick Button */}
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                    isNotifEnabled
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
                      : 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  }`}
                  title="Pengaturan Notifikasi & Alarm Adzan"
                >
                  <BellRing className={`w-3.5 h-3.5 ${isNotifEnabled ? 'text-amber-400 animate-bounce' : 'text-emerald-500'}`} />
                  <span className="hidden sm:inline">{isNotifEnabled ? 'Alarm Aktif' : 'Bisu'}</span>
                </button>

                {/* Test Adzan Button */}
                <button
                  onClick={() => triggerAdzanAlert(nextPrayerName)}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-2.5 py-1 rounded-full text-[11px] transition-all shadow-sm flex items-center gap-1"
                  title={`Simulasi Uji Notifikasi Adzan (${nextPrayerName})`}
                >
                  <Megaphone className="w-3 h-3" />
                  <span>Uji Adzan</span>
                </button>
              </div>
            </div>

            {/* Prayer Cards Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center">
              {prayerTimes.map((item) => {
                const isConfigured = prayerNotifConfig[item.name] !== false;

                return (
                  <div
                    key={item.name}
                    className={`p-2 rounded-xl transition-all border relative group ${
                      item.isNext
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-emerald-950 font-bold border-amber-300 shadow-md ring-2 ring-amber-400/50 transform -translate-y-0.5'
                        : item.passed
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 opacity-80'
                        : 'bg-emerald-900/40 text-emerald-100 border-emerald-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[10px] uppercase tracking-wider opacity-90">{item.name}</span>
                      {['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'].includes(item.name) && (
                        <span title={isConfigured ? 'Alarm Notifikasi Aktif' : 'Alarm Dimatikan'}>
                          <Bell className={`w-2.5 h-2.5 ${isConfigured ? (item.isNext ? 'text-emerald-950' : 'text-amber-400') : 'text-emerald-700'}`} />
                        </span>
                      )}
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono mt-0.5">{item.time}</div>
                    {item.isNext && (
                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/20 text-emerald-950 font-bold">
                        {isTomorrow && item.name === nextPrayerName ? 'Besok Pagi' : 'Berikutnya'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center/Right: Qibla & Wisdom Quote */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4">
            
            {/* Qibla Direction Widget */}
            <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-800 flex items-center gap-3 sm:w-44 flex-shrink-0">
              <div className="relative w-12 h-12 rounded-full bg-emerald-900 border-2 border-amber-400/80 flex items-center justify-center shadow-md">
                <Compass className="w-7 h-7 text-amber-400 animate-pulse" style={{ transform: `rotate(${qiblaAngle}deg)` }} />
                <span className="absolute text-[8px] font-bold text-amber-200 bottom-0.5">NW</span>
              </div>
              <div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">Arah Kiblat</div>
                <div className="text-sm font-bold text-white font-mono">{qiblaAngle}° NW</div>
                <div className="text-[10px] text-emerald-400 truncate max-w-[100px]">{selectedCity}</div>
              </div>
            </div>

            {/* Daily Ayah / Hadith Card */}
            <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-800 flex-1 relative group">
              <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Ayah Kaffah Hari Ini
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleAudio}
                    className="p-1 hover:bg-emerald-800 rounded text-emerald-200 transition-colors"
                    title={audioPlaying ? "Hentikan Murattal" : "Putar Murottal AI"}
                  >
                    {audioPlaying ? <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleCopyAyah}
                    className="p-1 hover:bg-emerald-800 rounded text-emerald-200 transition-colors"
                    title="Salin Ayat & Terjemahan"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-right font-serif text-sm text-amber-100 font-bold leading-relaxed tracking-wide my-1">
                {dailyAyah.arabic}
              </p>
              <p className="text-xs text-emerald-200 line-clamp-2 italic font-sans">
                "{dailyAyah.translation}"
              </p>
              <span className="text-[10px] text-emerald-400 font-medium block mt-1 text-right">
                {dailyAyah.source}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* NOTIFICATION SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-emerald-200 shadow-2xl p-6 text-gray-800 space-y-4 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-emerald-950 text-base">Pengaturan Notifikasi Sholat</h3>
                <p className="text-xs text-gray-500">Sesuaikan alarm visual dan lantunan audio adzan</p>
              </div>
            </div>

            {/* Main Toggle */}
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-emerald-950 block">Notifikasi Waktu Sholat</span>
                <span className="text-[11px] text-emerald-800">Aktifkan pengingat saat adzan berkumandang</span>
              </div>
              <button
                onClick={() => setIsNotifEnabled(!isNotifEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${isNotifEnabled ? 'bg-emerald-700' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-md ${isNotifEnabled ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Sound Mode Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-950 block">Jenis Suara Pengingat</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSoundMode('adzan')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    soundMode === 'adzan' ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <Megaphone className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span>Takbir Adzan</span>
                </button>
                <button
                  onClick={() => setSoundMode('chime')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    soundMode === 'chime' ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <Volume1 className="w-4 h-4 mx-auto mb-1 text-emerald-300" />
                  <span>Chime Halus</span>
                </button>
                <button
                  onClick={() => setSoundMode('mute')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    soundMode === 'mute' ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <VolumeX className="w-4 h-4 mx-auto mb-1 text-red-300" />
                  <span>Bisu (Visual)</span>
                </button>
              </div>
            </div>

            {/* Desktop System Notification Switch */}
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-gray-800 block">Notifikasi Desktop Browser</span>
                <span className="text-[10px] text-gray-500">
                  {desktopNotifGranted ? '✅ Izin Notifikasi Diberikan' : 'Membutuhkan izin browser'}
                </span>
              </div>
              <button
                onClick={requestDesktopNotifPermission}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  desktopNotifGranted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                }`}
              >
                {desktopNotifGranted ? 'Aktif' : 'Izinkan'}
              </button>
            </div>

            {/* Per-Prayer Config */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-950 block">Pengingat Per-Waktu Sholat</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'].map((pr) => {
                  const active = prayerNotifConfig[pr] !== false;
                  return (
                    <button
                      key={pr}
                      onClick={() =>
                        setPrayerNotifConfig((prev) => ({
                          ...prev,
                          [pr]: !active,
                        }))
                      }
                      className={`p-2 rounded-xl border flex items-center justify-between font-medium transition-all ${
                        active ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}
                    >
                      <span>Sholat {pr}</span>
                      <Bell className={`w-3.5 h-3.5 ${active ? 'text-emerald-700 fill-emerald-700' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  playAdzanSound();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Uji Suara ({soundMode.toUpperCase()})</span>
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE ADZAN ALERT MODAL */}
      {showAdzanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 w-full max-w-md rounded-3xl border-2 border-amber-400/80 shadow-2xl p-6 text-white space-y-4 relative text-center animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Background Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => {
                stopAdzanSound();
                setShowAdzanModal(false);
              }}
              className="absolute right-4 top-4 text-emerald-300 hover:text-white p-1.5 rounded-full hover:bg-emerald-800/60 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pulsing Minaret Badge */}
            <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <span className="text-3xl">🕌</span>
            </div>

            <div className="space-y-1">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full letter-spacing-1">
                PENGINGAT ADZAN INTERAKSI
              </span>
              <h2 className="text-2xl font-bold font-serif text-amber-200 pt-1">
                Telah Masuk Waktu Sholat {activeAdzanPrayer}!
              </h2>
              <p className="text-xs text-emerald-200">
                Untuk wilayah <strong>{selectedCity}</strong> dan sekitarnya
              </p>
            </div>

            {/* Arabic Adzan Call */}
            <div className="bg-emerald-900/80 p-3 rounded-2xl border border-amber-400/30 space-y-1 my-2">
              <div className="text-lg font-serif font-bold text-amber-300">
                حَيَّ عَلَى الصَّلاَةِ • حَيَّ عَلَى الْفَلاَحِ
              </div>
              <p className="text-[11px] text-emerald-200 italic">
                "Mari menunaikan sholat, mari meraih kemenangan."
              </p>
            </div>

            {/* Iqamah Countdown Banner */}
            <div className="bg-emerald-950/90 p-3 rounded-2xl border border-emerald-700/80 flex items-center justify-between text-xs">
              <div className="text-left">
                <span className="text-amber-400 font-bold block text-[11px]">Hitung Mundur Iqamah:</span>
                <span className="text-[10px] text-emerald-300">Persiapan Sholat Berjamaah</span>
              </div>
              <div className="font-mono text-xl font-bold text-white bg-emerald-900 px-3 py-1 rounded-xl border border-emerald-600">
                {formatIqamahTime(iqamahCountdown)}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (isAdzanAudioPlaying) {
                    stopAdzanSound();
                  } else {
                    playAdzanSound();
                  }
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isAdzanAudioPlaying ? (
                  <>
                    <Square className="w-4 h-4 fill-emerald-950" />
                    <span>Hentikan Suara Adzan</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-emerald-950" />
                    <span>Putar Suara Adzan</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  stopAdzanSound();
                  setShowAdzanModal(false);
                }}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all border border-emerald-600"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

