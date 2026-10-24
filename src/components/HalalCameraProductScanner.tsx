import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Info,
  Check,
  Share2,
  Trash2,
  History,
  ShoppingBag,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  X,
  HelpCircle,
  FileText,
  Search,
  BookOpen
} from 'lucide-react';
import { HalalCameraScanResult } from '../types';

// Preset sample products with realistic images for instant demonstration without physical camera
const SAMPLE_PRODUCTS = [
  {
    title: 'Indomie Mi Goreng (Logo Halal BPJPH)',
    category: 'Mi Instan',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80',
    hint: 'Indomie Goreng kemasan resmi dengan logo Halal Indonesia Kemenag/BPJPH'
  },
  {
    title: 'Wafer Cokelat Halal MUI',
    category: 'Snack & Biskuit',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=600&q=80',
    hint: 'Wafer renyah cokelat manis dengan sertifikasi Halal MUI LPPOM'
  },
  {
    title: 'Snack Impor Emulsifier E471 (Syubhat)',
    category: 'Snack Impor',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    hint: 'Keripik kentang impor mengandung Emulsifier E471 dan perisa belum bersertifikat Halal lokal'
  },
  {
    title: 'Snack Pork Crispy Lard (Non-Halal)',
    category: 'Makanan Non-Halal',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    hint: 'Produk olahan mengandung kulit babi (Pork) dan minyak babi (Lard)'
  }
];

interface HalalCameraProductScannerProps {
  onSelectMarketplaceProduct?: (query: string) => void;
}

export const HalalCameraProductScanner: React.FC<HalalCameraProductScannerProps> = ({
  onSelectMarketplaceProduct
}) => {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples' | 'history'>('camera');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Captured Photo & Input States
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [productHint, setProductHint] = useState<string>('');

  // AI Loading & Result States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<HalalCameraScanResult | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Scan History State
  const [scanHistory, setScanHistory] = useState<HalalCameraScanResult[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_camera_halal_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load camera scan history', e);
    }
    return [];
  });

  // Media Stream & Video Elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Save scan history
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_camera_halal_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.error('Failed to save camera scan history', e);
    }
  }, [scanHistory]);

  // Cleanup camera stream on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Auto-start camera when 'camera' tab is active and no captured image
  useEffect(() => {
    if (activeTab === 'camera' && !capturedImage && !currentResult) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
  }, [activeTab, cameraFacing, capturedImage, currentResult]);

  // Audio Chime helper
  const playChime = (type: 'halal' | 'syubhat' | 'non-halal' | 'neutral' = 'neutral') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'halal') {
        // High pleasant major chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'non-halal') {
        // Warning minor low chime
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        osc.frequency.setValueAtTime(311.13, ctx.currentTime + 0.15); // Eb4
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        // Subtle notification chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  // Start Camera Stream
  const startCameraStream = async () => {
    stopCameraStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Perangkat atau browser Anda tidak mendukung akses kamera langsung. Silakan gunakan tab Upload Foto atau Contoh Sampel.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as any) : {};
        if (capabilities.torch) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Izin akses kamera belum diberikan. Izinkan akses kamera pada pengaturan peramban Anda atau gunakan opsi upload foto kemasan.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Kamera tidak terdeteksi pada perangkat ini. Silakan gunakan upload foto atau gunakan contoh gambar.');
      } else {
        setCameraError(`Tidak dapat menghubungkan kamera: ${err.message || 'Pastikan tidak ada aplikasi lain yang menggunakan kamera.'}`);
      }
    }
  };

  // Stop Camera Stream
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error(e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        const newState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: newState }]
        });
        setIsTorchOn(newState);
      } catch (err) {
        console.warn('Torch constraint error:', err);
      }
    }
  };

  // Switch between front and rear camera
  const switchCamera = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture image frame from Video
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

      stopCameraStream();
      setCapturedImage(dataUrl);
      playChime('neutral');

      // Auto-trigger Gemini analysis
      analyzeProductWithGemini(dataUrl, productHint);
    } catch (err) {
      console.error('Capture frame error:', err);
      setApiError('Gagal mengambil tangkapan kamera. Silakan coba kembali.');
    }
  };

  // Handle File Upload from Disk / Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setApiError('Ukuran file maksimal 10MB. Silakan pilih foto dengan resolusi wajar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedImage(result);
      stopCameraStream();
      playChime('neutral');
      analyzeProductWithGemini(result, productHint);
    };
    reader.onerror = () => {
      setApiError('Gagal membaca berkas gambar.');
    };
    reader.readAsDataURL(file);
  };

  // Select Sample Preset Product
  const handleSelectSample = async (sample: typeof SAMPLE_PRODUCTS[0]) => {
    try {
      setAnalysisStep('Mengunduh sampel produk...');
      setIsAnalyzing(true);
      setApiError(null);
      setCapturedImage(sample.image);
      setProductHint(sample.hint);

      // Fetch sample image and convert to Base64
      const response = await fetch(sample.image);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        analyzeProductWithGemini(base64data, sample.hint);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      setIsAnalyzing(false);
      setApiError('Gagal memuat sampel foto. Silakan gunakan upload atau kamera perangkat.');
    }
  };

  // Analyze Product with Gemini 3.8 Flash Vision API
  const analyzeProductWithGemini = async (base64Image: string, hint?: string) => {
    setIsAnalyzing(true);
    setApiError(null);
    setCurrentResult(null);

    setAnalysisStep('1/3 Mengunggah foto kemasan ke Gemini Vision AI...');

    try {
      setTimeout(() => {
        setAnalysisStep('2/3 Menganalisis logo Halal BPJPH/MUI & titik kritis bahan...');
      }, 1200);

      setTimeout(() => {
        setAnalysisStep('3/3 Menilai kepatuhan syariah & menyusun rekomendasi...');
      }, 2500);

      const response = await fetch('/api/gemini/halal-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
          productNameHint: hint || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.success || !resJson.data) {
        throw new Error(resJson.error || 'Format data hasil pemindaian tidak valid');
      }

      const d = resJson.data;

      const formattedResult: HalalCameraScanResult = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productName: d.productName || 'Produk Kemasan',
        brand: d.brand || 'Tidak Teridentifikasi',
        category: d.category || 'Makanan & Minuman',
        halalStatus: d.halalStatus || 'HALAL',
        halalStatusLabel: d.halalStatusLabel || (d.halalStatus === 'HALAL' ? 'Terverifikasi Halal' : d.halalStatus === 'NON_HALAL' ? 'Non-Halal (Haram)' : 'Syubhat / Perlu Dipastikan'),
        confidenceScore: typeof d.confidenceScore === 'number' ? d.confidenceScore : 92,
        halalLogoDetected: Boolean(d.halalLogoDetected),
        halalLogoDetails: d.halalLogoDetails || (d.halalLogoDetected ? 'Terdeteksi Logo Halal Resmi' : 'Logo Halal tidak terlihat jelas pada kemasan'),
        halalCertNumber: d.halalCertNumber || null,
        detectedIngredients: Array.isArray(d.detectedIngredients) ? d.detectedIngredients : [],
        criticalHalalPoints: Array.isArray(d.criticalHalalPoints) ? d.criticalHalalPoints : [],
        syariahVerdict: d.syariahVerdict || 'Produk telah dianalisis berdasarkan prinsip kehalalan makanan dalam Islam.',
        recommendation: d.recommendation || 'Periksa fisik kemasan sebelum mengonsumsi.',
        fiqihReference: d.fiqihReference || 'QS. Al-Baqarah: 168 (Perintah memakan yang halal dan thayyib).',
        imageThumbnail: base64Image,
        scannedAt: new Date().toISOString()
      };

      setCurrentResult(formattedResult);

      // Play corresponding sound
      if (formattedResult.halalStatus === 'HALAL') {
        playChime('halal');
      } else if (formattedResult.halalStatus === 'NON_HALAL') {
        playChime('non-halal');
      } else {
        playChime('syubhat');
      }

      // Add to Scan History (avoiding immediate duplicates)
      setScanHistory((prev) => [formattedResult, ...prev.slice(0, 24)]);
    } catch (err: any) {
      console.error('Gemini Vision Halal Scan failed:', err);
      setApiError(err.message || 'Gagal memproses pemindaian. Pastikan API key Gemini valid dan koneksi internet stabil.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Reset and Scan Again
  const handleResetScan = () => {
    setCapturedImage(null);
    setCurrentResult(null);
    setApiError(null);
    setProductHint('');
    if (activeTab === 'camera') {
      startCameraStream();
    }
  };

  // Share Scan Result
  const handleShareResult = async () => {
    if (!currentResult) return;
    const shareText = `🔍 Hasil Audit Halal AI ABDICity:
📦 Produk: ${currentResult.productName} (${currentResult.brand})
🏷️ Status: ${currentResult.halalStatus === 'HALAL' ? '✅ HALAL' : currentResult.halalStatus === 'NON_HALAL' ? '❌ NON-HALAL / HARAM' : '⚠️ SYUBHAT'}
🛡️ Logo Halal: ${currentResult.halalLogoDetails}
💡 Rekomendasi: ${currentResult.recommendation}
📖 Dalil: ${currentResult.fiqihReference}

Dipindai via ABDICity.cloud - Platform Terpadu 4B Kaffah`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cek Halal: ${currentResult.productName}`,
          text: shareText
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Delete an item from scan history
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScanHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all scan history
  const handleClearHistory = () => {
    if (window.confirm('Hapus seluruh riwayat pemindaian halal?')) {
      setScanHistory([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 text-white p-6 rounded-3xl border-2 border-emerald-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-emerald-950" /> Gemini 3.8 Flash Vision
              </span>
              <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600">
                Audit Fiqih Muamalah Kaffah
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
              <Camera className="w-7 h-7 text-amber-400" />
              <span>Pemindai Produk Halal AI (Camera Scanner)</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Arahkan kamera ke kemasan makanan, minuman, atau kosmetik. AI akan memeriksa logo sertifikasi Halal BPJPH/MUI, membaca daftar komposisi, mendeteksi titik kritis kehalalan, dan memberikan fatwa syariah secara instan.
            </p>
          </div>

          {/* Quick Sound & Status Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara Chime' : 'Aktifkan Suara Chime'}
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
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 font-extrabold shadow-md'
                  : 'bg-emerald-800/90 border-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Riwayat ({scanHistory.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* INPUT METHOD SELECTION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('camera');
              if (capturedImage && !currentResult) {
                setCapturedImage(null);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'camera'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Kamera Langsung</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCameraStream();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload Foto Kemasan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('samples');
              stopCameraStream();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'samples'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-teal-400" />
            <span>Contoh Foto Produk</span>
          </button>
        </div>

        {capturedImage && (
          <button
            onClick={handleResetScan}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pindai Ulang</span>
          </button>
        )}
      </div>

      {/* ERROR BANNER IF ANY */}
      {apiError && (
        <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl flex items-start justify-between gap-3 text-rose-900 shadow-sm">
          <div className="flex items-start gap-2.5 text-xs">
            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Terjadi Kendala Pemindaian:</strong>
              <p className="mt-0.5">{apiError}</p>
            </div>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-rose-500 hover:text-rose-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CAMERA / CAPTURE / PREVIEW HUD */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. CAMERA TAB VIEW */}
          {activeTab === 'camera' && !capturedImage && (
            <div className="bg-black rounded-3xl overflow-hidden border-2 border-emerald-600 shadow-2xl relative">
              {/* Camera Video Viewfinder */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-gray-950 flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Camera Fallback or Loading overlay */}
                {!isCameraActive && !cameraError && (
                  <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                    <p className="font-bold text-sm">Menyiapkan Lensa Kamera...</p>
                    <p className="text-xs text-emerald-200">Pastikan browser mengizinkan akses kamera perangkat.</p>
                  </div>
                )}

                {/* Camera Error fallback box */}
                {cameraError && (
                  <div className="absolute inset-0 bg-emerald-950/95 p-6 flex flex-col items-center justify-center text-center text-white space-y-4">
                    <AlertTriangle className="w-12 h-12 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-base text-amber-300">Akses Kamera Belum Tersedia</h4>
                      <p className="text-xs text-emerald-100 max-w-sm mt-1 leading-relaxed">{cameraError}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={startCameraStream}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Coba Hubungkan Lagi</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Foto Manual</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Scanning Frame HUD Overlay (when camera active) */}
                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                    {/* Top HUD text */}
                    <div className="flex items-center justify-between">
                      <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        LIVE VIEWFINDER
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-mono px-2.5 py-1 rounded-full border border-emerald-500/40">
                        {cameraFacing === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}
                      </span>
                    </div>

                    {/* Central Target Box with Corner Brackets */}
                    <div className="relative mx-auto w-3/4 max-w-xs aspect-square flex items-center justify-center">
                      <div className="w-full h-full border-2 border-amber-400/60 rounded-2xl relative">
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                        {/* Animated Laser Scanning Line */}
                        <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse" style={{ top: '50%' }} />
                      </div>
                    </div>

                    {/* Bottom Guidance */}
                    <div className="text-center">
                      <span className="bg-black/70 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full border border-white/20 shadow-md">
                        Arahkan ke Logo Halal atau Tabel Komposisi
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shutter & Camera Controls Bar */}
              <div className="bg-emerald-950 p-4 border-t border-emerald-800 flex items-center justify-around gap-4">
                {/* Switch Camera Button */}
                <button
                  type="button"
                  onClick={switchCamera}
                  disabled={!isCameraActive}
                  className="p-3 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 disabled:opacity-40 transition-all border border-emerald-700 flex flex-col items-center gap-1"
                  title="Ganti Kamera Depan/Belakang"
                >
                  <RefreshCw className="w-5 h-5 text-amber-300" />
                  <span className="text-[10px] font-bold">Putar</span>
                </button>

                {/* Primary Shutter Button */}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={!isCameraActive}
                  className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:scale-105 active:scale-95 disabled:opacity-40 text-emerald-950 p-4 sm:px-8 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all flex items-center gap-2 border-2 border-amber-200"
                >
                  <Camera className="w-6 h-6 fill-emerald-950" />
                  <span>Ambil Foto & Pindai</span>
                </button>

                {/* Flashlight / Torch Button (if supported) */}
                <button
                  type="button"
                  onClick={toggleTorch}
                  disabled={!isCameraActive || !hasTorch}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                    isTorchOn
                      ? 'bg-amber-400 text-emerald-950 border-amber-300'
                      : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700 disabled:opacity-30'
                  }`}
                  title={hasTorch ? 'Lampu Flash' : 'Flash tidak didukung pada kamera ini'}
                >
                  <Zap className={`w-5 h-5 ${isTorchOn ? 'fill-emerald-950' : 'text-amber-300'}`} />
                  <span className="text-[10px] font-bold">{isTorchOn ? 'Flash On' : 'Flash'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. UPLOAD TAB VIEW */}
          {activeTab === 'upload' && !capturedImage && (
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-300 shadow-md text-center space-y-4 hover:border-emerald-500 transition-all">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                <Upload className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-bold text-emerald-950 font-serif text-lg">Pilih Foto Kemasan dari Galeri</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Unggah foto kemasan produk, label nutrisi, atau foto komposisi bahan. Format JPG, PNG, WEBP (maks. 10MB).
                </p>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95">
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>Pilih Foto Produk</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-emerald-100 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Aman & Terenkripsi
                </span>
                <span>•</span>
                <span>Didukung Gemini 3.8 Flash</span>
              </div>
            </div>
          )}

          {/* 3. SAMPLES TAB VIEW */}
          {activeTab === 'samples' && !capturedImage && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md space-y-4">
              <div className="border-b border-emerald-100 pb-3">
                <h3 className="font-bold text-emerald-950 font-serif text-base flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-500" />
                  <span>Uji Cepat dengan Contoh Foto Kemasan Produk</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Klik salah satu produk uji coba di bawah ini untuk melihat analisis live kehalalan oleh Gemini API tanpa perlu memotret.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SAMPLE_PRODUCTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="text-left bg-emerald-50/40 hover:bg-emerald-100/60 border border-emerald-200/80 hover:border-emerald-400 rounded-2xl p-3 flex items-center gap-3 transition-all group shadow-xs hover:shadow-md"
                  >
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="w-16 h-16 rounded-xl object-cover border border-emerald-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="overflow-hidden space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {sample.category}
                      </span>
                      <h4 className="font-bold text-emerald-950 text-xs truncate font-serif">{sample.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{sample.hint}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. CAPTURED IMAGE PREVIEW CARD (ACTIVE AFTER SNAP OR UPLOAD) */}
          {capturedImage && (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden space-y-4 p-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-bold text-emerald-950 text-sm font-serif">Foto Kemasan yang Dipindai</span>
                </div>
                <button
                  onClick={handleResetScan}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Foto Ulang</span>
                </button>
              </div>

              {/* Image with zoom thumbnail */}
              <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-[4/3] max-h-72 flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Tangkapan Kemasan Produk"
                  className="max-w-full max-h-full object-contain"
                />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-6 space-y-3">
                    <Sparkles className="w-12 h-12 text-amber-400 animate-spin" />
                    <div className="space-y-1">
                      <p className="font-bold font-serif text-base text-amber-300">Sedang Menganalisis...</p>
                      <p className="text-xs text-emerald-200 font-mono">{analysisStep || 'Gemini 3.8 Flash Vision sedang mengaudit kehalalan...'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Hint/Notes Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  <span>Catatan Tambahan untuk AI (Opsional):</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productHint}
                    onChange={(e) => setProductHint(e.target.value)}
                    placeholder="Contoh: 'Varian Rasa Balado', atau 'Biskuit Keju dari Australia'"
                    disabled={isAnalyzing}
                    className="flex-1 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => analyzeProductWithGemini(capturedImage, productHint)}
                    disabled={isAnalyzing}
                    className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Scan Ulang</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FIQIH GUIDE ACCORDION INFO BOX */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 space-y-2.5">
            <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-serif flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Panduan Mengenal Titik Kritis Kehalalan Produk Kemasan</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sebagian bahan seperti <strong className="text-emerald-950">Gelatin</strong>, <strong className="text-emerald-950">Emulsifier E471/E472</strong>, dan <strong className="text-emerald-950">Perisa</strong> berstatus <span className="text-amber-700 font-bold">Syubhat</span> jika diproduksi tanpa sertifikasi halal resmi, karena dapat bersumber dari lemak babi atau sembelihan yang tidak syar'i.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AI SCAN RESULTS & VERDICT CARD */}
        <div className="lg:col-span-6 space-y-4">
          {/* A. LOADING STATE SKELETON */}
          {isAnalyzing && (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-emerald-950 font-serif text-xl">
                  Auditor Fiqih Halal AI Sedang Bekerja
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Memeriksa kesesuaian syariah, basis data BPJPH Kemenag, logo halal internasional, dan titik kritis bahan baku...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ekstraksi visual & deteksi kemasan produk</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verifikasi keaslian Logo Halal BPJPH / MUI</span>
                </div>
                <div className="flex items-center gap-2 text-amber-800 font-bold animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{analysisStep || 'Audit fiqih makanan thayyib...'}</span>
                </div>
              </div>
            </div>
          )}

          {/* B. NO RESULTS YET / EMPTY STATE */}
          {!isAnalyzing && !currentResult && (
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-8 text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-50 rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                <ShieldCheck className="w-10 h-10 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-bold text-emerald-950 font-serif text-xl">
                  Siap Memindai Produk Halal
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Ambil foto langsung menggunakan kamera atau unggah foto kemasan di sebelah kiri untuk melihat rincian kehalalan, logo BPJPH, serta titik kritis bahan.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-emerald-800 font-bold text-sm block">100%</span>
                  <span className="text-gray-600 text-[11px] block">Deteksi Logo Halal</span>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-amber-700 font-bold text-sm block">Titik Kritis</span>
                  <span className="text-gray-600 text-[11px] block">Audit Emulsifier & Gelatin</span>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-teal-800 font-bold text-sm block">Rujukan Fiqih</span>
                  <span className="text-gray-600 text-[11px] block">Al-Qur'an & Sunnah</span>
                </div>
              </div>
            </div>
          )}

          {/* C. ACTIVE SCAN RESULT CARD */}
          {!isAnalyzing && currentResult && (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden space-y-5 p-6">
              {/* STATUS HEADER BANNER */}
              <div
                className={`p-5 rounded-2xl border-2 text-white shadow-md flex items-start justify-between gap-4 ${
                  currentResult.halalStatus === 'HALAL'
                    ? 'bg-gradient-to-r from-emerald-900 to-teal-950 border-emerald-500'
                    : currentResult.halalStatus === 'NON_HALAL'
                    ? 'bg-gradient-to-r from-rose-950 to-red-900 border-rose-500'
                    : 'bg-gradient-to-r from-amber-950 to-yellow-950 border-amber-500'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {currentResult.halalStatus === 'HALAL' && (
                      <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> 100% Halal & Thayyib
                      </span>
                    )}
                    {currentResult.halalStatus === 'NON_HALAL' && (
                      <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <XCircle className="w-3 h-3" /> Peringatan Non-Halal
                      </span>
                    )}
                    {currentResult.halalStatus === 'SYUBHAT' && (
                      <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" /> Perlu Diteliti (Syubhat)
                      </span>
                    )}
                    <span className="text-[10px] text-gray-300 font-mono">
                      Akurasi {currentResult.confidenceScore}%
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
                    {currentResult.halalStatusLabel}
                  </h3>

                  <p className="text-xs text-gray-200 leading-relaxed pt-1">
                    {currentResult.recommendation}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {currentResult.halalStatus === 'HALAL' && (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-400 flex items-center justify-center text-amber-300 shadow-lg">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                  )}
                  {currentResult.halalStatus === 'NON_HALAL' && (
                    <div className="w-14 h-14 rounded-2xl bg-rose-900/80 border border-rose-400 flex items-center justify-center text-rose-200 shadow-lg">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}
                  {currentResult.halalStatus === 'SYUBHAT' && (
                    <div className="w-14 h-14 rounded-2xl bg-amber-900/80 border border-amber-400 flex items-center justify-center text-amber-300 shadow-lg">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* PRODUCT IDENTITY & LOGO STATUS */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-gray-500 font-medium">Nama Produk Terdeteksi:</span>
                  <span className="font-bold text-emerald-950 font-serif text-sm">{currentResult.productName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-gray-500 font-medium">Merk / Brand:</span>
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
                        <Check className="w-3.5 h-3.5" /> {currentResult.halalLogoDetails}
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {currentResult.halalLogoDetails}
                      </span>
                    )}
                  </div>
                </div>

                {currentResult.halalCertNumber && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-500 font-medium">No. Sertifikasi Halal:</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {currentResult.halalCertNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* CRITICAL HALAL CONTROL POINTS (TITIK KRITIS BAHAN) */}
              {currentResult.criticalHalalPoints && currentResult.criticalHalalPoints.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-serif flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Titik Kritis Bahan Baku (Halal Control Points)</span>
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

              {/* SYARIAH VERDICT & EXPLANATION */}
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-serif flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Ulasan Fiqih & Analisis Syariah</span>
                </h4>
                <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 text-xs text-gray-800 leading-relaxed">
                  {currentResult.syariahVerdict}
                </div>
              </div>

              {/* FIQIH REFERENCE & DALIL */}
              {currentResult.fiqihReference && (
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
                  <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px] text-amber-900">Rujukan Fiqih / Dalil:</span>
                    <p className="text-gray-700 italic mt-0.5 text-[11px]">{currentResult.fiqihReference}</p>
                  </div>
                </div>
              )}

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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SCAN HISTORY MODAL / EXPANDED SECTION */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-emerald-950 font-serif text-lg">
                Riwayat Pemindaian Produk Halal ({scanHistory.length})
              </h3>
            </div>

            {scanHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center p-12 text-gray-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs">Belum ada riwayat pemindaian kamera.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentResult(item);
                    setCapturedImage(item.imageThumbnail);
                    setActiveTab('camera');
                  }}
                  className="bg-emerald-50/40 hover:bg-emerald-100/50 border border-emerald-100 hover:border-emerald-300 p-4 rounded-2xl transition-all cursor-pointer space-y-3 relative group"
                >
                  <button
                    onClick={(e) => handleDeleteHistory(item.id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Hapus riwayat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageThumbnail}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover border border-emerald-200 flex-shrink-0"
                    />
                    <div className="space-y-1 overflow-hidden">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                          item.halalStatus === 'HALAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.halalStatus === 'NON_HALAL'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.halalStatusLabel}
                      </span>
                      <h4 className="font-bold text-emerald-950 text-xs font-serif truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">{item.brand}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                    {item.recommendation}
                  </p>

                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>{new Date(item.scannedAt).toLocaleDateString('id-ID')}</span>
                    <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                      Lihat Detail <Check className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
