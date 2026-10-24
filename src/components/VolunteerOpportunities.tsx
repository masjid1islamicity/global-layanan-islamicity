import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  UserPlus,
  Sparkles,
  Search,
  Filter,
  X,
  Award,
  ChevronRight,
  ShieldCheck,
  Building2,
  Heart,
  MessageSquare,
  BadgeCheck,
  Check,
  Info
} from 'lucide-react';

export interface VolunteerOpportunity {
  id: string;
  title: string;
  mosqueName: string;
  location: string;
  dateTime: string;
  category: 'Sosial & Dapur Berkah' | 'Kebersihan & Sarana' | 'Media & IT Dakwah' | 'Pendidikan TPA';
  requiredCount: number;
  registeredCount: number;
  skillsNeeded: string[];
  coordinatorName: string;
  coordinatorPhone: string;
  description: string;
  benefits: string[];
}

const INITIAL_OPPORTUNITIES: VolunteerOpportunity[] = [
  {
    id: 'vol-1',
    title: "Distribusi 250 Paket Nasi Berkah Jum'at & Pelayanan Jamaah",
    mosqueName: 'Masjid Raya ABDICity Center',
    location: 'Jl. Merdeka Barat No. 12, Jakarta Pusat',
    dateTime: "Setiap Hari Jum'at, 10:30 - 13:30 WIB",
    category: 'Sosial & Dapur Berkah',
    requiredCount: 15,
    registeredCount: 12,
    skillsNeeded: ['Kerjasama Tim', 'Keramahan Pelayanan', 'Fisik Prima'],
    coordinatorName: 'Ust. Ahmad Fauzi (Ketua DKM)',
    coordinatorPhone: '081299887711',
    description: 'Membantu persiapan, pembungkusan, dan pembagian paket makan siang gratis ba\'da Salat Jum\'at untuk jamaah, musafir, dan pekerja jalanan.',
    benefits: ['Makan Siang Berkah', 'Sertifikat Khadimul Masjid', 'Ukhuwah Sahabat Hijrah']
  },
  {
    id: 'vol-2',
    title: 'Tim Media, Kameramen & Live Streaming Tabligh Akbar',
    mosqueName: 'Masjid Agung Sunda Kelapa',
    location: 'Menteng, Jakarta Pusat',
    dateTime: 'Sabtu, 15 Agustus 2026, 18:00 - 21:00 WIB',
    category: 'Media & IT Dakwah',
    requiredCount: 6,
    registeredCount: 4,
    skillsNeeded: ['Operasional Kamera / HP', 'Software OBS / vMix', 'Manajemen Audio Mixer'],
    coordinatorName: 'Akhi Dimas Septian (Divisi Media)',
    coordinatorPhone: '085611223344',
    description: 'Bertanggung jawab atas kelancaran siaran langsung YouTube/Instagram Live Kajian Rutin Malam Minggu bersama Ustadz Nasional.',
    benefits: ['Snack & Konsumsi', 'Poin Amal Jariyah Dakwah Digital', 'Akses VIP Ustaz']
  },
  {
    id: 'vol-3',
    title: 'Pengajar Pembantu TPA & Rumah Tahfizh Anak Dhuafa',
    mosqueName: 'Masjid Al-Ikhlas ABDICity',
    location: 'Kebayoran Baru, Jakarta Selatan',
    dateTime: 'Senin & Rabu, 15:30 - 17:00 WIB',
    category: 'Pendidikan TPA',
    requiredCount: 10,
    registeredCount: 8,
    skillsNeeded: ['Membaca Al-Qur\'an / Tajwid Dasar', 'Sabar & Ramah Anak', 'Kreatif'],
    coordinatorName: 'Ustadzah Nurul Huda',
    coordinatorPhone: '081344556677',
    description: 'Mendampingi anak-anak dhuafa dan santri TPA dalam menghafal Surah-surah Pendek Juz 30 serta bacaan doa harian.',
    benefits: ['Pahala Mengajar Al-Qur\'an', 'Modul Pengajaran Syariah', 'Snack Santri']
  },
  {
    id: 'vol-4',
    title: 'Gotong Royong Kebersihan Karpet & Sterilisasi Wudhu Utama',
    mosqueName: 'Masjid Ar-Rahman ABDICity',
    location: 'Pondok Indah, Jakarta Selatan',
    dateTime: 'Minggu, 16 Agustus 2026, 07:00 - 10:00 WIB',
    category: 'Kebersihan & Sarana',
    requiredCount: 20,
    registeredCount: 18,
    skillsNeeded: ['Semangat Khidmat', 'Kerja Sama Kelompok', 'Fisik Sehat'],
    coordinatorName: 'Pak Haji Ridwan (Sie Sarpras)',
    coordinatorPhone: '081133445566',
    description: 'Program kerja bakti mingguan menyedot debu karpet utama, membersihkan tempat wudhu, toilet, serta merapikan mukena & Al-Qur\'an.',
    benefits: ['Sarapan Nasi Uduk Berkah', 'Kaus Relawan ABDICity', 'Pahala Menjaga Rumah Allah']
  },
  {
    id: 'vol-5',
    title: 'Penyaluran Paket Sembako & Santunan Yatim/Dhuafa',
    mosqueName: 'Masjid An-Nur Cempaka',
    location: 'Cempaka Putih, Jakarta Pusat',
    dateTime: 'Kamis, 20 Agustus 2026, 08:00 - 12:00 WIB',
    category: 'Sosial & Dapur Berkah',
    requiredCount: 12,
    registeredCount: 9,
    skillsNeeded: ['Pendataan / Verifikasi', 'Komunikasi Santun', 'Pengemasan'],
    coordinatorName: 'Ust. Zulkifli (Panitia Amil)',
    coordinatorPhone: '081877665544',
    description: 'Membantu verifikasi data penerima manfaat dan mendistribusikan 100 paket bantuan sembako kepada lansia dan anak yatim sekitar masjid.',
    benefits: ['Makan Siang Panitia', 'Doa Bersama Anak Yatim', 'Sertifikat Relawan']
  }
];

export const VolunteerOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_volunteer_opportunities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OPPORTUNITIES;
  });

  const [registeredTasks, setRegisteredTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_my_registered_volunteer_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['vol-1']; // Default registered to 1 task as sample
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<VolunteerOpportunity | null>(null);

  // Form states inside registration modal
  const [volunteerName, setVolunteerName] = useState<string>('Ahmad Mujahid');
  const [volunteerPhone, setVolunteerPhone] = useState<string>('081234567890');
  const [volunteerNote, setVolunteerNote] = useState<string>('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [justRegisteredTask, setJustRegisteredTask] = useState<VolunteerOpportunity | null>(null);
  const [viewTab, setViewTab] = useState<'opportunities' | 'my-tasks'>('opportunities');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_volunteer_opportunities', JSON.stringify(opportunities));
    } catch (e) {
      console.error(e);
    }
  }, [opportunities]);

  useEffect(() => {
    try {
      localStorage.setItem('abdicity_my_registered_volunteer_ids', JSON.stringify(registeredTasks));
    } catch (e) {
      console.error(e);
    }
  }, [registeredTasks]);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.mosqueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const myOpportunitiesList = opportunities.filter((opp) => registeredTasks.includes(opp.id));

  const handleOpenSignUpModal = (task: VolunteerOpportunity) => {
    setSelectedTaskForModal(task);
  };

  const handleConfirmSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForModal) return;

    const taskId = selectedTaskForModal.id;

    if (!registeredTasks.includes(taskId)) {
      setRegisteredTasks((prev) => [...prev, taskId]);
      setOpportunities((prev) =>
        prev.map((item) =>
          item.id === taskId
            ? { ...item, registeredCount: Math.min(item.requiredCount, item.registeredCount + 1) }
            : item
        )
      );
    }

    setJustRegisteredTask(selectedTaskForModal);
    setSelectedTaskForModal(null);
    setIsSuccessModalOpen(true);
  };

  const handleCancelRegistration = (taskId: string) => {
    setRegisteredTasks((prev) => prev.filter((id) => id !== taskId));
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, registeredCount: Math.max(0, item.registeredCount - 1) } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-700 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
              <span>Program Khadimul Masjid & Relawan Ummat</span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl font-serif text-amber-300 leading-tight">
              Peluang Khidmat & Relawan Masjid ABDICity
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              "Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa..." (QS. Al-Ma'idah: 2). Wujudkan kepedulian sosial dan memakmurkan rumah Allah dengan menyumbangkan tenaga serta keahlian Anda.
            </p>
          </div>

          {/* Quick Counter Card */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/80 text-center space-y-1.5 min-w-[200px] shadow-lg">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
              Tugas Terdaftar Anda
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-400 flex items-center justify-center gap-1.5">
              <BadgeCheck className="w-6 h-6 text-amber-400" />
              <span>{registeredTasks.length} Tugas Khidmat</span>
            </div>
            <button
              onClick={() => setViewTab(viewTab === 'opportunities' ? 'my-tasks' : 'opportunities')}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline block mx-auto pt-1 transition-all"
            >
              {viewTab === 'opportunities' ? 'Lihat Tugas Saya →' : '← Lihat Semua Peluang'}
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS: ALL OPPORTUNITIES VS MY TASKS */}
      <div className="flex items-center justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewTab('opportunities')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'opportunities'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Semua Peluang Relawan ({opportunities.length})</span>
          </button>

          <button
            onClick={() => setViewTab('my-tasks')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'my-tasks'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <BadgeCheck className="w-4 h-4 text-amber-400" />
            <span>Tugas Khidmat Saya ({registeredTasks.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OPPORTUNITIES LIST */}
      {viewTab === 'opportunities' && (
        <div className="space-y-5">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-md space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari tugas relawan atau nama masjid..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
                {[
                  { id: 'all', label: 'Semua Bidang' },
                  { id: 'Sosial & Dapur Berkah', label: 'Sosial & Dapur Berkah' },
                  { id: 'Kebersihan & Sarana', label: 'Kebersihan & Sarana' },
                  { id: 'Media & IT Dakwah', label: 'Media & IT Dakwah' },
                  { id: 'Pendidikan TPA', label: 'Pendidikan TPA' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((task) => {
              const isRegistered = registeredTasks.includes(task.id);
              const quotaPercent = Math.round((task.registeredCount / task.requiredCount) * 100);
              const isFull = task.registeredCount >= task.requiredCount;

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3.5">
                    {/* Header Category & Status Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {task.category}
                      </span>

                      {isRegistered ? (
                        <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                          <CheckCircle2 className="w-3 h-3 text-amber-600" />
                          <span>Anda Terdaftar</span>
                        </span>
                      ) : isFull ? (
                        <span className="bg-gray-100 text-gray-600 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                          Kuota Penuh
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {task.requiredCount - task.registeredCount} Slot Tersisa
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className="font-bold text-emerald-950 text-base font-serif leading-snug group-hover:text-emerald-800 transition-colors">
                      {task.title}
                    </h3>

                    {/* Location & Time info */}
                    <div className="space-y-1.5 text-xs text-gray-700 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                      <div className="flex items-start gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">{task.mosqueName}</strong>
                          <span className="text-[11px] text-gray-500">{task.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-900 pt-1 border-t border-emerald-100/80">
                        <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{task.dateTime}</span>
                      </div>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-gray-600">Kuota Khadimul Masjid:</span>
                        <span className="text-emerald-900 font-mono">
                          {task.registeredCount} / {task.requiredCount} Orang ({quotaPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Keahlian Diharapkan:</span>
                      <div className="flex flex-wrap gap-1">
                        {task.skillsNeeded.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-800 font-medium text-[10px] px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-5 pt-0">
                    {isRegistered ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCancelRegistration(task.id)}
                          className="w-1/3 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-xl text-xs transition-all border border-red-200"
                        >
                          Batal
                        </button>
                        <a
                          href={`https://wa.me/62${task.coordinatorPhone.replace(/^0/, '')}?text=Assalamu'alaikum%20${encodeURIComponent(task.coordinatorName)},%20saya%20sudah%20terdaftar%20relawan%20${encodeURIComponent(task.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-300" />
                          <span>Hubungi DKM</span>
                        </a>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenSignUpModal(task)}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                      >
                        <UserPlus className="w-4 h-4 text-amber-300" />
                        <span>Daftar Tugas Khidmat Ini</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MY REGISTERED TASKS LIST */}
      {viewTab === 'my-tasks' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
            <h3 className="font-bold text-emerald-950 font-serif text-lg flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-amber-500" />
              <span>Daftar Tugas Khidmat & Relawan Terdaftar Anda</span>
            </h3>

            {myOpportunitiesList.length === 0 ? (
              <div className="text-center py-10 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200 space-y-3">
                <Users className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-xs text-gray-600 font-medium">
                  Anda belum terdaftar pada tugas khidmat relawan masjid.
                </p>
                <button
                  onClick={() => setViewTab('opportunities')}
                  className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                >
                  Cari & Daftar Peluang Relawan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myOpportunitiesList.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-200 text-emerald-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md">
                          {task.category}
                        </span>
                        <span className="text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> TERDAFTAR RESMI
                        </span>
                      </div>

                      <h4 className="font-bold text-emerald-950 text-sm font-serif">{task.title}</h4>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{task.mosqueName} - {task.location}</span>
                      </p>
                      <p className="text-emerald-900 font-mono text-[11px] font-bold">
                        ⏱ {task.dateTime} | Koordinator: {task.coordinatorName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                      <a
                        href={`https://wa.me/62${task.coordinatorPhone.replace(/^0/, '')}?text=Assalamu'alaikum%20${encodeURIComponent(task.coordinatorName)},%20saya%20sudah%20terdaftar%20relawan%20${encodeURIComponent(task.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-300" />
                        <span>Koordinasi WA</span>
                      </a>

                      <button
                        onClick={() => handleCancelRegistration(task.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3 py-2 rounded-xl"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REGISTRATION FORM MODAL */}
      {selectedTaskForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-emerald-200 shadow-2xl p-6 space-y-4 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedTaskForModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 font-serif text-base">
                  Formulir Pendaftaran Khadimul Masjid
                </h3>
                <p className="text-xs text-gray-500">Konfirmasi komitmen khidmat relawan Anda</p>
              </div>
            </div>

            {/* Task Summary Box */}
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Tugas Dipilih:</span>
              <p className="font-bold text-emerald-950 font-serif text-sm">{selectedTaskForModal.title}</p>
              <p className="text-gray-600"><strong>Lokasi:</strong> {selectedTaskForModal.mosqueName}</p>
              <p className="text-emerald-900 font-mono font-bold"><strong>Waktu:</strong> {selectedTaskForModal.dateTime}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmSignUp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">Nama Lengkap Relawan:</label>
                <input
                  type="text"
                  required
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-emerald-950 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Nomor WhatsApp Aktif:</label>
                <input
                  type="tel"
                  required
                  value={volunteerPhone}
                  onChange={(e) => setVolunteerPhone(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-emerald-950 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Catatan / Keahlian Khusus (Opsional):</label>
                <textarea
                  rows={2}
                  value={volunteerNote}
                  onChange={(e) => setVolunteerNote(e.target.value)}
                  placeholder="Contoh: Saya memiliki pengalaman operasional sound system masjid dan siap hadir lebih awal..."
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForModal(null)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Konfirmasi Pendaftaran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {isSuccessModalOpen && justRegisteredTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-emerald-200 shadow-2xl p-6 text-center space-y-4 relative animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                BERHASIL TERDAFTAR KHADIMUL MASJID
              </span>
              <h3 className="font-bold text-emerald-950 text-xl font-serif">Alhamdulillah, Barakallahu Fiik!</h3>
              <p className="text-xs text-gray-600">
                Terima kasih Akhi/Ukhti <strong className="text-emerald-950">{volunteerName}</strong>. Pendaftaran Anda untuk tugas:
              </p>
              <p className="text-sm font-bold text-emerald-900 font-serif pt-1">
                "{justRegisteredTask.title}"
              </p>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-left space-y-1.5">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span>Lokasi: {justRegisteredTask.mosqueName}</span>
              </div>
              <p className="text-emerald-900 font-mono text-[11px]">Waktu: {justRegisteredTask.dateTime}</p>
              <p className="text-gray-700">Koordinator DKM: <strong>{justRegisteredTask.coordinatorName}</strong></p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/62${justRegisteredTask.coordinatorPhone.replace(/^0/, '')}?text=Assalamu'alaikum%20${encodeURIComponent(justRegisteredTask.coordinatorName)},%20saya%20${encodeURIComponent(volunteerName)}%20baru%20saja%20terdaftar%20relawan%20${encodeURIComponent(justRegisteredTask.title)}.%20Mohon%20petunjuk%20koordinasi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Masuk Group WA / Hubungi Koordinator</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-all"
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
