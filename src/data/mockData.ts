import { QuranSurah, Mosque, UmkmBusiness, CampaignWaqf, KajianEvent, SyariahQuizQuestion, DailyHadith } from '../types';

export const SURAH_LIST: QuranSurah[] = [
  {
    number: 1,
    name: "الفاتحة",
    latinName: "Al-Fatihah",
    translatedName: "Pembukaan",
    numberOfAyahs: 7,
    revelationType: "Meccan",
    sampleAyahArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    sampleAyahLatin: "Bismillāhir-raḥmānir-raḥīm",
    sampleAyahTranslation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang."
  },
  {
    number: 2,
    name: "البقرة",
    latinName: "Al-Baqarah",
    translatedName: "Sapi Betina",
    numberOfAyahs: 286,
    revelationType: "Medinan",
    sampleAyahArabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    sampleAyahLatin: "Żālikal-kitābu lā raiba fīh, hudal lil-muttaqīn",
    sampleAyahTranslation: "Kitab (Al-Qur'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa."
  },
  {
    number: 3,
    name: "آل عمران",
    latinName: "Ali 'Imran",
    translatedName: "Keluarga 'Imran",
    numberOfAyahs: 200,
    revelationType: "Medinan",
    sampleAyahArabic: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ",
    sampleAyahLatin: "Syahidallāhu annahū lā ilāha illā huwa wal-malā'ikatu wa ulul-'ilm",
    sampleAyahTranslation: "Allah menyatakan bahwasanya tidak ada Tuhan melainkan Dia yang menegakkan keadilan, dan para malaikat serta orang-orang berilmu."
  },
  {
    number: 36,
    name: "يس",
    latinName: "Yasin",
    translatedName: "Yasin",
    numberOfAyahs: 83,
    revelationType: "Meccan",
    sampleAyahArabic: "يس ۚ وَالْقُرْآنِ الْحَكِيمِ ۚ إِنَّكَ لَمِنَ الْمُرْسَلِينَ",
    sampleAyahLatin: "Yā Sīn. Wal-qur'ānil-ḥakīm. Innaka laminal-mursalīn",
    sampleAyahTranslation: "Yasin. Demi Al-Qur'an yang penuh hikmah. Sungguh engkau adalah salah seorang dari rasul-rasul."
  },
  {
    number: 55,
    name: "الرحمن",
    latinName: "Ar-Rahman",
    translatedName: "Yang Maha Pemurah",
    numberOfAyahs: 78,
    revelationType: "Medinan",
    sampleAyahArabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    sampleAyahLatin: "Fa bi'ayyi ālā'i rabbikumā tukażżibān",
    sampleAyahTranslation: "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"
  },
  {
    number: 67,
    name: "الملك",
    latinName: "Al-Mulk",
    translatedName: "Kerajaan",
    numberOfAyahs: 30,
    revelationType: "Meccan",
    sampleAyahArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    sampleAyahLatin: "Tabārakallażī biyadihil-mulku wa huwa 'alā kulli syai'in qadīr",
    sampleAyahTranslation: "Maha Suci Allah yang di tangan-Nya lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu."
  },
  {
    number: 112,
    name: "الإخلاص",
    latinName: "Al-Ikhlas",
    translatedName: "Ikhlas",
    numberOfAyahs: 4,
    revelationType: "Meccan",
    sampleAyahArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۚ اللَّهُ الصَّمَدُ",
    sampleAyahLatin: "Qul huwallāhu aḥad. Allāhuṣ-ṣamad",
    sampleAyahTranslation: "Katakanlah: Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu."
  }
];

export const MOSQUE_LIST: Mosque[] = [
  {
    id: "m-1",
    name: "Masjid Agung Islamicity ABDICity Central",
    address: "Jl. Merdeka Dakwah No. 01, Pusat Kota",
    city: "Jakarta Pusat",
    lat: -6.175392,
    lng: 106.827153,
    distanceKm: 0.8,
    image: "https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80",
    capacity: 3500,
    facilities: ["AC Dingin", "Kipas Angin", "Area Parkir Luas", "Kantin Halal", "Perpustakaan Syariah", "Toilet Disabilitas"],
    hasAmbulance: true,
    hasFreeJumatMeal: true,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "KH. Prof. Dr. Ahmad Zaki, MA",
    imajJumatThisWeek: "Ustadz Hanif Al-Hafidz",
    cashBalance: 148500000,
    activeCampaigns: 3,
    contactPhone: "+62 812-3456-7890"
  },
  {
    id: "m-2",
    name: "Masjid Jami' Ar-Rahman Berjamaah",
    address: "Jl. Raya Syariah Kav. 12, Kompleks Hijrah",
    city: "Jakarta Selatan",
    lat: -6.229746,
    lng: 106.809712,
    distanceKm: 1.5,
    image: "https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=800&q=80",
    capacity: 1200,
    facilities: ["Pusat Zakat", "Koperasi Syariah", "Ambulans 24 Jam", "Area Wudhu Wanita Terpisah"],
    hasAmbulance: true,
    hasFreeJumatMeal: true,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "Ustadz Dr. Fathurrahman, Lc",
    imajJumatThisWeek: "Ustadz Salman Al-Farisi",
    cashBalance: 82000000,
    activeCampaigns: 2,
    contactPhone: "+62 813-8899-7711"
  },
  {
    id: "m-3",
    name: "Masjid Al-Barkah Bermuamalah",
    address: "Jl. Industri Halal No. 45",
    city: "Tangerang",
    lat: -6.178306,
    lng: 106.631889,
    distanceKm: 3.2,
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    capacity: 800,
    facilities: ["Pasar Subuh Jamaah", "Layanan Muamalah", "ATM Center", "Ruang Kajian Remaja"],
    hasAmbulance: false,
    hasFreeJumatMeal: true,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "Ustadz H. Abdullah Syukri, M.Ag",
    imajJumatThisWeek: "Ustadz Hilman Nulhakim",
    cashBalance: 45200000,
    activeCampaigns: 1,
    contactPhone: "+62 815-9000-1122"
  },
  {
    id: "m-4",
    name: "Masjid Istiqlal Syariah Hub",
    address: "Jl. Taman Wijaya Kusuma, Pasar Baru",
    city: "Jakarta Pusat",
    lat: -6.170200,
    lng: 106.831500,
    distanceKm: 2.1,
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    capacity: 10000,
    facilities: ["Pusat Konsultasi Syariah", "Akses Disabilitas", "E-Library", "Rest Area Musafir"],
    hasAmbulance: true,
    hasFreeJumatMeal: true,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "Prof. Dr. KH. Nasaruddin Umar, MA",
    imajJumatThisWeek: "Ustadz H. Husni Ismail",
    cashBalance: 320000000,
    activeCampaigns: 5,
    contactPhone: "+62 811-1223-344"
  },
  {
    id: "m-5",
    name: "Masjid Al-Azhar ABDICity Branch",
    address: "Jl. Sisingamangaraja, Kebayoran Baru",
    city: "Jakarta Selatan",
    lat: -6.235100,
    lng: 106.801200,
    distanceKm: 4.0,
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
    capacity: 2500,
    facilities: ["Auditorium Syariah", "Lapangan Olahraga", "Koperasi ZIS", "Klinik Gratis"],
    hasAmbulance: true,
    hasFreeJumatMeal: false,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "Ustadz Dr. Mukhlis Hanafi",
    imajJumatThisWeek: "Ustadz Muhammad Yasin",
    cashBalance: 110000000,
    activeCampaigns: 2,
    contactPhone: "+62 812-8877-6655"
  },
  {
    id: "m-6",
    name: "Masjid Agung Sultan Mahmud Badaruddin I Palembang",
    address: "Jl. Jend. Sudirman No. 1, 19 Ilir, Bukit Kecil",
    city: "Palembang",
    lat: -2.990930,
    lng: 104.756554,
    distanceKm: 1.2,
    image: "https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80",
    capacity: 9000,
    facilities: ["Menara Pandang", "Area Berwudhu Modern", "Kantin Halal Khas Palembang", "Pusat ZIS & Wakaf", "Ambulans 24 Jam"],
    hasAmbulance: true,
    hasFreeJumatMeal: true,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "KH. Nawawi Dencik Al-Hafidz",
    imajJumatThisWeek: "Ustadz H. Ahmad Syukri",
    cashBalance: 175000000,
    activeCampaigns: 4,
    contactPhone: "+62 711-354321"
  },
  {
    id: "m-7",
    name: "Masjid Dian Al-Mahri (Masjid Kubah Emas)",
    address: "Jl. Raya Meruyung, Cinere, Limo, Kota Depok",
    city: "Depok",
    lat: -6.383889,
    lng: 106.772500,
    distanceKm: 2.5,
    image: "https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80",
    capacity: 20000,
    facilities: ["Kubah Berlapis Emas", "Taman Asri & Parkir Luas", "Pusat ZIS & Baitul Mal", "Area Berwudhu Modern", "Ambulans 24 Jam"],
    hasAmbulance: true,
    hasFreeJumatMeal: true,
    hasAirConditioning: true,
    qhatibJumatThisWeek: "KH. Syarif Hidayatullah, MA",
    imajJumatThisWeek: "Ustadz H. Abdul Manaf",
    cashBalance: 215000000,
    activeCampaigns: 3,
    contactPhone: "+62 21-7788-9900"
  }
];

export const UMKM_LIST: UmkmBusiness[] = [
  {
    id: "u-1",
    name: "Ayam Penyet Sambal Hijau Syariah",
    category: "Kuliner Halal",
    ownerName: "H. Ridwan & Ibu Aisyah",
    address: "Ruko Halal Center Blok A No. 3, Jakarta",
    city: "Jakarta Pusat",
    mosqueAffiliation: "Masjid Agung Islamicity Central",
    rating: 4.9,
    reviewsCount: 128,
    halalCertNumber: "ID311100018920121",
    isVerifiedSyariah: true,
    description: "Kuliner resep warisan keluarga, bahan 100% segar & tersertifikasi Halal MUI, diproses sesuai kaidah penyembelihan syar'i.",
    featuredProducts: [
      { name: "Paket Ayam Penyet Komplit", price: 28000, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80" },
      { name: "Es Cendol Hijrah Nangka", price: 12000, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "6281299001122",
    lookingForSyirkah: true,
    syirkahDetail: "Membuka cabang baru di Depok. Membutuhkan mitra Mudharabah modal Rp 35.000.000 dengan bagi hasil 60:40."
  },
  {
    id: "u-2",
    name: "Koko & Gamis Syar'i Medina Wear",
    category: "Fashion Muslim",
    ownerName: "Ukhti Sarah & Akhi Fikri",
    address: "Jl. Busana Muslimah No. 88, Bandung",
    city: "Bandung",
    mosqueAffiliation: "Masjid Jami' Ar-Rahman Berjamaah",
    rating: 4.8,
    reviewsCount: 94,
    halalCertNumber: "ID32110002901009",
    isVerifiedSyariah: true,
    description: "Produsen busana muslim & muslimah elegan, nyaman, menutup aurat secara sempurna, bahan katun madinah premium.",
    featuredProducts: [
      { name: "Gamis Syar'i Set Khimar Premium", price: 245000, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80" },
      { name: "Baju Koko Modern Minimalis", price: 175000, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "6281377889900",
    lookingForSyirkah: false
  },
  {
    id: "u-3",
    name: "Jasa Konsultasi Keuangan & Pembukuan Syariah",
    category: "Jasa Keuangan Syariah",
    ownerName: "Drs. Ahmad Dahlan, SE, Ak, CA",
    address: "Gedung Syariah Tower Lt. 4, Jakarta",
    city: "Jakarta Selatan",
    mosqueAffiliation: "Masjid Al-Azhar ABDICity Branch",
    rating: 5.0,
    reviewsCount: 42,
    isVerifiedSyariah: true,
    description: "Membantu UMKM menyusun laporan keuangan syariah, audit akad, pendaftaran sertifikasi halal, dan zakat perusahaan.",
    featuredProducts: [
      { name: "Paket Pendampingan Sertifikasi Halal", price: 1500000, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
      { name: "Audit Akad & Laporan Keuangan Syariah", price: 2500000, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "6281122334455",
    lookingForSyirkah: true,
    syirkahDetail: "Mencari pengembang aplikasi finansial untuk kemitraan lisensi software akuntansi syariah."
  },
  {
    id: "u-4",
    name: "Herbal Thibbun Nabawi Al-Afiya",
    category: "Produk Herbal",
    ownerName: "Ustadz Usman Al-Habsyi",
    address: "Jl. Sehat Nabawi No. 12, Bekasi",
    city: "Bekasi",
    mosqueAffiliation: "Masjid Al-Barkah Bermuamalah",
    rating: 4.9,
    reviewsCount: 110,
    halalCertNumber: "ID31110003421008",
    isVerifiedSyariah: true,
    description: "Pusat ramuan herbal alami berbasis petunjuk Thibbun Nabawi, madu murni, habbatussauda, dan minyak zaitun Palestina.",
    featuredProducts: [
      { name: "Madu Murni Habbatussauda 500g", price: 85000, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80" },
      { name: "Sari Kurma Ajwa Madinah 350ml", price: 65000, image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "6281233445566",
    lookingForSyirkah: false
  },
  {
    id: "u-5",
    name: "Pustaka & Penerbitan Kitab Syariah",
    category: "Edukasi & Kitab",
    ownerName: "Ustadz Hilman Nulhakim, Lc",
    address: "Jl. Terusan Dakwah No. 05, Tangerang",
    city: "Tangerang",
    mosqueAffiliation: "Masjid Al-Barkah Bermuamalah",
    rating: 4.8,
    reviewsCount: 67,
    isVerifiedSyariah: true,
    description: "Penyedia mushaf Al-Qur'an terjemah, kitab gundul turats, modul fiqih muamalah, serta media edukasi anak shalih.",
    featuredProducts: [
      { name: "Al-Qur'an Hafalan Tajwid Warna A5", price: 95000, image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80" },
      { name: "Buku Panduan Fiqih Muamalah Ringkas", price: 55000, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "6281590001122",
    lookingForSyirkah: true,
    syirkahDetail: "Mencari mitra percetakan lokal untuk pencetakan 5.000 eksemplar modul TPA Anak."
  },
  {
    id: "u-6",
    name: "Koperasi BMT Bersama Jamaah Istiqlal",
    category: "Jasa Keuangan Syariah",
    ownerName: "H. Zulkifli & Pengurus DKM",
    address: "Area Kompleks Masjid Istiqlal, Jakarta",
    city: "Jakarta Pusat",
    mosqueAffiliation: "Masjid Istiqlal Syariah Hub",
    rating: 4.9,
    reviewsCount: 156,
    isVerifiedSyariah: true,
    description: "Baitul Maal wat Tamwil (BMT) binaan masjid pemberdaya usaha mikro jamaah tanpa bunga, simpan pinjam syariah & qardhul hasan.",
    featuredProducts: [
      { name: "Simpanan Wadiah Qardhul Hasan", price: 100000, image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80" },
      { name: "Pembiayaan Murabahah Usaha Mikro", price: 5000000, image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "628111223344",
    lookingForSyirkah: false
  },
  {
    id: "u-7",
    name: "Pempek Asli Palembang Berkah Halal",
    category: "Kuliner Halal",
    ownerName: "Cik Aisyah & H. M. Husni",
    address: "Jl. Merdeka No. 12, Ilir Barat, Palembang",
    city: "Palembang",
    mosqueAffiliation: "Masjid Agung Sultan Mahmud Badaruddin I Palembang",
    rating: 4.95,
    reviewsCount: 142,
    halalCertNumber: "ID16110004561023",
    isVerifiedSyariah: true,
    description: "Pempek asli ikan tenggiri segar khas Palembang, cuka gula batok linggau asli tanpa cuka kimia, 100% halal dan higienis bersertifikat MUI.",
    featuredProducts: [
      { name: "Paket Pempek Kapal Selam & Lenjer (Isi 10)", price: 65000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" },
      { name: "Pempek Crispy Kulit Tenggiri", price: 35000, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80" }
    ],
    contactWhatsapp: "6281273891022",
    lookingForSyirkah: true,
    syirkahDetail: "Membuka kemitraan distribusi beku (frozen food) di Jabodetabek dengan akad mudharabah bagi hasil 65:35."
  }
];

export const CAMPAIGN_LIST: CampaignWaqf[] = [
  {
    id: "c-1",
    title: "Pengadaan Ambulans Gratis Jamaah & Dhuafa",
    mosqueName: "Masjid Agung Islamicity Central",
    category: "Ambulans Gratis",
    targetAmount: 250000000,
    collectedAmount: 187500000,
    donorsCount: 412,
    deadlineDays: 14,
    imageUrl: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
    description: "Penyediaan armada ambulans siaga 24 jam gratis untuk antar jemput pasien dhuafa, jenazah, dan tanggap bencana."
  },
  {
    id: "c-2",
    title: "Program Wakaf 1.000 Al-Qur'an Hafalan Santri Pelosok",
    mosqueName: "Masjid Jami' Ar-Rahman Berjamaah",
    category: "Pengadaan Al-Qur'an",
    targetAmount: 50000000,
    collectedAmount: 42300000,
    donorsCount: 230,
    deadlineDays: 8,
    imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    description: "Membantu santri rumah tahfidz pelosok desa mendapatkan Mushaf Al-Qur'an hafalan tajwid berwarna yang layak."
  },
  {
    id: "c-3",
    title: "Infaq Makan Siang Berkah Jum'at 500 Porsi",
    mosqueName: "Masjid Al-Barkah Bermuamalah",
    category: "Makan Siang Berkah Jum'at",
    targetAmount: 10000000,
    collectedAmount: 10000000,
    donorsCount: 85,
    deadlineDays: 2,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Penyediaan hidangan prasmanan sehat untuk jamaah salat Jum'at, musafir, dan pekerja harian di sekitar masjid."
  }
];

export const KAJIAN_LIST: KajianEvent[] = [
  {
    id: "k-1",
    title: "Kajian Rutin Muamalah Syariah: Fiqih Jual Beli Modern & E-Commerce",
    speaker: "KH. Prof. Dr. Ahmad Zaki, MA",
    theme: "Bermuamalah Kaffah",
    mosqueName: "Masjid Agung Islamicity Central",
    date: "Sabtu Ini",
    time: "09:00 - 11:30 WIB",
    isLiveStream: true,
    streamUrl: "https://youtube.com/live/abdicity-stream",
    attendeesCount: 340
  },
  {
    id: "k-2",
    title: "Tabligh Akbar: Membangun Ekonomi Berjamaah Berbasis Masjid",
    speaker: "Ustadz Dr. Fathurrahman, Lc",
    theme: "Berjamaah & Bersyariah",
    mosqueName: "Masjid Jami' Ar-Rahman",
    date: "Ahad Pagi",
    time: "06:00 - 08:00 WIB",
    isLiveStream: true,
    attendeesCount: 520
  },
  {
    id: "k-3",
    title: "Workshop Keluarga Sakinah: Mendidik Anak Cinta Masjid & Al-Qur'an",
    speaker: "Ustadzah Fatimah Azzahra, M.Pd",
    theme: "Berdakwah dalam Keluarga",
    mosqueName: "Masjid Al-Barkah Bermuamalah",
    date: "Rabu Depan",
    time: "15:30 - 17:30 WIB",
    isLiveStream: false,
    attendeesCount: 180
  }
];

export const QUIZ_QUESTIONS: SyariahQuizQuestion[] = [
  {
    id: 1,
    question: "Manakah di antara berikut ini yang TERMASUK rukun jual beli dalam Fiqih Muamalah Syariah?",
    options: [
      "Penjual, Pembeli, Barang/Jasa, dan Ijab Qabul (Akad)",
      "Adanya modal awal minimal Rp 10 Juta",
      "Persetujuan dari lembaga perbankan konvensional",
      "Penggunaan stempel toko berwarna hijau"
    ],
    correctIndex: 0,
    explanation: "Rukun jual beli syariah mensyaratkan adanya Penjual (Bā'i'), Pembeli (Mushtarī), Barang/Jasa yang diperjualbelikan (Ma'qūd 'Alaih), dan Ijab Qabul (Shīghah)."
  },
  {
    id: 2,
    question: "Apa perbedaan mendasar antara akad Mudharabah dan Musyarakah?",
    options: [
      "Mudharabah 100% modal dari satu pihak (Shahibul Maal), sedangkan Musyarakah modal berasal dari gabungan para mitra",
      "Mudharabah khusus untuk usaha makanan, Musyarakah untuk pakaian",
      "Musyarakah tidak membutuhkan bagi hasil, Mudharabah wajib bagi hasil",
      "Mudharabah dilarang dalam Islam, Musyarakah diperbolehkan"
    ],
    correctIndex: 0,
    explanation: "Pada akad Mudharabah, pemilik modal menyetorkan 100% modal dan pengelola menjalankan usaha. Pada Musyarakah, kedua belah pihak sama-sama menyetor modal dan berbagi keuntungan/risiko secara proporsional."
  },
  {
    id: 3,
    question: "Berapa nisab Zakat Maal (Harta Simpanan) yang telah mengendap selama 1 haul (1 tahun Hijriah)?",
    options: [
      "Setara 85 gram emas murni",
      "Setara 10 gram emas murni",
      "Setara Rp 1.000.000",
      "Setara 5 ekor kambing"
    ],
    correctIndex: 0,
    explanation: "Nisab Zakat Maal menurut kesepakatan ulama adalah setara dengan harga 85 gram emas murni. Kadar zakat yang wajib dikeluarkan adalah 2,5%."
  }
];

export const HADITH_LIST: DailyHadith[] = [
  {
    id: 'h-1',
    narrator: 'HR. Bukhari No. 1 & Muslim No. 1907',
    book: 'Shahih Bukhari & Shahih Muslim',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: 'Sesungguhnya setiap amalan tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.',
    explanation: 'Niat adalah pondasi utama dalam setiap ibadah dan muamalah harian seorang Muslim agar bernilai pahala dan keikhlasan di sisi Allah SWT.',
    category: 'Keikhlasan & Niat',
    grade: 'Shahih'
  },
  {
    id: 'h-2',
    narrator: 'HR. Muslim No. 2699',
    book: 'Shahih Muslim',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: 'Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga.',
    explanation: 'Setiap langkah dan ikhtiar dalam mempelajari kebaikan agama maupun ilmu bermanfaat adalah investasi mulia menuju keridhaan Allah.',
    category: 'Menuntut Ilmu',
    grade: 'Shahih'
  },
  {
    id: 'h-3',
    narrator: 'HR. Tirmidzi No. 1956',
    book: 'Sunan At-Tirmidzi',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    translation: 'Senyummu di hadapan saudaramu adalah (bernilai) sedekah bagimu.',
    explanation: 'Kebaikan sederhana seperti menampilkan wajah ramah, ceria, dan penuh empati kepada sesama Muslim dihitung sebagai ibadah sedekah.',
    category: 'Akhlak & Sedekah',
    grade: 'Hasan Shahih'
  },
  {
    id: 'h-4',
    narrator: 'HR. Bukhari No. 13 & Muslim No. 45',
    book: 'Shahih Bukhari & Shahih Muslim',
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'Tidak sempurna iman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia mencintai untuk dirinya sendiri.',
    explanation: 'Puncak empati seorang mu\'min adalah saat ia menginginkan kebaikan, keselamatan, dan keberkahan bagi saudaranya sebagaimana untuk dirinya sendiri.',
    category: 'Ukhuwah & Empati',
    grade: 'Shahih'
  },
  {
    id: 'h-5',
    narrator: 'HR. Abu Daud No. 4941 & Tirmidzi No. 1924',
    book: 'Sunan Abi Daud',
    arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ',
    translation: 'Orang-orang yang penyayang akan disayangi oleh Ar-Rahman (Allah Yang Maha Penyayang). Sayangilah yang ada di bumi, niscaya yang ada di langit akan menyayangimu.',
    explanation: 'Menebar kasih sayang dan kepedulian sosial kepada sesama makhluk bumi akan membuka pintu-pintu rahmat dan ampunan dari Allah SWT.',
    category: 'Kasih Sayang & Rahmat',
    grade: 'Shahih'
  },
  {
    id: 'h-6',
    narrator: 'HR. Bukhari No. 2067 & Muslim No. 2557',
    book: 'Shahih Bukhari',
    arabic: 'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ',
    translation: 'Barangsiapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung tali silaturahmi.',
    explanation: 'Silaturahmi bukan sekadar menyapa, tapi membuka pintu keberkahan rezeki, kesehatan, dan umur yang melimpah amalan kebaikan.',
    category: 'Silaturahmi & Rezeki',
    grade: 'Shahih'
  },
  {
    id: 'h-7',
    narrator: 'HR. Bukhari No. 1429 & Muslim No. 1033',
    book: 'Shahih Bukhari & Shahih Muslim',
    arabic: 'الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى',
    translation: 'Tangan yang di atas (memberi) lebih baik daripada tangan yang di bawah (menerima).',
    explanation: 'Menjadi pendorong kebaikan yang rajin memberi, berinfaq, dan mandiri berdaya adalah posisi yang sangat dicintai oleh Allah SWT.',
    category: 'Sedekah & Kemandirian',
    grade: 'Shahih'
  },
  {
    id: 'h-8',
    narrator: 'HR. Bukhari No. 6018 & Muslim No. 47',
    book: 'Shahih Bukhari & Shahih Muslim',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: 'Barangsiapa yang beriman kepada Allah dan hari akhirat, hendaklah ia berkata yang baik atau diam.',
    explanation: 'Cerminan iman yang kokoh adalah kemampuan mengendalikan lisan dan tulisan di media sosial agar senantiasa membawa kebaikan.',
    category: 'Adab & Menjaga Lisan',
    grade: 'Shahih'
  }
];

