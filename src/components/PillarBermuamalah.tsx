import React, { useState, useEffect } from 'react';
import { UMKM_LIST } from '../data/mockData';
import { ShoppingBag, ShieldCheck, MessageSquare, Sparkles, Phone, Star, Building2, UserCheck, Check, Search, Filter, Tag, X, ShoppingCart, CheckCircle2, Store, Heart, Scan, Barcode, Utensils, Camera } from 'lucide-react';
import { HalalBarcodeScanner } from './HalalBarcodeScanner';
import { HalalCameraProductScanner } from './HalalCameraProductScanner';
import { HalalVisionScanner } from './HalalVisionScanner';
import { UmkmDirectory } from './UmkmDirectory';
import { HalalCulinaryRecipes } from './HalalCulinaryRecipes';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  merchantName: string;
  merchantOwner: string;
  merchantAddress: string;
  merchantWhatsapp: string;
  halalCertNumber?: string;
  isVerifiedSyariah: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
}

export const PillarBermuamalah: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'umkm-directory' | 'directory' | 'halal-vision' | 'halal-camera' | 'halal-scanner' | 'halal-recipes' | 'syirkah' | 'promo-ai'>('umkm-directory');
  const [viewMode, setViewMode] = useState<'products' | 'merchants' | 'favorites'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyHalalVerified, setOnlyHalalVerified] = useState<boolean>(false);

  // Favorites State with localStorage persistence
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_favorite_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load favorite products", e);
    }
    return ['p-1', 'p-3']; // Default sample favorites
  });

  const [favoriteMerchantIds, setFavoriteMerchantIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_favorite_merchants');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load favorite merchants", e);
    }
    return ['1']; // Default sample favorite merchant
  });

  useEffect(() => {
    try {
      localStorage.setItem('abdicity_favorite_products', JSON.stringify(favoriteProductIds));
    } catch (e) {
      console.error("Failed to save favorite products", e);
    }
  }, [favoriteProductIds]);

  useEffect(() => {
    try {
      localStorage.setItem('abdicity_favorite_merchants', JSON.stringify(favoriteMerchantIds));
    } catch (e) {
      console.error("Failed to save favorite merchants", e);
    }
  }, [favoriteMerchantIds]);

  const toggleFavoriteProduct = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteMerchant = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteMerchantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selected Product Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderNote, setOrderNote] = useState<string>('');

  // Promo Generator State
  const [productName, setProductName] = useState('');
  const [productHighlight, setProductHighlight] = useState('');
  const [promoGenerated, setPromoGenerated] = useState('');
  const [loadingPromo, setLoadingPromo] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);

  const categories = ['Semua', 'Kuliner Halal', 'Fashion Muslim', 'Jasa Keuangan Syariah', 'Herbal & Kesehatan'];

  // Flatten products from UMKM_LIST and add additional items for a rich marketplace catalog
  const allProducts: ProductItem[] = [
    {
      id: 'p-1',
      name: 'Paket Ayam Penyet Sambal Hijau Komplit',
      category: 'Kuliner Halal',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Ayam Penyet Sambal Hijau Syariah',
      merchantOwner: 'H. Ridwan & Ibu Aisyah',
      merchantAddress: 'Ruko Halal Center Blok A No. 3, Jakarta',
      merchantWhatsapp: '6281299001122',
      halalCertNumber: 'ID311100018920121',
      isVerifiedSyariah: true,
      rating: 4.9,
      reviewsCount: 128,
      description: 'Ayam penyet goreng renyah bumbu rempah pilihan dipadu sambal hijau pedas mantap. Disajikan dengan nasi hangat, tahu, tempe, dan lalapan segar 100% halal MUI.'
    },
    {
      id: 'p-2',
      name: 'Es Cendol Hijrah Nangka Duren',
      category: 'Kuliner Halal',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Ayam Penyet Sambal Hijau Syariah',
      merchantOwner: 'H. Ridwan & Ibu Aisyah',
      merchantAddress: 'Ruko Halal Center Blok A No. 3, Jakarta',
      merchantWhatsapp: '6281299001122',
      halalCertNumber: 'ID311100018920121',
      isVerifiedSyariah: true,
      rating: 4.8,
      reviewsCount: 95,
      description: 'Cendol beras asli tanpa bahan pengawet sintetik dengan kuah santan segar, gula aren murni, potongan nangka dan daging duren segar.'
    },
    {
      id: 'p-3',
      name: 'Gamis Syar\'i Set Khimar Premium Medina',
      category: 'Fashion Muslim',
      price: 245000,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Koko & Gamis Syar\'i Medina Wear',
      merchantOwner: 'Ukhti Sarah & Akhi Fikri',
      merchantAddress: 'Jl. Busana Muslimah No. 88, Bandung',
      merchantWhatsapp: '6281377889900',
      halalCertNumber: 'ID32110002901009',
      isVerifiedSyariah: true,
      rating: 4.9,
      reviewsCount: 142,
      description: 'Gamis syar\'i anggun berbahan katun Madinah impor yang lembut, adem, tidak menerawang, busui-friendly dengan khimar pet antem instan.'
    },
    {
      id: 'p-4',
      name: 'Baju Koko Modern Minimalis Katun',
      category: 'Fashion Muslim',
      price: 175000,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Koko & Gamis Syar\'i Medina Wear',
      merchantOwner: 'Ukhti Sarah & Akhi Fikri',
      merchantAddress: 'Jl. Busana Muslimah No. 88, Bandung',
      merchantWhatsapp: '6281377889900',
      halalCertNumber: 'ID32110002901009',
      isVerifiedSyariah: true,
      rating: 4.8,
      reviewsCount: 88,
      description: 'Koko lengan panjang pria bergaya modern kasual dengan aksen bordir geometris halus. Sangat nyaman untuk salat jamaah dan menghadiri majelis ilmu.'
    },
    {
      id: 'p-5',
      name: 'Paket Pendampingan Pendaftaran Sertifikasi Halal',
      category: 'Jasa Keuangan Syariah',
      price: 1500000,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Jasa Konsultasi Keuangan & Pembukuan Syariah',
      merchantOwner: 'Drs. Ahmad Dahlan, SE, Ak, CA',
      merchantAddress: 'Gedung Syariah Tower Lt. 4, Jakarta',
      merchantWhatsapp: '6281122334455',
      isVerifiedSyariah: true,
      rating: 5.0,
      reviewsCount: 42,
      description: 'Pendampingan lengkap pengurusan sertifikasi Halal MUI & BPJPH untuk usaha mikro, kecil, dan menengah hingga terbit sertifikat resmi.'
    },
    {
      id: 'p-6',
      name: 'Audit Akad & Laporan Keuangan Syariah UMKM',
      category: 'Jasa Keuangan Syariah',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Jasa Konsultasi Keuangan & Pembukuan Syariah',
      merchantOwner: 'Drs. Ahmad Dahlan, SE, Ak, CA',
      merchantAddress: 'Gedung Syariah Tower Lt. 4, Jakarta',
      merchantWhatsapp: '6281122334455',
      isVerifiedSyariah: true,
      rating: 5.0,
      reviewsCount: 31,
      description: 'Pemeriksaan kepatuhan akad syariah (Mudharabah/Murabahah/Musyarakah) serta penyusunan laporan keuangan sesuai PSAK Syariah 101.'
    },
    {
      id: 'p-7',
      name: 'Madu Murni Habbatussauda Barokah 500g',
      category: 'Herbal & Kesehatan',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Herbal Thibbun Nabawi Al-Afiya',
      merchantOwner: 'Ustadz Usman Al-Habsyi',
      merchantAddress: 'Jl. Sehat Nabawi No. 12, Bekasi',
      merchantWhatsapp: '6281233445566',
      halalCertNumber: 'ID31110003421008',
      isVerifiedSyariah: true,
      rating: 4.9,
      reviewsCount: 110,
      description: 'Madu hutan murni pilihan yang dipadukan dengan minyak jintan hitam (Habbatussauda). Khasiat alami sesuai petunjuk Thibbun Nabawi untuk menjaga imunitas.'
    },
    {
      id: 'p-8',
      name: 'Sari Kurma Ajwa Madinah Premium 350ml',
      category: 'Herbal & Kesehatan',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80',
      merchantName: 'Herbal Thibbun Nabawi Al-Afiya',
      merchantOwner: 'Ustadz Usman Al-Habsyi',
      merchantAddress: 'Jl. Sehat Nabawi No. 12, Bekasi',
      merchantWhatsapp: '6281233445566',
      halalCertNumber: 'ID31110003421008',
      isVerifiedSyariah: true,
      rating: 4.8,
      reviewsCount: 76,
      description: 'Ekstrak kurma Ajwa (Kurma Nabi) murni tanpa campuran pemanis buatan. Kaya akan zat besi dan antioksidan untuk stamina harian keluarga.'
    }
  ];

  // Filtering products
  const filteredProducts = allProducts.filter((p) => {
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHalal = onlyHalalVerified ? Boolean(p.halalCertNumber) : true;
    return matchesCat && matchesSearch && matchesHalal;
  });

  // Filtering merchants
  const filteredUmkm = UMKM_LIST.filter((u) => {
    const matchesCat = selectedCategory === 'Semua' || u.category === selectedCategory;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHalal = onlyHalalVerified ? Boolean(u.halalCertNumber) : true;
    return matchesCat && matchesSearch && matchesHalal;
  });

  const handleGeneratePromo = async () => {
    if (!productName.trim() || loadingPromo) return;
    setLoadingPromo(true);

    try {
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Buatkan caption promosi pemasaran halal & berkah untuk UMKM Muslim dengan rincian:
- Nama Produk/Usaha: ${productName}
- Keunggulan / Bahan Halal: ${productHighlight || "Bahan berkualitas, 100% tersertifikasi halal"}

Kriteria Caption:
1. Menarik, sopan, dan menginspirasi (dimulai dengan kata pembuka Islami yang hangat).
2. Tuliskan poin keunggulan utama dalam bentuk bullet list.
3. Berikan kalimat Call to Action mengajak jamaah membeli & membela produk UMKM Muslim.
4. Sertakan hashtag Islami seperti #BermuamalahSyariah #BeliProdukMuslim.`,
          category: 'Bermuamalah'
        })
      });
      const data = await res.json();
      setPromoGenerated(data.response || 'Gagal membuat caption promosi.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPromo(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Subtab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('umkm-directory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'umkm-directory'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Direktori UMKM Komunitas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('directory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'directory'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Marketplace Produk</span>
          </button>

          <button
            onClick={() => setActiveSubTab('halal-vision')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
              activeSubTab === 'halal-vision'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Halal Vision Scanner</span>
            <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded-md hidden md:inline">
              VISION AI
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('halal-scanner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'halal-scanner'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Scan className="w-4 h-4 text-amber-300" />
            <span>Cek Barcode Halal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('halal-recipes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'halal-recipes'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-300" />
            <span>Resep Kuliner Halal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('syirkah')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'syirkah'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Forum Syirkah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('promo-ai')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'promo-ai'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>AI Deskripsi Promo</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 0: INTERACTIVE SEARCHABLE DIREKTORI UMKM KOMUNITAS MASJID */}
      {activeSubTab === 'umkm-directory' && (
        <UmkmDirectory
          onOpenHalalScanner={() => setActiveSubTab('halal-vision')}
          onOpenPromoGenerator={() => setActiveSubTab('promo-ai')}
        />
      )}

      {/* SUBTAB RESEP KULINER HALAL */}
      {activeSubTab === 'halal-recipes' && <HalalCulinaryRecipes />}

      {/* SUBTAB 1: UMKM MARKETPLACE & PRODUCT CATALOG GRID */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Header & Controls Bar */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <div>
                <h3 className="font-bold text-emerald-950 font-serif text-xl flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" /> Marketplace UMKM Syariah ABDICity
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Beli produk halal & dukung perekonomian usaha jamaah Muslim secara langsung tanpa riba.
                </p>
              </div>

              {/* View Switcher: Product Grid vs Merchant Store Directory vs Favorites */}
              <div className="flex items-center gap-1.5 bg-emerald-50 p-1.5 rounded-xl border border-emerald-200">
                <button
                  onClick={() => setViewMode('products')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'products'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Katalog Produk</span>
                </button>
                <button
                  onClick={() => setViewMode('merchants')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'merchants'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Direktori Toko</span>
                </button>
                <button
                  onClick={() => setViewMode('favorites')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'favorites'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-900 bg-rose-50/80 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favoriteProductIds.length + favoriteMerchantIds.length > 0 ? 'fill-current' : ''}`} />
                  <span>Favorit Saya</span>
                  {(favoriteProductIds.length + favoriteMerchantIds.length) > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                      viewMode === 'favorites' ? 'bg-white text-rose-700' : 'bg-rose-600 text-white'
                    }`}>
                      {favoriteProductIds.length + favoriteMerchantIds.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari produk halal, makanan, gamis, herbal, atau nama toko..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Halal Vision Quick Scan CTA Button */}
              <button
                onClick={() => setActiveSubTab('halal-vision')}
                className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 border border-amber-400/40 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm self-stretch sm:self-auto whitespace-nowrap"
              >
                <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Halal Vision Scanner</span>
              </button>

              {/* Halal Filter Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer bg-emerald-50/60 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium whitespace-nowrap self-stretch sm:self-auto">
                <input
                  type="checkbox"
                  checked={onlyHalalVerified}
                  onChange={(e) => setOnlyHalalVerified(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-600 w-4 h-4"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hanya Sertifikat Halal MUI</span>
              </label>
            </div>

            {/* Category Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-emerald-50/50 text-emerald-900 border border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* VIEW MODE 1: PRODUCT LISTING GRID */}
          {viewMode === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Menampilkan <strong>{filteredProducts.length}</strong> produk pilihan Syariah</span>
                <span className="text-emerald-800 font-bold">100% Transaksi Bebas Riba</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-emerald-100 shadow-md overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-emerald-300 transition-all"
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div className="relative h-48 overflow-hidden bg-emerald-950/5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-900 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
                          {p.category}
                        </div>
                        {p.halalCertNumber && (
                          <div className="absolute top-3 right-12 bg-emerald-800 text-amber-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3" /> Halal MUI
                          </div>
                        )}
                        <button
                          onClick={(e) => toggleFavoriteProduct(p.id, e)}
                          title={favoriteProductIds.includes(p.id) ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border shadow-md transition-all ${
                            favoriteProductIds.includes(p.id)
                              ? 'bg-rose-500 text-white border-rose-600 scale-105'
                              : 'bg-white/80 text-gray-700 border-white hover:bg-white hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${favoriteProductIds.includes(p.id) ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Product Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                            <Store className="w-3 h-3 text-emerald-600" />
                            <span className="truncate max-w-[130px]">{p.merchantName}</span>
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{p.rating}</span>
                          </div>
                        </div>

                        <h4 className="font-bold text-emerald-950 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                          {p.name}
                        </h4>

                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        <div className="pt-2 border-t border-emerald-100 flex items-baseline justify-between">
                          <span className="text-xs text-gray-400">Harga:</span>
                          <span className="text-base font-extrabold font-mono text-emerald-900">
                            Rp {p.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="p-4 pt-0 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setOrderQuantity(1);
                          setOrderNote('');
                        }}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                        <span>Detail & Pesan Produk</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-emerald-200 text-gray-500 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-base text-emerald-950">Produk Tidak Ditemukan</h4>
                  <p className="text-xs max-w-sm mx-auto">
                    Coba ganti kata kunci pencarian atau pilih kategori lain pada menu di atas.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: MERCHANT DIRECTORY */}
          {viewMode === 'merchants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUmkm.map((u) => (
                <div key={u.id} className="bg-white rounded-3xl border border-emerald-100 shadow-lg p-5 space-y-4 flex flex-col justify-between hover:shadow-xl transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        {u.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{u.rating}</span>
                          <span className="text-gray-400 font-normal">({u.reviewsCount})</span>
                        </div>
                        <button
                          onClick={(e) => toggleFavoriteMerchant(u.id, e)}
                          title={favoriteMerchantIds.includes(u.id) ? 'Hapus Toko dari Favorit' : 'Simpan Toko ke Favorit'}
                          className={`p-1.5 rounded-full border transition-all ${
                            favoriteMerchantIds.includes(u.id)
                              ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                              : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-rose-500 hover:bg-rose-50'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${favoriteMerchantIds.includes(u.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-emerald-950 text-base leading-snug flex items-center gap-1.5 font-serif">
                        {u.name}
                        {u.isVerifiedSyariah && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" title="Terverifikasi Syariah ABDICity" />
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">Pemilik: {u.ownerName} • {u.address}</p>
                    </div>

                    {u.halalCertNumber && (
                      <div className="text-[10px] bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>Sertifikat Halal MUI: {u.halalCertNumber}</span>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 line-clamp-2">{u.description}</p>

                    {/* Featured Products */}
                    <div className="space-y-2 pt-2 border-t border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase">Produk Unggulan:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {u.featuredProducts.map((fp, i) => (
                          <div key={i} className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                            <img src={fp.image} alt={fp.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="overflow-hidden">
                              <span className="text-[11px] font-bold text-gray-800 block truncate">{fp.name}</span>
                              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                                Rp {fp.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-100">
                    <a
                      href={`https://wa.me/${u.contactWhatsapp}?text=Assalamu'alaikum%20${encodeURIComponent(u.name)},%20saya%20menghubungi%20dari%20Marketplace%20ABDICity.cloud%20ingin%20bertanya...`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                      <span>Hubungi Penjual via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 3: FAVORITES LIST */}
          {viewMode === 'favorites' && (() => {
            const favProducts = allProducts.filter((p) => favoriteProductIds.includes(p.id));
            const favMerchants = UMKM_LIST.filter((u) => favoriteMerchantIds.includes(u.id));
            const isEmpty = favProducts.length === 0 && favMerchants.length === 0;

            if (isEmpty) {
              return (
                <div className="bg-white rounded-3xl border border-dashed border-rose-200 p-10 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-rose-50 rounded-full border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
                    <Heart className="w-8 h-8 fill-rose-100 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 font-serif text-lg">Belum Ada Produk atau Toko Favorit</h4>
                    <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                      Tekan tombol ikon hati (♥) pada produk atau toko syariah pilihan Anda di Marketplace untuk menyimpannya di sini agar mudah ditemukan kembali.
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('products')}
                    className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Jelajahi Katalog Produk</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-8">
                {/* Favorites Summary Banner */}
                <div className="bg-gradient-to-r from-rose-900 via-rose-850 to-pink-950 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-300 fill-rose-400" />
                      <h4 className="font-bold font-serif text-lg">Daftar Produk & Toko Favorit Saya</h4>
                    </div>
                    <p className="text-xs text-rose-100">
                      Tersimpan {favProducts.length} produk dan {favMerchants.length} toko syariah pilihan Anda.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
                    <span>Total Tersimpan: {favProducts.length + favMerchants.length} Item</span>
                  </div>
                </div>

                {/* Section 1: Favorited Products */}
                {favProducts.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-emerald-950 font-serif text-base flex items-center gap-2 border-b border-emerald-100 pb-2">
                      <Tag className="w-4 h-4 text-rose-500" /> Produk Pilihan Favorit ({favProducts.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {favProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white rounded-3xl border border-rose-100 shadow-md overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all"
                        >
                          <div>
                            <div className="relative h-48 overflow-hidden bg-emerald-950/5">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-900 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
                                {p.category}
                              </div>
                              <button
                                onClick={(e) => toggleFavoriteProduct(p.id, e)}
                                title="Hapus dari Favorit"
                                className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white border border-rose-600 shadow-md transition-all scale-105 hover:bg-rose-600"
                              >
                                <Heart className="w-3.5 h-3.5 fill-white" />
                              </button>
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                                  <Store className="w-3 h-3 text-emerald-600" />
                                  <span className="truncate max-w-[130px]">{p.merchantName}</span>
                                </span>
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span>{p.rating}</span>
                                </div>
                              </div>
                              <h4 className="font-bold text-emerald-950 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                                {p.name}
                              </h4>
                              <div className="pt-2 border-t border-emerald-100 flex items-baseline justify-between">
                                <span className="text-xs text-gray-400">Harga:</span>
                                <span className="text-base font-extrabold font-mono text-emerald-900">
                                  Rp {p.price.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 pt-0">
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                setOrderQuantity(1);
                                setOrderNote('');
                              }}
                              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                              <span>Pesan Produk</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Favorited Merchants */}
                {favMerchants.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-emerald-950 font-serif text-base flex items-center gap-2 border-b border-emerald-100 pb-2">
                      <Store className="w-4 h-4 text-rose-500" /> Toko Syariah Favorit Saya ({favMerchants.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favMerchants.map((u) => (
                        <div key={u.id} className="bg-white rounded-3xl border border-rose-100 shadow-md p-5 space-y-4 flex flex-col justify-between hover:shadow-xl transition-all">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                {u.category}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{u.rating}</span>
                                </div>
                                <button
                                  onClick={(e) => toggleFavoriteMerchant(u.id, e)}
                                  title="Hapus Toko dari Favorit"
                                  className="p-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100"
                                >
                                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-emerald-950 text-base leading-snug flex items-center gap-1.5 font-serif">
                                {u.name}
                                {u.isVerifiedSyariah && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" title="Terverifikasi Syariah ABDICity" />
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">Pemilik: {u.ownerName} • {u.address}</p>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{u.description}</p>
                          </div>
                          <div className="pt-3 border-t border-emerald-100">
                            <a
                              href={`https://wa.me/${u.contactWhatsapp}?text=Assalamu'alaikum%20${encodeURIComponent(u.name)},%20saya%20menghubungi%20dari%20Marketplace%20ABDICity.cloud...`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                              <span>Hubungi Penjual via WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* PRODUCT ORDER & INQUIRY MODAL */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-3xl border border-emerald-200 shadow-2xl p-6 relative overflow-hidden space-y-5">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavoriteProduct(selectedProduct.id, e)}
                    title={favoriteProductIds.includes(selectedProduct.id) ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                    className={`p-1.5 rounded-full border transition-all ${
                      favoriteProductIds.includes(selectedProduct.id)
                        ? 'bg-rose-50 text-rose-600 border-rose-300'
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:text-rose-500 hover:bg-rose-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoriteProductIds.includes(selectedProduct.id) ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-700 font-bold p-1 rounded-full text-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-4 items-start border-b border-emerald-100 pb-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-emerald-100 flex-shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {selectedProduct.category}
                    </span>
                    <h3 className="font-bold text-emerald-950 font-serif text-base leading-snug">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Toko: <strong>{selectedProduct.merchantName}</strong> ({selectedProduct.merchantOwner})
                    </p>
                    <div className="text-base font-extrabold font-mono text-emerald-900 pt-1">
                      Rp {selectedProduct.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 space-y-1">
                    <span className="font-bold text-emerald-900">Jaminan Kepatuhan Syariah:</span>
                    <p className="text-gray-700 leading-relaxed text-[11px]">{selectedProduct.description}</p>
                    {selectedProduct.halalCertNumber && (
                      <div className="text-[10px] text-emerald-800 font-mono font-bold flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sertifikat Halal: {selectedProduct.halalCertNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200">
                    <span className="font-bold text-gray-800">Jumlah Pesanan:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-xl bg-white border border-gray-300 font-bold text-gray-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-mono font-extrabold text-sm text-emerald-900 w-6 text-center">
                        {orderQuantity}
                      </span>
                      <button
                        onClick={() => setOrderQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-xl bg-white border border-gray-300 font-bold text-gray-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Note Input */}
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Catatan Pesanan / Spesifikasi:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Ukuran L, Sambal dipisah, Pengiriman besok subuh..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Total Calculation */}
                  <div className="flex justify-between items-center p-3.5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl">
                    <span className="text-xs">Total Estimasi Harga:</span>
                    <span className="text-lg font-mono font-bold text-amber-300">
                      Rp {(selectedProduct.price * orderQuantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/${selectedProduct.merchantWhatsapp}?text=${encodeURIComponent(
                      `Assalamu'alaikum ${selectedProduct.merchantName},\n\nSaya ingin memesan via Marketplace ABDICity.cloud:\n- Produk: ${selectedProduct.name}\n- Jumlah: ${orderQuantity} unit\n- Total Estimasi: Rp ${(
                        selectedProduct.price * orderQuantity
                      ).toLocaleString('id-ID')}\n${orderNote ? `- Catatan: ${orderNote}\n` : ''}\nApakah produk ini ready stok? Terima kasih.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-300" />
                    <span>Lanjutkan Pesanan via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: HALAL VISION SCANNER (CAMERA CAPTURE SIMULATOR FOR BARCODES & INGREDIENTS) */}
      {(activeSubTab === 'halal-vision' || activeSubTab === 'halal-camera') && (
        <HalalVisionScanner
          onSelectMarketplaceProduct={(query) => {
            setSearchQuery(query);
            setActiveSubTab('directory');
            setViewMode('products');
          }}
        />
      )}

      {/* SUBTAB: HALAL BARCODE SCANNER */}
      {activeSubTab === 'halal-scanner' && (
        <HalalBarcodeScanner
          onSelectMarketplaceProduct={(query) => {
            setSearchQuery(query);
            setActiveSubTab('directory');
            setViewMode('products');
          }}
          onSwitchToCameraScanner={() => setActiveSubTab('halal-vision')}
        />
      )}

      {/* SUBTAB 2: FORUM SYIRKAH */}
      {activeSubTab === 'syirkah' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-emerald-950 font-serif text-xl">Forum Syirkah & Kolaborasi Modal Muslim</h3>
            <p className="text-xs text-gray-600">Peluang investasi halal & kemitraan usaha berbasis akad Mudharabah dan Musyarakah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UMKM_LIST.filter((u) => u.lookingForSyirkah).map((u) => (
              <div key={u.id} className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Peluang Kemitraan Mudharabah
                    </span>
                    <h4 className="font-bold text-emerald-950 text-lg mt-1 font-serif">{u.name}</h4>
                  </div>
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  "{u.syirkahDetail}"
                </p>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-gray-500">Pemilik: {u.ownerName}</span>
                  <a
                    href={`https://wa.me/${u.contactWhatsapp}?text=Assalamu'alaikum%20${encodeURIComponent(u.ownerName)},%20saya%20tertarik%20dengan%20peluang%20Syirkah%20di%20ABDICity...`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ajukan Diskusi Syirkah</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: AI PROMO GENERATOR */}
      {activeSubTab === 'promo-ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-4">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Generator Caption Promosi Halal
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Bantu produk UMKM Anda dipromosikan dengan kata-kata santun, beretika, dan mengundang keberkahan.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">Nama Produk / Usaha Anda:</label>
                <input
                  type="text"
                  placeholder="Contoh: Kopi Susu Aren Syariah, Gamis Medina Set"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Bahan Utama & Keunggulan Halal:</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: 100% Biji kopi arabika lokal, tanpa bahan pengawet sintetik, tersertifikasi Halal MUI..."
                  value={productHighlight}
                  onChange={(e) => setProductHighlight(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                onClick={handleGeneratePromo}
                disabled={loadingPromo || !productName.trim()}
                className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingPromo ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>AI Menyusun Promo Berkah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Buat Caption Promosi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            {promoGenerated ? (
              <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xl space-y-4 relative">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <span className="text-xs font-bold text-emerald-900">Hasil Caption Promosi Berkah</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(promoGenerated);
                      setCopiedPromo(true);
                      setTimeout(() => setCopiedPromo(false), 2000);
                    }}
                    className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    {copiedPromo ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{copiedPromo ? "Tersalin!" : "Salin Caption"}</span>
                  </button>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs text-gray-800 leading-relaxed whitespace-pre-line font-sans">
                  {promoGenerated}
                </div>
              </div>
            ) : (
              <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-emerald-300 text-emerald-800 space-y-3">
                <Sparkles className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Hasil Promosi Belum Dibuat</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Isi nama produk dan keunggulan usaha Anda di panel sebelah kiri untuk membuat caption medsos secara instan.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

