import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  CheckCircle2,
  Circle,
  Flame,
  Award,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  Plus,
  Minus,
  Share2,
  Check,
  FileText,
  Download,
  X,
  Printer
} from 'lucide-react';

interface DailyIbadahTrackerProps {
  onOpenInfaqModal?: (title?: string, amount?: number) => void;
  onNavigateToQuran?: () => void;
}

export interface PrayerLog {
  subuh: 'masjid' | 'on_time' | 'late' | 'none';
  dzuhur: 'masjid' | 'on_time' | 'late' | 'none';
  ashar: 'masjid' | 'on_time' | 'late' | 'none';
  maghrib: 'masjid' | 'on_time' | 'late' | 'none';
  isya: 'masjid' | 'on_time' | 'late' | 'none';
}

export interface SunnahLog {
  tahajud: boolean;
  dhuha: boolean;
  rawatib: boolean;
  witir: boolean;
}

export interface QuranLog {
  pagesRead: number;
  targetPages: number;
  juzNumber: number;
}

export interface CharityLog {
  sedekahSubuh: boolean;
  dzikirPagi: boolean;
  dzikirPetang: boolean;
  bantuSesama: boolean;
}

export interface DayIbadahData {
  dateStr: string; // YYYY-MM-DD
  prayers: PrayerLog;
  sunnah: SunnahLog;
  quran: QuranLog;
  charity: CharityLog;
}

const DEFAULT_PRAYERS: PrayerLog = {
  subuh: 'none',
  dzuhur: 'none',
  ashar: 'none',
  maghrib: 'none',
  isya: 'none',
};

const DEFAULT_SUNNAH: SunnahLog = {
  tahajud: false,
  dhuha: false,
  rawatib: false,
  witir: false,
};

const DEFAULT_QURAN: QuranLog = {
  pagesRead: 0,
  targetPages: 10,
  juzNumber: 1,
};

const DEFAULT_CHARITY: CharityLog = {
  sedekahSubuh: false,
  dzikirPagi: false,
  dzikirPetang: false,
  bantuSesama: false,
};

export const DailyIbadahTracker: React.FC<DailyIbadahTrackerProps> = ({
  onOpenInfaqModal,
  onNavigateToQuran,
}) => {
  // Get current date string (YYYY-MM-DD)
  const getTodayStr = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayStr());
  const [trackerData, setTrackerData] = useState<{ [dateStr: string]: DayIbadahData }>(() => {
    try {
      const saved = localStorage.getItem('abdicity_ibadah_tracker_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [streakCount, setStreakCount] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportTimeframe, setExportTimeframe] = useState<'7days' | '30days'>('7days');
  const [exportUserName, setExportUserName] = useState<string>('Jamaah ABDICity');

  // Get data for selected date or initialize defaults
  const currentDayData: DayIbadahData = trackerData[selectedDateStr] || {
    dateStr: selectedDateStr,
    prayers: { ...DEFAULT_PRAYERS },
    sunnah: { ...DEFAULT_SUNNAH },
    quran: { ...DEFAULT_QURAN },
    charity: { ...DEFAULT_CHARITY },
  };

  // Save to localStorage when trackerData updates
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_ibadah_tracker_v1', JSON.stringify(trackerData));
      calculateStreak();
    } catch (e) {
      console.error(e);
    }
  }, [trackerData]);

  // Calculate streak based on past completed days
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayData = trackerData[dateKey];

      if (dayData) {
        // Calculate completion percentage for that day
        const score = calculateDayCompletion(dayData);
        if (score.percentage >= 40) {
          streak++;
        } else if (i > 0) {
          break; // Streak broken
        }
      } else if (i > 0) {
        break;
      }
    }
    setStreakCount(Math.max(streak, 1));
  };

  // Update specific day data helper
  const updateCurrentDayData = (updater: (prev: DayIbadahData) => DayIbadahData) => {
    setTrackerData((prev) => {
      const updatedDay = updater(currentDayData);
      return {
        ...prev,
        [selectedDateStr]: updatedDay,
      };
    });
  };

  // Prayer update
  const handlePrayerChange = (
    prayer: keyof PrayerLog,
    status: 'masjid' | 'on_time' | 'late' | 'none'
  ) => {
    updateCurrentDayData((prev) => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [prayer]: status,
      },
    }));
  };

  // Sunnah toggle
  const handleSunnahToggle = (key: keyof SunnahLog) => {
    updateCurrentDayData((prev) => ({
      ...prev,
      sunnah: {
        ...prev.sunnah,
        [key]: !prev.sunnah[key],
      },
    }));
  };

  // Quran pages read change
  const handleQuranPagesChange = (delta: number) => {
    updateCurrentDayData((prev) => ({
      ...prev,
      quran: {
        ...prev.quran,
        pagesRead: Math.max(0, prev.quran.pagesRead + delta),
      },
    }));
  };

  // Charity toggle
  const handleCharityToggle = (key: keyof CharityLog) => {
    updateCurrentDayData((prev) => ({
      ...prev,
      charity: {
        ...prev.charity,
        [key]: !prev.charity[key],
      },
    }));
  };

  // Calculate percentage & points for the day
  const calculateDayCompletion = (data: DayIbadahData) => {
    let totalItems = 0;
    let completedItems = 0;
    let points = 0;

    // 1. Mandatory Prayers (5 items)
    const prayerKeys: (keyof PrayerLog)[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    prayerKeys.forEach((p) => {
      totalItems += 2; // Weight
      const status = data.prayers[p];
      if (status === 'masjid') {
        completedItems += 2;
        points += 50;
      } else if (status === 'on_time') {
        completedItems += 1.5;
        points += 35;
      } else if (status === 'late') {
        completedItems += 1;
        points += 20;
      }
    });

    // 2. Sunnah Prayers (4 items)
    const sunnahKeys: (keyof SunnahLog)[] = ['tahajud', 'dhuha', 'rawatib', 'witir'];
    sunnahKeys.forEach((s) => {
      totalItems += 1;
      if (data.sunnah[s]) {
        completedItems += 1;
        points += 30;
      }
    });

    // 3. Quran Reading
    totalItems += 2;
    if (data.quran.pagesRead > 0) {
      const quranRatio = Math.min(1, data.quran.pagesRead / (data.quran.targetPages || 10));
      completedItems += quranRatio * 2;
      points += Math.round(quranRatio * 60) + data.quran.pagesRead * 2;
    }

    // 4. Charity & Good Deeds (4 items)
    const charityKeys: (keyof CharityLog)[] = [
      'sedekahSubuh',
      'dzikirPagi',
      'dzikirPetang',
      'bantuSesama',
    ];
    charityKeys.forEach((c) => {
      totalItems += 1;
      if (data.charity[c]) {
        completedItems += 1;
        points += 25;
      }
    });

    const percentage = Math.min(100, Math.round((completedItems / totalItems) * 100));

    return { percentage, points };
  };

  const { percentage, points } = calculateDayCompletion(currentDayData);

  // Date Navigation
  const handleDateShift = (days: number) => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() + days);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDateStr === getTodayStr();

  const formattedDateLabel = new Date(selectedDateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShareStreak = () => {
    const text = `✨ *Jurnal Mutaba'ah Ibadah ABDICity* ✨\n\n📅 Date: ${formattedDateLabel}\n🔥 Streak Istiqomah: ${streakCount} Hari\n📊 Capaian Target: ${percentage}%\n⭐ Poin Ibadah: ${points} XP\n\nMari jaga konsistensi ibadah bersama di ABDICity.cloud!`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2200);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const daysCount = exportTimeframe === '7days' ? 7 : 30;
      const timeframeLabel = exportTimeframe === '7days' ? '7 Hari Terakhir (Mingguan)' : '30 Hari Terakhir (Bulanan)';
      const today = new Date();

      const datesList: DayIbadahData[] = [];
      let totalPct = 0;
      let totalPages = 0;
      let totalXP = 0;
      let totalMasjidPrayers = 0;
      let totalSunnahCount = 0;
      let totalSedekahCount = 0;

      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayObj = trackerData[dateStr] || {
          dateStr,
          prayers: { ...DEFAULT_PRAYERS },
          sunnah: { ...DEFAULT_SUNNAH },
          quran: { ...DEFAULT_QURAN },
          charity: { ...DEFAULT_CHARITY },
        };

        const score = calculateDayCompletion(dayObj);
        totalPct += score.percentage;
        totalXP += score.points;
        totalPages += dayObj.quran.pagesRead || 0;

        Object.values(dayObj.prayers).forEach((st) => {
          if (st === 'masjid' || st === 'on_time') totalMasjidPrayers++;
        });
        Object.values(dayObj.sunnah).forEach((v) => {
          if (v) totalSunnahCount++;
        });
        Object.values(dayObj.charity).forEach((v) => {
          if (v) totalSedekahCount++;
        });

        datesList.push(dayObj);
      }

      const avgPct = Math.round(totalPct / daysCount);

      // PDF Styling & Header
      doc.setFillColor(6, 78, 59); // Emerald 900
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(251, 191, 36); // Amber 400
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("LAPORAN MUTABA'AH IBADAH YAUMIBAH", 14, 14);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`ABDICity.cloud • Laporan Konsistensi ${timeframeLabel}`, 14, 22);

      const genDateStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Dicetak Pada: ${genDateStr}`, 14, 27);

      // User Profile & Summary Box
      doc.setDrawColor(209, 250, 229);
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, 38, 182, 34, 3, 3, 'FD');

      doc.setTextColor(6, 78, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Profil Nama Jamaah: ${exportUserName || 'Jamaah ABDICity'}`, 18, 46);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      // Metrics Left
      doc.text(`• Rata-rata Capaian Target: ${avgPct}%`, 18, 53);
      doc.text(`• Total Poin XP Amal: ${totalXP} XP`, 18, 59);
      doc.text(`• Streak Istiqomah: ${streakCount} Hari`, 18, 65);

      // Metrics Right
      doc.text(`• Tilawah Al-Qur'an: ${totalPages} Halaman`, 105, 53);
      doc.text(`• Sholat Fardhu Tepat/Masjid: ${totalMasjidPrayers} kali`, 105, 59);
      doc.text(`• Sunnah & Sedekah Logged: ${totalSunnahCount + totalSedekahCount} amalan`, 105, 65);

      // Table Header
      let startY = 80;
      doc.setFillColor(6, 78, 59);
      doc.rect(14, startY, 182, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');

      doc.text('TANGGAL', 18, startY + 5.5);
      doc.text('SHOLAT FARDHU', 55, startY + 5.5);
      doc.text('SUNNAH', 105, startY + 5.5);
      doc.text('QURAN', 135, startY + 5.5);
      doc.text('SEDEKAH', 160, startY + 5.5);
      doc.text('CAPAIAN', 180, startY + 5.5);

      startY += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      datesList.forEach((day, idx) => {
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }

        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, startY, 182, 6.5, 'F');
        }

        const dLabel = new Date(day.dateStr).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        });

        const fardhuCount = Object.values(day.prayers).filter((s) => s !== 'none').length;
        const sunnahCount = Object.values(day.sunnah).filter(Boolean).length;
        const charityCount = Object.values(day.charity).filter(Boolean).length;
        const score = calculateDayCompletion(day);

        doc.setTextColor(30, 41, 59);
        doc.text(dLabel, 18, startY + 4.5);
        doc.text(`${fardhuCount}/5 Waktu`, 55, startY + 4.5);
        doc.text(`${sunnahCount} Amalan`, 105, startY + 4.5);
        doc.text(`${day.quran.pagesRead || 0} Hal`, 135, startY + 4.5);
        doc.text(`${charityCount} Amalan`, 160, startY + 4.5);

        if (score.percentage >= 70) {
          doc.setTextColor(16, 185, 129);
        } else if (score.percentage >= 40) {
          doc.setTextColor(217, 119, 6);
        } else {
          doc.setTextColor(100, 116, 139);
        }
        doc.text(`${score.percentage}%`, 180, startY + 4.5);

        startY += 6.5;
      });

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(241, 245, 249);
      doc.rect(0, pageHeight - 15, 210, 15, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(71, 85, 105);
      doc.text(
        '"Barangsiapa menempuh jalan untuk mencari ilmu / kebaikan, Allah akan mudahkan jalannya menuju surga." (HR. Muslim)',
        14,
        pageHeight - 7
      );

      doc.save(`Laporan_Ibadah_ABDICity_${exportTimeframe}_${new Date().toISOString().split('T')[0]}.pdf`);
      setIsExportModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Gagal mengunduh Laporan PDF. Silakan coba lagi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Mutaba'ah Yaumiyah
              </span>
              <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gamifikasi Amal Shalih
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 leading-tight">
              Pencatat Ibadah Harian (Daily Tracker)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
              Jaga konsistensi sholat 5 waktu, tilawah Al-Qur'an, sedekah subuh, dan amalan sunnah dengan sistem poin & streak istiqomah.
            </p>
          </div>

          {/* Gamification Stats Card */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-emerald-900/90 p-4 rounded-2xl border border-amber-400/40 text-center shadow-inner space-y-0.5 min-w-[110px]">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                Streak Istiqomah
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-2xl font-mono">
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
                <span>{streakCount}</span>
              </div>
              <span className="text-[10px] text-amber-200 block">Hari Berturut</span>
            </div>

            <div className="bg-emerald-900/90 p-4 rounded-2xl border border-amber-400/40 text-center shadow-inner space-y-0.5 min-w-[110px]">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                Capaian Hari Ini
              </span>
              <div className="text-amber-300 font-extrabold text-2xl font-mono">
                {percentage}%
              </div>
              <span className="text-[10px] text-emerald-200 block">{points} XP Amal</span>
            </div>
          </div>
        </div>

        {/* Date Selector Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDateShift(-1)}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 p-2 rounded-xl border border-emerald-700 transition-all"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="bg-emerald-950/80 px-4 py-2 rounded-xl border border-amber-400/30 flex items-center gap-2 text-xs font-bold text-amber-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formattedDateLabel}</span>
              {isToday && (
                <span className="bg-amber-400 text-emerald-950 text-[10px] px-2 py-0.2 rounded-full font-black ml-1">
                  Hari Ini
                </span>
              )}
            </div>

            <button
              onClick={() => handleDateShift(1)}
              disabled={isToday}
              className={`p-2 rounded-xl border transition-all ${
                isToday
                  ? 'bg-emerald-900/40 text-emerald-600 border-emerald-800/40 cursor-not-allowed'
                  : 'bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-amber-400/40 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Export PDF Laporan</span>
            </button>

            <button
              onClick={handleShareStreak}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Jurnal Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan Progress</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Checklist Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sholat Wajib 5 Waktu & Sunnah */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: SHOLAT FARDHU 5 WAKTU */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 font-serif text-base">Sholat Fardhu 5 Waktu</h3>
                  <p className="text-[11px] text-gray-500">Tiang agama & amalan pertama yang dihisab</p>
                </div>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Wajib
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'subuh', label: 'Subuh', icon: Moon, desc: '2 Rakaat Wajar' },
                { key: 'dzuhur', label: 'Dzuhur', icon: Sun, desc: '4 Rakaat Siang' },
                { key: 'ashar', label: 'Ashar', icon: Sun, desc: '4 Rakaat Sore' },
                { key: 'maghrib', label: 'Maghrib', icon: Moon, desc: '3 Rakaat Senja' },
                { key: 'isya', label: 'Isya', icon: Moon, desc: '4 Rakaat Malam' },
              ].map((p) => {
                const currentStatus = currentDayData.prayers[p.key as keyof PrayerLog];

                return (
                  <div
                    key={p.key}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        currentStatus !== 'none' ? 'bg-emerald-800 text-amber-300' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <p.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-emerald-950 text-sm block">{p.label}</span>
                        <span className="text-[10px] text-gray-500">{p.desc}</span>
                      </div>
                    </div>

                    {/* Status Options */}
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <button
                        onClick={() => handlePrayerChange(p.key as keyof PrayerLog, 'masjid')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          currentStatus === 'masjid'
                            ? 'bg-emerald-800 text-amber-300 border-emerald-800 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'
                        }`}
                      >
                        🕌 Berjamaah
                      </button>

                      <button
                        onClick={() => handlePrayerChange(p.key as keyof PrayerLog, 'on_time')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          currentStatus === 'on_time'
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'
                        }`}
                      >
                        ⏱️ Tepat Waktu
                      </button>

                      <button
                        onClick={() => handlePrayerChange(p.key as keyof PrayerLog, 'late')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          currentStatus === 'late'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                        }`}
                      >
                        ⏳ Terlambat
                      </button>

                      <button
                        onClick={() => handlePrayerChange(p.key as keyof PrayerLog, 'none')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          currentStatus === 'none'
                            ? 'bg-gray-200 text-gray-600'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title="Reset Status"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SHOLAT SUNNAH MU'AKKAD */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 font-serif text-base">Sholat Sunnah Pilihan</h3>
                  <p className="text-[11px] text-gray-500">Penutup kekurangan sholat fardhu & penarik keberkahan</p>
                </div>
              </div>
              <span className="text-[11px] bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                Sunnah
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'tahajud', label: 'Qiyamul Lail / Tahajud', desc: 'Malam hari sepertiga akhir' },
                { key: 'dhuha', label: 'Sholat Dhuha', desc: '2 - 8 Rakaat pembuka rezeki' },
                { key: 'rawatib', label: 'Sunnah Rawatib', desc: 'Qabliyah & Ba\'diyyah Fardhu' },
                { key: 'witir', label: 'Sholat Witir', desc: 'Penutup sholat malam' },
              ].map((s) => {
                const isChecked = currentDayData.sunnah[s.key as keyof SunnahLog];

                return (
                  <button
                    key={s.key}
                    onClick={() => handleSunnahToggle(s.key as keyof SunnahLog)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-800 text-white border-amber-400 shadow-md'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 font-bold ${
                      isChecked ? 'bg-amber-400 text-emerald-950' : 'border border-gray-400 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{s.label}</span>
                      <span className={`text-[10px] block ${isChecked ? 'text-emerald-200' : 'text-gray-500'}`}>
                        {s.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Quran Tilawah & Charity / Good Deeds */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECTION 3: TILAWAH AL-QUR'AN */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 font-serif text-base">Tilawah Al-Qur'an</h3>
                  <p className="text-[11px] text-gray-500">Target One Day One Juz / Halaman</p>
                </div>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Tadabbur
              </span>
            </div>

            {/* Pages Progress Card */}
            <div className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white p-5 rounded-2xl space-y-4 border border-emerald-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-200 font-semibold">Capaian Halaman Hari Ini:</span>
                <span className="font-mono font-bold text-amber-300 text-lg">
                  {currentDayData.quran.pagesRead} / {currentDayData.quran.targetPages} Hal
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-emerald-900 rounded-full overflow-hidden border border-emerald-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((currentDayData.quran.pagesRead / currentDayData.quran.targetPages) * 100))}%`,
                  }}
                />
              </div>

              {/* Counter Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuranPagesChange(-1)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold border border-emerald-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleQuranPagesChange(1)}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1 Halaman
                  </button>
                  <button
                    onClick={() => handleQuranPagesChange(5)}
                    className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold border border-amber-400/40"
                  >
                    +5 Hal
                  </button>
                </div>

                {onNavigateToQuran && (
                  <button
                    onClick={onNavigateToQuran}
                    className="text-xs text-amber-300 hover:text-white font-bold underline flex items-center gap-1"
                  >
                    <span>Buka Qur'an</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: SEDEKAH & AMAL YAUMI */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 font-serif text-base">Sedekah & Dzikir Harian</h3>
                  <p className="text-[11px] text-gray-500">Amalan penyempurna keberkahan hidup</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'sedekahSubuh', label: 'Sedekah Subuh / Infaq Harian', desc: 'Malaikat mendoakan ganti kelipatan rezeki' },
                { key: 'dzikirPagi', label: 'Dzikir Pagi', desc: 'Benteng perlindungan dari pagi hingga petang' },
                { key: 'dzikirPetang', label: 'Dzikir Petang', desc: 'Perlindungan dari malam hingga pagi hari' },
                { key: 'bantuSesama', label: 'Senyum & Membantu Sesama', desc: 'Sedekah ringan penuh nilai kebaikan' },
              ].map((c) => {
                const isChecked = currentDayData.charity[c.key as keyof CharityLog];

                return (
                  <div
                    key={c.key}
                    onClick={() => handleCharityToggle(c.key as keyof CharityLog)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-emerald-800 text-white border-amber-400 shadow-sm'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs block">{c.label}</span>
                      <span className={`text-[10px] block ${isChecked ? 'text-emerald-200' : 'text-gray-500'}`}>
                        {c.desc}
                      </span>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                      isChecked ? 'bg-amber-400 text-emerald-950' : 'border border-gray-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Infaq Action */}
            {onOpenInfaqModal && (
              <button
                onClick={() => onOpenInfaqModal('Sedekah Subuh / Infaq Harian ABDICity', 10000)}
                className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-2"
              >
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                <span>Salurkan Sedekah Subuh Sekarang (Rp 10.000)</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Export PDF Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 font-serif text-base">Export Laporan PDF</h3>
                  <p className="text-[11px] text-gray-500">Mutaba'ah Ibadah Yaumiyah ABDICity</p>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Name Input */}
              <div className="space-y-1">
                <label className="font-bold text-emerald-950 block">Nama Jamaah (Ditampilkan pada PDF):</label>
                <input
                  type="text"
                  value={exportUserName}
                  onChange={(e) => setExportUserName(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Timeframe Switcher */}
              <div className="space-y-1">
                <label className="font-bold text-emerald-950 block">Pilih Rentang Waktu Laporan:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setExportTimeframe('7days')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                      exportTimeframe === '7days'
                        ? 'bg-emerald-800 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-slate-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="block text-sm">7 Hari Terakhir</span>
                    <span className="text-[10px] text-emerald-200 font-normal">Review Mingguan</span>
                  </button>

                  <button
                    onClick={() => setExportTimeframe('30days')}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                      exportTimeframe === '30days'
                        ? 'bg-emerald-800 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-slate-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="block text-sm">30 Hari Terakhir</span>
                    <span className="text-[10px] text-emerald-200 font-normal">Review Bulanan</span>
                  </button>
                </div>
              </div>

              {/* Summary Preview Info */}
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1.5 text-emerald-900">
                <span className="font-bold block flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Ringkasan Dokumen PDF:
                </span>
                <ul className="text-[11px] space-y-1 text-emerald-800 list-disc list-inside">
                  <li>Laporan berisi rekapitulasi Sholat Fardhu, Sunnah, Tilawah, & Sedekah.</li>
                  <li>Diikuti grafik & persentase istiqomah {exportTimeframe === '7days' ? '7' : '30'} hari.</li>
                  <li>Dilengkapi kutipan motivasi islami & tanggal cetak resmi.</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
              >
                Batal
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
