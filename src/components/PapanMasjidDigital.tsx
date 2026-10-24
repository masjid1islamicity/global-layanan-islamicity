import React, { useState, useEffect } from 'react';
import { MOSQUE_LIST, KAJIAN_LIST } from '../data/mockData';
import { Mosque } from '../types';
import {
  Megaphone,
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  BellOff,
  Share2,
  Plus,
  CheckCircle2,
  Heart,
  Search,
  Filter,
  Sparkles,
  FileText,
  Phone,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  ShieldCheck,
  Check,
  Award,
  Pin,
  PinOff,
  Compass,
  Radio,
  UserCheck,
  BadgeCheck
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  mosqueId: string;
  mosqueName: string;
  category: 'Informasi Kas' | 'Renovasi' | 'Sosial & ZIS' | 'Himbauan' | 'Kajian Special';
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
  isPinned?: boolean;
  authorRole?: string;
  authorName?: string;
  image?: string;
}

interface ActivityScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jum\'at' | 'Sabtu' | 'Ahad';
  time: string;
  title: string;
  speakerOrTeacher: string;
  category: 'Kajian Subuh' | 'TPA Santri' | 'Tahsin & Bahasa Arab' | 'Keluarga & Ibu-Ibu' | 'Remaja Masjid';
  targetAudience: 'Umum' | 'Bapak-Bapak' | 'Ibu-Ibu' | 'Anak-Anak' | 'Remaja';
  location: string;
}

interface CommunityEventItem {
  id: string;
  mosqueId: string;
  mosqueName: string;
  title: string;
  speaker: string;
  category: 'Tabligh Akbar' | 'Bazaar Halal' | 'Donor Darah' | 'Pelatihan' | 'Rihlah';
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  maxCapacity?: number;
  isLiveStream: boolean;
  description: string;
}

interface PapanMasjidDigitalProps {
  onOpenInfaqModal: (campaignTitle?: string, presetAmount?: number) => void;
}

// Prayer Schedule Structure
interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  isNext?: boolean;
}

// Sample Announcements Data with Admin Pinned Notices
const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-pinned-1',
    mosqueId: 'm-1',
    mosqueName: 'Masjid Agung Islamicity ABDICity Central',
    category: 'Kajian Special',
    title: '📢 Himbauan & Edaran Resmi DKM: Pelaksanaan Tabligh Akbar & Pembagian Sembako Syariah',
    content: 'Assalamu\'alaikum Wr. Wb. Diberitahukan kepada seluruh jamaah ABDICity, DKM Masjid Agung mengundang seluruh warga untuk menghadiri Tabligh Akbar Sabtu ini. Mohon membawa sajadah masing-masing dan menjaga ketertiban saf.',
    date: '12 Agustus 2026',
    isImportant: true,
    isPinned: true,
    authorRole: 'Ketua Umum DKM ABDICity',
    authorName: 'KH. Prof. Dr. Ahmad Zaki, MA',
    image: 'https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ann-1',
    mosqueId: 'm-1',
    mosqueName: 'Masjid Agung Islamicity ABDICity Central',
    category: 'Renovasi',
    title: 'Perkembangan Perbaikan Kubah Utama & Instalasi Solar Panel Syariah',
    content: 'Alhamdulillah, progres renovasi kubah utama telah mencapai 85%. Pemasangan solar panel ramah lingkungan bantuan jamaah sudah mulai beroperasi untuk menghemat listrik operasional masjid.',
    date: '11 Agustus 2026',
    isImportant: true,
    isPinned: false,
    authorRole: 'Tim Pembangunan DKM',
    authorName: 'Ir. H. Budi Santoso'
  },
  {
    id: 'ann-2',
    mosqueId: 'm-1',
    mosqueName: 'Masjid Agung Islamicity ABDICity Central',
    category: 'Sosial & ZIS',
    title: 'Penyaluran Zakat Maal & Fithr Tahapan Bulan Ini',
    content: 'Tim Amil Zakat Masjid Agung telah menyalurkan dana ZIS senilai Rp 45.000.000 kepada 120 kepala keluarga dhuafa dan beasiswa santri di wilayah sekitar masjid.',
    date: '09 Agustus 2026',
    isImportant: false,
    isPinned: false,
    authorRole: 'Sekretariat Amil Zakat',
    authorName: 'Ustadz Hilman'
  },
  {
    id: 'ann-3',
    mosqueId: 'm-2',
    mosqueName: "Masjid Jami' Ar-Rahman Berjamaah",
    category: 'Informasi Kas',
    title: 'Laporan Transparansi Keuangan Kas Masjid Minggu Ke-1 Agustus',
    content: 'Saldo Kas Awal: Rp 78.500.000 | Penerimaan Infaq Jum\'at: Rp 9.200.000 | Pengeluaran Operasional & Kebersihan: Rp 5.700.000 | Saldo Akhir: Rp 82.000.000. Syukron jazakallahu khairan.',
    date: '08 Agustus 2026',
    isImportant: false,
    isPinned: true,
    authorRole: 'Bendahara DKM Ar-Rahman',
    authorName: 'H. Rahman Wijaya'
  },
  {
    id: 'ann-4',
    mosqueId: 'm-3',
    mosqueName: 'Masjid Al-Barkah Bermuamalah',
    category: 'Himbauan',
    title: 'Pendaftaran Stand Pasar Subuh Jamaah Bermuamalah Dibuka',
    content: 'Diberitahukan kepada seluruh UMKM jamaah masjid yang ingin membuka lapak di Pasar Subuh Berjamaah setiap Ahad Pagi, pendaftaran gratis di kantor DKM.',
    date: '07 Agustus 2026',
    isImportant: true,
    isPinned: false,
    authorRole: 'Divisi Pemberdayaan UMKM',
    authorName: 'Hj. Siti Aminah'
  }
];

// Sample Weekly Activity Schedules Data
const WEEKLY_SCHEDULES: ActivityScheduleItem[] = [
  {
    id: 'sch-1',
    day: 'Senin',
    time: '16:00 - 17:30 WIB',
    title: 'Pembelajaran TPA & Hafalan Juz 30 Santri Anak',
    speakerOrTeacher: 'Ustadz Hilman & Tim Pengajar TPA',
    category: 'TPA Santri',
    targetAudience: 'Anak-Anak',
    location: 'Ruang Kelas Lantai 2'
  },
  {
    id: 'sch-2',
    day: 'Selasa',
    time: '18:30 - 19:45 WIB (Ba\'da Maghrib)',
    title: 'Kajian Fiqih Muamalah & Akad-Akad Syariah',
    speakerOrTeacher: 'Ustadz Dr. Fathurrahman, Lc',
    category: 'Tahsin & Bahasa Arab',
    targetAudience: 'Umum',
    location: 'Ruang Utama Salat'
  },
  {
    id: 'sch-3',
    day: 'Rabu',
    time: '09:00 - 11:00 WIB',
    title: 'Majelis Taklim Ibu-Ibu: Fiqih Wanita & Parenting Islam',
    speakerOrTeacher: 'Ustadzah Fatimah Azzahra, M.Pd',
    category: 'Keluarga & Ibu-Ibu',
    targetAudience: 'Ibu-Ibu',
    location: 'Aula Srikandi Masjid'
  },
  {
    id: 'sch-4',
    day: 'Kamis',
    time: '18:30 - 20:00 WIB',
    title: 'Pembacaan Surah Yasin, Dhikr & Doa Bersama Jamaah',
    speakerOrTeacher: 'Imam Masjid & Jamaah',
    category: 'Kajian Subuh',
    targetAudience: 'Umum',
    location: 'Ruang Utama Salat'
  },
  {
    id: 'sch-5',
    day: 'Jum\'at',
    time: '11:45 - 13:00 WIB',
    title: 'Salat Jum\'at Berjamaah & Khutbah Serentak',
    speakerOrTeacher: 'KH. Prof. Dr. Ahmad Zaki, MA',
    category: 'Kajian Subuh',
    targetAudience: 'Umum',
    location: 'Masjid Agung Central'
  },
  {
    id: 'sch-6',
    day: 'Sabtu',
    time: '05:00 - 06:30 WIB (Kuliah Subuh)',
    title: 'Tafsir Al-Qur\'an Tematik & Sarapan Bersama',
    speakerOrTeacher: 'Ustadz Hanif Al-Hafidz',
    category: 'Kajian Subuh',
    targetAudience: 'Bapak-Bapak',
    location: 'Serambi Utama Masjid'
  },
  {
    id: 'sch-7',
    day: 'Ahad',
    time: '08:30 - 11:30 WIB',
    title: 'Rembug RISMA (Remaja Islam Masjid) & Coding Syariah',
    speakerOrTeacher: 'Tim Pemuda & Tech Community ABDICity',
    category: 'Remaja Masjid',
    targetAudience: 'Remaja',
    location: 'Youth Center Masjid'
  }
];

// Sample Community Events Data
const COMMUNITY_EVENTS: CommunityEventItem[] = [
  {
    id: 'evt-1',
    mosqueId: 'm-1',
    mosqueName: 'Masjid Agung Islamicity ABDICity Central',
    title: 'Tabligh Akbar & Peluncuran Gerakan 1.000 Pengusaha Syariah',
    speaker: 'KH. Prof. Dr. Ahmad Zaki, MA & Habib Rizky Al-Attas',
    category: 'Tabligh Akbar',
    date: 'Sabtu, 15 Agustus 2026',
    time: '08:30 - 12:00 WIB',
    location: 'Ruang Utama & Halaman Depan Masjid Agung',
    attendeesCount: 450,
    maxCapacity: 1000,
    isLiveStream: true,
    description: 'Acara silaturahmi akbar jamaah lintas kota, diisi dengan tausiyah fiqih muamalah, pembagian sertifikat sertifikasi halal gratis untuk 50 UMKM, dan donor darah.'
  },
  {
    id: 'evt-2',
    mosqueId: 'm-2',
    mosqueName: "Masjid Jami' Ar-Rahman Berjamaah",
    title: 'Pelatihan Sertifikasi Pengurusan Jenazah Syar\'i Sesuai Sunnah',
    speaker: 'Tim Ustadz Amil & Pemulasaraan Jenazah DKI',
    category: 'Pelatihan',
    date: 'Ahad, 16 Agustus 2026',
    time: '09:00 - 15:00 WIB',
    location: 'Gedung Serbaguna Lantai 2',
    attendeesCount: 85,
    maxCapacity: 100,
    isLiveStream: false,
    description: 'Pelatihan teori dan praktek memandikan, mengkafani, hingga menyalatkan jenazah secara syar\'i. Dilengkapi modul panduan dan sertifikat keberhasilan.'
  },
  {
    id: 'evt-3',
    mosqueId: 'm-3',
    mosqueName: 'Masjid Al-Barkah Bermuamalah',
    title: 'Bazaar Kuliner Halal & Donor Darah Peduli Kemanusiaan',
    speaker: 'Panitia Bermuamalah & PMI Kota Tangerang',
    category: 'Bazaar Halal',
    date: 'Ahad, 23 Agustus 2026',
    time: '06:00 - 14:00 WIB',
    location: 'Halaman Pelataran Masjid Al-Barkah',
    attendeesCount: 210,
    maxCapacity: 500,
    isLiveStream: false,
    description: 'Bazaar jajanan sehat halal, pemeriksaan kesehatan gratis (gula darah & tensi), serta bakti sosial pembagian sembako untuk 150 warga lansia.'
  }
];

export const PapanMasjidDigital: React.FC<PapanMasjidDigitalProps> = ({ onOpenInfaqModal }) => {
  const [selectedMosqueId, setSelectedMosqueId] = useState<string>('all');
  const [activeBoardTab, setActiveBoardTab] = useState<'announcements' | 'events' | 'schedules' | 'cash-report'>('announcements');
  const [announcementCategory, setAnnouncementCategory] = useState<string>('Semua');
  const [scheduleDay, setScheduleDay] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mode Admin DKM Toggle (Allows Mosque Admins to Pin/Unpin, Post Official Notices, Delete Items)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Selected City for Prayer Schedule
  const [selectedCity, setSelectedCity] = useState<string>('ABDICity (Pusat)');

  // Audio Adhan Simulation State
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);

  // Live Prayer Schedules State
  const PRAYER_TIMES: PrayerTime[] = [
    { name: 'Subuh', time: '04:38 WIB', arabicName: 'الفجر' },
    { name: 'Terbit', time: '05:54 WIB', arabicName: 'الشروق' },
    { name: 'Dzuhur', time: '12:02 WIB', arabicName: 'الظهر' },
    { name: 'Ashar', time: '15:20 WIB', arabicName: 'العصر' },
    { name: 'Maghrib', time: '18:04 WIB', arabicName: 'المغرب', isNext: true },
    { name: 'Isya', time: '19:15 WIB', arabicName: 'العشاء' }
  ];

  // Reminders for events stored in localStorage
  const [remindedEventIds, setRemindedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_reminded_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load event reminders', e);
    }
    return ['evt-1'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('abdicity_reminded_events', JSON.stringify(remindedEventIds));
    } catch (e) {
      console.error('Failed to save event reminders', e);
    }
  }, [remindedEventIds]);

  const toggleEventReminder = (id: string) => {
    setRemindedEventIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Modal for new announcement proposal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Informasi Kas' | 'Renovasi' | 'Sosial & ZIS' | 'Himbauan' | 'Kajian Special'>('Himbauan');
  const [newContent, setNewContent] = useState('');
  const [newAuthorRole, setNewAuthorRole] = useState('Pengurus DKM ABDICity');
  const [newAuthorName, setNewAuthorName] = useState('Ustadz Ahmad');
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);

  // Pin/Unpin Announcement Handler (Admin DKM Capability)
  const togglePinAnnouncement = (id: string) => {
    setAnnouncementsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextPinned = !item.isPinned;
          showToast(
            nextPinned
              ? `📌 Pengumuman "${item.title.substring(0, 30)}..." berhasil DISEMATKAN di Papan Pengurus!`
              : `📌 Sematan pengumuman dilepaskan.`
          );
          return { ...item, isPinned: nextPinned };
        }
        return item;
      })
    );
  };

  // Delete Announcement Handler (Admin DKM Capability)
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncementsList((prev) => prev.filter((item) => item.id !== id));
    showToast('🗑️ Pengumuman berhasil dihapus dari Papan Digital.');
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const currentMosque = MOSQUE_LIST.find((m) => m.id === (selectedMosqueId === 'all' ? 'm-1' : selectedMosqueId)) || MOSQUE_LIST[0];

    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      mosqueId: currentMosque.id,
      mosqueName: currentMosque.name,
      category: newCategory,
      title: newTitle,
      content: newContent,
      date: 'Hari Ini',
      isImportant: true,
      isPinned: newIsPinned,
      authorRole: newAuthorRole || 'Pengurus DKM',
      authorName: newAuthorName || 'Ustadz Jamaah'
    };

    setAnnouncementsList([newItem, ...announcementsList]);
    setIsSubmitModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewIsPinned(false);
    showToast(
      newIsPinned
        ? 'Alhamdulillah, Pengumuman resmi berhasil diterbitkan dan DISEMATKAN di Papan Pengurus!'
        : 'Alhamdulillah, Usulan Pengumuman berhasil diajukan ke Pengurus DKM!'
    );
  };

  // Filtered Lists
  const selectedMosque = MOSQUE_LIST.find((m) => m.id === selectedMosqueId);

  const filteredAnnouncements = announcementsList.filter((a) => {
    const matchesMosque = selectedMosqueId === 'all' || a.mosqueId === selectedMosqueId;
    const matchesCategory = announcementCategory === 'Semua' || a.category === announcementCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMosque && matchesCategory && matchesSearch;
  });

  const filteredEvents = COMMUNITY_EVENTS.filter((e) => {
    const matchesMosque = selectedMosqueId === 'all' || e.mosqueId === selectedMosqueId;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMosque && matchesSearch;
  });

  const filteredSchedules = WEEKLY_SCHEDULES.filter((s) => {
    const matchesDay = scheduleDay === 'Semua' || s.day === scheduleDay;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.speakerOrTeacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* TOP TICKER & MOSQUE SELECTOR HEADER */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-800 space-y-4">
        {/* Ticker Row */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-white/15 overflow-hidden">
          <div className="flex items-center gap-1.5 bg-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex-shrink-0 shadow-sm">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Info Terkini</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-xs text-amber-100 font-medium tracking-wide flex-1">
            <p className="animate-marquee inline-block">
              ✨ Penyaluran Zakat Maal & Fithr dibuka di Sekretariat DKM • Kajian Akbar Tabligh bersama KH. Prof. Dr. Ahmad Zaki, MA Sabtu Ini • Bebas Pajak & Laporan Transparan Kas Masjid ABDICity.cloud
            </p>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-amber-400" />
              <h2 className="font-bold text-xl sm:text-2xl font-serif text-white">Papan Masjid Digital ABDICity</h2>
            </div>
            <p className="text-xs text-emerald-200">
              Pusat Informasi Pengumuman, Agenda Komunitas Jamaah, Jadwal Ibadah, dan Transparansi Kas Masjid.
            </p>
          </div>

          {/* Mosque Selector Dropdown */}
          <div className="flex items-center gap-2 bg-emerald-900/80 p-2 rounded-2xl border border-emerald-700/80">
            <MapPin className="w-4 h-4 text-amber-300 ml-1" />
            <select
              value={selectedMosqueId}
              onChange={(e) => setSelectedMosqueId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-emerald-950 text-white">Semua Masjid ABDICity</option>
              {MOSQUE_LIST.map((m) => (
                <option key={m.id} value={m.id} className="bg-emerald-950 text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Highlight Stats Row for Selected Mosque */}
        {selectedMosque ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/80 text-xs">
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Masjid Terpilih:</span>
              <span className="font-bold text-white truncate block">{selectedMosque.name}</span>
            </div>
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Khathib Jum'at Ini:</span>
              <span className="font-bold text-amber-300 truncate block">{selectedMosque.qhatibJumatThisWeek}</span>
            </div>
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Imam Salat Jum'at:</span>
              <span className="font-bold text-white truncate block">{selectedMosque.imajJumatThisWeek}</span>
            </div>
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Saldo Kas Terkini:</span>
              <span className="font-extrabold font-mono text-amber-300 block">Rp {selectedMosque.cashBalance.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/80 text-xs">
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Total Jaringan Masjid:</span>
              <span className="font-bold text-white block">{MOSQUE_LIST.length} Masjid Utama</span>
            </div>
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Pengumuman Aktif:</span>
              <span className="font-bold text-amber-300 block">{announcementsList.length} Warta Jamaah</span>
            </div>
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Agenda Komunitas:</span>
              <span className="font-bold text-white block">{COMMUNITY_EVENTS.length} Kegiatan Mendatang</span>
            </div>
            <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-300 block">Pengingat Ditandai:</span>
              <span className="font-extrabold font-mono text-amber-300 block">{remindedEventIds.length} Event</span>
            </div>
          </div>
        )}
      </div>

      {/* LIVE PRAYER SCHEDULE & ADHAN COUNTDOWN WIDGET CARD */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-5 border-2 border-emerald-700/80 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md">
              <Clock className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-white font-serif text-base sm:text-lg flex items-center gap-2">
                <span>Jadwal Salat & Waktu Ibadah Realtime</span>
                <span className="bg-emerald-800 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-600">
                  Live Sync
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                Waktu salat otomatis disesuaikan dengan posisi masjid lokal ({selectedCity}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 bg-emerald-900/90 border border-emerald-700 rounded-xl px-3 py-1.5 text-xs text-amber-300">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ABDICity (Pusat)" className="bg-emerald-950">ABDICity (Pusat)</option>
                <option value="Jakarta Selatan" className="bg-emerald-950">Jakarta Selatan</option>
                <option value="Surabaya" className="bg-emerald-950">Surabaya</option>
                <option value="Bandung" className="bg-emerald-950">Bandung</option>
                <option value="Medan" className="bg-emerald-950">Medan</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPlayingAdhan(!isPlayingAdhan);
                showToast(
                  !isPlayingAdhan
                    ? '🔊 Simulasi Suara Adhan Merdu Berhasil Dilanjutkan.'
                    : '🔇 Suara Adhan Dimatikan.'
                );
              }}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isPlayingAdhan
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border-emerald-600'
              }`}
              title="Simulasi Alarm Adhan"
            >
              {isPlayingAdhan ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingAdhan ? 'Adhan Play' : 'Suara Adhan'}</span>
            </button>
          </div>
        </div>

        {/* Live Prayer Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRAYER_TIMES.map((pt) => (
            <div
              key={pt.name}
              className={`p-3 rounded-2xl border transition-all text-center space-y-1 relative overflow-hidden ${
                pt.isNext
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg scale-[1.02] font-black'
                  : 'bg-emerald-950/70 text-white border-emerald-800/80 hover:bg-emerald-900/60'
              }`}
            >
              {pt.isNext && (
                <div className="absolute top-0 right-0 bg-emerald-950 text-amber-300 text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                  Menjelang
                </div>
              )}
              <span className={`text-[11px] block font-serif ${pt.isNext ? 'text-emerald-950 font-bold' : 'text-emerald-300'}`}>
                {pt.name}
              </span>
              <span className={`text-xs block font-mono ${pt.isNext ? 'text-emerald-900 font-extrabold' : 'text-emerald-400'}`}>
                {pt.arabicName}
              </span>
              <span className={`text-sm sm:text-base font-extrabold font-mono block ${pt.isNext ? 'text-emerald-950' : 'text-amber-300'}`}>
                {pt.time}
              </span>
            </div>
          ))}
        </div>

        {/* Countdown Banner */}
        <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400 animate-ping" />
            <span className="text-emerald-200">
              Waktu Salat Berikutnya: <strong className="text-amber-300 font-mono">Maghrib (18:04 WIB)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-amber-300 font-bold bg-emerald-900/90 px-3 py-1 rounded-xl border border-emerald-700">
            <span>Hitung Mundur:</span>
            <span className="text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">00:24:15</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS & SEARCH BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
          <button
            onClick={() => setActiveBoardTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeBoardTab === 'announcements'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Pengumuman Masjid</span>
            <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {announcementsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveBoardTab('events')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeBoardTab === 'events'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Agenda & Acara</span>
            <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {COMMUNITY_EVENTS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveBoardTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeBoardTab === 'schedules'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Jadwal Kegiatan Rutin</span>
          </button>

          <button
            onClick={() => setActiveBoardTab('cash-report')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeBoardTab === 'cash-report'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Laporan Kas & Transparansi</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pengumuman / agenda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* TAB 1: PENGUMUMAN MASJID */}
      {activeBoardTab === 'announcements' && (
        <div className="space-y-6">
          {/* Admin Mode Status & Proposal Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Kategori:
              </span>
              {['Semua', 'Informasi Kas', 'Renovasi', 'Sosial & ZIS', 'Himbauan', 'Kajian Special'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAnnouncementCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    announcementCategory === cat
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(!isAdminMode);
                  showToast(
                    !isAdminMode
                      ? '🔓 Mode Pengurus DKM Aktif! Anda kini dapat menyematkan atau mengedit pengumuman.'
                      : '🔒 Kembali ke Mode Jamaah Umum.'
                  );
                }}
                className={`text-xs px-3 py-2 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
                  isAdminMode
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 font-extrabold shadow-sm'
                    : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>{isAdminMode ? 'Mode DKM Aktif' : 'Akses DKM / Marbot'}</span>
              </button>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Usulkan Pengumuman</span>
              </button>
            </div>
          </div>

          {/* DKM ADMIN PINNED NOTICES HERO SECTION (PINNED BY MOSQUE ADMINISTRATORS) */}
          {announcementsList.some((a) => a.isPinned) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-500 fill-amber-400 animate-bounce" />
                <h3 className="font-bold text-emerald-950 font-serif text-sm sm:text-base">
                  Disematkan Pengurus DKM Masjid (Pinned Notices)
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  Resmi & Penting
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcementsList
                  .filter((a) => a.isPinned)
                  .map((item) => (
                    <div
                      key={`pinned-${item.id}`}
                      className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-5 border-2 border-amber-400/80 shadow-xl space-y-3.5 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-emerald-800/90 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-400 text-emerald-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Pin className="w-3 h-3 fill-emerald-950" /> Pinned
                          </span>
                          <span className="text-[10px] text-emerald-200 font-medium">{item.date}</span>
                        </div>

                        {isAdminMode && (
                          <button
                            type="button"
                            onClick={() => togglePinAnnouncement(item.id)}
                            className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 p-1.5 rounded-lg text-[10px] font-bold border border-emerald-600 flex items-center gap-1"
                            title="Lepaskan Sematan"
                          >
                            <PinOff className="w-3.5 h-3.5" />
                            <span>Unpin</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-amber-300 text-base sm:text-lg leading-snug font-serif">
                          {item.title}
                        </h4>
                        <p className="text-xs text-emerald-100 leading-relaxed bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800/80">
                          {item.content}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] text-emerald-300 block font-medium">Penanggung Jawab:</span>
                            <span className="font-bold text-white text-[11px] block">{item.authorName || 'DKM Masjid'} ({item.authorRole || 'Pengurus'})</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenInfaqModal(`Dukungan ${item.title}`, 50000)}
                          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl shadow-md transition-all"
                        >
                          Dukung
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ALL ANNOUNCEMENTS GRID */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-emerald-950 font-serif text-sm sm:text-base flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-700" />
              <span>Semua Warta & Pengumuman Komunitas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-emerald-100 shadow-md p-5 space-y-4 flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      {item.isPinned && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Pin className="w-3 h-3 text-amber-600 fill-amber-500" /> Disematkan
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 font-medium">{item.date}</span>
                    </div>

                    {isAdminMode && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => togglePinAnnouncement(item.id)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                            item.isPinned
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title={item.isPinned ? 'Lepaskan sematan' : 'Sematkan ke atas'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAnnouncement(item.id)}
                          className="p-1.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          title="Hapus Pengumuman"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {item.image && (
                      <div className="h-40 rounded-2xl overflow-hidden bg-emerald-950/10">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-emerald-950 text-base leading-snug font-serif">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {item.mosqueName}
                      </p>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/60">
                      {item.content}
                    </p>

                    {item.authorName && (
                      <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 pt-1">
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Dipublikasikan oleh: <strong>{item.authorName}</strong> ({item.authorRole || 'Pengurus DKM'})</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                    <button
                      onClick={() => showToast(`Link pengumuman "${item.title}" disalin ke clipboard!`)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-500" /> Bagikan ke Jamaah
                    </button>

                    <button
                      onClick={() => onOpenInfaqModal(`Dukungan ${item.title}`, 25000)}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                    >
                      Dukung Kegiatan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="bg-white rounded-3xl border border-dashed border-emerald-200 p-8 text-center space-y-3">
              <Megaphone className="w-10 h-10 text-emerald-300 mx-auto" />
              <p className="text-xs text-gray-500 font-medium">Tidak ada pengumuman yang sesuai dengan filter pencarian.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AGENDA & ACARA KOMUNITAS */}
      {activeBoardTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const isReminded = remindedEventIds.includes(evt.id);

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-emerald-100 shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                        {evt.category}
                      </span>
                      {evt.isLiveStream && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span> Live Stream
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-emerald-950 text-base leading-snug font-serif">{evt.title}</h4>
                      <p className="text-xs text-amber-800 font-bold mt-1">Pemateri: {evt.speaker}</p>
                    </div>

                    <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 text-xs space-y-1.5 text-gray-700">
                      <p className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{evt.date} • {evt.time}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-medium text-emerald-900">
                        <Users className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{evt.attendeesCount} Jamaah Terdaftar {evt.maxCapacity ? `(Kapasitas ${evt.maxCapacity})` : ''}</span>
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3">{evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-emerald-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        toggleEventReminder(evt.id);
                        if (!isReminded) {
                          showToast(`Pengingat acara "${evt.title}" berhasil diaktifkan!`);
                        }
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        isReminded
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {isReminded ? (
                        <>
                          <Bell className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                          <span>Pengingat Aktif</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Ingatkan Saya</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => showToast(`Anda berhasil mendaftar sebagai peserta "${evt.title}". Sampai jumpa di masjid!`)}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all text-center"
                    >
                      Hadir / Daftar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: JADWAL KEGIATAN RUTIN MASJID */}
      {activeBoardTab === 'schedules' && (
        <div className="space-y-6">
          {/* Day Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
            <span className="text-xs font-bold text-emerald-900 mr-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Hari:
            </span>
            {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Ahad'].map((d) => (
              <button
                key={d}
                onClick={() => setScheduleDay(d)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  scheduleDay === d
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Activity Matrix List */}
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-md overflow-hidden">
            <div className="p-4 bg-emerald-900 text-white font-serif font-bold text-sm flex items-center justify-between">
              <span>Matriks Kegiatan Rutin Mingguan Masjid</span>
              <span className="text-xs font-normal text-emerald-200">Terbuka Untuk Umum</span>
            </div>

            <div className="divide-y divide-emerald-100">
              {filteredSchedules.map((sch) => (
                <div key={sch.id} className="p-4 sm:p-5 hover:bg-emerald-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                        {sch.day}
                      </span>
                      <span className="text-xs font-bold font-mono text-emerald-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" /> {sch.time}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        {sch.targetAudience}
                      </span>
                    </div>

                    <h4 className="font-bold text-emerald-950 text-base leading-tight font-serif">{sch.title}</h4>

                    <p className="text-xs text-gray-600">
                      <strong>Pengampu / Guru:</strong> {sch.speakerOrTeacher} • <span className="text-emerald-800">Lokasi: {sch.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <button
                      onClick={() => showToast(`Jadwal "${sch.title}" ditambahkan ke kalender pengingat Anda!`)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                    >
                      + Tambah Pengingat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LAPORAN KAS & TRANSPARANSI */}
      {activeBoardTab === 'cash-report' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-emerald-950 font-serif">Laporan Keuangan & Kas Masjid Transparan</h3>
                <p className="text-xs text-gray-600">Laporan realtime pemasukan dan pengeluaran dana infaq, zakat, & wakaf jamaah.</p>
              </div>

              <button
                onClick={() => onOpenInfaqModal('Infaq Kas Masjid Utama', 100000)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-amber-300" />
                <span>Salurkan Infaq Kas</span>
              </button>
            </div>

            {/* Cash Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Kas Utama Operasional</span>
                <span className="text-xl font-black font-mono text-emerald-900 block">Rp 148.500.000</span>
                <span className="text-[10px] text-emerald-600 block">Audit Terakhir: 10 Agustus 2026</span>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-1">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Kas Santri & Anak Yatim</span>
                <span className="text-xl font-black font-mono text-amber-950 block">Rp 42.300.000</span>
                <span className="text-[10px] text-amber-700 block">Penyaluran Rutin Setiap Bulan</span>
              </div>

              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 text-center space-y-1">
                <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">Kas Ambulans & Bencana</span>
                <span className="text-xl font-black font-mono text-teal-950 block">Rp 28.700.000</span>
                <span className="text-[10px] text-teal-700 block">Siaga Dana Darurat Jamaah</span>
              </div>
            </div>

            {/* Audit Status Badge */}
            <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm font-serif">Laporan Keuangan Terverifikasi Bebas Riba</h4>
                  <p className="text-xs text-emerald-200">Disusun menggunakan sistem akuntansi syariah nirlaba dan diaudit berkala oleh Dewan Pengawas DKM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL MODAL FOR USULAN PENGUMUMAN */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-emerald-200 shadow-2xl p-6 space-y-5 relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold p-1 text-base"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-emerald-100 pb-3">
              <h3 className="font-bold text-lg text-emerald-950 font-serif flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" /> Form Usulan Pengumuman Jamaah
              </h3>
              <p className="text-xs text-gray-500">Ajukan pengumuman penting untuk ditayangkan di Papan Masjid Digital.</p>
            </div>

            <form onSubmit={handleAddAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">Judul Pengumuman:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Kerja Bakti Bersama Halaman Masjid Ahad Depan"
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Kategori Pengumuman:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Himbauan">Himbauan & Warta</option>
                    <option value="Kajian Special">Kajian Special</option>
                    <option value="Sosial & ZIS">Sosial & ZIS</option>
                    <option value="Renovasi">Renovasi & Pembangunan</option>
                    <option value="Informasi Kas">Informasi Kas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Nama Pengusul / Pengurus:</label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="Contoh: Ustadz Ahmad"
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Jabatan / Peran Pengusul:</label>
                  <input
                    type="text"
                    value={newAuthorRole}
                    onChange={(e) => setNewAuthorRole(e.target.value)}
                    placeholder="Contoh: Tim Humas & Media DKM"
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 w-full">
                    <input
                      type="checkbox"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="accent-emerald-700 w-4 h-4 rounded"
                    />
                    <span className="font-bold text-emerald-950 text-xs flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Semat di Atas (Pinned Notice)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Isi Pengumuman Lengkap:</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tuliskan detail pengumuman secara lengkap, jelas, dan ramah..."
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="bg-gray-100 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-gray-200"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Kirim Usulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
