import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Scan,
  Barcode,
  FileText,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Upload,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  History,
  Trash2,
  X,
  Check,
  BookOpen,
  ShoppingBag,
  Info,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { HalalCameraScanResult } from '../types';

export type ScanMode = 'barcode' | 'ingredients';

interface SamplePreset {
  id: string;
  mode: ScanMode;
  name: string;
  brand: string;
  barcode: string;
  category: string;
  status: 'HALAL' | 'SYUBHAT' | 'NON_HALAL';
  statusLabel: string;
  confidenceScore: number;
  halalCertNumber?: string;
  image: string;
  ingredientsText: string;
  detectedIngredients: string[];
  criticalHalalPoints: {
    ingredient: string;
    reason: string;
    status: 'aman' | 'kritis' | 'haram';
  }[];
  syariahVerdict: string;
  recommendation: string;
  fiqihReference: string;
}

const PRESET_SAMPLES: SamplePreset[] = [
  {
    id: 'sample-1',
    mode: 'barcode',
    name: 'Indomie Mi Goreng Spesial 85g',
    brand: 'PT Indofood CBP Sukses Makmur Tbk',
    barcode: '8998866200277',
    category: 'Makanan Instan',
    status: 'HALAL',
    statusLabel: 'Terverifikasi Halal Resmi BPJPH & MUI',
    confidenceScore: 99,
    halalCertNumber: 'ID00410000021310121',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80',
    ingredientsText: 'Tepung terigu, minyak kelapa sawit, garam, bubuk bawang putih, pengatur keasaman, perisa identik alami ayam (halal), kecap manis, saus cabai.',
    detectedIngredients: ['Tepung Terigu', 'Minyak Sawit', 'Kecap Manis', 'Bumbu Bawang', 'Perisa Gurih Halal'],
    criticalHalalPoints: [
      {
        ingredient: 'Minyak Kelapa Sawit',
        reason: '100% Lemak nabati alami tanpa campuran minyak hewani tidak halal.',
        status: 'aman'
      },
      {
        ingredient: 'Perisa Sintetik Ayam',
        reason: 'Telah diaudit LPPOM MUI dan bersumber dari prekursor mikrobial halal tanpa alkohol/etanol melampaui batas fatwa.',
        status: 'aman'
      }
    ],
    syariahVerdict: 'Produk telah mengantongi Sertifikat Halal resmi BPJPH Kemenag RI dan ketetapan halal MUI. Seluruh bahan dan proses pengolahan memenuhi Standar Jaminan Produk Halal (SJPH).',
    recommendation: 'Aman dan thayyib untuk dikonsumsi oleh seluruh keluarga Muslim.',
    fiqihReference: 'QS. Al-Baqarah: 168 - "Wahai manusia! Makanlah dari (makanan) yang halal dan baik (thayyib) yang terdapat di bumi."'
  },
  {
    id: 'sample-2',
    mode: 'ingredients',
    name: 'Marshmallow Fluffy Vanilla Dream',
    brand: 'Confiserie Sweets Import',
    barcode: '7613035981245',
    category: 'Permen & Kembang Gula',
    status: 'SYUBHAT',
    statusLabel: 'Perlu Verifikasi (Status Syubhat)',
    confidenceScore: 94,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=600&q=80',
    ingredientsText: 'Sugar, glucose syrup, water, gelatin (animal origin), artificial vanilla flavor, corn starch, coloring agent E102.',
    detectedIngredients: ['Gula Pasir', 'Sirup Glukosa', 'Gelatin (Animal Origin)', 'Perisa Vanila', 'Pewarna E102'],
    criticalHalalPoints: [
      {
        ingredient: 'Gelatin (Animal Origin)',
        reason: 'Kemasan mencantumkan gelatin hewani tanpa mencantumkan spesies hewani (sapi vs babi) dan tidak disertai sertifikasi halal yang diakui BPJPH.',
        status: 'kritis'
      },
      {
        ingredient: 'Perisa Vanila Sintetik',
        reason: 'Perisa vanila komersial impor sering menggunakan pelarut ekstrak berbasis etanol.',
        status: 'kritis'
      }
    ],
    syariahVerdict: 'Produk ini mengandung gelatin hewani yang sumber dan tata cara penyembelihannya belum terverifikasi halal oleh BPJPH atau badan halal yang memiliki MRA dengan Indonesia. Terdapat syubhat yang kuat.',
    recommendation: 'Dianjurkan untuk menahan diri (wara\') dari mengonsumsi produk ini sampai ada kepastian kehalalan dari produsen atau pilih marshmallow lokal berlogo Halal Indonesia.',
    fiqihReference: 'Hadits Nu\'man bin Basyir RA (HR. Bukhari no. 52 & Muslim no. 1599) - "Sesungguhnya yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya ada perkara-perkara syubhat yang tidak diketahui oleh kebanyakan manusia. Barangsiapa menjauhi perkara syubhat, ia telah menyelamatkan agama dan kehormatannya."'
  },
  {
    id: 'sample-3',
    mode: 'ingredients',
    name: 'Snack Keripik Kentang Sour Cream & Onion',
    brand: 'Crispy Snack Gourmet',
    barcode: '8801043019882',
    category: 'Makanan Ringan',
    status: 'SYUBHAT',
    statusLabel: 'Perlu Verifikasi (Status Syubhat)',
    confidenceScore: 91,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    ingredientsText: 'Potato flakes, vegetable oil, seasoning (whey powder, milk solids, onion powder, flavor enhancer E621, emulsifier E471 [mono & diglycerides of fatty acids]).',
    detectedIngredients: ['Kentang', 'Minyak Nabati', 'Whey Bubuk', 'Pengemulsi E471', 'Bumbu Sour Cream'],
    criticalHalalPoints: [
      {
        ingredient: 'Pengemulsi E471 (Mono & Diglycerides)',
        reason: 'E471 dapat diekstraksi dari lemak nabati (sawit/kedelai) ATAU lemak hewani (babi/sapi). Tidak tercantum keterangan "vegetable origin" atau logo halal.',
        status: 'kritis'
      },
      {
        ingredient: 'Whey Powder (Serum Susu)',
        reason: 'Hasil samping produksi keju yang memerlukan enzim rennet atau pepsin. Perlu dipastikan bukan dari babi atau sapi tanpa sembelih syar\'i.',
        status: 'kritis'
      }
    ],
    syariahVerdict: 'Bahan aditif E471 dan Whey berisiko tinggi (titik kritis). Selama produsen belum menyertakan logo sertifikat Halal, produk berstatus Syubhat bagi konsumen Muslim.',
    recommendation: 'Cek nomor BPOM RI ML pada kemasan belakang atau periksa barcode pada pangkalan data Halal Kemenag RI.',
    fiqihReference: 'Kaidah Fiqhiyyah - "Al-Ashlu fil-Asy-ya\'i al-Ibahah hatta yadulla ad-dalilu \'ala at-tahrim" dan hadits "Da\' ma yaribuka ila ma la yaribuka" (Tinggalkan apa yang meragukanmu kepada apa yang tidak meragukanmu).'
  },
  {
    id: 'sample-4',
    mode: 'barcode',
    name: 'Sari Kurma Ajwa & Habbatussauda Barokah',
    brand: 'Herbal Nabawi Indonesia',
    barcode: '8993417281902',
    category: 'Herbal & Suplemen',
    status: 'HALAL',
    statusLabel: 'Terverifikasi Halal Resmi BPJPH & MUI',
    confidenceScore: 98,
    halalCertNumber: 'ID31110003421008',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    ingredientsText: 'Ekstrak kurma Ajwa murni, madu hutan, minyak habbatussauda dingin, propolis lebah, air demineralisasi.',
    detectedIngredients: ['Kurma Ajwa', 'Madu Hutan', 'Habbatussauda', 'Propolis', 'Air Murni'],
    criticalHalalPoints: [
      {
        ingredient: 'Ekstrak Nabati & Madu',
        reason: '100% Bahan alamiah thayyib tanpa bahan kimia sintetik atau fermentasi beralkohol.',
        status: 'aman'
      }
    ],
    syariahVerdict: 'Produk herbal thibbun nabawi yang telah terdaftar resmi di BPJPH dan bersertifikat Halal MUI. Aman, berkhasiat, dan berkah.',
    recommendation: 'Sangat direkomendasikan untuk konsumsi harian keluarga Muslim.',
    fiqihReference: 'QS. An-Nahl: 69 - "Dari perut lebah itu keluar minuman (madu) yang bermacam-macam warnanya, di dalamnya terdapat obat yang menyembuhkan bagi manusia."'
  },
  {
    id: 'sample-5',
    mode: 'ingredients',
    name: 'Ramen Instan Tokyo Shoyu Chashu',
    brand: 'Nippon Ramen Craft',
    barcode: '4902105001234',
    category: 'Makanan Impor',
    status: 'NON_HALAL',
    statusLabel: 'Non-Halal (Mengandung Bahan Diharamkan)',
    confidenceScore: 99,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    ingredientsText: 'Noodles, soy sauce, pork extract (tonkotsu), pork fat (lard), mirin, sake alcohol, salt, monosodium glutamate.',
    detectedIngredients: ['Tepung Terigu', 'Ekstrak Babi (Pork Extract)', 'Minyak Babi (Lard)', 'Mirin / Sake', 'Kecap Asin'],
    criticalHalalPoints: [
      {
        ingredient: 'Ekstrak Babi (Pork Extract) & Lemak Babi (Lard)',
        reason: 'Mengandung unsur babi (khinzir) yang tegas diharamkan dalam syariat Islam.',
        status: 'haram'
      },
      {
        ingredient: 'Mirin & Sake Alcohol',
        reason: 'Khamr masak fermentasi beralkohol yang memabukkan dan najis menurut jumhur ulama.',
        status: 'haram'
      }
    ],
    syariahVerdict: 'Produk ini secara eksplisit mencantumkan bahan-bahan yang diharamkan syariat Islam (pork, lard, mirin). Diharamkan secara mutlak untuk dikonsumsi atau diperjualbelikan antar sesama Muslim.',
    recommendation: 'JANGAN dikonsumsi. Pilih produk ramen yang telah memiliki sertifikat Halal resmi BPJPH / MUI.',
    fiqihReference: 'QS. Al-Maidah: 3 - "Diharamkan bagimu (memakan) bangkai, darah, daging babi, dan daging hewan yang disembelih bukan atas nama Allah..."'
  }
];

interface HalalVisionScannerProps {
  onSelectMarketplaceProduct?: (query: string) => void;
}

export const HalalVisionScanner: React.FC<HalalVisionScannerProps> = ({
  onSelectMarketplaceProduct
}) => {
  // Scanner Mode: Barcode vs Ingredients OCR
  const [scanMode, setScanMode] = useState<ScanMode>('barcode');

  // Camera & Stream states
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Capture Animation & Simulation states
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [showShutterFlash, setShowShutterFlash] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);

  // Selected or Captured image
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<SamplePreset | null>(null);

  // Result state
  const [currentResult, setCurrentResult] = useState<HalalCameraScanResult | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // History state
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<HalalCameraScanResult[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_halal_vision_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_halal_vision_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.error(e);
    }
  }, [scanHistory]);

  // Audio synthesizer chime helper
  const playAudioCue = (type: 'shutter' | 'halal' | 'syubhat' | 'non-halal') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'shutter') {
        // Crisp mechanical shutter click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'halal') {
        // High melodious major chord (C5 - E5 - G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'syubhat') {
        // Warning alert note (F4 - G#4)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(349.23, now);
        osc.frequency.setValueAtTime(415.3, now + 0.14);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Low discordant warning
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(207.65, now + 0.15);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  // Start real webcam stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Kamera tidak didukung oleh browser Anda. Anda dapat menggunakan mode simulasi atau unggah foto.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsLiveCameraActive(true);
      }

      // Check torch
      const track = stream.getVideoTracks()[0];
      if (track && track.getCapabilities) {
        const caps = track.getCapabilities() as any;
        setHasTorch(Boolean(caps?.torch));
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsLiveCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Izin akses kamera belum diberikan. Mode simulasi kamera aktif otomatis.');
      } else {
        setCameraError('Kamera fisik tidak terdeteksi. Mode simulasi kamera siap digunakan.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
    setIsTorchOn(false);
  };

  // Switch front/back camera
  const switchCamera = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle flash torch
  const toggleTorch = async () => {
    if (!streamRef.current || !hasTorch) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const newState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: newState }]
        });
        setIsTorchOn(newState);
      } catch (err) {
        console.warn('Torch error:', err);
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraFacing]);

  // Execute Simulated or Real Capture Flow
  const triggerCaptureAndScan = (customPreset?: SamplePreset) => {
    const selectedPreset = customPreset || (
      scanMode === 'barcode' ? PRESET_SAMPLES[0] : PRESET_SAMPLES[1]
    );

    setActivePreset(selectedPreset);
    setIsCapturing(true);
    setShowShutterFlash(true);
    playAudioCue('shutter');

    // Shutter flash animation duration
    setTimeout(() => {
      setShowShutterFlash(false);
    }, 180);

    // Freeze camera frame or prepare captured thumbnail
    let thumbnail = selectedPreset.image;
    if (videoRef.current && isLiveCameraActive) {
      try {
        const v = videoRef.current;
        const c = document.createElement('canvas');
        c.width = v.videoWidth || 640;
        c.height = v.videoHeight || 480;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(v, 0, 0, c.width, c.height);
          thumbnail = c.toDataURL('image/jpeg', 0.85);
        }
      } catch (e) {
        console.warn('Canvas capture fallback to preset image', e);
      }
    }
    setCapturedImage(thumbnail);

    // Enter AI analysis phase
    setIsAnalyzing(true);
    setScanStepIndex(1);

    setTimeout(() => {
      setScanStepIndex(2);
    }, 900);

    setTimeout(() => {
      setScanStepIndex(3);
    }, 1800);

    setTimeout(() => {
      // Finalize Result
      const formattedResult: HalalCameraScanResult = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productName: selectedPreset.name,
        brand: selectedPreset.brand,
        category: selectedPreset.category,
        halalStatus: selectedPreset.status,
        halalStatusLabel: selectedPreset.statusLabel,
        confidenceScore: selectedPreset.confidenceScore,
        halalLogoDetected: selectedPreset.status === 'HALAL',
        halalLogoDetails: selectedPreset.status === 'HALAL'
          ? 'Terdeteksi Logo Halal Indonesia (BPJPH / MUI Resmi)'
          : 'Logo Halal Resmi Tidak Ditemukan pada Kemasan',
        halalCertNumber: selectedPreset.halalCertNumber || null,
        detectedIngredients: selectedPreset.detectedIngredients,
        criticalHalalPoints: selectedPreset.criticalHalalPoints,
        syariahVerdict: selectedPreset.syariahVerdict,
        recommendation: selectedPreset.recommendation,
        fiqihReference: selectedPreset.fiqihReference,
        imageThumbnail: thumbnail,
        scannedAt: new Date().toISOString()
      };

      setCurrentResult(formattedResult);
      setIsAnalyzing(false);
      setIsCapturing(false);

      // Play verdict audio cue
      if (formattedResult.halalStatus === 'HALAL') {
        playAudioCue('halal');
      } else if (formattedResult.halalStatus === 'SYUBHAT') {
        playAudioCue('syubhat');
      } else {
        playAudioCue('non-halal');
      }

      // Add to history
      setScanHistory((prev) => [formattedResult, ...prev.slice(0, 19)]);
    }, 2600);
  };

  // Reset scan to start fresh
  const handleResetScan = () => {
    setCapturedImage(null);
    setCurrentResult(null);
    setIsAnalyzing(false);
    setIsCapturing(false);
    setScanStepIndex(0);
    setActivePreset(null);
  };

  // File Upload flow
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCapturedImage(base64);
      // Pick appropriate sample based on mode
      const chosenSample = scanMode === 'barcode' ? PRESET_SAMPLES[0] : PRESET_SAMPLES[1];
      triggerCaptureAndScan(chosenSample);
    };
    reader.readAsDataURL(file);
  };

  // Share result text
  const handleShareResult = async () => {
    if (!currentResult) return;
    const shareText = `🔍 Hasil Halal Vision Scanner ABDICity:
📦 Produk: ${currentResult.productName} (${currentResult.brand})
🏷️ Status: ${currentResult.halalStatus === 'HALAL' ? '✅ HALAL' : currentResult.halalStatus === 'SYUBHAT' ? '⚠️ SYUBHAT' : '❌ NON-HALAL'}
🛡️ Sertifikasi: ${currentResult.halalCertNumber ? `No. ${currentResult.halalCertNumber}` : 'Belum Tersertifikasi'}
💡 Saran Syariah: ${currentResult.recommendation}
📖 Dalil: ${currentResult.fiqihReference}

Dipindai via ABDICity.cloud - Pilar Bermuamalah Kaffah`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Status Halal: ${currentResult.productName}`,
          text: shareText
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    }
  };

  return (
    <div className="space-y-6">
      {/* HERO BANNER - HALAL VISION SCANNER BRAND */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 text-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-emerald-950" /> Gemini Vision AI
              </span>
              <span className="bg-emerald-800/90 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600">
                Pilar Bermuamalah
              </span>
              <span className="bg-teal-900/80 text-teal-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-teal-700">
                Standar BPJPH & MUI
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
              <Camera className="w-7 h-7 text-amber-400" />
              <span>Halal Vision Scanner</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Simulasi pemindai kamera cerdas untuk memindai <strong>Barcode Produk</strong> atau <strong>Teks Komposisi (Ingredients)</strong> secara real-time. Menentukan status <strong>Halal Resmi</strong> vs <strong>Syubhat</strong> lengkap dengan audit titik kritis bahan.
            </p>
          </div>

          {/* Quick Sound, History & Reset Actions */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara Chime' : 'Nyalakan Suara Chime'}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                soundEnabled
                  ? 'bg-emerald-800/90 border-emerald-600 text-amber-300'
                  : 'bg-emerald-950 border-emerald-800 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Suara Aktif' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-emerald-800/90 hover:bg-emerald-700 text-white border border-emerald-600 px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Riwayat ({scanHistory.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* DUAL MODE SELECTOR: BARCODE vs INGREDIENTS OCR */}
      <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-emerald-50/70 p-1.5 rounded-xl border border-emerald-200">
          <button
            onClick={() => {
              setScanMode('barcode');
              if (currentResult) handleResetScan();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              scanMode === 'barcode'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-950 hover:bg-emerald-100'
            }`}
          >
            <Barcode className="w-4 h-4 text-amber-400" />
            <span>1. Pindai Barcode Produk</span>
          </button>

          <button
            onClick={() => {
              setScanMode('ingredients');
              if (currentResult) handleResetScan();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              scanMode === 'ingredients'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-950 hover:bg-emerald-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>2. Pindai Komposisi (Ingredients OCR)</span>
          </button>
        </div>

        {/* Quick info chip */}
        <div className="text-xs text-gray-500 flex items-center gap-1.5 px-2">
          <Info className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>
            {scanMode === 'barcode'
              ? 'Targetkan kode batang EAN/UPC pada kemasan'
              : 'Targetkan tabel komposisi bahan & aditif pangan'}
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: VIEWFINDER (LEFT) & VERDICT RESULTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SIMULATED / LIVE CAMERA VIEWFINDER HUD */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gray-950 rounded-3xl overflow-hidden border-2 border-emerald-600 shadow-2xl relative">
            {/* Camera Viewport */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden select-none">
              {/* Shutter Flash Effect Overlay */}
              {showShutterFlash && (
                <div className="absolute inset-0 bg-white z-50 animate-fade-out pointer-events-none transition-opacity duration-150" />
              )}

              {/* Real WebCam Video Feed */}
              {isLiveCameraActive && !capturedImage && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Simulated Camera Feed Fallback / Sample Preview when webcam is inactive or captured */}
              {(!isLiveCameraActive || capturedImage) && (
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      capturedImage ||
                      (scanMode === 'barcode'
                        ? 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80')
                    }
                    alt="Camera feed preview"
                    className="w-full h-full object-cover opacity-85 transition-opacity"
                  />
                  {/* Subtle camera noise/vignette effect */}
                  <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
                </div>
              )}

              {/* LIVE VIEWFINDER HUD OVERLAY */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-5 z-20">
                {/* Top Status Bar */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="bg-black/75 backdrop-blur-md text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    {isLiveCameraActive ? 'LIVE CAMERA' : 'SIMULATED VIEWFINDER'}
                  </span>
                  <span className="bg-black/75 backdrop-blur-md text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40 font-bold shadow-md">
                    MODE: {scanMode === 'barcode' ? 'BARCODE OPTICAL' : 'INGREDIENTS OCR'}
                  </span>
                </div>

                {/* Central Optical Scan Target Overlay */}
                <div className="relative mx-auto w-4/5 max-w-xs aspect-square sm:aspect-[4/3] flex items-center justify-center">
                  {scanMode === 'barcode' ? (
                    // Barcode Reticle
                    <div className="w-full h-44 sm:h-48 border-2 border-dashed border-amber-400/70 rounded-2xl relative bg-black/15 backdrop-blur-xs flex items-center justify-center">
                      {/* Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                      {/* Optical Barcode Graphic Guide */}
                      <div className="w-3/4 opacity-40 flex justify-between items-center h-16 pointer-events-none">
                        <div className="w-1 bg-white h-full" />
                        <div className="w-2 bg-white h-full" />
                        <div className="w-0.5 bg-white h-full" />
                        <div className="w-3 bg-white h-full" />
                        <div className="w-1 bg-white h-full" />
                        <div className="w-2 bg-white h-full" />
                        <div className="w-0.5 bg-white h-full" />
                        <div className="w-2 bg-white h-full" />
                        <div className="w-1.5 bg-white h-full" />
                        <div className="w-3 bg-white h-full" />
                        <div className="w-1 bg-white h-full" />
                      </div>

                      {/* Animated Red/Amber Laser Scanning Line */}
                      <div
                        className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-pulse"
                        style={{ top: '50%' }}
                      />
                    </div>
                  ) : (
                    // Ingredients Document OCR Reticle
                    <div className="w-full h-52 sm:h-56 border-2 border-teal-400/80 rounded-2xl relative bg-emerald-950/20 backdrop-blur-xs flex flex-col justify-between p-4">
                      {/* Document corner brackets */}
                      <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-teal-300 rounded-tl-xl" />
                      <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-teal-300 rounded-tr-xl" />
                      <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-teal-300 rounded-bl-xl" />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-teal-300 rounded-br-xl" />

                      {/* Simulated OCR Text Highlight Boxes */}
                      <div className="space-y-2 pointer-events-none">
                        <div className="h-2.5 bg-teal-400/30 rounded w-5/6 animate-pulse" />
                        <div className="h-2.5 bg-teal-400/40 rounded w-full animate-pulse" />
                        <div className="h-2.5 bg-amber-400/40 rounded w-4/6 animate-pulse" />
                        <div className="h-2.5 bg-teal-400/30 rounded w-3/4 animate-pulse" />
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] font-mono text-teal-200 bg-black/60 px-2 py-0.5 rounded">
                          OCR SCANNING REGION
                        </span>
                      </div>

                      {/* Animated Scanning Grid */}
                      <div
                        className="absolute inset-x-2 h-0.5 bg-teal-300 shadow-[0_0_10px_#5eead4] animate-bounce"
                        style={{ top: '45%' }}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Guide Prompt */}
                <div className="text-center">
                  <span className="bg-black/75 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                    {scanMode === 'barcode'
                      ? 'Sejajarkan garis laser merah dengan Barcode'
                      : 'Posisikan tabel komposisi bahan di dalam kotak panduan'}
                  </span>
                </div>
              </div>

              {/* In-Flight Scanning Loader Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs z-40 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl animate-spin">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-base font-serif text-amber-300">
                      Memproses Citra Kamera...
                    </h4>
                    <p className="text-xs text-emerald-100 font-mono">
                      {scanStepIndex === 1 && '1/3 Mengekstraksi kode batang & teks komposisi...'}
                      {scanStepIndex === 2 && '2/3 Menghubungkan ke BPJPH & LPPOM Halal Database...'}
                      {scanStepIndex >= 3 && '3/3 Audit Titik Kritis: Menentukan Halal vs Syubhat...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Shutter & Viewfinder Controls Footer */}
            <div className="bg-emerald-950 p-4 border-t border-emerald-800 flex items-center justify-between gap-3">
              {/* Switch Camera */}
              <button
                type="button"
                onClick={switchCamera}
                disabled={isAnalyzing}
                className="p-3 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 transition-all border border-emerald-700 flex flex-col items-center gap-1 disabled:opacity-40"
                title="Ganti Kamera Depan/Belakang"
              >
                <RefreshCw className="w-5 h-5 text-amber-300" />
                <span className="text-[10px] font-bold">Putar</span>
              </button>

              {/* Main Simulated / Real Shutter Button */}
              <button
                type="button"
                onClick={() => triggerCaptureAndScan()}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-95 disabled:opacity-40 text-emerald-950 p-3.5 sm:px-6 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-amber-200"
              >
                <Camera className="w-5 h-5 fill-emerald-950" />
                <span>Ambil Foto & Pindai {scanMode === 'barcode' ? 'Barcode' : 'Komposisi'}</span>
              </button>

              {/* Flashlight / Torch toggle */}
              <button
                type="button"
                onClick={toggleTorch}
                disabled={isAnalyzing || !hasTorch}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                  isTorchOn
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700 disabled:opacity-30'
                }`}
                title={hasTorch ? 'Lampu Flash' : 'Flash tidak tersedia'}
              >
                <Zap className={`w-5 h-5 ${isTorchOn ? 'fill-emerald-950 text-emerald-950' : 'text-amber-300'}`} />
                <span className="text-[10px] font-bold">{isTorchOn ? 'Flash On' : 'Flash'}</span>
              </button>

              {/* Manual Upload Option */}
              <label
                className="p-3 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 transition-all border border-emerald-700 flex flex-col items-center gap-1 cursor-pointer"
                title="Unggah Foto dari Galeri"
              >
                <Upload className="w-5 h-5 text-amber-300" />
                <span className="text-[10px] font-bold">Galeri</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* QUICK PRESET TEST PRODUCTS - Allows one-click testing of Halal vs Syubhat */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
              <div>
                <h4 className="font-bold text-emerald-950 text-sm font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Uji Coba Cepat Sampel Produk (1-Klik Simulasi)</span>
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Pilih produk berikut untuk mensimulasikan alur kamera dan membandingkan status Halal vs Syubhat:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_SAMPLES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setScanMode(preset.mode);
                    triggerCaptureAndScan(preset);
                  }}
                  disabled={isAnalyzing}
                  className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                    activePreset?.id === preset.id
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-400/40'
                      : 'bg-gray-50/70 hover:bg-emerald-50/50 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1 overflow-hidden flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          preset.status === 'HALAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : preset.status === 'SYUBHAT'
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'bg-rose-100 text-rose-800 font-bold'
                        }`}
                      >
                        {preset.status}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {preset.mode === 'barcode' ? 'Barcode' : 'OCR'}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-gray-900 truncate">{preset.name}</h5>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{preset.brand}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLASSIFICATION RESULT CARD (HALAL vs SYUBHAT) */}
        <div className="lg:col-span-6 space-y-4">
          {/* EMPTY / READY STATE (when no scan executed yet) */}
          {!currentResult && !isAnalyzing && (
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-8 text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-50 rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                <ShieldCheck className="w-10 h-10 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-bold text-emerald-950 font-serif text-xl">
                  Siap Memindai Produk
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Tekan tombol <strong>Ambil Foto & Pindai</strong> pada jendela bidik kamera di sebelah kiri, atau pilih salah satu <strong>Uji Coba Cepat</strong> untuk melihat klasifikasi Halal atau Syubhat secara instan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-center gap-1 text-emerald-800 font-extrabold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Status HALAL</span>
                  </div>
                  <span className="text-gray-600 text-[11px] block">
                    Sertifikat resmi BPJPH / MUI & bahan nabati thayyib
                  </span>
                </div>

                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                  <div className="flex items-center justify-center gap-1 text-amber-800 font-extrabold text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Status SYUBHAT</span>
                  </div>
                  <span className="text-gray-600 text-[11px] block">
                    Titik kritis bahan (gelatin hewani, E471, perisa alkohol)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE SCAN VERDICT CARD */}
          {currentResult && (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden space-y-5 p-6">
              {/* PRIMARY STATUS BANNER */}
              <div
                className={`p-5 rounded-2xl border-2 text-white shadow-md flex items-start justify-between gap-4 ${
                  currentResult.halalStatus === 'HALAL'
                    ? 'bg-gradient-to-r from-emerald-900 to-teal-950 border-emerald-500'
                    : currentResult.halalStatus === 'SYUBHAT'
                    ? 'bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-900 border-amber-500'
                    : 'bg-gradient-to-r from-rose-950 to-red-900 border-rose-500'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {currentResult.halalStatus === 'HALAL' && (
                      <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Halal Resmi
                      </span>
                    )}
                    {currentResult.halalStatus === 'SYUBHAT' && (
                      <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3.5 h-3.5" /> Titik Kritis Syubhat
                      </span>
                    )}
                    {currentResult.halalStatus === 'NON_HALAL' && (
                      <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <XCircle className="w-3.5 h-3.5" /> Peringatan Non-Halal
                      </span>
                    )}

                    <span className="text-[10px] text-gray-300 font-mono">
                      Akurasi AI {currentResult.confidenceScore}%
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
                    {currentResult.halalStatusLabel}
                  </h3>

                  <p className="text-xs text-gray-200 leading-relaxed pt-0.5">
                    {currentResult.recommendation}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {currentResult.halalStatus === 'HALAL' && (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-400 flex items-center justify-center text-amber-300 shadow-lg">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                  )}
                  {currentResult.halalStatus === 'SYUBHAT' && (
                    <div className="w-14 h-14 rounded-2xl bg-amber-900/80 border border-amber-400 flex items-center justify-center text-amber-300 shadow-lg">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  )}
                  {currentResult.halalStatus === 'NON_HALAL' && (
                    <div className="w-14 h-14 rounded-2xl bg-rose-900/80 border border-rose-400 flex items-center justify-center text-rose-200 shadow-lg">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* PRODUCT IDENTITY & CERTIFICATION DETAILS */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-gray-500 font-medium">Nama Produk:</span>
                  <span className="font-bold text-emerald-950 font-serif text-sm">
                    {currentResult.productName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-gray-500 font-medium">Merk / Produsen:</span>
                  <span className="font-bold text-emerald-900">{currentResult.brand}</span>
                </div>

                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-gray-500 font-medium">Kategori:</span>
                  <span className="text-gray-800 font-medium">{currentResult.category}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-500 font-medium">Logo Halal Resmi:</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    {currentResult.halalLogoDetected ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terdaftar BPJPH Kemenag RI
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Belum Ditemukan Logo Halal Resmi
                      </span>
                    )}
                  </div>
                </div>

                {currentResult.halalCertNumber && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-500 font-medium">Nomor Ketetapan Halal:</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                      {currentResult.halalCertNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* CRITICAL HALAL POINTS (TITIK KRITIS BAHAN) */}
              {currentResult.criticalHalalPoints && currentResult.criticalHalalPoints.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-serif flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Audit Titik Kritis Bahan Baku (Halal Critical Control Points)</span>
                  </h4>

                  <div className="space-y-2">
                    {currentResult.criticalHalalPoints.map((pt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                          pt.status === 'haram'
                            ? 'bg-rose-50 border-rose-200 text-rose-950'
                            : pt.status === 'kritis'
                            ? 'bg-amber-50 border-amber-200 text-amber-950'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="mt-0.5">
                          {pt.status === 'haram' && <XCircle className="w-4 h-4 text-rose-600" />}
                          {pt.status === 'kritis' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {pt.status === 'aman' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <strong className="font-bold text-xs">{pt.ingredient}</strong>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                pt.status === 'haram'
                                  ? 'bg-rose-200 text-rose-900'
                                  : pt.status === 'kritis'
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-emerald-200 text-emerald-900'
                              }`}
                            >
                              {pt.status}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-gray-700">{pt.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FIQIH DALIL & FATWA SYARIAH */}
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-serif flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Kaidah Syariah & Rujukan Dalil</span>
                </h4>
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <p className="text-gray-800 leading-relaxed text-[11px] italic">
                    {currentResult.fiqihReference}
                  </p>
                  <p className="text-gray-600 text-[11px] pt-1">
                    {currentResult.syariahVerdict}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row items-center gap-3">
                {onSelectMarketplaceProduct && (
                  <button
                    onClick={() => onSelectMarketplaceProduct(currentResult.category || currentResult.productName)}
                    className="w-full sm:flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Cari Alternatif di Marketplace UMKM</span>
                  </button>
                )}

                <button
                  onClick={handleShareResult}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedShare ? 'Tersalin!' : 'Bagikan'}</span>
                </button>

                <button
                  onClick={handleResetScan}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-3 rounded-xl transition-all"
                >
                  Pindai Produk Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SCAN HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-emerald-200 shadow-2xl p-6 relative overflow-hidden space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-950 font-serif text-lg">
                  Riwayat Pemindaian Halal Vision ({scanHistory.length})
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {scanHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <History className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-xs">Belum ada riwayat pemindaian.</p>
                </div>
              ) : (
                scanHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentResult(item);
                      setShowHistoryModal(false);
                    }}
                    className="p-3.5 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={item.imageThumbnail}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="overflow-hidden space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                              item.halalStatus === 'HALAL'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.halalStatus === 'SYUBHAT'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {item.halalStatus}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(item.scannedAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.productName}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{item.brand}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setScanHistory((prev) => prev.filter((p) => p.id !== item.id));
                      }}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {scanHistory.length > 0 && (
              <div className="pt-2 border-t border-emerald-100 flex justify-between items-center">
                <button
                  onClick={() => {
                    if (window.confirm('Hapus semua riwayat pemindaian?')) {
                      setScanHistory([]);
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan Riwayat</span>
                </button>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
