import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  Plus,
  Share2,
  Heart,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  ExternalLink,
  Tag,
  X,
  Check,
  Building2,
  CalendarDays,
  List
} from 'lucide-react';

export interface MosqueEventItem {
  id: string;
  title: string;
  mosqueName: string;
  location: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string;
  speaker: string;
  category: 'Tabligh Akbar' | 'Kajian Rutin' | 'Subuh Berjamaah' | 'Khatam Quran' | 'Bakti Sosial' | 'Bazar UMKM' | 'Remaja Masjid';
  description: string;
  imageUrl?: string;
  attendeesCount: number;
  maxQuota?: number;
  isRegistered?: boolean;
  contactPerson?: string;
  isFeatured?: boolean;
}

const INITIAL_EVENTS: MosqueEventItem[] = [
  {
    id: 'evt-1',
    title: 'Tabligh Akbar: "Menata Hati, Memperkuat Ukhuwah di Era Digital"',
    mosqueName: 'Masjid Agung Islamicity ABDICity Central',
    location: 'Jl. Merdeka Dakwah No. 01, Pusat Kota',
    dateStr: '2026-08-15',
    timeStr: '19:30 - 21:30 WIB (Ba\'da Isya)',
    speaker: 'KH. Prof. Dr. Ahmad Zaki, MA',
    category: 'Tabligh Akbar',
    description: 'Kajian akbar ilmiah menyambut bulan Muharram dan penguatan ekonomi syariah umat. Disediakan konsumsi & doorprize buku syariah.',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 240,
    maxQuota: 500,
    isFeatured: true,
    contactPerson: '0812-3456-7890 (Humas Masjid)'
  },
  {
    id: 'evt-2',
    title: 'Gerakan Sholat Subuh Berjamaah & Sarapan Berkah Gratis',
    mosqueName: 'Masjid Jami\' Ar-Rahman',
    location: 'Jl. Melati Syariah No. 45',
    dateStr: '2026-08-16',
    timeStr: '04:15 - 06:00 WIB',
    speaker: 'Ustadz Hanif Al-Hafidz',
    category: 'Subuh Berjamaah',
    description: 'Kuliah Subuh tematik dilanjutkan ramah tamah dan sarapan bubur ayam berkah bersama seluruh jamaah dan anak yatim.',
    imageUrl: 'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 185,
    maxQuota: 300,
    isFeatured: true,
    contactPerson: '0813-9876-5432'
  },
  {
    id: 'evt-3',
    title: 'Bakti Sosial Donor Darah & Cek Kesehatan Gratis Jamaah',
    mosqueName: 'Masjid Al-Azhar ABDICity',
    location: 'Komp. Pendidikan Syariah, Blok B',
    dateStr: '2026-08-17',
    timeStr: '08:00 - 12:00 WIB',
    speaker: 'Tim Dokter Muslim & PMI Kota',
    category: 'Bakti Sosial',
    description: 'Kegiatan kemanusiaan donor darah bekerjasama dengan PMI serta pemeriksaan gula darah, asam urat, & kolesterol gratis.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 95,
    maxQuota: 150,
    contactPerson: '0811-2233-4455'
  },
  {
    id: 'evt-4',
    title: 'Kajian Rutin Fiqih Muamalah & Konsultasi Zakat',
    mosqueName: 'Masjid Raya Taqwa',
    location: 'Jl. Pemuda Islam No. 12',
    dateStr: '2026-08-18',
    timeStr: '16:00 - 17:30 WIB (Ba\'da Ashar)',
    speaker: 'Ustadz Dr. Irfan Syauqi, M.E.I',
    category: 'Kajian Rutin',
    description: 'Membahas bab akad jual beli, bebas riba, dan perhitungan zakat mal perdagangan modern untuk pengusaha UMKM.',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 60,
    maxQuota: 100,
    contactPerson: '0857-1122-3344'
  },
  {
    id: 'evt-5',
    title: 'Bazar Halal UMKM Masjid & Festival Kuliner Nusantara',
    mosqueName: 'Masjid Agung Islamicity ABDICity Central',
    location: 'Halaman Pelataran Masjid Central',
    dateStr: '2026-08-22',
    timeStr: '07:00 - 17:00 WIB',
    speaker: 'Komunitas UMKM Bermuamalah',
    category: 'Bazar UMKM',
    description: 'Pameran 40+ stan produk kuliner halal, busana muslim, buku islami, dan kerajinan binaan jamaah masjid.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 420,
    maxQuota: 1000,
    isFeatured: true,
    contactPerson: '0812-9988-7766'
  },
  {
    id: 'evt-6',
    title: 'Tahsin & Khataman Al-Qur\'an Bersama Remaja Masjid',
    mosqueName: 'Masjid Nurul Ikhlas',
    location: 'Jl. Kenanga Dakwah No. 8',
    dateStr: '2026-08-25',
    timeStr: '18:30 - 20:00 WIB (Ba\'da Maghrib)',
    speaker: 'Ustadzah Syarifah Nur, S.Th.I',
    category: 'Khatam Quran',
    description: 'Bimbingan tajwid perbaikan makhraj huruf Al-Qur\'an dan sima\'an juz 30 bersama santri dan jamaah umum.',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 45,
    maxQuota: 80,
    contactPerson: '0815-4433-2211'
  }
];

interface MasjidEventCalendarProps {
  onOpenInfaqModal?: (title?: string, amount?: number) => void;
}

export const MasjidEventCalendar: React.FC<MasjidEventCalendarProps> = ({ onOpenInfaqModal }) => {
  const [events, setEvents] = useState<MosqueEventItem[]>(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Calendar Navigation State (Current month view)
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Reminders & Registration Modal State
  const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  // New Event Proposal Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMosque, setNewMosque] = useState('Masjid Agung Islamicity ABDICity Central');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('2026-08-20');
  const [newTime, setNewTime] = useState('19:30 WIB');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newCategory, setNewCategory] = useState<MosqueEventItem['category']>('Tabligh Akbar');
  const [newDescription, setNewDescription] = useState('');
  const [newQuota, setNewQuota] = useState('200');

  // Categories list
  const categories = ['Semua', 'Tabligh Akbar', 'Kajian Rutin', 'Subuh Berjamaah', 'Khatam Quran', 'Bakti Sosial', 'Bazar UMKM', 'Remaja Masjid'];

  // Toggle Attendance / RSVP
  const handleToggleRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const isReg = !evt.isRegistered;
          return {
            ...evt,
            isRegistered: isReg,
            attendeesCount: isReg ? evt.attendeesCount + 1 : evt.attendeesCount - 1
          };
        }
        return evt;
      })
    );
  };

  // Google Calendar Integration Link Generator
  const getGoogleCalendarUrl = (evt: MosqueEventItem) => {
    const title = encodeURIComponent(evt.title);
    const details = encodeURIComponent(`${evt.description}\n\nPenceramah/Pengisi: ${evt.speaker}\nLokasi: ${evt.location}`);
    const location = encodeURIComponent(`${evt.mosqueName}, ${evt.location}`);

    // Convert date string YYYY-MM-DD
    const dateFormatted = evt.dateStr.replace(/-/g, '');
    const dates = `${dateFormatted}T120000Z/${dateFormatted}T150000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // Share Event Details
  const handleShareEvent = (evt: MosqueEventItem) => {
    const text = `📅 *AGENDA KEGIATAN MASJID ABDICity*
🕌 *${evt.title}*
📍 Tempat: ${evt.mosqueName} (${evt.location})
🗓️ Tanggal: ${evt.dateStr}
⏰ Jam: ${evt.timeStr}
🎙️ Penceramah/Pengisi: ${evt.speaker}

Mari hadir dan ajak keluarga tercinta! Info selengkapnya di ABDICity.cloud`;

    navigator.clipboard.writeText(text);
    setCopiedShareId(evt.id);
    setTimeout(() => setCopiedShareId(null), 2000);
  };

  // Set Reminder Notification
  const handleSetReminder = (evt: MosqueEventItem) => {
    setActiveReminderId(evt.id);
    setTimeout(() => setActiveReminderId(null), 3000);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Pengingat Agenda Masjid: ${evt.title}`, {
        body: `Di ${evt.mosqueName} pada ${evt.dateStr} jam ${evt.timeStr}`,
        icon: '/icon.png'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Add New Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMosque || !newSpeaker) return;

    const created: MosqueEventItem = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      mosqueName: newMosque,
      location: newLocation || 'Pelataran Utama Masjid',
      dateStr: newDate,
      timeStr: newTime,
      speaker: newSpeaker,
      category: newCategory,
      description: newDescription || 'Agenda kegiatan jamaah masjid.',
      attendeesCount: 1,
      maxQuota: parseInt(newQuota) || 200,
      isRegistered: true,
      contactPerson: 'Panitia Masjid Local'
    };

    setEvents([created, ...events]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewSpeaker('');
    setNewDescription('');
  };

  // Filter Events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.mosqueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.speaker.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Semua' || evt.category === selectedCategory;
    const matchesDate = !selectedCalendarDate || evt.dateStr === selectedCalendarDate;

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Calendar Helper functions
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-800">
        <div className="absolute -right-6 -bottom-6 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
              <CalendarIcon className="w-4 h-4 text-amber-300" />
              <span>Kalender Agenda Masjid & Kajian Jamaah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 leading-tight">
              Jadwal Kegiatan & Tabligh Akbar Komunitas Masjid
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Pantau jadwal kajian rutin, gerakan Subuh berjamaah, bakti sosial, dan festival bazaar UMKM masjid di sekitar Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Usulkan Agenda Masjid</span>
            </button>
          </div>
        </div>

        {/* View Switcher & Quick Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-emerald-800/80">
          <div className="flex items-center gap-2 bg-emerald-950/60 p-1 rounded-2xl border border-emerald-800">
            <button
              onClick={() => {
                setViewMode('list');
                setSelectedCalendarDate(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Daftar Agenda</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'calendar' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Kalender Bulanan</span>
            </button>
          </div>

          <div className="text-xs text-amber-300/90 font-mono font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Terdaftar {events.reduce((acc, curr) => acc + (curr.isRegistered ? 1 : 0), 0)} Agenda Diikuti</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari agenda, masjid, penceramah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {selectedCalendarDate && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-amber-600" />
              Menampilkan agenda khusus tanggal: {selectedCalendarDate}
            </span>
            <button
              onClick={() => setSelectedCalendarDate(null)}
              className="text-amber-700 hover:text-amber-900 font-bold underline text-[11px]"
            >
              Tampilkan Semua Tanggal
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: MONTHLY CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-emerald-950 font-serif text-lg min-w-[160px] text-center">
                {monthName}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 hidden sm:block">
              Klik pada tanggal bertanda titik emas untuk menyaring agenda kegiatan.
            </p>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-emerald-800 bg-emerald-50/60 p-2 rounded-2xl">
            <div>Ahad</div>
            <div>Senin</div>
            <div>Selasa</div>
            <div>Rabu</div>
            <div>Kamis</div>
            <div>Jum'at</div>
            <div>Sabtu</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty cells for padding before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[54px] rounded-xl bg-slate-50/40 border border-transparent" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
              const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

              // Check if any events exist on this date
              const dayEvents = events.filter((e) => e.dateStr === dateStr);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedCalendarDate === dateStr;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => {
                    if (hasEvents) {
                      setSelectedCalendarDate(isSelected ? null : dateStr);
                    }
                  }}
                  className={`min-h-[58px] p-1.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    hasEvents ? 'cursor-pointer hover:border-emerald-500 shadow-2xs' : 'opacity-60 cursor-default'
                  } ${
                    isSelected
                      ? 'bg-emerald-800 text-amber-300 border-amber-400 font-bold shadow-md'
                      : hasEvents
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{dayNum}</span>

                  {hasEvents && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 justify-center">
                        {dayEvents.map((e) => (
                          <span
                            key={e.id}
                            className={`w-2 h-2 rounded-full ${
                              e.category === 'Tabligh Akbar'
                                ? 'bg-amber-400'
                                : e.category === 'Subuh Berjamaah'
                                ? 'bg-emerald-600'
                                : 'bg-teal-500'
                            }`}
                            title={e.title}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-extrabold block text-center truncate">
                        {dayEvents.length} Agenda
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2 & FILTERED LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-emerald-950 font-serif text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-500" />
            <span>Daftar Agenda Kegiatan ({filteredEvents.length})</span>
          </h3>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-emerald-200 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 text-emerald-300 mx-auto" />
            <div>
              <h4 className="font-bold text-emerald-950 text-base">Tidak Ada Agenda Ditemukan</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian, pilih kategori lain, atau tambahkan usulan agenda masjid baru.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Usulkan Agenda Baru</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg ${
                  evt.isFeatured ? 'border-amber-300 ring-1 ring-amber-400/30' : 'border-emerald-100'
                }`}
              >
                <div>
                  {/* Event Top Banner Image / Badge */}
                  <div className="relative h-44 bg-slate-800 overflow-hidden">
                    <img
                      src={evt.imageUrl || 'https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80'}
                      alt={evt.title}
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                    {/* Category & Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-emerald-900/90 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full text-[10px] font-extrabold border border-amber-400/30 shadow-md">
                        {evt.category}
                      </span>
                      {evt.isFeatured && (
                        <span className="bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Utamakan
                        </span>
                      )}
                    </div>

                    {/* Date Tag Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-mono text-amber-300 block font-bold">
                        🗓️ {evt.dateStr} • {evt.timeStr}
                      </span>
                      <h4 className="font-bold font-serif text-base text-white leading-tight line-clamp-2 mt-0.5">
                        {evt.title}
                      </h4>
                    </div>
                  </div>

                  {/* Event Details Content */}
                  <div className="p-5 space-y-3.5 text-xs text-gray-700">
                    <div className="space-y-1.5 border-b border-emerald-50 pb-3">
                      <div className="flex items-start gap-2 text-emerald-950 font-bold">
                        <Building2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{evt.mosqueName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 pl-6">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    {/* Speaker Info */}
                    <div className="flex items-center gap-2.5 bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
                      <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block font-medium">Penceramah / Pengisi Agenda:</span>
                        <span className="font-bold text-emerald-950 block">{evt.speaker}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-xs line-clamp-2">
                      {evt.description}
                    </p>

                    {/* Quota Progress */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-700" /> Kuota Kehadiran Jamaah:
                        </span>
                        <span className="text-emerald-900 font-mono">
                          {evt.attendeesCount} {evt.maxQuota ? `/ ${evt.maxQuota}` : ''} Jamaah
                        </span>
                      </div>
                      {evt.maxQuota && (
                        <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-700 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (evt.attendeesCount / evt.maxQuota) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* RSVP Registration Button */}
                    <button
                      onClick={() => handleToggleRSVP(evt.id)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                        evt.isRegistered
                          ? 'bg-emerald-800 text-amber-300 border border-emerald-700'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      {evt.isRegistered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                          <span>Hadir (Terdaftar)</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-amber-300" />
                          <span>Daftar Hadir (RSVP)</span>
                        </>
                      )}
                    </button>

                    {/* Google Calendar Link */}
                    <a
                      href={getGoogleCalendarUrl(evt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl transition-all"
                      title="Tambah ke Google Calendar"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-700" />
                    </a>

                    {/* Reminder Bell */}
                    <button
                      onClick={() => handleSetReminder(evt)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        activeReminderId === evt.id
                          ? 'bg-amber-400 text-emerald-950 border-amber-500'
                          : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-200'
                      }`}
                      title="Ingatkan Saya"
                    >
                      <Bell className="w-4 h-4 text-amber-600" />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShareEvent(evt)}
                      className="p-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl transition-all"
                      title="Bagikan Agenda"
                    >
                      {copiedShareId === evt.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4 text-emerald-700" />
                      )}
                    </button>
                  </div>

                  {/* Infaq Support Button */}
                  {onOpenInfaqModal && (
                    <button
                      onClick={() => onOpenInfaqModal(`Infaq Operasional Agenda: ${evt.title}`, 50000)}
                      className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Infaq Operasional / Konsumsi Agenda Ini</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: SUBMIT NEW MOSQUE EVENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 font-serif text-base">Usulkan Agenda Masjid Baru</h3>
                  <p className="text-[11px] text-gray-500">Ajukan jadwal pengajian atau kegiatan kemakmuran masjid</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-emerald-950 block">Judul Agenda / Nama Kegiatan:*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tabligh Akbar & Dzikir Bersama..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-emerald-950 block">Nama Masjid:*</label>
                  <input
                    type="text"
                    required
                    value={newMosque}
                    onChange={(e) => setNewMosque(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-emerald-950 block">Kategori Kegiatan:*</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MosqueEventItem['category'])}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Tabligh Akbar">Tabligh Akbar</option>
                    <option value="Kajian Rutin">Kajian Rutin</option>
                    <option value="Subuh Berjamaah">Subuh Berjamaah</option>
                    <option value="Khatam Quran">Khatam Quran</option>
                    <option value="Bakti Sosial">Bakti Sosial</option>
                    <option value="Bazar UMKM">Bazar UMKM</option>
                    <option value="Remaja Masjid">Remaja Masjid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-emerald-950 block">Tanggal:*</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-emerald-950 block">Waktu / Jam:*</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 19:30 WIB (Ba'da Isya)"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-emerald-950 block">Penceramah / Pengisi:*</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Ustadz / Narasumber"
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-emerald-950 block">Target Kuota Jamaah:</label>
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-emerald-950 block">Lokasi Spesifik / Ruangan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Ruang Utama Lantai 1 / Pelataran Depan"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-emerald-950 block">Deskripsi & Catatan Kegiatan:</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan topik bahasan, fasilitas konsumsi, atau ketentuan jamaah..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Terbitkan Agenda</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
