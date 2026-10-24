import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  Heart,
  TrendingUp,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Building2,
  X,
  Plus,
  Info,
  Filter,
  Receipt,
  Gift,
  ArrowUpRight,
  ChevronRight,
  Bell,
  BellRing,
  Target,
  Clock,
  Smartphone,
  Mail,
  Settings,
  Save,
  Check,
  Zap,
  AlertCircle,
  Send,
  Search,
  Printer,
  FileText,
  Trash2,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

interface MonthlyCharityData {
  month: string;
  infaqMasjid: number;
  zakat: number;
  wakaf: number;
  baksosFood: number;
  total: number;
}

const INITIAL_MONTHLY_DATA: MonthlyCharityData[] = [
  { month: 'Jan', infaqMasjid: 250000, zakat: 0, wakaf: 100000, baksosFood: 150000, total: 500000 },
  { month: 'Feb', infaqMasjid: 300000, zakat: 0, wakaf: 200000, baksosFood: 100000, total: 600000 },
  { month: 'Mar', infaqMasjid: 400000, zakat: 1250000, wakaf: 150000, baksosFood: 300000, total: 2100000 },
  { month: 'Apr', infaqMasjid: 350000, zakat: 0, wakaf: 100000, baksosFood: 200000, total: 650000 },
  { month: 'Mei', infaqMasjid: 300000, zakat: 0, wakaf: 250000, baksosFood: 150000, total: 700000 },
  { month: 'Jun', infaqMasjid: 450000, zakat: 0, wakaf: 100000, baksosFood: 250000, total: 800000 },
  { month: 'Jul', infaqMasjid: 500000, zakat: 0, wakaf: 300000, baksosFood: 200000, total: 1000000 },
  { month: 'Agu', infaqMasjid: 600000, zakat: 1500000, wakaf: 200000, baksosFood: 350000, total: 2650000 }
];

export interface InfaqTransactionItem {
  id: string;
  receiptNo?: string;
  receiptNumber?: string;
  donorName?: string;
  donorPhone?: string;
  title?: string;
  program?: string;
  category?: string;
  amount: number;
  paymentMethod?: string;
  date: string;
  status?: string;
  verifiedHash?: string;
}

const INITIAL_LOCAL_STORAGE_HISTORY: InfaqTransactionItem[] = [
  {
    id: 'tx-101',
    receiptNo: 'ABDC-928102',
    donorName: 'Ahmad Mujahid',
    donorPhone: '081234567890',
    title: 'Zakat Maal Perdagangan UMKM',
    program: 'Zakat Maal Perdagangan UMKM',
    category: 'Zakat',
    amount: 1500000,
    paymentMethod: 'bank',
    date: '2026-08-10 14:20',
    status: 'Berhasil',
    verifiedHash: '0x8f2a...c41e'
  },
  {
    id: 'tx-102',
    receiptNo: 'ABDC-881204',
    donorName: 'Ahmad Mujahid',
    donorPhone: '081234567890',
    title: 'Infaq Renovasi Karpet Masjid Central ABDICity',
    program: 'Infaq Renovasi Karpet Masjid Central ABDICity',
    category: 'Infaq Masjid',
    amount: 300000,
    paymentMethod: 'qris',
    date: '2026-08-08 09:15',
    status: 'Berhasil',
    verifiedHash: '0x4e11...992b'
  },
  {
    id: 'tx-103',
    receiptNo: 'ABDC-739105',
    donorName: 'Ahmad Mujahid',
    donorPhone: '081234567890',
    title: 'Sponsorship 50 Paket Nasi Berkah Jum\'at',
    program: 'Sponsorship 50 Paket Nasi Berkah Jum\'at',
    category: 'Makan Gratis',
    amount: 350000,
    paymentMethod: 'qris',
    date: '2026-08-01 11:30',
    status: 'Berhasil',
    verifiedHash: '0x1c98...331a'
  },
  {
    id: 'tx-104',
    receiptNo: 'ABDC-662019',
    donorName: 'Ahmad Mujahid',
    donorPhone: '081234567890',
    title: 'Wakaf Ubin & Keramik Masjid Al-Azhar',
    program: 'Wakaf Ubin & Keramik Masjid Al-Azhar',
    category: 'Wakaf',
    amount: 300000,
    paymentMethod: 'bank',
    date: '2026-07-25 16:45',
    status: 'Berhasil',
    verifiedHash: '0x7b66...55a2'
  },
  {
    id: 'tx-105',
    receiptNo: 'ABDC-551982',
    donorName: 'Ahmad Mujahid',
    donorPhone: '081234567890',
    title: 'Beasiswa Pendidikan Santri Penghafal Quran',
    program: 'Beasiswa Pendidikan Santri Penghafal Quran',
    category: 'Infaq Pendidikan',
    amount: 200000,
    paymentMethod: 'qris',
    date: '2026-07-15 10:00',
    status: 'Berhasil',
    verifiedHash: '0x3d44...118c'
  }
];

interface ReminderSettings {
  enabled: boolean;
  targetAmount: number;
  reminderDay: string;
  reminderChannel: 'whatsapp' | 'email' | 'push' | 'all';
  reminderTime: string;
  preferredProgram: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInfaqModal?: (title?: string, amount?: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenInfaqModal
}) => {
  const [monthlyData] = useState<MonthlyCharityData[]>(INITIAL_MONTHLY_DATA);

  // Load transaction history from localStorage key 'abdicity_infaq_history'
  const [donationHistory, setDonationHistory] = useState<InfaqTransactionItem[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_infaq_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load infaq transactions from localStorage', e);
    }
    return INITIAL_LOCAL_STORAGE_HISTORY;
  });

  const [chartView, setChartView] = useState<'stacked' | 'total'>('stacked');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Search, Filter & Detail State for Transaction History
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
  const [selectedDetailTx, setSelectedDetailTx] = useState<InfaqTransactionItem | null>(null);

  // Sync / Re-fetch from localStorage whenever modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('abdicity_infaq_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDonationHistory(parsed);
          }
        } else {
          // Store initial if never set before
          localStorage.setItem('abdicity_infaq_history', JSON.stringify(INITIAL_LOCAL_STORAGE_HISTORY));
        }
      } catch (e) {
        console.error('Error fetching localStorage infaq history', e);
      }
    }
  }, [isOpen]);

  // Listen for storage changes across components or tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'abdicity_infaq_history' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setDonationHistory(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync to localStorage when donationHistory is deleted or modified
  const saveHistoryToLocalStorage = (updated: InfaqTransactionItem[]) => {
    setDonationHistory(updated);
    try {
      localStorage.setItem('abdicity_infaq_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  };

  const handleDeleteTx = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan riwayat transaksi ini?')) {
      const updated = donationHistory.filter((item) => item.id !== id);
      saveHistoryToLocalStorage(updated);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat transaksi infaq/zakat?')) {
      saveHistoryToLocalStorage([]);
    }
  };

  const handleResetDefaultHistory = () => {
    saveHistoryToLocalStorage(INITIAL_LOCAL_STORAGE_HISTORY);
  };

  // Recurring Monthly Notification & Goal Settings State
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    try {
      const saved = localStorage.getItem('abdicity_infaq_reminder_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      enabled: true,
      targetAmount: 500000,
      reminderDay: '5',
      reminderChannel: 'whatsapp',
      reminderTime: '07:00',
      preferredProgram: 'Infaq Rutin Kemakmuran Masjid & Makanan Gratis Jum\'at'
    };
  });

  const [isSavedToast, setIsSavedToast] = useState(false);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // Web Push Notification Permission State
  const [pushPermissionStatus, setPushPermissionStatus] = useState<'granted' | 'denied' | 'default' | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Re-check push permission state when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  // Helper to dispatch native HTML5 browser push notification
  const sendNativeBrowserPush = (title: string, body: string, customProgram?: string, customAmount?: number) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Browser Web Notification API not supported in this browser.');
      return false;
    }

    if (Notification.permission === 'granted') {
      try {
        const notifOptions: NotificationOptions & { renotify?: boolean; requireInteraction?: boolean } = {
          body: body,
          icon: 'https://cdn-icons-png.flaticon.com/512/2907/2907150.png',
          badge: 'https://cdn-icons-png.flaticon.com/512/2907/2907150.png',
          tag: 'abdicity-infaq-reminder-' + Date.now()
        };
        const notif = new Notification(title, notifOptions);

        notif.onclick = (e) => {
          e.preventDefault();
          window.focus();
          notif.close();
          if (onOpenInfaqModal) {
            onClose();
            onOpenInfaqModal(
              customProgram || reminderSettings.preferredProgram,
              customAmount || reminderSettings.targetAmount
            );
          }
        };
        return true;
      } catch (err) {
        console.error('Error instantiating Native Push Notification:', err);
      }
    }
    return false;
  };

  // Helper to request browser notification permission
  const requestBrowserNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser Anda tidak mendukung Web Notification API.');
      setPushPermissionStatus('unsupported');
      return 'unsupported';
    }

    try {
      let perm: NotificationPermission = 'default';
      if (typeof Notification.requestPermission === 'function') {
        perm = await Notification.requestPermission();
      } else {
        perm = await new Promise<NotificationPermission>((resolve) => {
          Notification.requestPermission((p) => resolve(p));
        });
      }
      setPushPermissionStatus(perm);

      if (perm === 'granted') {
        sendNativeBrowserPush(
          "🕌 Notifikasi Push ABDICity Diaktifkan",
          `Assalamu'alaikum Ahmad Mujahid! Notifikasi push browser pengingat target infaq bulanan Anda (Rp ${reminderSettings.targetAmount.toLocaleString('id-ID')}) telah berhasil diaktifkan.`
        );
      } else if (perm === 'denied') {
        alert(
          'Izin notifikasi diblokir oleh browser. Untuk mengaktifkan kembali, klik ikon gembok pada address bar browser Anda dan izinkan Notifikasi untuk situs ini.'
        );
      }
      return perm;
    } catch (err) {
      console.error('Failed to request browser notification permission', err);
      return 'denied';
    }
  };

  if (!isOpen) return null;

  // Derive categories for filter buttons
  const getCategoryFromTitle = (titleStr: string, existingCat?: string): string => {
    if (existingCat) return existingCat;
    const t = (titleStr || '').toLowerCase();
    if (t.includes('zakat')) return 'Zakat';
    if (t.includes('wakaf')) return 'Wakaf';
    if (t.includes('makan') || t.includes('baksos') || t.includes('nasi')) return 'Makan Gratis';
    if (t.includes('pendidikan') || t.includes('santri')) return 'Infaq Pendidikan';
    return 'Infaq Masjid';
  };

  // Calculate totals
  const totalFromHistory = donationHistory.reduce((acc, item) => acc + (item.amount || 0), 0);
  const totalLifetimeCharity = Math.max(
    monthlyData.reduce((acc, item) => acc + item.total, 0),
    totalFromHistory
  );
  const totalInfaqMasjid = monthlyData.reduce((acc, item) => acc + item.infaqMasjid, 0);
  const totalZakat = monthlyData.reduce((acc, item) => acc + item.zakat, 0);
  const totalWakaf = monthlyData.reduce((acc, item) => acc + item.wakaf, 0);
  const totalBaksosFood = monthlyData.reduce((acc, item) => acc + item.baksosFood, 0);

  // Current Month Infaq (e.g. August 2026)
  const currentMonthData = monthlyData[monthlyData.length - 1];
  const currentMonthInfaqTotal = currentMonthData ? currentMonthData.total : 0;
  const goalProgressPercent = Math.min(
    Math.round((currentMonthInfaqTotal / (reminderSettings.targetAmount || 1)) * 100),
    1000
  );

  const handleSaveReminderSettings = async () => {
    try {
      localStorage.setItem('abdicity_infaq_reminder_settings', JSON.stringify(reminderSettings));

      // Auto-trigger push permission request if channel involves push and permission is default
      if (
        reminderSettings.enabled &&
        (reminderSettings.reminderChannel === 'push' || reminderSettings.reminderChannel === 'all') &&
        pushPermissionStatus === 'default'
      ) {
        await requestBrowserNotificationPermission();
      }

      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerTestReminder = () => {
    const channelName =
      reminderSettings.reminderChannel === 'whatsapp'
        ? 'WhatsApp'
        : reminderSettings.reminderChannel === 'email'
        ? 'Email'
        : reminderSettings.reminderChannel === 'push'
        ? 'Browser Push'
        : 'WhatsApp & Email & Push';

    const dayText =
      reminderSettings.reminderDay === '1'
        ? 'Awal Bulan (Tgl 1)'
        : reminderSettings.reminderDay === '5'
        ? 'Tanggal 5 (Setelah Gajian)'
        : reminderSettings.reminderDay === '10'
        ? 'Tanggal 10'
        : reminderSettings.reminderDay === '25'
        ? 'Tanggal 25'
        : 'Setiap Hari Jum\'at Pertama';

    const pushTitle = "🕌 Pengingat Target Infaq Rutin ABDICity";
    const pushBody = `Assalamu'alaikum Bpk/Ibu Ahmad Mujahid. Jadwal ${dayText} (${reminderSettings.reminderTime} WIB): Target infaq bulanan Rp ${reminderSettings.targetAmount.toLocaleString('id-ID')} untuk "${reminderSettings.preferredProgram}". Klik untuk menyalurkan!`;

    // Attempt native browser push notification
    let sentNative = false;
    if (
      reminderSettings.reminderChannel === 'push' ||
      reminderSettings.reminderChannel === 'all' ||
      pushPermissionStatus === 'granted'
    ) {
      sentNative = sendNativeBrowserPush(pushTitle, pushBody);
    }

    const msg = `🔔 [Pengingat Infaq Rutin ${channelName}] Assalamu'alaikum Bpk/Ibu Ahmad Mujahid. Pengingat jadwal ${dayText} pukul ${reminderSettings.reminderTime} WIB: Target infaq bulanan Anda adalah Rp ${reminderSettings.targetAmount.toLocaleString('id-ID')}. Mari terus jaga istiqomah amalan kebaikan untuk program "${reminderSettings.preferredProgram}". ${
      sentNative ? ' (Notifikasi Native Push Browser Berhasil Terkirim ke Sistem OS!)' : ''
    } Tekan tombol 'Infaq Sekarang' di bawah untuk menyalurkan.`;

    setSimulatedNotification(msg);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Printable Digital Receipt Generator
  const handlePrintReceipt = (item: InfaqTransactionItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Harap izinkan popup browser untuk mengunduh/mencetak Kuitansi PDF.');
      return;
    }

    const title = item.title || item.program || 'Infaq & Sedekah Umum';
    const receiptNo = item.receiptNo || item.receiptNumber || `ABDC-${item.id}`;
    const date = item.date || new Date().toISOString().slice(0, 10);
    const donor = item.donorName || 'Ahmad Mujahid';
    const amount = item.amount || 0;
    const method = item.paymentMethod || 'QRIS';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Kuitansi_Resmi_${receiptNo}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', -apple-system, sans-serif; color: #064e3b; margin: 0; padding: 24px; background: #fff; }
          .top-bar { height: 6px; background: linear-gradient(90deg, #064e3b, #059669, #f59e0b); border-radius: 3px; margin-bottom: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; pb: 16px; margin-bottom: 20px; }
          .logo { display: flex; align-items: center; gap: 12px; }
          .icon { width: 44px; height: 44px; background: #064e3b; color: #f59e0b; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
          .title-text h1 { margin: 0; font-size: 20px; font-family: Georgia, serif; color: #064e3b; }
          .title-text p { margin: 2px 0 0; font-size: 11px; color: #047857; font-weight: 600; }
          .badge { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #1e293b; }
          .row span { color: #64748b; }
          .amount-row { border-top: 2px solid #059669; border-bottom: 2px solid #059669; padding: 12px 0; margin-top: 12px; font-size: 16px; font-weight: bold; }
          .amount-val { font-family: 'Courier New', monospace; color: #d97706; font-size: 20px; }
          .quran { text-align: center; background: #f0fdf4; border: 1px solid #a7f3d0; padding: 16px; border-radius: 12px; margin-bottom: 24px; }
          .arabic { font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #047857; margin-bottom: 4px; }
          .footer { text-align: center; border-top: 1px solid #e2e8f0; pt: 16px; font-size: 10px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="top-bar"></div>
        <div class="header">
          <div class="logo">
            <div class="icon">🕌</div>
            <div class="title-text">
              <h1>ABDICity Islamicity Platform</h1>
              <p>Platform Digital Kemakmuran Masjid & Penyaluran Syariah</p>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge">KUITANSI RESMI DONASI</span>
            <p style="margin: 4px 0 0; font-size: 10px; color: #64748b; font-family: monospace;">No: ${receiptNo}</p>
          </div>
        </div>

        <div class="box">
          <div class="row"><span>Nama Donatur / Hamba Allah:</span><strong>${donor}</strong></div>
          <div class="row"><span>Tanggal Penyaluran:</span><strong>${date}</strong></div>
          <div class="row"><span>Program / Akad Infaq:</span><strong>${title}</strong></div>
          <div class="row"><span>Kategori:</span><strong style="color:#047857;">${getCategoryFromTitle(title, item.category)}</strong></div>
          <div class="row"><span>Metode Pembayaran:</span><strong style="text-transform: uppercase;">${method}</strong></div>
          <div class="row"><span>Kode Verifikasi System:</span><strong style="font-family: monospace;">${item.verifiedHash || '0x' + Date.now().toString(16)}</strong></div>
          
          <div class="row amount-row">
            <span>Total Penyaluran Dana:</span>
            <span class="amount-val">Rp ${amount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div class="quran">
          <div class="arabic">"جَزَاكُمُ اللهُ خَيْرًا كَثِيْرًا وَبَارَكَ اللهُ فِيْ أَمْوَالِكُمْ"</div>
          <div style="font-size: 11px; color: #065f46;">"Jazakallahu khairan katshiran. Semoga Allah SWT melipatgandakan pahala, mensucikan harta, dan memberikan keberkahan untuk Anda dan keluarga."</div>
        </div>

        <div class="footer">
          <p>Terverifikasi Otomatis oleh Sistem DKM ABDICity • Bebas Riba • Audit Transparan 100%</p>
        </div>

        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 300); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Export Filtered History to CSV
  const handleExportCSV = () => {
    if (filteredHistory.length === 0) return;
    const headers = ['No Kuitansi', 'Tanggal', 'Nama Donatur', 'Program/Akad', 'Kategori', 'Nominal (Rp)', 'Metode', 'Status'];
    const rows = filteredHistory.map((tx) => [
      `"${tx.receiptNo || tx.receiptNumber || tx.id}"`,
      `"${tx.date}"`,
      `"${tx.donorName || 'Ahmad Mujahid'}"`,
      `"${(tx.title || tx.program || '').replace(/"/g, '""')}"`,
      `"${getCategoryFromTitle(tx.title || tx.program || '', tx.category)}"`,
      tx.amount || 0,
      `"${(tx.paymentMethod || 'qris').toUpperCase()}"`,
      `"${tx.status || 'Berhasil'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Riwayat_Infaq_Zakat_ABDICity_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Tooltip Component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const monthTotal = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-emerald-950 text-white p-3.5 rounded-2xl shadow-xl border border-emerald-700 text-xs space-y-2">
          <p className="font-bold font-serif text-amber-300 text-sm border-b border-emerald-800 pb-1">
            Bulan {label} {selectedYear}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-medium">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold font-mono">{formatRupiah(entry.value)}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-emerald-800 flex items-center justify-between font-extrabold text-amber-300">
            <span>Total Bulan Ini:</span>
            <span className="font-mono text-sm">{formatRupiah(monthTotal)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Filter transactions based on search query and category
  const filteredHistory = donationHistory.filter((item) => {
    const titleText = (item.title || item.program || '').toLowerCase();
    const donorText = (item.donorName || '').toLowerCase();
    const receiptText = (item.receiptNo || item.receiptNumber || '').toLowerCase();
    const searchLower = historySearchQuery.toLowerCase();

    const matchesSearch =
      titleText.includes(searchLower) || donorText.includes(searchLower) || receiptText.includes(searchLower);

    const category = getCategoryFromTitle(item.title || item.program || '', item.category);

    const matchesCategory =
      selectedCategoryFilter === 'Semua' || category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-emerald-100 space-y-6 animate-in fade-in zoom-in duration-200 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header User Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xl sm:text-2xl shadow-lg border-2 border-amber-400">
                AM
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 p-1 rounded-full shadow-md" title="Akun Terverifikasi Syariah">
                <ShieldCheck className="w-4 h-4 fill-emerald-900 text-amber-400" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-emerald-950">Ahmad Mujahid</h2>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" /> Donatur Istiqomah Kaffah
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                <span>masjid1.islamicity@gmail.com</span>
                <span>•</span>
                <span className="text-emerald-800 font-medium">Anggota Sejak Jan 2025</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onOpenInfaqModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInfaqModal("Infaq Rutin Keberkahan", 100000);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Infaq Sekarang</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-slate-100 rounded-2xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Motivational Verse & Hadith Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl shadow-md relative overflow-hidden border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Transparansi & Motivasi Amalan Ruhiyah</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 font-serif italic">
              "Harta tidak akan berkurang karena sedekah. Dan Allah tidak menambah kepada seorang hamba yang pemaaf melainkan kemuliaan."
            </p>
            <p className="text-[11px] text-amber-300/90 font-mono">
              — HR. Muslim No. 2588
            </p>
          </div>

          <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800 text-right flex-shrink-0 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
            <span className="text-[10px] text-emerald-300 font-medium">Total Akumulasi Donasi:</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-300 font-mono">
              {formatRupiah(totalLifetimeCharity)}
            </span>
          </div>
        </div>

        {/* Key Metrics Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[11px] font-bold">Infaq Masjid</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm sm:text-base font-extrabold text-emerald-950 font-mono">
              {formatRupiah(totalInfaqMasjid)}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium">12 Program Kemakmuran</p>
          </div>

          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-bold">Zakat Maal & Fitrah</span>
              <Receipt className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm sm:text-base font-extrabold text-amber-950 font-mono">
              {formatRupiah(totalZakat)}
            </p>
            <p className="text-[10px] text-amber-700 font-medium">Tersalurkan ke 8 Ashnaf</p>
          </div>

          <div className="bg-teal-50/80 p-3.5 rounded-2xl border border-teal-200/80 space-y-1">
            <div className="flex items-center justify-between text-teal-800">
              <span className="text-[11px] font-bold">Wakaf Produktif</span>
              <Gift className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-sm sm:text-base font-extrabold text-teal-950 font-mono">
              {formatRupiah(totalWakaf)}
            </p>
            <p className="text-[10px] text-teal-700 font-medium">Wakaf Ubin & Al-Qur'an</p>
          </div>

          <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200/80 space-y-1">
            <div className="flex items-center justify-between text-rose-800">
              <span className="text-[11px] font-bold">Baksos & Food</span>
              <Heart className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-sm sm:text-base font-extrabold text-rose-950 font-mono">
              {formatRupiah(totalBaksosFood)}
            </p>
            <p className="text-[10px] text-rose-700 font-medium">210 Paket Makanan Jum'at</p>
          </div>
        </div>

        {/* DEDICATED TARGET SEDEKAH PROGRESS BAR & GOAL TRACKER CARD */}
        <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-white p-5 sm:p-6 rounded-3xl border-2 border-amber-400/60 shadow-xl space-y-5 relative overflow-hidden">
          {/* Ambient Glow Decorative Effect */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/90 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-lg flex-shrink-0">
                <Target className="w-5 h-5 text-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white font-serif text-base sm:text-lg">
                    Target Sedekah Bulanan
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Goal Istiqomah
                  </span>
                </div>
                <p className="text-xs text-emerald-200">
                  Setel target finansial infaq Anda & pantau progress amalan secara realtime bulan {currentMonthData?.month || 'Agustus'} {selectedYear}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsEditingTarget(!isEditingTarget)}
                className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-600 transition-all flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{isEditingTarget ? 'Tutup Pengaturan' : 'Atur Target Sedekah'}</span>
              </button>
            </div>
          </div>

          {/* Target Amount Adjustment Panel (Collapsible / Toggleable) */}
          {isEditingTarget && (
            <div className="bg-emerald-950/90 p-4 rounded-2xl border border-amber-400/30 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="font-bold text-amber-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Pilih atau Input Nominal Target Sedekah (Rp):</span>
                </label>
                <span className="text-[11px] text-emerald-300">
                  Target Tersimpan: <strong className="font-mono text-amber-300">Rp {(reminderSettings.targetAmount || 0).toLocaleString('id-ID')}</strong>
                </span>
              </div>

              {/* Preset Target Goal Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[100000, 250000, 500000, 1000000, 2500000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setReminderSettings((prev) => ({ ...prev, targetAmount: amt }));
                      try {
                        const updated = { ...reminderSettings, targetAmount: amt };
                        localStorage.setItem('abdicity_infaq_reminder_settings', JSON.stringify(updated));
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold font-mono text-xs transition-all border text-center ${
                      reminderSettings.targetAmount === amt
                        ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md font-extrabold scale-[1.02]'
                        : 'bg-emerald-900/80 text-emerald-100 border-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    Rp {(amt / 1000).toFixed(0)}rb
                  </button>
                ))}
              </div>

              {/* Slider & Custom Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-emerald-300 font-mono">
                    <span>Rp 50.000</span>
                    <span>Rp 5.000.000</span>
                    <span>Rp 10.000.000</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={10000000}
                    step={50000}
                    value={reminderSettings.targetAmount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 50000;
                      setReminderSettings((prev) => ({ ...prev, targetAmount: val }));
                    }}
                    className="w-full accent-amber-400 cursor-pointer h-2 bg-emerald-900 rounded-lg"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    step={50000}
                    value={reminderSettings.targetAmount}
                    onChange={(e) => {
                      const val = Math.max(10000, parseInt(e.target.value) || 0);
                      setReminderSettings((prev) => ({ ...prev, targetAmount: val }));
                    }}
                    placeholder="Nominal Custom"
                    className="w-full bg-emerald-900/90 border border-amber-400/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400 text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveReminderSettings}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Target Sedekah</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Target Sedekah Progress Bar & Milestone Display */}
          <div className="bg-emerald-950/80 p-4 sm:p-5 rounded-2xl border border-emerald-800 space-y-4">
            {/* Upper Progress Text & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-200">Progress Capaian Target:</span>
                  <span className="bg-amber-400 text-emerald-950 text-xs font-extrabold px-2.5 py-0.5 rounded-full font-mono shadow-sm">
                    {goalProgressPercent}% Tercapai
                  </span>
                </div>
                <p className="text-[11px] text-amber-300 font-serif italic">
                  {goalProgressPercent >= 100
                    ? '🎉 Subhanallah! Target Sedekah Bulan Ini Telah Terlampaui. Semoga Menjadi Tabungan Akhirat.'
                    : goalProgressPercent >= 75
                    ? '🚀 Sedikit Lagi! Tinggal 25% Lagi Menuju Target Sedekah Bulanan Anda.'
                    : goalProgressPercent >= 50
                    ? '✨ Masya Allah! Anda Sudah Mencapai Setengah Jalan Target Sedekah Bulan Ini.'
                    : goalProgressPercent >= 25
                    ? '🌱 Awal Yang Baik! Terus Istiqomah Menyalurkan Sedekah Rutin.'
                    : '🤲 Mari Mulai Kebaikan Bulan Ini Dengan Menyisihkan Sebagian Harta.'}
                </p>
              </div>

              <div className="text-left sm:text-right font-mono self-start sm:self-auto">
                <div className="text-xs text-emerald-300">Terkumpul / Target:</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-300">
                  Rp {currentMonthInfaqTotal.toLocaleString('id-ID')} / <span className="text-emerald-100">Rp {(reminderSettings.targetAmount || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar Track with Milestone Indicators */}
            <div className="space-y-1.5">
              <div className="relative w-full bg-emerald-900/90 rounded-full h-5 p-0.5 border-2 border-emerald-700 overflow-hidden shadow-inner">
                {/* Animated Gradient Fill */}
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out relative shadow-lg"
                  style={{ width: `${Math.min(goalProgressPercent, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Milestone Scale Ticks (0%, 25%, 50%, 75%, 100%) */}
              <div className="relative w-full flex justify-between text-[10px] text-emerald-300 font-mono pt-1">
                <span className={goalProgressPercent >= 0 ? 'text-amber-300 font-bold' : ''}>0%</span>
                <span className={goalProgressPercent >= 25 ? 'text-amber-300 font-bold' : ''}>25%</span>
                <span className={goalProgressPercent >= 50 ? 'text-amber-300 font-bold' : ''}>50%</span>
                <span className={goalProgressPercent >= 75 ? 'text-amber-300 font-bold' : ''}>75%</span>
                <span className={goalProgressPercent >= 100 ? 'text-amber-300 font-bold' : ''}>100% Target</span>
              </div>
            </div>

            {/* Financial Summary Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 text-xs space-y-1">
                <span className="text-[10px] text-emerald-300 font-medium">Target Bulanan:</span>
                <p className="font-bold text-amber-300 font-mono text-xs sm:text-sm">
                  Rp {(reminderSettings.targetAmount || 0).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 text-xs space-y-1">
                <span className="text-[10px] text-emerald-300 font-medium">Terkumpul Bulan Ini:</span>
                <p className="font-bold text-emerald-200 font-mono text-xs sm:text-sm">
                  Rp {currentMonthInfaqTotal.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 text-xs space-y-1">
                <span className="text-[10px] text-emerald-300 font-medium">Sisa Target:</span>
                <p className="font-bold font-mono text-xs sm:text-sm text-amber-300">
                  {currentMonthInfaqTotal >= reminderSettings.targetAmount
                    ? '0 (Terlampaui!)'
                    : `Rp ${(reminderSettings.targetAmount - currentMonthInfaqTotal).toLocaleString('id-ID')}`}
                </p>
              </div>

              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 text-xs space-y-1">
                <span className="text-[10px] text-emerald-300 font-medium">Laju Harian (Estimasi):</span>
                <p className="font-bold text-teal-200 font-mono text-xs sm:text-sm">
                  {currentMonthInfaqTotal >= reminderSettings.targetAmount
                    ? 'Selesai'
                    : `Rp ${Math.ceil((reminderSettings.targetAmount - currentMonthInfaqTotal) / 20).toLocaleString('id-ID')}/hari`}
                </p>
              </div>
            </div>

            {/* Action Button: Kejar Target Infaq */}
            {onOpenInfaqModal && currentMonthInfaqTotal < reminderSettings.targetAmount && (
              <div className="pt-2 flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const remaining = Math.max(50000, reminderSettings.targetAmount - currentMonthInfaqTotal);
                    onOpenInfaqModal(reminderSettings.preferredProgram, remaining);
                  }}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg group"
                >
                  <Zap className="w-4 h-4 text-emerald-900 fill-emerald-900 group-hover:scale-110 transition-transform" />
                  <span>
                    Penuhi Sisa Target (Salurkan Rp {(reminderSettings.targetAmount - currentMonthInfaqTotal).toLocaleString('id-ID')})
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RECURRING INFAQ REMINDER & MONTHLY GOAL SETTINGS SECTION */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white p-4 sm:p-6 rounded-3xl border border-emerald-700 shadow-lg space-y-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-bold text-white font-serif text-base sm:text-lg">
                  Pengaturan Pengingat Infaq Rutin & Jadwal Notifikasi
                </h3>
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Kelola jadwal pengingat otomatis (WhatsApp, Email, Push Browser) agar tidak terlewat menyalurkan infaq rutin.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 bg-emerald-900/90 p-2 rounded-2xl border border-emerald-700 self-start sm:self-auto">
              <span className="text-xs font-bold text-emerald-200">
                {reminderSettings.enabled ? 'Pengingat Aktif' : 'Pengingat Nonaktif'}
              </span>
              <button
                type="button"
                onClick={() =>
                  setReminderSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center ${
                  reminderSettings.enabled ? 'bg-amber-400' : 'bg-emerald-950'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-emerald-950 transition-transform ${
                    reminderSettings.enabled ? 'translate-x-6 bg-emerald-950' : 'translate-x-0 bg-emerald-600'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Target Goal Progress Meter for Current Month */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Pencapaian Target Infaq Bulan Ini ({currentMonthData?.month || 'Agustus'} {selectedYear})</span>
              </div>
              <span className="font-mono text-emerald-200 font-bold">
                Rp {currentMonthInfaqTotal.toLocaleString('id-ID')} / Rp {(reminderSettings.targetAmount || 0).toLocaleString('id-ID')}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full bg-emerald-900 rounded-full h-3.5 overflow-hidden p-0.5 border border-emerald-700">
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 relative"
                style={{ width: `${Math.min(goalProgressPercent, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-300 font-medium">
                {goalProgressPercent >= 100 ? (
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Alhamdulillah! Target Bulanan Terlampaui ({goalProgressPercent}%)
                  </span>
                ) : (
                  <span>
                    Sisa target bulan ini: <strong className="text-amber-300 font-mono">Rp {Math.max(0, reminderSettings.targetAmount - currentMonthInfaqTotal).toLocaleString('id-ID')}</strong> ({goalProgressPercent}% tercapai)
                  </span>
                )}
              </span>

              <span className="bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                Goal ID: ABDC-TARGET-2026
              </span>
            </div>
          </div>

          {/* Interactive Form Controls for Notification Settings */}
          {reminderSettings.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Target Amount Selector */}
              <div className="space-y-1.5">
                <label className="block text-emerald-200 font-bold">Nominal Target Infaq Bulanan:</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[100000, 250000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() =>
                        setReminderSettings((prev) => ({ ...prev, targetAmount: amt }))
                      }
                      className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] transition-all border ${
                        reminderSettings.targetAmount === amt
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md'
                          : 'bg-emerald-900/70 text-emerald-100 border-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      Rp {(amt / 1000).toFixed(0)}rb
                    </button>
                  ))}
                </div>
                <div className="pt-1">
                  <input
                    type="number"
                    value={reminderSettings.targetAmount}
                    onChange={(e) =>
                      setReminderSettings((prev) => ({
                        ...prev,
                        targetAmount: Math.max(10000, parseInt(e.target.value) || 0)
                      }))
                    }
                    placeholder="Nominal Custom (Rp)"
                    className="w-full bg-emerald-950/90 border border-emerald-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Day & Time Selector */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="block text-emerald-200 font-bold">Jadwal Tanggal:</label>
                  <select
                    value={reminderSettings.reminderDay}
                    onChange={(e) =>
                      setReminderSettings((prev) => ({ ...prev, reminderDay: e.target.value }))
                    }
                    className="w-full bg-emerald-950 border border-emerald-700 text-white font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="1">Awal Bulan (Tgl 1)</option>
                    <option value="5">Tanggal 5 (Gajian)</option>
                    <option value="10">Tanggal 10</option>
                    <option value="25">Tanggal 25</option>
                    <option value="friday">Setiap Jum'at Pertama</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-emerald-200 font-bold">Jam Kirim:</label>
                  <select
                    value={reminderSettings.reminderTime}
                    onChange={(e) =>
                      setReminderSettings((prev) => ({ ...prev, reminderTime: e.target.value }))
                    }
                    className="w-full bg-emerald-950 border border-emerald-700 text-white font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="05:00">05:00 WIB (Ba'da Subuh)</option>
                    <option value="07:00">07:00 WIB (Pagi Hari)</option>
                    <option value="12:30">12:30 WIB (Ba'da Dzuhur)</option>
                    <option value="20:00">20:00 WIB (Malam Hari)</option>
                  </select>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="space-y-1.5">
                <label className="block text-emerald-200 font-bold">Saluran Pengiriman Notifikasi:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setReminderSettings((prev) => ({ ...prev, reminderChannel: 'whatsapp' }))
                    }
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reminderSettings.reminderChannel === 'whatsapp'
                        ? 'bg-amber-400 text-emerald-950 border-amber-300'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>WhatsApp Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setReminderSettings((prev) => ({ ...prev, reminderChannel: 'email' }))
                    }
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reminderSettings.reminderChannel === 'email'
                        ? 'bg-amber-400 text-emerald-950 border-amber-300'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Kuitansi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setReminderSettings((prev) => ({ ...prev, reminderChannel: 'push' }))
                    }
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reminderSettings.reminderChannel === 'push'
                        ? 'bg-amber-400 text-emerald-950 border-amber-300'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>App Push Notif</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setReminderSettings((prev) => ({ ...prev, reminderChannel: 'all' }))
                    }
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reminderSettings.reminderChannel === 'all'
                        ? 'bg-amber-400 text-emerald-950 border-amber-300'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Semua Saluran</span>
                  </button>
                </div>
              </div>

              {/* Preferred Program Selection */}
              <div className="space-y-1.5">
                <label className="block text-emerald-200 font-bold">Program Akad Pengingat Pilihan:</label>
                <select
                  value={reminderSettings.preferredProgram}
                  onChange={(e) =>
                    setReminderSettings((prev) => ({ ...prev, preferredProgram: e.target.value }))
                  }
                  className="w-full bg-emerald-950 border border-emerald-700 text-white font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 truncate"
                >
                  <option value="Infaq Rutin Kemakmuran Masjid & Makanan Gratis Jum'at">
                    Infaq Rutin Masjid & Makanan Gratis Jum'at
                  </option>
                  <option value="Zakat Maal & Pemberdayaan Ekonomi Ummat">
                    Zakat Maal & Pemberdayaan Ekonomi Ummat
                  </option>
                  <option value="Wakaf Ubin & Fasilitas Jamaah ABDICity">
                    Wakaf Ubin & Fasilitas Jamaah ABDICity
                  </option>
                  <option value="Beasiswa Santri Yatim & Penghafal Al-Qur'an">
                    Beasiswa Santri Yatim & Penghafal Al-Qur'an
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* Browser Push Notification Permission & Status Card */}
          {reminderSettings.enabled && (
            <div className="pt-2">
              {pushPermissionStatus === 'granted' ? (
                <div className="bg-emerald-950/90 p-3.5 rounded-2xl border border-emerald-700/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>Status Push Notif Browser: Aktif & Terverifikasi</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </p>
                      <p className="text-[11px] text-emerald-200">
                        Sistem OS / Browser Anda siap menerima pengingat target infaq bulanan secara otomatis.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      sendNativeBrowserPush(
                        "🕌 Pengingat Target Infaq Rutin ABDICity",
                        `Assalamu'alaikum Ahmad Mujahid! Target infaq bulanan Anda: Rp ${reminderSettings.targetAmount.toLocaleString('id-ID')}. Mari terus jaga istiqomah.`
                      )
                    }
                    className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs border border-emerald-600 transition-all flex items-center gap-1.5 flex-shrink-0 self-stretch sm:self-auto justify-center"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Uji Push Browser Native</span>
                  </button>
                </div>
              ) : pushPermissionStatus === 'denied' ? (
                <div className="bg-rose-950/80 p-3.5 rounded-2xl border border-rose-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-rose-200">Izin Push Notification Diblokir di Browser</p>
                      <p className="text-[11px] text-rose-200/90">
                        Browser memblokir notifikasi. Klik ikon gembok pada address bar URL browser Anda, ubah izin Notifikasi menjadi 'Izinkan', lalu tekan tombol 'Coba Lagi'.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={requestBrowserNotificationPermission}
                    className="bg-rose-900 hover:bg-rose-800 text-rose-100 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-600 transition-all flex-shrink-0 self-stretch sm:self-auto justify-center"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : pushPermissionStatus === 'default' ? (
                <div className="bg-amber-950/80 p-3.5 rounded-2xl border border-amber-600/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <BellRing className="w-5 h-5 text-amber-400 animate-bounce flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-200">Izin Push Notification Browser Belum Diberikan</p>
                      <p className="text-[11px] text-amber-200/90">
                        Aktifkan notifikasi push browser agar pengingat target infaq bulanan dikirim langsung ke layar desktop/HP Anda.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={requestBrowserNotificationPermission}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md self-stretch sm:self-auto justify-center"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Aktifkan Push Notif Browser</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800 text-[11px] text-emerald-300">
                  <p>
                    * Pengingat push browser memanfaatkan Web Notification API bawaan browser Anda.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons & Save Confirmation Toast */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-800">
            <button
              type="button"
              onClick={handleTriggerTestReminder}
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-emerald-600 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Uji Kirim Pengingat (Simulasi)</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {isSavedToast && (
                <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5 bg-emerald-950 px-3 py-1.5 rounded-xl border border-amber-400/50 animate-in fade-in">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Pengaturan Berhasil Disimpan!</span>
                </span>
              )}

              <button
                type="button"
                onClick={handleSaveReminderSettings}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>

          {/* Simulated Notification Modal/Banner Preview */}
          {simulatedNotification && (
            <div className="bg-emerald-950 p-4 rounded-2xl border-2 border-amber-400/80 shadow-2xl space-y-3 text-xs animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    Simulasi Notifikasi Pengingat ({reminderSettings.reminderChannel.toUpperCase()})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulatedNotification(null)}
                  className="text-emerald-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-emerald-100 font-mono leading-relaxed bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
                {simulatedNotification}
              </p>

              <div className="flex justify-end gap-2">
                {onOpenInfaqModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedNotification(null);
                      onClose();
                      onOpenInfaqModal(reminderSettings.preferredProgram, reminderSettings.targetAmount);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Heart className="w-3.5 h-3.5 fill-emerald-950 text-emerald-950" />
                    <span>Infaq Sekarang Sesuai Target</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MAIN VISUALIZATION: BAR CHART OF MONTHLY CHARITY DISTRIBUTION */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-emerald-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                <span>Grafik Distribusi Infaq & Zakat Bulanan</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Visualisasi rekapitulasi kontribusi sosial syariah Anda selama tahun {selectedYear}
              </p>
            </div>

            {/* View & Year Switchers */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center bg-emerald-50 p-1 rounded-xl border border-emerald-200 text-xs">
                <button
                  onClick={() => setChartView('stacked')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    chartView === 'stacked'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  Kategori Detail
                </button>
                <button
                  onClick={() => setChartView('total')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    chartView === 'total'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  Total Akumulasi
                </button>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="2026">Tahun 2026</option>
                <option value="2025">Tahun 2025</option>
              </select>
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#047857', fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }}
                />

                {chartView === 'stacked' ? (
                  <>
                    <Bar dataKey="infaqMasjid" name="Infaq Masjid" stackId="a" fill="#047857" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="zakat" name="Zakat Maal" stackId="a" fill="#d97706" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="wakaf" name="Wakaf Produktif" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="baksosFood" name="Baksos & Makanan" stackId="a" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <Bar dataKey="total" name="Total Kontribusi" fill="#047857" radius={[6, 6, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.total > 1500000 ? '#d97706' : '#047857'} />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transparency & Audit Guarantee Footer */}
          <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">
                Setiap rupiah disalurkan langsung secara transparan dengan bukti akad digital & kwitansi terverifikasi syariah.
              </span>
            </div>
            <span className="font-bold text-amber-700 whitespace-nowrap hidden sm:inline">
              Audit 100% Real-time
            </span>
          </div>
        </div>

        {/* TRANSACTION HISTORY SECTION (FETCHED & STORED IN LOCAL STORAGE) */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-emerald-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-950 font-serif text-base">
                  Riwayat Transaksi Infaq & Zakat (LocalStorage)
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Daftar lengkap kontribusi yang tersimpan otomatis di perangkat Anda ({donationHistory.length} total transaksi).
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredHistory.length === 0}
                className="bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition-all"
                title="Ekspor ke CSV / Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh CSV</span>
              </button>

              {donationHistory.length === 0 && (
                <button
                  type="button"
                  onClick={handleResetDefaultHistory}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-amber-300 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Muat Contoh Riwayat</span>
                </button>
              )}

              {donationHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-rose-200 transition-all"
                  title="Hapus Semua Riwayat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Category Filter Chips */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama program, donatur, atau kwitansi..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-3 py-2 font-medium text-emerald-950 focus:outline-none focus:border-emerald-600"
              />
              {historySearchQuery && (
                <button
                  onClick={() => setHistorySearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['Semua', 'Zakat', 'Infaq', 'Wakaf', 'Makan'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                    selectedCategoryFilter === cat
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction History Table */}
          <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-xs">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-950 text-sm">Tidak Ada Catatan Transaksi</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {historySearchQuery
                      ? `Tidak ada riwayat donasi yang cocok dengan kata kunci "${historySearchQuery}".`
                      : 'Belum ada riwayat infaq atau zakat tersimpan di local storage.'}
                  </p>
                </div>
                {onOpenInfaqModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenInfaqModal("Infaq Umum Masjid ABDICity", 50000);
                    }}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Salurkan Infaq Sekarang</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50/80 text-emerald-900 font-bold border-b border-emerald-100">
                    <tr>
                      <th className="p-3.5">Tanggal</th>
                      <th className="p-3.5">Program & Akad Infaq</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5 text-right">Nominal (Rp)</th>
                      <th className="p-3.5 text-center">Metode / No. Kwitansi</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50 text-gray-700 font-medium">
                    {filteredHistory.map((item) => {
                      const displayTitle = item.title || item.program || 'Infaq Umum';
                      const receiptNumber = item.receiptNo || item.receiptNumber || `ABDC-${item.id}`;
                      const categoryLabel = getCategoryFromTitle(displayTitle, item.category);

                      return (
                        <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="p-3.5 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                            {item.date}
                          </td>

                          <td className="p-3.5 font-bold text-emerald-950 max-w-xs">
                            <div className="space-y-0.5">
                              <p className="line-clamp-1">{displayTitle}</p>
                              <p className="text-[10px] text-gray-500 font-normal">
                                Donatur: <strong className="text-emerald-800">{item.donorName || 'Ahmad Mujahid'}</strong>
                              </p>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                              {categoryLabel}
                            </span>
                          </td>

                          <td className="p-3.5 text-right font-bold text-emerald-950 font-mono whitespace-nowrap">
                            {formatRupiah(item.amount)}
                          </td>

                          <td className="p-3.5 text-center font-mono text-[10px] text-gray-500 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                              <span className="uppercase text-[9px] font-bold text-emerald-800">
                                {item.paymentMethod || 'qris'}
                              </span>
                              <span>•</span>
                              <span>{receiptNumber}</span>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.5" />
                            </div>
                          </td>

                          <td className="p-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setSelectedDetailTx(item)}
                                className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-all"
                                title="Lihat Rincian Transaksi"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handlePrintReceipt(item)}
                                className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-all"
                                title="Cetak / Unduh Kwitansi PDF"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteTx(item.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-all"
                                title="Hapus dari Riwayat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL TRANSACTION MODAL POPUP */}
        {selectedDetailTx && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 border border-emerald-200 shadow-2xl animate-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-950 font-bold font-serif text-base">
                  <Receipt className="w-5 h-5 text-emerald-700" />
                  <span>Rincian Kwitansi Transaksi</span>
                </div>
                <button
                  onClick={() => setSelectedDetailTx(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-emerald-200/80 pb-2">
                  <span className="text-gray-500">Nomor Kwitansi:</span>
                  <span className="font-mono font-bold text-emerald-950">
                    {selectedDetailTx.receiptNo || selectedDetailTx.receiptNumber || `ABDC-${selectedDetailTx.id}`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Program / Akad:</span>
                  <span className="font-bold text-emerald-950 text-right max-w-[200px]">
                    {selectedDetailTx.title || selectedDetailTx.program}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Kategori:</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    {getCategoryFromTitle(selectedDetailTx.title || selectedDetailTx.program || '', selectedDetailTx.category)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Nama Donatur:</span>
                  <span className="font-bold text-gray-800">{selectedDetailTx.donorName || 'Ahmad Mujahid'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Nomor Telepon:</span>
                  <span className="font-mono text-gray-800">{selectedDetailTx.donorPhone || '081234567890'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tanggal Transaksi:</span>
                  <span className="font-mono text-gray-800">{selectedDetailTx.date}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Metode Pembayaran:</span>
                  <span className="font-bold uppercase text-emerald-800">{selectedDetailTx.paymentMethod || 'QRIS'}</span>
                </div>

                <div className="flex justify-between items-center border-t border-emerald-200/80 pt-2">
                  <span className="font-bold text-emerald-950 text-sm">Nominal Disalurkan:</span>
                  <span className="font-mono font-extrabold text-amber-600 text-base">
                    {formatRupiah(selectedDetailTx.amount)}
                  </span>
                </div>

                <div className="bg-emerald-900 text-emerald-100 p-2.5 rounded-xl text-[10px] space-y-0.5 font-mono">
                  <span className="text-amber-300 font-bold block">Digital Audit Hash:</span>
                  <span className="break-all">{selectedDetailTx.verifiedHash || '0x8f2a33901bc41e992b118c7721'}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePrintReceipt(selectedDetailTx);
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Cetak / Unduh Kwitansi PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

