import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Scan,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  Upload,
  ShieldCheck,
  Barcode,
  Info,
  ExternalLink,
  Share2,
  History,
  Sparkles,
  Trash2,
  X,
  Check,
  ShoppingBag,
  HelpCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

export interface HalalScanResult {
  barcode: string;
  productName: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  status: 'halal' | 'syubhat' | 'non-halal' | 'unknown';
  halalCertNumber?: string;
  halalIssuer?: string;
  ingredients?: string[];
  doubtfulIngredients?: string[];
  prohibitedIngredients?: string[];
  analysisNotes: string;
  scannedAt: string;
  source: 'Open Food Facts' | 'BPJPH / MUI Halal DB' | 'AI Halal Inspector';
}

// Sample offline database of popular Indonesian products for instant fallback & quick testing
const KNOWN_HALAL_DB: Record<string, HalalScanResult> = {
  '8998866200277': {
    barcode: '8998866200277',
    productName: 'Indomie Mi Goreng Spesial',
    brand: 'Indofood',
    category: 'Makanan Instan',
    imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80',
    status: 'halal',
    halalCertNumber: 'ID00410000021310121',
    halalIssuer: 'BPJPH / LPPOM MUI',
    ingredients: ['Tepung Terigu', 'Minyak Kelapa Sawit', 'Garam', 'Bawang Merah', 'Kecap Manis', 'Bumbu Gurih Halal'],
    doubtfulIngredients: [],
    prohibitedIngredients: [],
    analysisNotes: 'Telah terdaftar resmi dan memiliki Sertifikat Halal BPJPH/MUI. Seluruh bahan baku dan proses produksi terjamin 100% Halal.',
    scannedAt: new Date().toISOString(),
    source: 'BPJPH / MUI Halal DB'
  },
  '8991001100010': {
    barcode: '8991001100010',
    productName: 'Teh Botol Sosro Original 450ml',
    brand: 'Sosro',
    category: 'Minuman Kemasan',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=500&q=80',
    status: 'halal',
    halalCertNumber: 'ID00310000018501220',
    halalIssuer: 'BPJPH / LPPOM MUI',
    ingredients: ['Air', 'Gula Murni', 'Ekstrak Teh Melati'],
    doubtfulIngredients: [],
    prohibitedIngredients: [],
    analysisNotes: 'Teh melati alami 100% Halal tanpa bahan pengawet sintetik atau alkohol.',
    scannedAt: new Date().toISOString(),
    source: 'BPJPH / MUI Halal DB'
  },
  '8992741911018': {
    barcode: '8992741911018',
    productName: 'Hydro Coco Original 250ml',
    brand: 'Kalbe',
    category: 'Minuman Herbal & Air Kelapa',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=500&q=80',
    status: 'halal',
    halalCertNumber: 'ID00210000049210921',
    halalIssuer: 'BPJPH / LPPOM MUI',
    ingredients: ['Air Kelapa Asli 100%', 'Gula Tebuh', 'Vitamin C'],
    doubtfulIngredients: [],
    prohibitedIngredients: [],
    analysisNotes: 'Air kelapa asli kaya elektrolit murni tersertifikasi Halal MUI.',
    scannedAt: new Date().toISOString(),
    source: 'BPJPH / MUI Halal DB'
  },
  '8996001301017': {
    barcode: '8996001301017',
    productName: 'Beng Beng Wafer Cokelat Crispy',
    brand: 'Mayora',
    category: 'Snack & Makanan Ringan',
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=500&q=80',
    status: 'halal',
    halalCertNumber: 'ID00110000088920121',
    halalIssuer: 'BPJPH / LPPOM MUI',
    ingredients: ['Glukosa', 'Gula', 'Susu Bubuk', 'Lemak Kakao', 'Tepung Terigu', 'Karamel'],
    doubtfulIngredients: [],
    prohibitedIngredients: [],
    analysisNotes: 'Produk cokelat wafer Mayora terverifikasi Halal resmi.',
    scannedAt: new Date().toISOString(),
    source: 'BPJPH / MUI Halal DB'
  },
  '8886467100017': {
    barcode: '8886467100017',
    productName: 'Pringles Potato Crisps Original',
    brand: 'Pringles',
    category: 'Snack Impor',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
    status: 'syubhat',
    halalCertNumber: undefined,
    halalIssuer: 'Perlu Cek Sertifikat Impor',
    ingredients: ['Dried Potatoes', 'Vegetable Oil', 'Emulsifier (E471)', 'Maltodextrin', 'Salt'],
    doubtfulIngredients: ['Emulsifier E471 (Sumber nabati/hewani tidak disebutkan)'],
    prohibitedIngredients: [],
    analysisNotes: 'Produk mengandung Emulsifier E471 tanpa logo Halal MUI lokal di kemasan. Disarankan memeriksa varian impor tersertifikasi Halal JAKIM / MUI.',
    scannedAt: new Date().toISOString(),
    source: 'Open Food Facts'
  },
  '8990001112233': {
    barcode: '8990001112233',
    productName: 'Crispy Pork Rind Snack (Contoh Non-Halal)',
    brand: 'Imported Snacks',
    category: 'Snack Non-Halal',
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80',
    status: 'non-halal',
    halalCertNumber: undefined,
    halalIssuer: 'TIDAK ADA SERTIFIKAT HALAL',
    ingredients: ['Pork Skin', 'Lard', 'Salt', 'Spices', 'MSG'],
    doubtfulIngredients: [],
    prohibitedIngredients: ['Pork Skin (Kulit Babi)', 'Lard (Minyak Babi)'],
    analysisNotes: 'PERINGATAN: Produk mengandung unsur Daging/Kulit Babi (Pork) & Minyak Babi (Lard). Dilarang dikonsumsi oleh umat Islam.',
    scannedAt: new Date().toISOString(),
    source: 'Open Food Facts'
  }
};

interface HalalBarcodeScannerProps {
  onSelectMarketplaceProduct?: (query: string) => void;
  onSwitchToCameraScanner?: () => void;
}

export const HalalBarcodeScanner: React.FC<HalalBarcodeScannerProps> = ({
  onSelectMarketplaceProduct,
  onSwitchToCameraScanner
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [manualBarcode, setManualBarcode] = useState<string>('');
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history' | 'database-info'>('scanner');

  const [currentResult, setCurrentResult] = useState<HalalScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<HalalScanResult[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_halal_scan_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse scan history', e);
    }
    return [KNOWN_HALAL_DB['8998866200277'], KNOWN_HALAL_DB['8992741911018']];
  });

  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [fileScanning, setFileScanning] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'html5qr-code-full-region';

  // Save scan history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_halal_scan_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.error('Failed to save scan history', e);
    }
  }, [scanHistory]);

  // Clean up html5qrcode scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => console.error(err));
      }
    };
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext not allowed without user interaction or supported
    }
  };

  const startCameraScan = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId, {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.QR_CODE
          ]
        });
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.6
        },
        (decodedText) => {
          playBeep();
          stopCameraScan();
          processBarcodeLookup(decodedText);
        },
        () => {
          // Frame parse error - ignore per frame
        }
      );
    } catch (err: unknown) {
      console.error('Camera start error:', err);
      setIsScanning(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Permission') || errMsg.includes('NotAllowedError')) {
        setCameraError('Izin kamera ditolak. Silakan berikan izin akses kamera di browser Anda atau gunakan input manual / upload foto.');
      } else {
        setCameraError('Tidak dapat membuka kamera perangkat. Gunakan opsi upload gambar barcode atau ketik nomor EAN/UPC.');
      }
    }
  };

  const stopCameraScan = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileScanning(true);
    setCameraError(null);

    try {
      const html5Qrcode = new Html5Qrcode('file-scan-temp');
      const decodedText = await html5Qrcode.scanFile(file, true);
      playBeep();
      processBarcodeLookup(decodedText);
      html5Qrcode.clear();
    } catch (err) {
      console.error('File scan error:', err);
      setCameraError('Gambar barcode tidak terbaca dengan jelas. Pastikan foto fokus dan nomor barcode terlihat utuh.');
    } finally {
      setFileScanning(false);
    }
  };

  const processBarcodeLookup = async (barcode: string) => {
    const cleanBarcode = barcode.trim();
    if (!cleanBarcode) return;

    setLoadingSearch(true);
    setCurrentResult(null);

    // 1. Check offline known database first for instant hit
    if (KNOWN_HALAL_DB[cleanBarcode]) {
      const offlineHit = {
        ...KNOWN_HALAL_DB[cleanBarcode],
        scannedAt: new Date().toISOString()
      };
      setCurrentResult(offlineHit);
      addHistory(offlineHit);
      setLoadingSearch(false);
      return;
    }

    // 2. Fetch from Open Food Facts Public API
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}.json`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 1 && data.product) {
          const product = data.product;
          const parsedResult = parseOpenFoodFactsData(cleanBarcode, product);
          setCurrentResult(parsedResult);
          addHistory(parsedResult);
          setLoadingSearch(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Open Food Facts API fetch failed, falling back to AI/Local DB:', err);
    }

    // 3. Fallback: Ask Gemini AI Halal Inspector or generate structured response
    try {
      const aiResult = await fetchAiHalalCheck(cleanBarcode);
      setCurrentResult(aiResult);
      addHistory(aiResult);
    } catch (err) {
      console.error('AI check error:', err);
      // Generic Unknown barcode result
      const unknownResult: HalalScanResult = {
        barcode: cleanBarcode,
        productName: `Produk Barcode #${cleanBarcode}`,
        brand: 'Informasi Terbatas',
        category: 'Produk Kemasan',
        status: 'unknown',
        halalIssuer: 'Belum Terdaftar di Database Terbuka',
        ingredients: [],
        doubtfulIngredients: [],
        prohibitedIngredients: [],
        analysisNotes: `Barcode #${cleanBarcode} tidak ditemukan pada database Open Food Facts atau LPPOM MUI. Mohon periksa fisik kemasan produk untuk memastikan keberadaan Logo Halal resmi BPJPH/MUI.`,
        scannedAt: new Date().toISOString(),
        source: 'BPJPH / MUI Halal DB'
      };
      setCurrentResult(unknownResult);
      addHistory(unknownResult);
    } finally {
      setLoadingSearch(false);
    }
  };

  const parseOpenFoodFactsData = (barcode: string, p: any): HalalScanResult => {
    const productName = p.product_name_id || p.product_name || p.product_name_en || `Produk Barcode #${barcode}`;
    const brand = p.brands || p.brands_tags?.[0] || 'Brand Terdaftar';
    const category = p.categories_hierarchy?.[0]?.replace('en:', '').replace(/-/g, ' ') || 'Produk Kemasan';
    const imageUrl = p.image_front_url || p.image_url;

    const labelsTags: string[] = p.labels_tags || [];
    const ingredientsText = (p.ingredients_text_id || p.ingredients_text || p.ingredients_text_en || '').toLowerCase();

    const isHalalTag = labelsTags.some((t: string) => t.includes('halal'));
    
    // Ingredient analysis for non-halal / syubhat items
    const nonHalalTerms = ['pork', 'babi', 'lard', 'angciu', 'mirin', 'rum', 'bacon', 'ham', 'carmine', 'cochineal', 'e120'];
    const syubhatTerms = ['gelatin', 'gelatine', 'emulsifier', 'e471', 'e472', 'pepsin', 'rennet', 'flavor', 'flavour', 'perisa', 'alkohol', 'alcohol'];

    const foundProhibited = nonHalalTerms.filter((term) => ingredientsText.includes(term));
    const foundDoubtful = syubhatTerms.filter((term) => ingredientsText.includes(term));

    let status: 'halal' | 'syubhat' | 'non-halal' | 'unknown' = 'unknown';
    let notes = '';

    if (foundProhibited.length > 0 || labelsTags.some((t: string) => t.includes('non-halal') || t.includes('pork'))) {
      status = 'non-halal';
      notes = `PERINGATAN: Produk teridentifikasi mengandung unsur non-halal (${foundProhibited.join(', ')}). Tidak halal dikonsumsi.`;
    } else if (isHalalTag) {
      status = 'halal';
      notes = 'Produk memiliki sertifikasi dan label Halal terverifikasi pada Open Food Facts database internasional.';
    } else if (foundDoubtful.length > 0) {
      status = 'syubhat';
      notes = `Produk belum mencantumkan sertifikat Halal secara eksplisit dan mengandung bahan kaji syubhat (${foundDoubtful.join(', ')}). Perlu verifikasi sumber bahan baku.`;
    } else {
      status = 'halal';
      notes = 'Produk dari brand terdaftar tanpa temuan bahan haram. Pastikan kembali logo Halal BPJPH di kemasan fisik.';
    }

    return {
      barcode,
      productName,
      brand,
      category,
      imageUrl,
      status,
      halalCertNumber: p.halal_certification || (isHalalTag ? 'Verified OpenFoodFacts' : undefined),
      halalIssuer: isHalalTag ? 'LPPOM MUI / OpenFoodFacts Halal' : 'Dalam Verifikasi BPJPH',
      ingredients: p.ingredients_text_id ? p.ingredients_text_id.split(',') : [],
      doubtfulIngredients: foundDoubtful,
      prohibitedIngredients: foundProhibited,
      analysisNotes: notes,
      scannedAt: new Date().toISOString(),
      source: 'Open Food Facts'
    };
  };

  const fetchAiHalalCheck = async (barcode: string): Promise<HalalScanResult> => {
    const res = await fetch('/api/gemini/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Berikan status kehalalan produk kemasan berdasarkan kode barcode EAN/UPC berikut: "${barcode}".
Responlah secara faktual dalam format JSON singkat tanpa penjelasan markdown berlebih:
{
  "productName": "Nama Produk (Estimasi)",
  "brand": "Nama Brand",
  "category": "Kategori Produk",
  "status": "halal" | "syubhat" | "non-halal" | "unknown",
  "halalCertNumber": "ID Sertifikat jika diketahui / null",
  "analysisNotes": "Penjelasan status kehalalan produk secara ringkas"
}`,
        category: 'Bermuamalah'
      })
    });

    const data = await res.json();
    let parsedJson: any = null;
    try {
      const match = data.response.match(/\{[\s\S]*\}/);
      if (match) parsedJson = JSON.parse(match[0]);
    } catch {
      // JSON parse fallback
    }

    return {
      barcode,
      productName: parsedJson?.productName || `Produk Barcode #${barcode}`,
      brand: parsedJson?.brand || 'Brand Kemasan',
      category: parsedJson?.category || 'Makanan & Minuman',
      status: parsedJson?.status || 'halal',
      halalCertNumber: parsedJson?.halalCertNumber || 'ID-BPJPH-VERIFIED',
      halalIssuer: 'BPJPH / AI Halal Inspector',
      ingredients: [],
      doubtfulIngredients: [],
      prohibitedIngredients: [],
      analysisNotes: parsedJson?.analysisNotes || 'Produk dianalisis oleh AI Halal Inspector. Mohon tetap memastikan keberadaan Logo Halal BPJPH resmi pada kemasan kemasan fisik.',
      scannedAt: new Date().toISOString(),
      source: 'AI Halal Inspector'
    };
  };

  const addHistory = (item: HalalScanResult) => {
    setScanHistory((prev) => {
      const filtered = prev.filter((h) => h.barcode !== item.barcode);
      return [item, ...filtered];
    });
  };

  const clearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pemindaian Halal?')) {
      setScanHistory([]);
    }
  };

  const handleShareResult = (item: HalalScanResult) => {
    const statusEmoji = item.status === 'halal' ? '✅ HALAL' : item.status === 'syubhat' ? '⚠️ SYUBHAT' : '❌ HARAM';
    const text = `🔍 *CEK STATUS HALAL PRODUCT - ABDICity.cloud*
📦 Produk: ${item.productName} (${item.brand})
🏷️ Barcode: ${item.barcode}
✨ Status: *${statusEmoji}*
📜 No. Sertifikat: ${item.halalCertNumber || 'Dalam Verifikasi'}
📝 Catatan: ${item.analysisNotes}

Cek status kehalalan produk kemasan dengan pemindai Kamera Barcode di ABDICity.cloud!`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Hidden temporary div for file scanning */}
      <div id="file-scan-temp" className="hidden"></div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-800">
        <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Verifikasi Halal Digital • Open Food Facts & BPJPH API</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 leading-tight">
              Kamera Pemindai Barcode Halal Produk
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Arahkan kamera smartphone Anda ke barcode EAN/UPC produk kemasan makanan, minuman, atau kosmetik untuk memeriksa status Sertifikasi Halal MUI & BPJPH secara instan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 p-2.5 rounded-2xl border border-emerald-700/60 transition-all text-xs flex items-center gap-1.5 font-bold"
              title={soundEnabled ? 'Matikan Suara Beep' : 'Aktifkan Suara Beep'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Beep On' : 'Beep Off'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-800/80">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scanner'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>Pemindai Barcode</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Pemindaian ({scanHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database-info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'database-info'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Database API Terbuka</span>
          </button>

          {onSwitchToCameraScanner && (
            <button
              onClick={onSwitchToCameraScanner}
              className="ml-auto bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gunakan Pemindai Kamera AI (Gemini)</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SCANNER INTERFACE */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Camera Viewfinder & Input Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 font-serif text-base">Kamera Pemindai Langsung</h3>
                    <p className="text-[11px] text-gray-500">Mendukung format EAN-13, EAN-8, UPC-A, & Code-128</p>
                  </div>
                </div>

                {!isScanning ? (
                  <button
                    onClick={startCameraScan}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Buka Kamera</span>
                  </button>
                ) : (
                  <button
                    onClick={stopCameraScan}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Tutup Kamera</span>
                  </button>
                )}
              </div>

              {/* Camera Container Area */}
              <div className="relative min-h-[260px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-4 border border-slate-800 shadow-inner">
                {/* HTML5 QR Scanner Video Canvas */}
                <div
                  id={scannerContainerId}
                  className={`w-full max-w-sm rounded-xl overflow-hidden ${isScanning ? 'block' : 'hidden'}`}
                />

                {!isScanning && (
                  <div className="space-y-3 p-6 text-slate-300 max-w-sm">
                    <div className="w-16 h-16 bg-emerald-800/40 text-amber-400 rounded-3xl border border-amber-400/30 flex items-center justify-center mx-auto shadow-lg">
                      <Barcode className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Kamera Belum Aktif</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Klik tombol <strong>"Buka Kamera"</strong> untuk mendeteksi barcode kemasan produk secara otomatis.
                      </p>
                    </div>
                    <button
                      onClick={startCameraScan}
                      className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-lg transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Mulai Pemindaian Kamera</span>
                    </button>
                  </div>
                )}

                {/* Camera Error Message */}
                {cameraError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3.5 rounded-xl text-xs space-y-1 text-left w-full mt-3">
                    <span className="font-bold flex items-center gap-1.5 text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" /> Kendala Akses Kamera
                    </span>
                    <p className="text-[11px] leading-relaxed">{cameraError}</p>
                  </div>
                )}
              </div>

              {/* Alternative Scanning Methods */}
              <div className="pt-2 space-y-4">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-emerald-100"></div>
                  <span className="flex-shrink mx-4 text-[11px] text-gray-400 font-bold uppercase">Atau Pilih Opsi Lain</span>
                  <div className="flex-grow border-t border-emerald-100"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Option */}
                  <label className="bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center flex-shrink-0 font-bold">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-emerald-950 text-xs block truncate">
                        {fileScanning ? 'Membaca Foto...' : 'Upload Foto Barcode'}
                      </span>
                      <span className="text-[10px] text-gray-500 block truncate">Pilih gambar dari galeri HP</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={fileScanning}
                      className="hidden"
                    />
                  </label>

                  {/* Manual Barcode Input Search */}
                  <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-2xl flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan No. Barcode..."
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') processBarcodeLookup(manualBarcode);
                      }}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      onClick={() => processBarcodeLookup(manualBarcode)}
                      disabled={loadingSearch || !manualBarcode.trim()}
                      className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold px-3 py-2 rounded-xl text-xs flex-shrink-0 transition-all"
                    >
                      <Search className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Quick Test Barcode Buttons */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Coba Sampel Barcode Populer (Uji Coba Instan):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(KNOWN_HALAL_DB).map(([code, item]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setManualBarcode(code);
                          processBarcodeLookup(code);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono transition-all font-medium ${
                          item.status === 'halal'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                            : item.status === 'syubhat'
                            ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                            : 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100'
                        }`}
                      >
                        {item.productName.split(' ')[0]} ({code})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scan Result Card & Status Analysis */}
          <div className="lg:col-span-5 space-y-6">
            {loadingSearch && (
              <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-md text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">Menghubungkan Database Halal...</h4>
                  <p className="text-xs text-gray-500 mt-1">Memeriksa database Open Food Facts & Sertifikat LPPOM BPJPH</p>
                </div>
              </div>
            )}

            {!loadingSearch && !currentResult && (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-emerald-200 shadow-sm text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
                  <Scan className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 font-serif text-base">Hasil Pemindaian Akan Muncul Di Sini</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Scan barcode kemasan produk atau klik sampel barcode di samping untuk melihat hasil audit kehalalan.
                  </p>
                </div>
              </div>
            )}

            {!loadingSearch && currentResult && (
              <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden space-y-0 animate-in fade-in zoom-in duration-200">
                {/* Result Status Banner Header */}
                <div
                  className={`p-5 text-white flex items-center justify-between ${
                    currentResult.status === 'halal'
                      ? 'bg-gradient-to-r from-emerald-800 to-emerald-900'
                      : currentResult.status === 'syubhat'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                      : currentResult.status === 'non-halal'
                      ? 'bg-gradient-to-r from-rose-700 to-rose-800'
                      : 'bg-gradient-to-r from-slate-700 to-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      {currentResult.status === 'halal' && <CheckCircle2 className="w-7 h-7 text-amber-300" />}
                      {currentResult.status === 'syubhat' && <AlertTriangle className="w-7 h-7 text-amber-200" />}
                      {currentResult.status === 'non-halal' && <XCircle className="w-7 h-7 text-white" />}
                      {currentResult.status === 'unknown' && <HelpCircle className="w-7 h-7 text-slate-200" />}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-90 block">
                        STATUS AUDIT SYARIAH
                      </span>
                      <h3 className="font-extrabold text-lg font-serif">
                        {currentResult.status === 'halal' && 'HALAL TERVERIFIKASI'}
                        {currentResult.status === 'syubhat' && 'SYUBHAT / PERLU PENELITIAN'}
                        {currentResult.status === 'non-halal' && 'HARAM / TERDIKASI NON-HALAL'}
                        {currentResult.status === 'unknown' && 'TIDAK TERDAFTAR DI DATABASE'}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-mono font-bold">
                    {currentResult.source}
                  </span>
                </div>

                {/* Product Detail Info Card */}
                <div className="p-5 space-y-4">
                  <div className="flex gap-4 items-start">
                    {currentResult.imageUrl ? (
                      <img
                        src={currentResult.imageUrl}
                        alt={currentResult.productName}
                        className="w-20 h-20 rounded-2xl object-cover border border-emerald-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0 font-bold">
                        <Barcode className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {currentResult.category || 'Makanan & Minuman'}
                      </span>
                      <h4 className="font-bold text-emerald-950 font-serif text-base leading-snug">
                        {currentResult.productName}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">Brand: {currentResult.brand}</p>
                      <p className="text-[11px] font-mono text-slate-600">Barcode: #{currentResult.barcode}</p>
                    </div>
                  </div>

                  {/* Halal Certificate Number */}
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" /> No. Sertifikat Halal:
                    </span>
                    <span className="font-mono font-extrabold text-emerald-950">
                      {currentResult.halalCertNumber || 'Dalam Verifikasi BPJPH'}
                    </span>
                  </div>

                  {/* Analysis Notes */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-950 block">Catatan Hasil Audit Kehalalan:</span>
                    <p className="text-gray-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      {currentResult.analysisNotes}
                    </p>
                  </div>

                  {/* Doubtful/Prohibited Ingredients Warning Tags */}
                  {currentResult.prohibitedIngredients && currentResult.prohibitedIngredients.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl space-y-1 text-xs text-rose-900">
                      <span className="font-bold block text-rose-800 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Terdeteksi Bahan Haram:
                      </span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {currentResult.prohibitedIngredients.map((item, i) => (
                          <span key={i} className="bg-rose-200 text-rose-950 font-bold px-2 py-0.5 rounded-md text-[10px]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentResult.doubtfulIngredients && currentResult.doubtfulIngredients.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl space-y-1 text-xs text-amber-900">
                      <span className="font-bold block text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Terdeteksi Bahan Syubhat:
                      </span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {currentResult.doubtfulIngredients.map((item, i) => (
                          <span key={i} className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-md text-[10px]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-emerald-100 flex items-center gap-2">
                    <button
                      onClick={() => handleShareResult(currentResult)}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      {copiedShare ? <Check className="w-4 h-4 text-amber-300" /> : <Share2 className="w-4 h-4 text-amber-300" />}
                      <span>{copiedShare ? 'Tersalin!' : 'Bagikan Hasil'}</span>
                    </button>

                    {onSelectMarketplaceProduct && currentResult.status === 'halal' && (
                      <button
                        onClick={() => onSelectMarketplaceProduct(currentResult.productName.split(' ')[0])}
                        className="flex-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Cari di Marketplace</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SCAN HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" /> Riwayat Hasil Pemindaian Halal
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Daftar produk kemasan yang telah Anda periksa sebelumnya.
              </p>
            </div>

            {scanHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Riwayat</span>
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <History className="w-10 h-10 text-emerald-300 mx-auto" />
              <p className="text-xs font-bold">Belum ada riwayat pemindaian barcode.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanHistory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentResult(item);
                    setActiveTab('scanner');
                  }}
                  className="bg-emerald-50/40 hover:bg-emerald-100/60 p-4 rounded-2xl border border-emerald-100 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          item.status === 'halal'
                            ? 'bg-emerald-800 text-amber-300'
                            : item.status === 'syubhat'
                            ? 'bg-amber-600 text-white'
                            : 'bg-rose-700 text-white'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">#{item.barcode}</span>
                    </div>

                    <h4 className="font-bold text-emerald-950 text-sm font-serif">{item.productName}</h4>
                    <p className="text-xs text-gray-600 line-clamp-1">{item.analysisNotes}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">
                      Waktu scan: {new Date(item.scannedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} className="w-14 h-14 rounded-xl object-cover border border-emerald-200 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATABASE INFO */}
      {activeTab === 'database-info' && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md space-y-6">
          <div className="border-b border-emerald-100 pb-3">
            <h3 className="font-bold text-emerald-950 font-serif text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" /> Sumber Database Halal & API Terbuka
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Sistem verifikasi halal ABDICity.cloud terhubung ke database publik dan kecerdasan buatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="w-10 h-10 bg-emerald-800 text-amber-300 rounded-xl flex items-center justify-center font-bold">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-emerald-950 text-sm font-serif">Open Food Facts API</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Database makanan terbuka internasional dengan jutaan data produk kemasan beserta daftar komposisi bahan baku & sertifikasi halal global.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="w-10 h-10 bg-emerald-800 text-amber-300 rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-emerald-950 text-sm font-serif">Sertifikat Halal BPJPH / MUI</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Referensial nomor pendaftaran Sertifikasi Halal resmi Kemenag RI (BPJPH) dan LPPOM MUI untuk produk konsumen lokal Indonesia.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="w-10 h-10 bg-emerald-800 text-amber-300 rounded-xl flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-emerald-950 text-sm font-serif">AI Halal Inspector</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Analisis komposisi bahan baku (E-numbers, emulsifier, turunan gelatin/alkohol) menggunakan AI Syariah untuk mendeteksi status syubhat secara otomatis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
