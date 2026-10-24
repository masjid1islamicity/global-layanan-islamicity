import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Download,
  QrCode,
  Building2,
  Sparkles,
  X,
  History,
  Search,
  FileText,
  Calendar,
  Wallet,
  Check,
  TrendingUp,
  BarChart3,
  LineChart,
  FileSpreadsheet,
  Printer,
  Award,
  CreditCard,
  Loader2,
  Clock,
  Copy,
  AlertTriangle,
  ShieldCheck,
  Smartphone,
  Send,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export interface InfaqTransaction {
  id: string;
  receiptNo: string;
  donorName: string;
  donorPhone: string;
  title: string;
  amount: number;
  paymentMethod: 'qris' | 'bank';
  date: string;
  status: 'Berhasil' | 'Diproses';
}

interface InfaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
  defaultAmount?: number;
}

const INITIAL_TRANSACTIONS: InfaqTransaction[] = [
  {
    id: 'tx-101',
    receiptNo: 'ABDC-928102',
    donorName: 'Hamba Allah',
    donorPhone: '081234567890',
    title: 'Infaq Subuh Pembentukan Peradaban',
    amount: 100000,
    paymentMethod: 'qris',
    date: '2026-08-10 05:15',
    status: 'Berhasil',
  },
  {
    id: 'tx-102',
    receiptNo: 'ABDC-881204',
    donorName: 'Hamba Allah',
    donorPhone: '081234567890',
    title: 'Zakat Maal & Penghasilan',
    amount: 2500000,
    paymentMethod: 'bank',
    date: '2026-08-01 14:30',
    status: 'Berhasil',
  },
  {
    id: 'tx-103',
    receiptNo: 'ABDC-739105',
    donorName: 'Hamba Allah',
    donorPhone: '081234567890',
    title: 'Sedekah Makanan Santri & Anak Yatim',
    amount: 500000,
    paymentMethod: 'qris',
    date: '2026-07-25 09:10',
    status: 'Berhasil',
  },
];

export const InfaqModal: React.FC<InfaqModalProps> = ({
  isOpen,
  onClose,
  defaultTitle = "Infaq & Sedekah Umum ABDICity",
  defaultAmount = 50000
}) => {
  const [activeTab, setActiveTab] = useState<'donate' | 'history'>('donate');
  const [donorName, setDonorName] = useState('Hamba Allah');
  const [donorPhone, setDonorPhone] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank'>('qris');
  const [step, setStep] = useState<'form' | 'payment' | 'receipt'>('form');

  // Mock Payment Gateway States
  const [paymentChannel, setPaymentChannel] = useState<'qris' | 'bsi_va' | 'muamalat_va' | 'debit_syariah'>('qris');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [copiedVA, setCopiedVA] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(899); // 14:59 countdown
  const [cardNumber, setCardNumber] = useState('4508 9201 8839 1029');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // Transactions state loaded from localStorage or initialized with sample data
  const [transactions, setTransactions] = useState<InfaqTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_infaq_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load infaq transactions", e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [currentReceipt, setCurrentReceipt] = useState<InfaqTransaction | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedTxDetail, setSelectedTxDetail] = useState<InfaqTransaction | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Timer countdown for Payment Gateway simulation session
  useEffect(() => {
    if (step === 'payment' && timeLeftSeconds > 0) {
      const timer = setInterval(() => setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeftSeconds]);

  // Chart Data calculation for Recharts
  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const map: { [key: string]: { dateLabel: string; amount: number; count: number } } = {};

    sorted.forEach((tx) => {
      let label = tx.date;
      try {
        const d = new Date(tx.date);
        if (!isNaN(d.getTime())) {
          label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        }
      } catch (e) {
        // fallback
      }

      if (!map[label]) {
        map[label] = { dateLabel: label, amount: 0, count: 0 };
      }
      map[label].amount += tx.amount;
      map[label].count += 1;
    });

    let runningTotal = 0;
    return Object.values(map).map((item) => {
      runningTotal += item.amount;
      return {
        ...item,
        cumulativeAmount: runningTotal
      };
    });
  }, [transactions]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_infaq_history', JSON.stringify(transactions));
    } catch (e) {
      console.error("Failed to save infaq transactions", e);
    }
  }, [transactions]);

  if (!isOpen) return null;

  const presets = [25000, 50000, 100000, 250000, 500000, 1000000];
  const effectiveAmount = customAmountInput ? Number(customAmountInput) : selectedAmount;

  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatedError(null);
    setTimeLeftSeconds(899);
    setStep('payment');
  };

  const handleSimulatePayment = (forceSuccess: boolean = true) => {
    setSimulatedError(null);
    setIsSimulatingPayment(true);

    setTimeout(() => {
      setIsSimulatingPayment(false);
      if (forceSuccess) {
        const newTx: InfaqTransaction = {
          id: `tx-${Date.now()}`,
          receiptNo: `ABDC-${Date.now().toString().slice(-6)}`,
          donorName: donorName.trim() || 'Hamba Allah',
          donorPhone: donorPhone.trim() || '-',
          title: defaultTitle,
          amount: effectiveAmount,
          paymentMethod: paymentChannel.includes('va') || paymentChannel === 'debit_syariah' ? 'bank' : 'qris',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'Berhasil',
        };

        setTransactions((prev) => [newTx, ...prev]);
        setCurrentReceipt(newTx);
        setStep('receipt');
      } else {
        setSimulatedError('Simulasi Dibatalkan: Pembayaran gagal diproses atau transaksi dibatalkan oleh pengguna.');
      }
    }, 1600);
  };

  const totalDonationAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredHistory = transactions.filter(
    (tx) =>
      tx.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      tx.receiptNo.toLowerCase().includes(historySearch.toLowerCase()) ||
      tx.donorName.toLowerCase().includes(historySearch.toLowerCase())
  );

  const exportToCSV = () => {
    if (filteredHistory.length === 0) return;
    const headers = ['No Kuitansi', 'Tanggal', 'Nama Donatur', 'No Telepon', 'Program/Akad', 'Nominal (Rp)', 'Metode Pembayaran', 'Status'];
    const rows = filteredHistory.map((tx) => [
      `"${tx.receiptNo}"`,
      `"${tx.date}"`,
      `"${tx.donorName}"`,
      `"${tx.donorPhone}"`,
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.paymentMethod.toUpperCase()}"`,
      `"${tx.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Infaq_Zakat_ABDICity_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (specificTx?: InfaqTransaction) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Harap izinkan popup browser untuk mencetak/mengunduh Laporan PDF.');
      return;
    }

    const txList = specificTx ? [specificTx] : filteredHistory;
    const totalAmount = txList.reduce((acc, curr) => acc + curr.amount, 0);
    const donorName = txList[0]?.donorName || 'Jamaah ABDICity';
    const isSingleReceipt = !!specificTx;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${isSingleReceipt ? `Kuitansi_${specificTx.receiptNo}` : `Laporan_Arsip_Infaq_Zakat_${donorName.replace(/\s+/g, '_')}`}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 24px;
            color: #064e3b;
            background: #ffffff;
            line-height: 1.5;
          }
          .top-bar {
            height: 6px;
            background: linear-gradient(90deg, #064e3b 0%, #059669 60%, #f59e0b 100%);
            border-radius: 3px;
            margin-bottom: 20px;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #059669;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .brand-logo {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-icon {
            width: 44px;
            height: 44px;
            background: #064e3b;
            color: #f59e0b;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: bold;
          }
          .brand-text h1 {
            margin: 0;
            font-size: 20px;
            color: #064e3b;
            font-family: Georgia, 'Times New Roman', serif;
            letter-spacing: 0.5px;
          }
          .brand-text p {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: #047857;
            font-weight: 600;
          }
          .doc-type {
            text-align: right;
          }
          .doc-type .badge-title {
            background: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            display: inline-block;
          }
          .doc-type p {
            margin: 4px 0 0 0;
            font-size: 10px;
            color: #64748b;
          }
          .donor-profile {
            background: #f0fdf4;
            border: 1px solid #a7f3d0;
            border-radius: 12px;
            padding: 14px 18px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .donor-info h3 {
            margin: 0;
            font-size: 14px;
            color: #064e3b;
          }
          .donor-info p {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: #047857;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 14px;
            text-align: center;
          }
          .card .label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            display: block;
            margin-bottom: 4px;
          }
          .card .value {
            font-size: 16px;
            font-weight: 800;
            color: #064e3b;
            font-family: 'Courier New', Courier, monospace;
          }
          .card .value-gold {
            color: #d97706;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 11px;
          }
          th {
            background: #065f46;
            color: #ffffff;
            padding: 10px 12px;
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
          }
          th:first-child { border-top-left-radius: 8px; }
          th:last-child { border-top-right-radius: 8px; }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          tr.total-row {
            background: #ecfdf5;
            font-weight: bold;
          }
          tr.total-row td {
            border-top: 2px solid #059669;
            border-bottom: 2px solid #059669;
            color: #064e3b;
            font-size: 12px;
          }
          .status-badge {
            background: #dcfce7;
            color: #166534;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 800;
            display: inline-block;
          }
          .receipt-mono {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700;
            color: #065f46;
          }
          .signatures {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 20px;
          }
          .sig-box {
            text-align: center;
            width: 200px;
          }
          .sig-space {
            height: 60px;
            border-bottom: 1px dashed #cbd5e1;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 10px;
            font-style: italic;
          }
          .sig-box p {
            margin: 0;
            font-size: 11px;
            font-weight: 700;
            color: #064e3b;
          }
          .sig-box span {
            font-size: 10px;
            color: #64748b;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            font-size: 10px;
            color: #64748b;
          }
          .arabic-quote {
            font-family: Georgia, serif;
            font-size: 13px;
            color: #047857;
            margin-bottom: 4px;
            font-weight: bold;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="top-bar"></div>

        <div class="header">
          <div class="brand-logo">
            <div class="logo-icon">🕌</div>
            <div class="brand-text">
              <h1>ABDICity Islamicity Platform</h1>
              <p>Laporan Resmi Arsip Infaq, Sedekah, & Zakat Syariah</p>
            </div>
          </div>
          <div class="doc-type">
            <span class="badge-title">${isSingleReceipt ? 'KUITANSI RESMI' : 'ARSIP RIWAYAT DONASI'}</span>
            <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div class="donor-profile">
          <div class="donor-info">
            <h3>Nama Donatur: <strong>${donorName}</strong></h3>
            <p>Terdaftar pada Platform Digital ABDICity • Terverifikasi Bebas Riba</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; color: #047857; font-weight: 700; display: block;">STATUS DOKUMEN</span>
            <span style="font-size: 11px; color: #166534; font-weight: 800; background: #dcfce7; padding: 2px 8px; border-radius: 4px;">SAH & AUDITED</span>
          </div>
        </div>

        <div class="summary-cards">
          <div class="card">
            <span class="label">Total Transaksi</span>
            <span class="value">${txList.length} Kebajikan</span>
          </div>
          <div class="card">
            <span class="label">Total Penyaluran Dana</span>
            <span class="value value-gold">Rp ${totalAmount.toLocaleString('id-ID')}</span>
          </div>
          <div class="card">
            <span class="label">Akad / Program</span>
            <span class="value" style="font-size: 12px; font-family: inherit;">Infaq & Zakat Digital</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No. Kuitansi</th>
              <th>Tanggal</th>
              <th>Program / Akad Infaq</th>
              <th>Metode</th>
              <th style="text-align: right;">Nominal (Rp)</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${txList
              .map(
                (tx) => `
              <tr>
                <td class="receipt-mono">${tx.receiptNo}</td>
                <td>${tx.date}</td>
                <td><strong>${tx.title}</strong></td>
                <td style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #047857;">${tx.paymentMethod}</td>
                <td style="font-family: 'Courier New', monospace; font-weight: bold; text-align: right; color: #064e3b;">Rp ${tx.amount.toLocaleString('id-ID')}</td>
                <td style="text-align: center;"><span class="status-badge">✔ ${tx.status}</span></td>
              </tr>
            `
              )
              .join('')}
            <tr class="total-row">
              <td colspan="4" style="text-align: right; font-weight: 800;">TOTAL AKUMULASI PENYALURAN:</td>
              <td style="text-align: right; font-family: 'Courier New', monospace; font-weight: 800; color: #d97706; font-size: 14px;">
                Rp ${totalAmount.toLocaleString('id-ID')}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-space">Stempel Digital DKM</div>
            <p>Pengurus DKM ABDICity</p>
            <span>Divisi Amil & ZIS</span>
          </div>

          <div class="sig-box">
            <div class="sig-space">Terverifikasi Sistem</div>
            <p>Dewan Pengawas Syariah</p>
            <span>Platform Islamicity</span>
          </div>
        </div>

        <div class="footer">
          <p class="arabic-quote">"جَزَاكُمُ اللهُ خَيْرًا كَثِيْرًا وَبَارَكَ اللهُ فِيْ أَمْوَالِكُمْ"</p>
          <p><strong>Jazakallahu khairan katshiran.</strong> Semoga Allah SWT melipatgandakan pahala, mensucikan harta, dan memberikan keberkahan untuk keluarga Anda.</p>
          <p style="margin-top: 8px; font-size: 9px; color: #94a3b8;">Dokumen PDF ini di-generate otomatis oleh Platform Syariah ABDICity sebagai arsip pribadi donatur yang sah.</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const exportCertificatePDF = (tx: InfaqTransaction) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Harap izinkan popup browser untuk mengunduh E-Sertifikat PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>E-Sertifikat_Infaq_${tx.receiptNo}_${tx.donorName.replace(/\s+/g, '_')}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Georgia, serif;
            margin: 0;
            padding: 20px;
            background: #fcfdfd;
            color: #064e3b;
            box-sizing: border-box;
          }
          .cert-border {
            border: 8px solid #064e3b;
            outline: 2px solid #f59e0b;
            outline-offset: -12px;
            padding: 28px 36px;
            border-radius: 12px;
            background: #ffffff;
            position: relative;
            text-align: center;
            box-shadow: inset 0 0 40px rgba(5, 150, 105, 0.05);
          }
          .header-badge {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #d97706;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 26px;
            font-weight: bold;
            color: #064e3b;
            margin: 0 0 4px 0;
            letter-spacing: 1px;
          }
          .subtitle {
            font-size: 12px;
            color: #059669;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 22px;
          }
          .presented-to {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .donor-name {
            font-family: Georgia, serif;
            font-size: 28px;
            font-weight: bold;
            color: #065f46;
            border-bottom: 2px solid #f59e0b;
            display: inline-block;
            padding-bottom: 4px;
            margin-bottom: 16px;
            min-width: 320px;
          }
          .cert-body {
            font-size: 13px;
            color: #1e293b;
            max-width: 680px;
            margin: 0 auto 18px auto;
            line-height: 1.6;
          }
          .amount-highlight {
            font-size: 15px;
            font-weight: bold;
            color: #d97706;
            font-family: 'Courier New', monospace;
            background: #fef3c7;
            padding: 2px 10px;
            border-radius: 6px;
            border: 1px solid #fde68a;
          }
          .quran-quote {
            background: #f0fdf4;
            border: 1px solid #a7f3d0;
            border-radius: 10px;
            padding: 12px 20px;
            margin: 0 auto 20px auto;
            max-width: 650px;
          }
          .quran-ar {
            font-family: Georgia, serif;
            font-size: 15px;
            color: #047857;
            font-weight: bold;
            margin-bottom: 4px;
            direction: rtl;
          }
          .quran-tr {
            font-size: 10px;
            color: #065f46;
            font-style: italic;
          }
          .footer-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 18px;
            padding: 0 40px;
          }
          .sig-column {
            text-align: center;
            width: 180px;
          }
          .sig-line {
            height: 40px;
            border-bottom: 1px dashed #059669;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #10b981;
            font-size: 10px;
            font-weight: bold;
          }
          .sig-name {
            font-size: 11px;
            font-weight: bold;
            color: #064e3b;
            margin: 0;
          }
          .sig-role {
            font-size: 10px;
            color: #64748b;
          }
          .cert-seal {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            border: 3px double #f59e0b;
            background: #ecfdf5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #064e3b;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
            padding: 4px;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
          }
          .cert-no {
            position: absolute;
            bottom: 12px;
            right: 20px;
            font-size: 9px;
            font-family: monospace;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; background: #fff; }
            .cert-border { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="header-badge">PLATFORM SYARIAH ABDICITY • DKM MASJID ABDICITY</div>
          <h1 class="title">SERTIFIKAT PENGHARGAAN DONATUR</h1>
          <div class="subtitle">CERTIFICATE OF INFAQ & CHARITABLE CONTRIBUTION</div>

          <div class="presented-to">Dengan penuh rasa syukur, sertifikat ini dipersembahkan kepada:</div>
          <div class="donor-name">${tx.donorName}</div>

          <div class="cert-body">
            Atas partisipasi dan ketulusan infaq/sedekah sebesar <span class="amount-highlight">Rp ${tx.amount.toLocaleString('id-ID')}</span> 
            untuk program kebaikan <strong>"${tx.title}"</strong> yang disalurkan pada tanggal <strong>${tx.date}</strong>. 
            Semoga Allah SWT mencatatnya sebagai amal jariyah yang pahalanya mengalir tiada putus.
          </div>

          <div class="quran-quote">
            <div class="quran-ar">"مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِّائَةُ حَبَّةٍ"</div>
            <div class="quran-tr">"Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji." (QS. Al-Baqarah: 261)</div>
          </div>

          <div class="footer-grid">
            <div class="sig-column">
              <div class="sig-line">TERVERIFIKASI DIGITAL</div>
              <p class="sig-name">Pengurus DKM ABDICity</p>
              <span class="sig-role">Divisi Amil & ZIS</span>
            </div>

            <div class="cert-seal">
              <span style="font-size: 16px; margin-bottom: 2px;">🕌</span>
              <span>E-SERTIFIKAT</span>
              <span style="color: #d97706; font-size: 8px;">TERVERIFIKASI</span>
            </div>

            <div class="sig-column">
              <div class="sig-line">SAH SYARIAH</div>
              <p class="sig-name">Dewan Pengawas Syariah</p>
              <span class="sig-role">Platform Islamicity</span>
            </div>
          </div>

          <div class="cert-no">NO. SERTIFIKAT: CERT/ZIS/${tx.receiptNo}</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-emerald-200 shadow-2xl p-6 relative overflow-hidden space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('donate')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'donate'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>Salurkan Infaq</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Riwayat Transaksi</span>
              <span className="bg-amber-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                {transactions.length}
              </span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 font-bold p-1 rounded-full text-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB 1: FORM & DONATION FLOW */}
        {activeTab === 'donate' && (
          <div className="overflow-y-auto pr-1 space-y-4">
            {/* STEP 1: FORM */}
            {step === 'form' && (
              <form onSubmit={handleProceedPayment} className="space-y-4">
                <div className="flex items-center gap-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 font-serif text-base">{defaultTitle}</h3>
                    <p className="text-[11px] text-gray-500">Penyaluran amanah infaq & zakat transparan 100%</p>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-emerald-900">Pilih Nominal Infaq/Sedekah:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presets.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmountInput('');
                        }}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          selectedAmount === amt && !customAmountInput
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                            : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Atau ketik nominal custom (Rp)..."
                      value={customAmountInput}
                      onChange={(e) => setCustomAmountInput(e.target.value)}
                      className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Donor info */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Nama Donatur / Atas Nama:</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Nomor WhatsApp (untuk bukti kuitansi):</label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Metode Pembayaran:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'qris'
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>QRIS Instant All-Bank</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'bank'
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Virtual Account Syariah</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold py-3.5 rounded-2xl shadow-lg transition-all text-xs sm:text-sm uppercase tracking-wider"
                >
                  Lanjutkan Pembayaran Rp {effectiveAmount.toLocaleString('id-ID')}
                </button>
              </form>
            )}

            {/* STEP 2: MOCK PAYMENT GATEWAY INTERFACE */}
            {step === 'payment' && (
              <div className="space-y-4">
                {/* Gateway Simulator Top Header */}
                <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-3.5 rounded-2xl border border-emerald-700 shadow-md flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">
                        Mock Payment Gateway Syariah
                      </span>
                    </div>
                    <p className="text-xs font-mono text-emerald-200">
                      ID Transaksi: <span className="text-white font-bold">TRX-ABD-{Date.now().toString().slice(-6)}</span>
                    </p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="text-[10px] text-emerald-300 flex items-center justify-end gap-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                      <span>Sisa Waktu: {Math.floor(timeLeftSeconds / 60)}:{('0' + (timeLeftSeconds % 60)).slice(-2)}</span>
                    </div>
                    <div className="text-base font-extrabold font-mono text-amber-400">
                      Rp {effectiveAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Gateway Channel Selector Tabs */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-emerald-900">Pilih Metode Simulasi Gateway:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentChannel('qris');
                        setSimulatedError(null);
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentChannel === 'qris'
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                          : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <span>QRIS Instant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentChannel('bsi_va');
                        setSimulatedError(null);
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentChannel === 'bsi_va'
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                          : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>VA Bank BSI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentChannel('muamalat_va');
                        setSimulatedError(null);
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentChannel === 'muamalat_va'
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                          : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-amber-400" />
                      <span>VA Muamalat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentChannel('debit_syariah');
                        setSimulatedError(null);
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentChannel === 'debit_syariah'
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                          : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Debit Syariah</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Detail Simulator Card */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                  {/* CHANNEL 1: QRIS */}
                  {paymentChannel === 'qris' && (
                    <div className="space-y-3 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full text-[10px] font-bold">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>QRIS Nasional Terintegrasi All-Bank & E-Wallet</span>
                      </div>

                      <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl shadow-md border-2 border-emerald-300 relative flex flex-col items-center justify-center group">
                        <QrCode className="w-24 h-24 text-emerald-950" />
                        <span className="text-[8px] font-mono font-bold text-emerald-800 mt-1">ID: QRIS-ABDC-99201</span>
                      </div>

                      <p className="text-[11px] text-gray-600 max-w-xs mx-auto">
                        Mendukung: GoPay, OVO, ShopeePay, DANA, BCA Mobile, BSI Mobile, LinkAja, Livin Mandiri.
                      </p>
                    </div>
                  )}

                  {/* CHANNEL 2 & 3: VIRTUAL ACCOUNT BSI / MUAMALAT */}
                  {(paymentChannel === 'bsi_va' || paymentChannel === 'muamalat_va') && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                        <span className="font-bold text-emerald-950">
                          {paymentChannel === 'bsi_va' ? 'Bank Syariah Indonesia (BSI)' : 'Bank Muamalat Indonesia'}
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          Virtual Account
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block">Nomor Virtual Account Simulasi:</span>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-extrabold text-emerald-950 tracking-wider">
                            {paymentChannel === 'bsi_va' ? '99281' : '11002'}
                            {donorPhone ? donorPhone.replace(/\D/g, '').slice(-8) : '81234567'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCopiedVA(true);
                              setTimeout(() => setCopiedVA(false), 2000);
                            }}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                          >
                            {copiedVA ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Salin VA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-600 space-y-1 bg-emerald-100/40 p-2.5 rounded-xl border border-emerald-200">
                        <p className="font-bold text-emerald-950">Cara Pembayaran Mobile Banking:</p>
                        <ol className="list-decimal list-inside space-y-0.5">
                          <li>Buka aplikasi Mobile Banking / Transfer Bank pilihan Anda.</li>
                          <li>Pilih menu <strong>Transfer Virtual Account</strong>.</li>
                          <li>Masukkan Nomor VA di atas lalu konfirmasi nominal Rp {effectiveAmount.toLocaleString('id-ID')}.</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 4: KARTU DEBIT SYARIAH */}
                  {paymentChannel === 'debit_syariah' && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                        <span className="font-bold text-emerald-950">Kartu Debit Syariah (Visa / Mastercard)</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber('4508 9201 8839 1029');
                            setCardExp('12/28');
                            setCardCvv('789');
                          }}
                          className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Isi Data Uji</span>
                        </button>
                      </div>

                      <div className="space-y-2 font-mono">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Nomor Kartu:</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Masa Berlaku:</label>
                            <input
                              type="text"
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-0.5">CVV:</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Error Alert Banner */}
                {simulatedError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-xs text-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{simulatedError}</p>
                      <p className="text-[10px] text-red-600 mt-0.5">
                        Anda dapat mencoba mengklik tombol "Simulasikan Pembayaran Berhasil" untuk melanjutkan uji transaksi.
                      </p>
                    </div>
                  </div>
                )}

                {/* Gateway Simulation Controls */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    disabled={isSimulatingPayment}
                    onClick={() => handleSimulatePayment(true)}
                    className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-70"
                  >
                    {isSimulatingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Memproses Transaksi Syariah (Simulasi Gateway)...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>Simulasikan Pembayaran Berhasil (Rp {effectiveAmount.toLocaleString('id-ID')})</span>
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isSimulatingPayment}
                      onClick={() => setStep('form')}
                      className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-all"
                    >
                      Ubah Data Donasi
                    </button>

                    <button
                      type="button"
                      disabled={isSimulatingPayment}
                      onClick={() => handleSimulatePayment(false)}
                      className="w-1/2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Simulasikan Gagal</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: RECEIPT & CONFIRMATION MESSAGE */}
            {step === 'receipt' && currentReceipt && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-md ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700" />
                </div>

                <div className="space-y-1">
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    VERIFIKASI TRANSAKSI SYARIAH LUNAS
                  </span>
                  <h3 className="font-bold text-emerald-950 text-xl font-serif">Alhamdulillah, Jazakumullah Khairan!</h3>
                  <p className="text-xs text-emerald-800 font-medium">Infaq Anda sebesar <strong className="font-mono text-emerald-950">Rp {currentReceipt.amount.toLocaleString('id-ID')}</strong> telah berhasil diproses.</p>
                </div>

                {/* Simulated Instant Confirmation Message Alert (WhatsApp / SMS) */}
                <div className="bg-emerald-900/95 text-white p-3.5 rounded-2xl border border-amber-400/50 shadow-md text-left text-xs space-y-1.5 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-emerald-800 pb-1">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-amber-300 text-[11px]">Konfirmasi Otomatis WhatsApp/SMS</span>
                    </div>
                    <span className="bg-emerald-800 text-amber-300 text-[9px] font-mono px-2 py-0.2 rounded-full">TERKIRIM 100%</span>
                  </div>
                  <p className="text-[11px] text-emerald-100 leading-snug font-mono">
                    💬 "Assalamu'alaikum wr. wb. Bpk/Ibu <strong className="text-amber-300">{currentReceipt.donorName}</strong>. Terima kasih atas kedermawanan Anda. Infaq program <strong className="text-white">{currentReceipt.title}</strong> sebesar <strong className="text-amber-300">Rp {currentReceipt.amount.toLocaleString('id-ID')}</strong> telah terverifikasi sah. No. Kuitansi: <strong className="text-amber-300">{currentReceipt.receiptNo}</strong>."
                  </p>
                </div>

                {/* Receipt Details Box */}
                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-xs text-left space-y-2 font-mono">
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-gray-500">No. Kuitansi:</span>
                    <span className="font-bold text-emerald-900">{currentReceipt.receiptNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-gray-500">Atas Nama:</span>
                    <span className="font-bold text-emerald-900">{currentReceipt.donorName}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-gray-500">No. WhatsApp:</span>
                    <span className="font-bold text-emerald-900">{currentReceipt.donorPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-gray-500">Program / Akad:</span>
                    <span className="font-bold text-emerald-900 truncate max-w-[200px]">{currentReceipt.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200 pb-1">
                    <span className="text-gray-500">Waktu & Tanggal:</span>
                    <span className="font-bold text-emerald-900">{currentReceipt.date}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-gray-700">Total Infaq:</span>
                    <span className="text-emerald-800">Rp {currentReceipt.amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => exportCertificatePDF(currentReceipt)}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-emerald-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all border border-amber-300 group"
                  >
                    <Award className="w-4 h-4 text-emerald-950 group-hover:scale-110 transition-transform" />
                    <span>Unduh E-Sertifikat Donasi (PDF)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        exportToPDF(currentReceipt);
                        setActiveTab('history');
                        setStep('form');
                      }}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Unduh Kuitansi PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('history');
                        setStep('form');
                      }}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold py-2.5 rounded-xl text-xs border border-emerald-200 transition-all"
                    >
                      Lihat Riwayat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Total Donation Stats */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-4 rounded-2xl shadow-md flex justify-between items-center">
              <div>
                <span className="text-[11px] text-emerald-200 block uppercase font-medium">Total Infaq & Zakat Anda</span>
                <span className="text-xl font-bold font-mono text-amber-300">
                  Rp {totalDonationAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs bg-emerald-800/80 px-2.5 py-1 rounded-full text-emerald-100 font-bold border border-emerald-700">
                  {transactions.length} Transaksi
                </span>
              </div>
            </div>

            {/* Export Report Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-600" />
                <span>Unduh Laporan Riwayat:</span>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={exportToCSV}
                  className="flex-1 sm:flex-none bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs text-[11px]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Unduh CSV</span>
                </button>

                <button
                  onClick={() => exportToPDF()}
                  className="flex-1 sm:flex-none bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs text-[11px]"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            </div>

            {/* Recharts Data Visualization Card */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs text-emerald-950 font-serif">Grafik Riwayat Infaq & Sedekah</h4>
                </div>

                <div className="flex items-center gap-1 bg-emerald-50 p-1 rounded-xl border border-emerald-200">
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      chartType === 'area'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    <LineChart className="w-3 h-3 text-amber-300" />
                    <span>Kumulatif</span>
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      chartType === 'bar'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    <BarChart3 className="w-3 h-3 text-amber-300" />
                    <span>Per Period</span>
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              {chartData.length > 0 ? (
                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="infaqAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-emerald-950 text-white p-2.5 rounded-xl shadow-xl border border-amber-400/40 text-[11px] space-y-0.5">
                                  <p className="font-bold text-amber-300 font-serif border-b border-emerald-800 pb-1">{label}</p>
                                  <p className="font-mono text-emerald-200">
                                    Total Kumulatif: <strong className="text-white">Rp {Number(payload[0].value).toLocaleString('id-ID')}</strong>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="cumulativeAmount" stroke="#047857" strokeWidth={2.5} fillOpacity={1} fill="url(#infaqAreaGrad)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-emerald-950 text-white p-2.5 rounded-xl shadow-xl border border-amber-400/40 text-[11px] space-y-0.5">
                                  <p className="font-bold text-amber-300 font-serif border-b border-emerald-800 pb-1">{label}</p>
                                  <p className="font-mono text-emerald-200">
                                    Nominal Period: <strong className="text-white">Rp {Number(payload[0].value).toLocaleString('id-ID')}</strong>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-28 flex items-center justify-center text-xs text-gray-400 italic">
                  Belum ada data grafik riwayat infaq.
                </div>
              )}
            </div>

            {/* Search filter inside history */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari program, no kuitansi, atau nama..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* History List */}
            <div className="space-y-2.5">
              {filteredHistory.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all flex justify-between items-start gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {tx.receiptNo}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {tx.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-emerald-950 text-xs truncate leading-snug">
                      {tx.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {tx.date}
                      </span>
                      <span>•</span>
                      <span>An. {tx.donorName}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-xs font-bold font-mono text-emerald-900">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => exportCertificatePDF(tx)}
                        title="Unduh E-Sertifikat Donasi"
                        className="text-[10px] text-emerald-950 font-bold bg-amber-400 hover:bg-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-2xs transition-all"
                      >
                        <Award className="w-3 h-3 text-emerald-950" />
                        <span>Sertifikat</span>
                      </button>
                      <button
                        onClick={() => setSelectedTxDetail(tx)}
                        className="text-[10px] text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1 transition-all"
                      >
                        <FileText className="w-3 h-3" /> Kuitansi
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs space-y-2 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200">
                  <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p>Belum ada riwayat transaksi infaq/zakat.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DETAIL RECEIPT MODAL OVERLAY */}
        {selectedTxDetail && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl border border-emerald-200 shadow-2xl p-5 relative space-y-4">
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 border-b border-emerald-100 pb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-emerald-950 font-serif text-base">Kuitansi Bukti Infaq Sah</h3>
                <p className="text-[11px] text-gray-500">ABDICity Kaffah Governance Platform</p>
              </div>

              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-gray-500">No. Kuitansi:</span>
                  <span className="font-bold text-emerald-900">{selectedTxDetail.receiptNo}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-gray-500">Donatur:</span>
                  <span className="font-bold text-emerald-900">{selectedTxDetail.donorName}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-gray-500">Program:</span>
                  <span className="font-bold text-emerald-900 text-right max-w-[200px] truncate">{selectedTxDetail.title}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-gray-500">Waktu Transaksi:</span>
                  <span className="font-bold text-emerald-900">{selectedTxDetail.date}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="text-gray-500">Metode:</span>
                  <span className="font-bold text-emerald-900 uppercase">{selectedTxDetail.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-gray-700">Nominal:</span>
                  <span className="text-emerald-800">Rp {selectedTxDetail.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => exportCertificatePDF(selectedTxDetail)}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-emerald-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all border border-amber-300 group"
                >
                  <Award className="w-4 h-4 text-emerald-950 group-hover:scale-110 transition-transform" />
                  <span>Unduh E-Sertifikat Donasi (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    exportToPDF(selectedTxDetail);
                    setSelectedTxDetail(null);
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Cetak / Unduh Kuitansi PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

