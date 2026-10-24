import React, { useState, useEffect } from 'react';
import { UMKM_LIST } from '../data/mockData';
import { UmkmBusiness } from '../types';
import {
  Store,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  MapPin,
  MessageSquare,
  Star,
  Heart,
  Plus,
  Sparkles,
  X,
  Tag,
  ShoppingBag,
  Users,
  CheckCircle2,
  ExternalLink,
  Check,
  ChevronRight,
  BadgeCheck,
  Building,
  Phone
} from 'lucide-react';

interface UmkmDirectoryProps {
  onOpenHalalScanner?: () => void;
  onOpenPromoGenerator?: () => void;
}

export const UmkmDirectory: React.FC<UmkmDirectoryProps> = ({
  onOpenHalalScanner,
  onOpenPromoGenerator
}) => {
  // Combine initial mock data with custom UMKMs stored in localStorage
  const [umkmList, setUmkmList] = useState<UmkmBusiness[]>(() => {
    try {
      const savedCustom = localStorage.getItem('abdicity_custom_umkm_list');
      if (savedCustom) {
        const customArr: UmkmBusiness[] = JSON.parse(savedCustom);
        return [...UMKM_LIST, ...customArr];
      }
    } catch (e) {
      console.error('Failed to load custom UMKMs', e);
    }
    return UMKM_LIST;
  });

  // Favorites state synced with localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_favorite_merchants');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['u-1', 'u-4']; // Default sample favorites
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedMosque, setSelectedMosque] = useState<string>('Semua Masjid');
  const [selectedCity, setSelectedCity] = useState<string>('Semua Kota');
  const [onlyHalalVerified, setOnlyHalalVerified] = useState<boolean>(false);
  const [onlyVerifiedSyariah, setOnlyVerifiedSyariah] = useState<boolean>(false);
  const [onlyLookingForSyirkah, setOnlyLookingForSyirkah] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');

  // Modal States
  const [selectedUmkmModal, setSelectedUmkmModal] = useState<UmkmBusiness | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [registeredSuccessName, setRegisteredSuccessName] = useState<string | null>(null);

  // New UMKM Form State
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<UmkmBusiness['category']>('Kuliner Halal');
  const [formOwnerName, setFormOwnerName] = useState<string>('');
  const [formMosqueAffiliation, setFormMosqueAffiliation] = useState<string>('Masjid Agung Islamicity Central');
  const [formAddress, setFormAddress] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('Jakarta Pusat');
  const [formWhatsapp, setFormWhatsapp] = useState<string>('');
  const [formHalalCert, setFormHalalCert] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formLookingForSyirkah, setFormLookingForSyirkah] = useState<boolean>(false);
  const [formSyirkahDetail, setFormSyirkahDetail] = useState<string>('');
  
  // Single product input inside form
  const [formProductName, setFormProductName] = useState<string>('');
  const [formProductPrice, setFormProductPrice] = useState<string>('');

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_favorite_merchants', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Categories list
  const categories = [
    'Semua',
    'Kuliner Halal',
    'Fashion Muslim',
    'Jasa Keuangan Syariah',
    'Produk Herbal',
    'Edukasi & Kitab'
  ];

  // Distinct mosques list for filter
  const mosqueOptions = [
    'Semua Masjid',
    ...Array.from(
      new Set(umkmList.map((u) => u.mosqueAffiliation).filter(Boolean) as string[])
    )
  ];

  // Distinct cities list for filter
  const cityOptions = [
    'Semua Kota',
    ...Array.from(new Set(umkmList.map((u) => u.city).filter(Boolean) as string[]))
  ];

  // Filtering engine
  const filteredUmkm = umkmList
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        u.name.toLowerCase().includes(q) ||
        u.ownerName.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q) ||
        (u.mosqueAffiliation && u.mosqueAffiliation.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q)) ||
        u.featuredProducts.some((p) => p.name.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'Semua' || u.category === selectedCategory;
      const matchesMosque =
        selectedMosque === 'Semua Masjid' || u.mosqueAffiliation === selectedMosque;
      const matchesCity = selectedCity === 'Semua Kota' || u.city === selectedCity;

      const matchesHalal = onlyHalalVerified ? Boolean(u.halalCertNumber) : true;
      const matchesSyariah = onlyVerifiedSyariah ? u.isVerifiedSyariah : true;
      const matchesSyirkah = onlyLookingForSyirkah ? u.lookingForSyirkah : true;

      return (
        matchesSearch &&
        matchesCat &&
        matchesMosque &&
        matchesCity &&
        matchesHalal &&
        matchesSyariah &&
        matchesSyirkah
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Handle register new UMKM submit
  const handleRegisterUmkmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formOwnerName.trim() || !formWhatsapp.trim()) return;

    const newUmkm: UmkmBusiness = {
      id: `custom-u-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      ownerName: formOwnerName.trim(),
      address: formAddress.trim() || 'Kompleks Masjid Binaan',
      city: formCity || 'Jakarta Pusat',
      mosqueAffiliation: formMosqueAffiliation,
      rating: 5.0,
      reviewsCount: 1,
      halalCertNumber: formHalalCert.trim() || undefined,
      isVerifiedSyariah: true,
      description:
        formDescription.trim() ||
        'Usaha binaan komunitas jamaah masjid dengan jaminan kehalalan dan transaksi syariah.',
      featuredProducts: formProductName.trim()
        ? [
            {
              name: formProductName.trim(),
              price: parseFloat(formProductPrice) || 25000,
              image:
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
            }
          ]
        : [
            {
              name: 'Produk Unggulan Syariah',
              price: 35000,
              image:
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
            }
          ],
      contactWhatsapp: formWhatsapp.replace(/\D/g, ''),
      lookingForSyirkah: formLookingForSyirkah,
      syirkahDetail: formLookingForSyirkah ? formSyirkahDetail.trim() : undefined
    };

    const updatedList = [newUmkm, ...umkmList];
    setUmkmList(updatedList);

    // Save custom array to localStorage
    try {
      const existingCustom = localStorage.getItem('abdicity_custom_umkm_list');
      const prevArr: UmkmBusiness[] = existingCustom ? JSON.parse(existingCustom) : [];
      localStorage.setItem(
        'abdicity_custom_umkm_list',
        JSON.stringify([newUmkm, ...prevArr])
      );
    } catch (err) {
      console.error('Error saving custom UMKM to localStorage', err);
    }

    setRegisteredSuccessName(newUmkm.name);
    setIsRegisterModalOpen(false);

    // Reset Form
    setFormName('');
    setFormOwnerName('');
    setFormAddress('');
    setFormWhatsapp('');
    setFormHalalCert('');
    setFormDescription('');
    setFormProductName('');
    setFormProductPrice('');
    setFormLookingForSyirkah(false);
    setFormSyirkahDetail('');
  };

  return (
    <div className="space-y-6">
      {/* DIRECTORY HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-700 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-sm">
              <Store className="w-3.5 h-3.5 text-emerald-950" />
              <span>Direktori UMKM & Usaha Komunitas Masjid Syariah</span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl font-serif text-amber-300 leading-tight">
              Pemberdayaan Ekonomi Jamaah & UMKM Binaan Masjid
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Temukan, beli, dan dukung usaha mikro, kecil, dan menengah milik jamaah masjid sekitar Anda. Transaksi 100% bebas riba, halal tersertifikasi, dan memperkuat ukhuwah bermuamalah.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 min-w-[220px]">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 text-emerald-950 group-hover:scale-110 transition-transform" />
              <span>Daftarkan UMKM Binaan Masjid</span>
            </button>

            {onOpenPromoGenerator && (
              <button
                onClick={onOpenPromoGenerator}
                className="bg-emerald-950/80 hover:bg-emerald-950 text-amber-300 border border-emerald-700 font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Generator Caption Promo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS REGISTRATION ALERT */}
      {registeredSuccessName && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-950 animate-in fade-in shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong>Alhamdulillah! Usaha "{registeredSuccessName}" Berhasil Terdaftar.</strong>
              <span className="block text-gray-600 text-[11px]">
                Usaha UMKM Anda kini telah masuk ke direktori publik komunitas masjid ABDICity.
              </span>
            </div>
          </div>
          <button
            onClick={() => setRegisteredSuccessName(null)}
            className="text-gray-400 hover:text-gray-600 font-bold p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FILTER & SEARCH PANEL */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
        {/* Row 1: Search Bar & Sort Dropdown */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama usaha, pemilik, produk, atau nama masjid binaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mosque Affiliation Selector */}
            <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-900 font-medium">
              <Building2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <select
                value={selectedMosque}
                onChange={(e) => setSelectedMosque(e.target.value)}
                className="bg-transparent font-bold text-emerald-950 focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                {mosqueOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-900 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-bold text-emerald-950 focus:outline-none cursor-pointer max-w-[120px] truncate"
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-900 font-medium">
              <span className="text-gray-500 hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-emerald-950 focus:outline-none cursor-pointer"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="reviews">Ulasan Terbanyak</option>
                <option value="name">Nama (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 3: Feature Checkbox Toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-emerald-100 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-50/60 px-3 py-1 rounded-xl border border-emerald-200 font-medium text-emerald-900">
            <input
              type="checkbox"
              checked={onlyHalalVerified}
              onChange={(e) => setOnlyHalalVerified(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-600 w-3.5 h-3.5"
            />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sertifikat Halal MUI</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-50/60 px-3 py-1 rounded-xl border border-emerald-200 font-medium text-emerald-900">
            <input
              type="checkbox"
              checked={onlyVerifiedSyariah}
              onChange={(e) => setOnlyVerifiedSyariah(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-600 w-3.5 h-3.5"
            />
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terverifikasi Syariah ABDICity</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 font-bold text-amber-950">
            <input
              type="checkbox"
              checked={onlyLookingForSyirkah}
              onChange={(e) => setOnlyLookingForSyirkah(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Buka Peluang Syirkah / Mudharabah</span>
          </label>

          {(selectedCategory !== 'Semua' ||
            selectedMosque !== 'Semua Masjid' ||
            selectedCity !== 'Semua Kota' ||
            searchQuery ||
            onlyHalalVerified ||
            onlyVerifiedSyariah ||
            onlyLookingForSyirkah) && (
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedMosque('Semua Masjid');
                setSelectedCity('Semua Kota');
                setSearchQuery('');
                setOnlyHalalVerified(false);
                setOnlyVerifiedSyariah(false);
                setOnlyLookingForSyirkah(false);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-bold underline ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* DIRECTORY LISTINGS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Menampilkan <strong>{filteredUmkm.length}</strong> usaha UMKM Komunitas Masjid
          </span>
          <span className="text-emerald-800 font-bold">100% Ekosistem Muamalah Syariah</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUmkm.map((u) => {
            const isFav = favoriteIds.includes(u.id);

            return (
              <div
                key={u.id}
                className="bg-white rounded-3xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-300"
              >
                <div className="p-5 space-y-3.5">
                  {/* Top Badges & Favorite Heart */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        {u.category}
                      </span>
                      {u.mosqueAffiliation && (
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span className="truncate max-w-[120px]">{u.mosqueAffiliation}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(u.id, e)}
                      title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                      className={`p-1.5 rounded-full border transition-all ${
                        isFav
                          ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                          : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Business Title & Owner */}
                  <div>
                    <h3 className="font-bold text-emerald-950 text-base font-serif leading-snug flex items-center gap-1.5 group-hover:text-emerald-800 transition-colors">
                      {u.name}
                      {u.isVerifiedSyariah && (
                        <ShieldCheck
                          className="w-4 h-4 text-emerald-600 flex-shrink-0"
                          title="Terverifikasi Syariah ABDICity"
                        />
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <span>Pengelola: <strong>{u.ownerName}</strong></span>
                      {u.city && <span>• {u.city}</span>}
                    </p>
                  </div>

                  {/* Rating & Halal Badge */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{u.rating}</span>
                      <span className="text-gray-400 font-normal">({u.reviewsCount} ulasan)</span>
                    </div>

                    {u.halalCertNumber ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Halal MUI</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-md">
                        Standard Halal
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {u.description}
                  </p>

                  {/* Address */}
                  <div className="text-[11px] text-gray-500 flex items-start gap-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{u.address}</span>
                  </div>

                  {/* Syirkah Banner if applicable */}
                  {u.lookingForSyirkah && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl text-xs text-amber-950 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-amber-900 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Membuka Syirkah / Mudharabah:</span>
                      </div>
                      <p className="text-[11px] text-amber-900 line-clamp-2">
                        {u.syirkahDetail}
                      </p>
                    </div>
                  )}

                  {/* Featured Products Mini Catalog */}
                  <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase block">
                      Produk Utama:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {u.featuredProducts.slice(0, 2).map((fp, i) => (
                        <div
                          key={i}
                          className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100 flex items-center gap-2"
                        >
                          <img
                            src={fp.image}
                            alt={fp.name}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold text-gray-800 block truncate">
                              {fp.name}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-800 font-bold">
                              Rp {fp.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUmkmModal(u)}
                      className="w-1/2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold py-2.5 rounded-xl text-xs transition-all border border-emerald-200 flex items-center justify-center gap-1"
                    >
                      <Store className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Detail Toko</span>
                    </button>

                    <a
                      href={`https://wa.me/${u.contactWhatsapp}?text=Assalamu'alaikum%20${encodeURIComponent(
                        u.name
                      )},%20saya%20menghubungi%20dari%20Direktori%20UMKM%20Komunitas%20Masjid%20ABDICity...`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-1/2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUmkm.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-emerald-200 text-gray-500 space-y-3">
            <Store className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-base text-emerald-950">
              Tidak Ada UMKM Binaan Masjid Ditemukan
            </h4>
            <p className="text-xs max-w-sm mx-auto">
              Coba ganti kata kunci pencarian, ubah filter masjid/kategori, atau daftarkan usaha jamaah baru.
            </p>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md"
            >
              + Daftarkan UMKM Baru
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL FOR SELECTED UMKM */}
      {selectedUmkmModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-emerald-200 shadow-2xl p-6 relative overflow-hidden space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUmkmModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 border-b border-emerald-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold font-serif text-xl flex-shrink-0 shadow-md">
                {selectedUmkmModal.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {selectedUmkmModal.category}
                  </span>
                  {selectedUmkmModal.mosqueAffiliation && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      Binaan {selectedUmkmModal.mosqueAffiliation}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-emerald-950 font-serif text-xl leading-snug flex items-center gap-1.5">
                  {selectedUmkmModal.name}
                  {selectedUmkmModal.isVerifiedSyariah && (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" title="Terverifikasi Syariah ABDICity" />
                  )}
                </h3>
                <p className="text-xs text-gray-500">
                  Pemilik: <strong>{selectedUmkmModal.ownerName}</strong> • Alamat: {selectedUmkmModal.address}
                </p>
              </div>
            </div>

            {/* Certifications & Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Status Kepatuhan Syariah:</span>
                <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Bebas Riba & Akad Syar'i</span>
                </p>
                {selectedUmkmModal.halalCertNumber && (
                  <p className="text-[11px] text-gray-700 font-mono pt-1">
                    No. Sertifikat Halal MUI: {selectedUmkmModal.halalCertNumber}
                  </p>
                )}
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Reputasi & Kontak:</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{selectedUmkmModal.rating} / 5.0</span>
                  <span className="text-gray-500 font-normal">({selectedUmkmModal.reviewsCount} Ulasan Pembeli)</span>
                </div>
                <p className="text-[11px] text-emerald-900 font-bold pt-1">
                  WhatsApp: +{selectedUmkmModal.contactWhatsapp}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs text-gray-700">
              <strong className="text-emerald-950 block">Deskripsi Usaha:</strong>
              <p className="leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100">
                {selectedUmkmModal.description}
              </p>
            </div>

            {/* Syirkah Box if applicable */}
            {selectedUmkmModal.lookingForSyirkah && selectedUmkmModal.syirkahDetail && (
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Peluang Syirkah & Kemitraan Modal (Mudharabah)</span>
                  </div>
                  <span className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    Terbuka
                  </span>
                </div>
                <p className="text-amber-900 leading-relaxed">
                  "{selectedUmkmModal.syirkahDetail}"
                </p>
              </div>
            )}

            {/* Products Catalog */}
            <div className="space-y-3">
              <strong className="text-emerald-950 text-xs block">Katalog Produk & Layanan Unggulan:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedUmkmModal.featuredProducts.map((p, idx) => (
                  <div key={idx} className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="overflow-hidden">
                        <span className="font-bold text-emerald-950 text-xs block truncate">{p.name}</span>
                        <span className="text-xs font-mono font-extrabold text-emerald-900">
                          Rp {p.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${selectedUmkmModal.contactWhatsapp}?text=${encodeURIComponent(
                        `Assalamu'alaikum ${selectedUmkmModal.name},\n\nSaya berminat memesan produk: ${p.name} (Rp ${p.price.toLocaleString('id-ID')}).\nMohon informasi ketersediaan dan pengiriman. Terima kasih!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap"
                    >
                      Beli
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-2 flex gap-3">
              <a
                href={`https://wa.me/${selectedUmkmModal.contactWhatsapp}?text=Assalamu'alaikum%20${encodeURIComponent(
                  selectedUmkmModal.name
                )},%20saya%20menghubungi%20dari%20Direktori%20UMKM%20Komunitas%20Masjid%20ABDICity...`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Hubungi Penjual via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW UMKM MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-emerald-200 shadow-2xl p-6 relative overflow-hidden space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 font-serif text-base">
                  Pendaftaran UMKM & Usaha Binaan Masjid Baru
                </h3>
                <p className="text-xs text-gray-500">
                  Daftarkan usaha jamaah Anda ke Direktori Muamalah Syariah
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterUmkmSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Nama Usaha / Toko UMKM:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Katering Berkah Jamaah"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Kategori Usaha:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-950 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Kuliner Halal">Kuliner Halal</option>
                    <option value="Fashion Muslim">Fashion Muslim</option>
                    <option value="Jasa Keuangan Syariah">Jasa Keuangan Syariah</option>
                    <option value="Produk Herbal">Produk Herbal</option>
                    <option value="Edukasi & Kitab">Edukasi & Kitab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Nama Pemilik / Jamaah:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Siti Hajar"
                    value={formOwnerName}
                    onChange={(e) => setFormOwnerName(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Affiliasi Masjid Binaan:</label>
                  <select
                    value={formMosqueAffiliation}
                    onChange={(e) => setFormMosqueAffiliation(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-950 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Masjid Agung Islamicity Central">Masjid Agung Islamicity Central</option>
                    <option value="Masjid Jami' Ar-Rahman Berjamaah">Masjid Jami' Ar-Rahman Berjamaah</option>
                    <option value="Masjid Al-Barkah Bermuamalah">Masjid Al-Barkah Bermuamalah</option>
                    <option value="Masjid Istiqlal Syariah Hub">Masjid Istiqlal Syariah Hub</option>
                    <option value="Masjid Al-Azhar ABDICity Branch">Masjid Al-Azhar ABDICity Branch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Nomor WhatsApp Aktif:</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081298765432"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Kota / Wilayah:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta Selatan"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Nomor Sertifikat Halal MUI (Opsional):</label>
                <input
                  type="text"
                  placeholder="Contoh: ID3111000998877"
                  value={formHalalCert}
                  onChange={(e) => setFormHalalCert(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-gray-800 font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Deskripsi Ringkas Usaha:</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan jenis makanan/produk, bahan baku, serta komitmen jaminan kehalalan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Sample Product Input */}
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-emerald-900 block">
                  Produk Unggulan Pertama (Opsional):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Produk (misal: Nasi Kebuli Kambing)"
                    value={formProductName}
                    onChange={(e) => setFormProductName(e.target.value)}
                    className="bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-gray-800"
                  />
                  <input
                    type="number"
                    placeholder="Harga dalam Rp (misal: 35000)"
                    value={formProductPrice}
                    onChange={(e) => setFormProductPrice(e.target.value)}
                    className="bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Syirkah Option */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={formLookingForSyirkah}
                    onChange={(e) => setFormLookingForSyirkah(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Buka Peluang Syirkah / Kerjasama Bagi Hasil Mudharabah</span>
                </label>
                {formLookingForSyirkah && (
                  <textarea
                    rows={2}
                    placeholder="Jelaskan kebutuhan modal, rencana ekspansi, serta skema estimasi nisbah bagi hasil..."
                    value={formSyirkahDetail}
                    onChange={(e) => setFormSyirkahDetail(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
                  />
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Daftarkan Usaha UMKM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
