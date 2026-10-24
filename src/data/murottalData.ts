export interface MurottalSurah {
  number: number;
  nameArabic: string;
  latinName: string;
  meaning: string;
  ayahCount: number;
  revelation: 'Makkiyyah' | 'Madaniyyah';
  fadhilah: string;
  recommendedPrayer: 'Subuh' | 'Dzuhur' | 'Ashar' | 'Maghrib' | 'Isya' | 'Dhuha' | 'Kapan Saja';
  sampleAyahArabic: string;
  sampleAyahLatin: string;
  sampleAyahTranslation: string;
  durationApprox: string;
}

export interface MurottalQari {
  id: string;
  name: string;
  title: string;
  country: string;
  flag: string;
  styleDescription: string;
  avatar: string;
  audioUrlBuilder: (surahNumber: number) => string;
}

export interface PrayerMurottalConfig {
  autoPlayEnabled: boolean;
  playTiming: 'adzan_arrival' | 'tarhim_pre' | 'after_adzan';
  selectedQariId: string;
  prayerMapping: {
    Subuh: number;
    Dzuhur: number;
    Ashar: number;
    Maghrib: number;
    Isya: number;
  };
  prayerToggles: {
    Subuh: boolean;
    Dzuhur: boolean;
    Ashar: boolean;
    Maghrib: boolean;
    Isya: boolean;
  };
  volume: number;
}

export const MUROTTAL_QARI_LIST: MurottalQari[] = [
  {
    id: 'mishary',
    name: 'Syaikh Mishary Rashid Alafasy',
    title: 'Imam Masjid Agung Kuwait & Qari Internasional',
    country: 'Kuwait',
    flag: '🇰🇼',
    styleDescription: 'Lantunan tarteel khas merdu, pelafalan makhorijul huruf sangat jernih dan menenangkan jiwa.',
    avatar: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=200&q=80',
    audioUrlBuilder: (num: number) => {
      const padded = num.toString().padStart(3, '0');
      return `https://server8.mp3quran.net/afs/${padded}.mp3`;
    }
  },
  {
    id: 'sudais',
    name: 'Syaikh Abdurrahman As-Sudais',
    title: 'Imam Besar Masjidil Haram Makkah',
    country: 'Arab Saudi',
    flag: '🇸🇦',
    styleDescription: 'Irama khusyuk bertenaga khas Masjidil Haram, membangkitkan kerinduan pada Ka\'bah dan Baitullah.',
    avatar: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=200&q=80',
    audioUrlBuilder: (num: number) => {
      const padded = num.toString().padStart(3, '0');
      return `https://server11.mp3quran.net/sds/${padded}.mp3`;
    }
  },
  {
    id: 'ghamdi',
    name: 'Syaikh Saad Al-Ghamdi',
    title: 'Qari & Ulama Terkemuka Madinah Al-Munawwarah',
    country: 'Arab Saudi',
    flag: '🇸🇦',
    styleDescription: 'Lantunan lembut, santai, dan penuh penghayatan tadabbur ayat-ayat Al-Qur\'an.',
    avatar: 'https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=200&q=80',
    audioUrlBuilder: (num: number) => {
      const padded = num.toString().padStart(3, '0');
      return `https://server8.mp3quran.net/ghamdi/${padded}.mp3`;
    }
  },
  {
    id: 'dossari',
    name: 'Syaikh Yasser Ad-Dossari',
    title: 'Imam Masjidil Haram Makkah Al-Mukarramah',
    country: 'Arab Saudi',
    flag: '🇸🇦',
    styleDescription: 'Vokal emosional dengan dinamika nada tinggi yang menyentuh sanubari jamaah sholat.',
    avatar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=200&q=80',
    audioUrlBuilder: (num: number) => {
      const padded = num.toString().padStart(3, '0');
      return `https://server11.mp3quran.net/yasser/${padded}.mp3`;
    }
  },
  {
    id: 'shuraim',
    name: 'Syaikh Saud Asy-Syuraim',
    title: 'Mantan Imam & Khatib Masjidil Haram Makkah',
    country: 'Arab Saudi',
    flag: '🇸🇦',
    styleDescription: 'Lantunan mantap dengan ritme cepat bertempo teratur, penuh wibawa dan kekhusyukan.',
    avatar: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=200&q=80',
    audioUrlBuilder: (num: number) => {
      const padded = num.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/shur/${padded}.mp3`;
    }
  }
];

export const MUROTTAL_SURAHS: MurottalSurah[] = [
  {
    number: 1,
    nameArabic: "الفاتحة",
    latinName: "Al-Fatihah",
    meaning: "Pembukaan (Ummul Qur'an)",
    ayahCount: 7,
    revelation: "Makkiyyah",
    fadhilah: "Induk Al-Qur'an, rukun sholat utama, as-Syifa (penyembuh), dan doa munajat hamba kepada Allah SWT.",
    recommendedPrayer: "Kapan Saja",
    sampleAyahArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    sampleAyahLatin: "Bismillāhir-raḥmānir-raḥīm. Al-ḥamdu lillāhi rabbil-'ālamīn.",
    sampleAyahTranslation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam.",
    durationApprox: "01:15"
  },
  {
    number: 56,
    nameArabic: "الواقعة",
    latinName: "Al-Waqi'ah",
    meaning: "Hari Kiamat",
    ayahCount: 96,
    revelation: "Makkiyyah",
    fadhilah: "Disunnahkan dibaca waktu Subuh dan fajar sebagai ikhtiar keberkahan rezeki, penjauh kefakiran, dan refleksi akhirat.",
    recommendedPrayer: "Subuh",
    sampleAyahArabic: "إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَّافِعَةٌ",
    sampleAyahLatin: "Iżā waqa'atil-wāqi'ah. Laisa liwaq'atihā kāżibah. Khāfiḍatur rāfi'ah.",
    sampleAyahTranslation: "Apabila terjadi hari Kiamat, terjadinya tidak dapat didustakan. Kejadian itu merendahkan (satu golongan) dan meninggikan (golongan lain).",
    durationApprox: "08:45"
  },
  {
    number: 55,
    nameArabic: "الرحمن",
    latinName: "Ar-Rahman",
    meaning: "Yang Maha Pemurah",
    ayahCount: 78,
    revelation: "Madaniyyah",
    fadhilah: "Sangat menyejukkan kalbu di waktu Dzuhur, mengingatkan 31 kali nikmat agung Allah dan menumbuhkan rasa syukur mendalam.",
    recommendedPrayer: "Dzuhur",
    sampleAyahArabic: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ",
    sampleAyahLatin: "Ar-Raḥmān. 'Allamal-Qur'ān. Khalaqal-insān. 'Allamahul-bayān.",
    sampleAyahTranslation: "Tuhan Yang Maha Pemurah, Yang telah mengajarkan Al-Qur'an. Dia menciptakan manusia, mengajarnya pandai berbicara.",
    durationApprox: "09:30"
  },
  {
    number: 94,
    nameArabic: "الشرح",
    latinName: "Al-Insyirah",
    meaning: "Kelapangan Hati",
    ayahCount: 8,
    revelation: "Makkiyyah",
    fadhilah: "Penenteram kalbu saat lelah beraktivitas di waktu Ashar, janji pasti bahwa bersama kesulitan ada kemudahan berlipat ganda.",
    recommendedPrayer: "Ashar",
    sampleAyahArabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ الَّذِي أَنقَضَ ظَهْرَكَ",
    sampleAyahLatin: "A lam nasyraḥ laka ṣadrak. Wa waḍa'nā 'anka wizrak. Allażī anqaḍa ẓahrak.",
    sampleAyahTranslation: "Bukankah Kami telah melapangkan dadamu (Muhammad)? Dan Kami pun telah menurunkan bebanmu darimu, yang memberatkan punggungmu.",
    durationApprox: "01:20"
  },
  {
    number: 67,
    nameArabic: "الملك",
    latinName: "Al-Mulk",
    meaning: "Kerajaan",
    ayahCount: 30,
    revelation: "Makkiyyah",
    fadhilah: "Dianjurkan dibaca setiap malam (waktu Maghrib/Isya) sebagai perisai dan penyelamat dari siksa kubur serta pembawa syafaat.",
    recommendedPrayer: "Maghrib",
    sampleAyahArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    sampleAyahLatin: "Tabārakallażī biyadihil-mulku wa huwa 'alā kulli syai'in qadīr. Allażī khalaqal-mauta wal-ḥayāta liyabluwakum ayyukum aḥsanu 'amalā.",
    sampleAyahTranslation: "Maha Suci Allah yang di tangan-Nya lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu. Yang menciptakan mati dan hidup untuk menguji kamu siapa yang terbaik amalnya.",
    durationApprox: "06:50"
  },
  {
    number: 2,
    nameArabic: "البقرة",
    latinName: "Al-Baqarah",
    meaning: "Sapi Betina (Ayat Kursi & Khotimah)",
    ayahCount: 286,
    revelation: "Madaniyyah",
    fadhilah: "Pengusir setan dari rumah dan benteng perlindungan tertinggi, sangat disunnahkan dibaca setelah sholat Isya dan menjelang tidur malam.",
    recommendedPrayer: "Isya",
    sampleAyahArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    sampleAyahLatin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khużuhū sinatuw wa lā na'ūm.",
    sampleAyahTranslation: "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur.",
    durationApprox: "15:20"
  },
  {
    number: 36,
    nameArabic: "يس",
    latinName: "Yasin",
    meaning: "Yasin (Jantung Al-Qur'an)",
    ayahCount: 83,
    revelation: "Makkiyyah",
    fadhilah: "Jantung Al-Qur'an (Qalbul Qur'an), mempermudah segala urusan hamba dan mendatangkan ampunan Allah ketika dibaca dengan ikhlas.",
    recommendedPrayer: "Subuh",
    sampleAyahArabic: "يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ۝ عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
    sampleAyahLatin: "Yā Sīn. Wal-qur'ānil-ḥakīm. Innaka laminal-mursalīn. 'Alā ṣirāṭim mustaqīm.",
    sampleAyahTranslation: "Yasin. Demi Al-Qur'an yang penuh hikmah. Sungguh engkau (Muhammad) benar-benar salah seorang dari rasul-rasul, di atas jalan yang lurus.",
    durationApprox: "12:10"
  },
  {
    number: 18,
    nameArabic: "الكهف",
    latinName: "Al-Kahf",
    meaning: "Gua",
    ayahCount: 110,
    revelation: "Makkiyyah",
    fadhilah: "Memancarkan cahaya penerang di antara dua Jum'at dan membentengi seorang mukmin dari fitnah Dajjal.",
    recommendedPrayer: "Kapan Saja",
    sampleAyahArabic: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا",
    sampleAyahLatin: "Al-ḥamdu lillāhillażī anzala 'alā 'abdihil-kitāba wa lam yaj'al lahū 'iwajā.",
    sampleAyahTranslation: "Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur'an) kepada hamba-Nya dan tidak menjadikannya bengkok.",
    durationApprox: "18:40"
  },
  {
    number: 93,
    nameArabic: "الضحى",
    latinName: "Ad-Duha",
    meaning: "Waktu Duha",
    ayahCount: 11,
    revelation: "Makkiyyah",
    fadhilah: "Penawar kegelisahan dan keputusasaan, menguatkan keyakinan bahwa Allah tidak pernah meninggalkan hamba-Nya yang beriman.",
    recommendedPrayer: "Dhuha",
    sampleAyahArabic: "وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    sampleAyahLatin: "Waḍ-ḍuḥā. Wal-laili iżā sajā. Mā wadda'aka rabbuka wa mā qalā.",
    sampleAyahTranslation: "Demi waktu duha (ketika matahari naik sepenggalah), dan demi malam apabila telah sunyi, Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak pula membencimu.",
    durationApprox: "01:30"
  },
  {
    number: 103,
    nameArabic: "العصر",
    latinName: "Al-'Asr",
    meaning: "Masa / Waktu",
    ayahCount: 3,
    revelation: "Makkiyyah",
    fadhilah: "Peringatan agung akan nilai waktu manusia, saling berpesan dalam kebenaran dan kesabaran di waktu sholat Ashar.",
    recommendedPrayer: "Ashar",
    sampleAyahArabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    sampleAyahLatin: "Wal-'aṣr. Innal-insāna lafī khusr. Illallażīna āmanū wa 'amiluṣ-ṣāliḥāti wa tawāṣau bil-ḥaqqi wa tawāṣau biṣ-ṣabr.",
    sampleAyahTranslation: "Demi masa. Sungguh manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.",
    durationApprox: "00:45"
  },
  {
    number: 62,
    nameArabic: "الجمعة",
    latinName: "Al-Jumu'ah",
    meaning: "Hari Jum'at",
    ayahCount: 11,
    revelation: "Madaniyyah",
    fadhilah: "Seruan kewajiban sholat Jum'at berjamaah, meninggalkan perniagaan sesaat demi mengingat Allah SWT.",
    recommendedPrayer: "Dzuhur",
    sampleAyahArabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ",
    sampleAyahLatin: "Yā ayyuhallażīna āmanū iżā nūdiya liṣ-ṣalāti miy yaumil-jumu'ati fas'au ilā żikrillāhi wa żarul-baī'.",
    sampleAyahTranslation: "Wahai orang-orang yang beriman! Apabila telah diseru untuk melaksanakan sholat pada hari Jum'at, maka segeralah kamu mengingat Allah dan tinggalkanlah jual beli.",
    durationApprox: "03:40"
  },
  {
    number: 112,
    nameArabic: "الإخلاص",
    latinName: "Al-Ikhlas",
    meaning: "Memurnikan Ke-Esaan Allah",
    ayahCount: 4,
    revelation: "Makkiyyah",
    fadhilah: "Pahalanya setara dengan sepertiga Al-Qur'an, pondasi utama akidah tauhid seorang mukmin kaffah.",
    recommendedPrayer: "Kapan Saja",
    sampleAyahArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    sampleAyahLatin: "Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad.",
    sampleAyahTranslation: "Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. (Allah) tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia.",
    durationApprox: "00:40"
  },
  {
    number: 113,
    nameArabic: "الفلق",
    latinName: "Al-Falaq",
    meaning: "Waktu Subuh",
    ayahCount: 5,
    revelation: "Makkiyyah",
    fadhilah: "Doa perlindungan diri dari kejahatan malam, sihir, dan kedengkian makhluk di waktu subuh menjelang fajar.",
    recommendedPrayer: "Subuh",
    sampleAyahArabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    sampleAyahLatin: "Qul a'ūżu birabbil-falaq. Min syarri mā khalaq. Wa min syarri gāsiqin iżā waqab.",
    sampleAyahTranslation: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh (fajar), dari kejahatan makhluk yang Dia ciptakan, dan dari kejahatan malam apabila telah gelap gulita.",
    durationApprox: "00:45"
  },
  {
    number: 114,
    nameArabic: "الناس",
    latinName: "An-Nas",
    meaning: "Manusia",
    ayahCount: 6,
    revelation: "Makkiyyah",
    fadhilah: "Perisai penutup Al-Qur'an dari bisikan setan tersembunyi yang merusak kekhusyukan ibadah manusia.",
    recommendedPrayer: "Isya",
    sampleAyahArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    sampleAyahLatin: "Qul a'ūżu birabbin-nās. Malikin-nās. Ilāhin-nās. Min syarril-waswāsil-khannās.",
    sampleAyahTranslation: "Katakanlah: Aku berlindung kepada Tuhannya manusia, Raja manusia, Sembahan manusia, dari kejahatan (bisikan) setan yang bersembunyi.",
    durationApprox: "00:50"
  }
];

export const DEFAULT_PRAYER_MUROTTAL_CONFIG: PrayerMurottalConfig = {
  autoPlayEnabled: true,
  playTiming: 'adzan_arrival',
  selectedQariId: 'mishary',
  prayerMapping: {
    Subuh: 56,    // Al-Waqi'ah
    Dzuhur: 55,   // Ar-Rahman
    Ashar: 94,    // Al-Insyirah
    Maghrib: 67,  // Al-Mulk
    Isya: 2,      // Al-Baqarah (Ayat Kursi)
  },
  prayerToggles: {
    Subuh: true,
    Dzuhur: true,
    Ashar: true,
    Maghrib: true,
    Isya: true,
  },
  volume: 0.85
};
