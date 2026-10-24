import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Search,
  CheckCircle2,
  AlertTriangle,
  Heart,
  BookOpen,
  Youtube,
  Share2,
  Sparkles,
  Clock,
  Users,
  ChefHat,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  Flame,
  Globe,
  ExternalLink,
  Info,
  Check
} from 'lucide-react';

export interface HalalRecipe {
  id: string;
  title: string;
  category: string;
  area: string;
  thumbnail: string;
  instructions: string;
  youtubeUrl?: string;
  ingredients: { name: string; measure: string }[];
  isHalalVerified: boolean;
  halalNotes?: string;
  hasNonHalalIngredient: boolean;
  substitutedIngredients?: { original: string; substitute: string }[];
  prepTime?: string;
  servings?: string;
}

// Non-halal ingredient detection keywords & recommended substitutes
const NON_HALAL_KEYWORDS = [
  'pork', 'bacon', 'ham', 'lard', 'prosciutto', 'pancetta', 'salami',
  'wine', 'red wine', 'white wine', 'beer', 'rum', 'mirin', 'sake',
  'bourbon', 'brandy', 'sherry', 'cider', 'alcohol'
];

const HALAL_SUBSTITUTES_MAP: Record<string, string> = {
  'wine': 'Kaldu sapi/ayam + 1 sdm perasan jeruk nipis / cuka apel',
  'red wine': 'Jus anggur hitam tanpa gula / kaldu sapi pekat',
  'white wine': 'Kaldu ayam + perasan lemon / jus apel tanpa gula',
  'beer': 'Kaldu sapi / ginger ale tanpa alkohol',
  'mirin': '1 sdm jus apel + 1 sdt perasan lemon',
  'sake': 'Jus apel jernih + sedikit perasan lemon',
  'pork': 'Daging sapi segar / Daging kambing halal',
  'bacon': 'Daging sapi asap (Beef Bacon Halal)',
  'ham': 'Daging dada ayam asap / Daging sapi olahan halal',
  'lard': 'Minyak kelapa murni / Mentega (Butter) tersertifikasi Halal',
  'rum': 'Ekstrak vanila halal + jus nanas',
  'bourbon': 'Jus apel pekat + perasan lemon'
};

// Curated Halal Local & Middle Eastern recipes fallback/starter list
const CURATED_HALAL_RECIPES: HalalRecipe[] = [
  {
    id: 'curated-1',
    title: 'Nasi Kebuli Daging Kambing Rempah Arab ABDICity',
    category: 'Lamb & Rice',
    area: 'Middle Eastern / Indonesian',
    thumbnail: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
    prepTime: '45 menit',
    servings: '5-6 Porsi',
    instructions: `1. Tumis bumbu halus (bawang merah, bawang putih, jahe, kunyit) dengan minyak samin hingga harum.
2. Masukkan rempah utuh (kapulaga, cengkeh, kayu manis, pekak, dan jintan).
3. Masukkan potongan daging kambing, aduk hingga berubah warna.
4. Tuang air/santan encer, masak hingga daging kambing empuk dan bumbu meresap.
5. Masukkan beras basmati yang telah dicuci bersih dan direndam 20 menit.
6. Aduk rata, tambahkan kismis, kapulaga, dan minyak samin secukupnya.
7. Kukus/arug nasi hingga matang tanak. Sajikan dengan taburan kismis, kacang mete, dan acar timur tengah.`,
    ingredients: [
      { name: 'Beras Basmati', measure: '500 gram' },
      { name: 'Daging Kambing Paha (Halal)', measure: '600 gram' },
      { name: 'Minyak Samin Halal', measure: '3 sdm' },
      { name: 'Kapulaga Arab & Cengkeh', measure: '5 butir' },
      { name: 'Kayu Manis', measure: '2 batang' },
      { name: 'Bawang Merah & Putih Halus', measure: '10 siung' },
      { name: 'Kismis & Kacang Mete', measure: '50 gram' }
    ],
    isHalalVerified: true,
    hasNonHalalIngredient: false,
    halalNotes: '100% Bahan Halal Alami & Menggunakan Minyak Samin Tersertifikasi Halal MUI.'
  },
  {
    id: 'curated-2',
    title: 'Rendang Daging Sapi Minang Dapur Berkah',
    category: 'Beef',
    area: 'Indonesian',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    prepTime: '2.5 Jam',
    servings: '8 Porsi',
    instructions: `1. Haluskan cabai keriting, bawang merah, bawang putih, jahe, lengkuas, dan kunyit.
2. Didihkan santan kental bersama bumbu halus, daun kunyit, daun jeruk, dan serai di atas api sedang sambil terus diaduk agar santan tidak pecah.
3. Masukkan potongan daging sapi paha.
4. Kecilkan api, aduk perlahan hingga kuah santan menyusut menjadi kalio kecokelatan.
5. Terus aduk hingga minyak keluar dan rendang berubah warna menjadi hitam kecokelatan yang harum nikmat.`,
    ingredients: [
      { name: 'Daging Sapi Paha (Sertifikat Halal)', measure: '1 kg' },
      { name: 'Santan Kental Kelapa Asli', measure: '1.5 Liter' },
      { name: 'Cabai Merah Keriting', measure: '150 gram' },
      { name: 'Bawang Merah & Putih', measure: '15 siung' },
      { name: 'Lengkuas, Jahe & Serai', measure: '3 ruas' },
      { name: 'Daun Kunyit & Daun Jeruk Purut', measure: '3 lembar' }
    ],
    isHalalVerified: true,
    hasNonHalalIngredient: false,
    halalNotes: 'Resep tradisional warisan Nusantara 100% bebas pengawet & aman syariah.'
  },
  {
    id: 'curated-3',
    title: 'Ayam Bakar Madu Taliwang Halal Kaffah',
    category: 'Chicken',
    area: 'Indonesian',
    thumbnail: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    prepTime: '40 menit',
    servings: '4 Porsi',
    instructions: `1. Lumuri ayam kampung dengan perasan air jeruk nipis dan garam, diamkan 15 menit.
2. Tumis bumbu halus (cabai rawit, cabai merah, kencur, bawang merah, bawang putih, terasi bakar halal) hingga harum.
3. Masukkan ayam, tuangkan sedikit air dan santan encer. Ungkep hingga daging empuk dan air menyusut.
4. Tambahkan madu murni dan minyak kelapa pada sisa bumbu ungkepan.
5. Bakar ayam di atas arang/grill pan sambil diolesi bumbu madu hingga harum kecokelatan.`,
    ingredients: [
      { name: 'Ayam Kampung Utuh (Potong 4)', measure: '1 ekor' },
      { name: 'Madu Murni Tersertifikasi Halal', measure: '3 sdm' },
      { name: 'Kencur & Terasi Udang Halal', measure: '2 ruas / 1 sdt' },
      { name: 'Cabai Red & Bawang Merah', measure: '10 buah' },
      { name: 'Jeruk Nipis & Garam', measure: '2 buah' }
    ],
    isHalalVerified: true,
    hasNonHalalIngredient: false,
    halalNotes: 'Diolah dari ayam potong syar\'i dengan bumbu terasi udang tersertifikasi halal.'
  },
  {
    id: 'curated-4',
    title: 'Sup Iga Sapi Rempah Bening Penghangat Badan',
    category: 'Beef',
    area: 'Indonesian',
    thumbnail: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    prepTime: '60 menit',
    servings: '5 Porsi',
    instructions: `1. Rebus iga sapi dalam air mendidih selama 10 menit untuk membuang kotoran, buang air rebuasan pertama.
2. Rebus kembali iga dengan air bersih baru bersama pala, kayu manis, dan cengkeh hingga iga empuk juicy.
3. Tumis bawang putih dan bawang merah cincang dengan sedikit minyak sampai wangi, masukkan ke dalam kuah iga.
4. Masukkan potongan wortel dan kentang. Bumbui dengan garam, lada putih, dan kaldu jamur halal.
5. Taburi daun bawang, seledri, dan bawang goreng sebelum dihidangkan.`,
    ingredients: [
      { name: 'Iga Sapi Segar Potong (Halal)', measure: '750 gram' },
      { name: 'Wortel & Kentang', measure: '3 buah' },
      { name: 'Biji Pala & Kayu Manis', measure: '1/2 sdt' },
      { name: 'Bawang Putih & Bawang Merah', measure: '8 siung' },
      { name: 'Kaldu Jamur Halal & Lada Putih', measure: '1 sdt' }
    ],
    isHalalVerified: true,
    hasNonHalalIngredient: false,
    halalNotes: 'Sangat direkomendasikan untuk hidangan keluarga & acara kebersamaan jamaah.'
  }
];

export const HalalCulinaryRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<HalalRecipe[]>(CURATED_HALAL_RECIPES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Selected recipe for modal
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<HalalRecipe | null>(null);

  // Checked ingredients inside detail modal
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Favorites saved in localStorage
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_favorite_halal_recipes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['curated-1', 'curated-2'];
  });

  const [activeTab, setActiveTab] = useState<'explore' | 'favorites'>('explore');

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_favorite_halal_recipes', JSON.stringify(favoriteRecipeIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteRecipeIds]);

  const toggleFavoriteRecipe = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper to process meal item from TheMealDB and run Halal Verification checks
  const processMealFromApi = (meal: any): HalalRecipe => {
    const rawIngredients: { name: string; measure: string }[] = [];
    const detectedNonHalal: { original: string; substitute: string }[] = [];
    let containsNonHalal = false;

    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== '') {
        const cleanIng = ing.trim();
        const cleanMeasure = measure ? measure.trim() : '';
        rawIngredients.push({ name: cleanIng, measure: cleanMeasure });

        // Check against non-halal keywords
        const lowerIng = cleanIng.toLowerCase();
        for (const kw of NON_HALAL_KEYWORDS) {
          if (lowerIng.includes(kw)) {
            containsNonHalal = true;
            const sub = HALAL_SUBSTITUTES_MAP[kw] || 'Ganti dengan alternatif bahan tersertifikasi Halal';
            detectedNonHalal.push({ original: cleanIng, substitute: sub });
            break;
          }
        }
      }
    }

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory || 'General Halal',
      area: meal.strArea || 'International',
      thumbnail: meal.strMealThumb,
      instructions: meal.strInstructions || 'Petunjuk memasak lengkap tersedia pada video tutorial.',
      youtubeUrl: meal.strYoutube,
      ingredients: rawIngredients,
      isHalalVerified: !containsNonHalal,
      hasNonHalalIngredient: containsNonHalal,
      substitutedIngredients: detectedNonHalal,
      halalNotes: containsNonHalal
        ? `Perhatian: Resep asli mengandung bahan (${detectedNonHalal.map((d) => d.original).join(', ')}). Sistem telah menyediakan panduan substitusi halal!`
        : '100% Bebas dari kandungan non-halal (Babi/Alkohol) berdasarkan verifikasi otomatis.',
      prepTime: '25-35 menit',
      servings: '4 Porsi'
    };
  };

  // Fetch recipes from external API (TheMealDB)
  const fetchRecipesFromApi = async (query: string, categoryFilter?: string) => {
    setIsLoading(true);
    setApiError(null);

    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

      if (categoryFilter && categoryFilter !== 'Semua' && !query) {
        // Translate categories to API terms if needed
        let apiCat = categoryFilter;
        if (categoryFilter === 'Ayam') apiCat = 'Chicken';
        else if (categoryFilter === 'Daging Sapi') apiCat = 'Beef';
        else if (categoryFilter === 'Kambing') apiCat = 'Goat';
        else if (categoryFilter === 'Seafood') apiCat = 'Seafood';
        else if (categoryFilter === 'Vegetarian') apiCat = 'Vegetarian';
        else if (categoryFilter === 'Penutup') apiCat = 'Dessert';
        else if (categoryFilter === 'Pasta') apiCat = 'Pasta';

        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(apiCat)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.meals && Array.isArray(data.meals)) {
        // If results came from filter.php, they only have idMeal, strMeal, strMealThumb. Fetch full detail for top 8
        if (!data.meals[0].strInstructions) {
          const detailPromises = data.meals.slice(0, 8).map((m: any) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`).then((r) => r.json())
          );
          const detailResults = await Promise.all(detailPromises);
          const processed = detailResults
            .map((dr) => (dr.meals ? processMealFromApi(dr.meals[0]) : null))
            .filter(Boolean) as HalalRecipe[];

          setRecipes([...CURATED_HALAL_RECIPES, ...processed]);
        } else {
          const processed = data.meals.map(processMealFromApi);
          setRecipes([...CURATED_HALAL_RECIPES, ...processed]);
        }
      } else {
        // Fallback to curated if nothing found
        setRecipes(CURATED_HALAL_RECIPES);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setApiError('Gagal menghubungkan ke server resep external. Menampilkan resep lokal terkurasi.');
      setRecipes(CURATED_HALAL_RECIPES);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchRecipesFromApi(searchQuery.trim());
    } else {
      setRecipes(CURATED_HALAL_RECIPES);
    }
  };

  // Quick preset click
  const handlePresetClick = (term: string) => {
    setSearchQuery(term);
    fetchRecipesFromApi(term);
  };

  // Filter category click
  const handleCategorySelect = (catLabel: string) => {
    setActiveCategory(catLabel);
    if (catLabel === 'Semua') {
      setRecipes(CURATED_HALAL_RECIPES);
    } else {
      fetchRecipesFromApi('', catLabel);
    }
  };

  const favoriteRecipesList = recipes.filter((r) => favoriteRecipeIds.includes(r.id));

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-700 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-sm">
              <Utensils className="w-3.5 h-3.5 text-emerald-950" />
              <span>Dapur Berkah & Kuliner Halal Nusantara/Mancanegara</span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl font-serif text-amber-300 leading-tight">
              Pencarian Resep Kuliner Halal & Panduan Substitusi
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Jelajahi resep kuliner lezat tersertifikasi halal dari berbagai belahan dunia. Dilengkapi dengan pendeteksi otomatis bahan non-halal beserta solusi substitusi bahan syar'i.
            </p>
          </div>

          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/80 text-center space-y-1.5 min-w-[200px] shadow-lg">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
              Buku Resep Favorit
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-400 flex items-center justify-center gap-1.5">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>{favoriteRecipeIds.length} Resep Tersimpan</span>
            </div>
            <button
              onClick={() => setActiveTab(activeTab === 'explore' ? 'favorites' : 'explore')}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline block mx-auto pt-1 transition-all"
            >
              {activeTab === 'explore' ? 'Lihat Resep Favorit →' : '← Kembali ke Cari Resep'}
            </button>
          </div>
        </div>
      </div>

      {/* TABS: EXPLORE VS FAVORITES */}
      <div className="flex items-center justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>Jelajah Resep Halal ({recipes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Favorit Dapur Saya ({favoriteRecipeIds.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'explore' && (
        <div className="space-y-5">
          {/* SEARCH & QUICK CHIPS PANEL */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari resep halal (contoh: Rendang, Chicken Curry, Biryani, Bakso, Kebab)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setRecipes(CURATED_HALAL_RECIPES);
                    }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-amber-300" />
                )}
                <span>Cari Resep API</span>
              </button>
            </form>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                'Semua',
                'Ayam',
                'Daging Sapi',
                'Kambing',
                'Seafood',
                'Vegetarian',
                'Penutup',
                'Pasta'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-100 text-xs">
              <span className="text-[11px] text-gray-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pencarian Cepat Kuliner Populer:</span>
              </span>
              {[
                'Chicken Biryani',
                'Rendang',
                'Kebab',
                'Teriyaki',
                'Hummus',
                'Fish Curry',
                'Pasta Arrabbiata'
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handlePresetClick(term)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-medium text-[11px] px-2.5 py-1 rounded-lg border border-emerald-200 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {apiError && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl text-xs text-amber-950 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* RECIPES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => {
              const isFav = favoriteRecipeIds.includes(recipe.id);

              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-3xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={recipe.thumbnail}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-emerald-950/80 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-xs uppercase tracking-wider">
                        {recipe.category} • {recipe.area}
                      </span>

                      <button
                        onClick={(e) => toggleFavoriteRecipe(recipe.id, e)}
                        className={`p-2 rounded-full border transition-all ${
                          isFav
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                            : 'bg-black/40 text-white border-white/30 backdrop-blur-xs hover:bg-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold font-serif text-base text-white leading-tight drop-shadow-sm line-clamp-1">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Halal Verification Status Badge */}
                    {recipe.hasNonHalalIngredient ? (
                      <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-2xl text-[11px] text-amber-950 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>Panduan Substitusi Halal Diterapkan</span>
                        </div>
                        <p className="text-[10px] text-amber-900 leading-snug">
                          Terdapat bahan resep asli yang dialihkan ke substitusi halal syar'i.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl text-[11px] text-emerald-950 flex items-center gap-2 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>100% Bebas Bahan Non-Halal</span>
                      </div>
                    )}

                    {/* Quick Metadata */}
                    <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{recipe.prepTime || '30 menit'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{recipe.servings || '4 Porsi'}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono font-bold text-emerald-900">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>{recipe.ingredients.length} Bahan</span>
                      </span>
                    </div>

                    {/* Preview Ingredients */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">
                        Bahan Utama:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-800 text-[10px] px-2 py-0.5 rounded-md"
                          >
                            {ing.name}
                          </span>
                        ))}
                        {recipe.ingredients.length > 4 && (
                          <span className="text-[10px] text-emerald-800 font-bold self-center">
                            +{recipe.ingredients.length - 4} lagi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setSelectedRecipeModal(recipe)}
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ChefHat className="w-4 h-4 text-amber-300" />
                      <span>Lihat Resep & Langkah Memasak</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAVORITES VIEW */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
            <h3 className="font-bold text-emerald-950 font-serif text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Daftar Resep Halal Pilihan Anda</span>
            </h3>

            {favoriteRecipesList.length === 0 ? (
              <div className="text-center py-10 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200 space-y-3">
                <ChefHat className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-xs text-gray-600 font-medium">
                  Belum ada resep halal yang disimpan ke favorit.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                >
                  Cari & Simpan Resep
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteRecipesList.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center gap-4"
                  >
                    <img
                      src={recipe.thumbnail}
                      alt={recipe.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0 text-xs">
                      <span className="bg-emerald-200 text-emerald-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        {recipe.category}
                      </span>
                      <h4 className="font-bold text-emerald-950 font-serif text-sm truncate">
                        {recipe.title}
                      </h4>
                      <p className="text-gray-600 text-[11px]">
                        {recipe.ingredients.length} Bahan • {recipe.prepTime || '30 menit'}
                      </p>
                      <button
                        onClick={() => setSelectedRecipeModal(recipe)}
                        className="text-xs text-emerald-800 font-bold underline pt-1 block"
                      >
                        Buka Resep Memasak →
                      </button>
                    </div>

                    <button
                      onClick={() => toggleFavoriteRecipe(recipe.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Hapus dari Favorit"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipeModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-emerald-200 shadow-2xl p-6 relative overflow-hidden space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecipeModal(null)}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs text-gray-500 hover:text-gray-800 p-1.5 rounded-full z-10 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero Banner */}
            <div className="relative h-56 rounded-2xl overflow-hidden bg-gray-900 -mx-6 -mt-6">
              <img
                src={selectedRecipeModal.thumbnail}
                alt={selectedRecipeModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                    {selectedRecipeModal.category}
                  </span>
                  <span className="bg-emerald-900/90 text-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedRecipeModal.area} Cuisine
                  </span>
                </div>
                <h2 className="font-bold text-xl sm:text-2xl font-serif text-white">
                  {selectedRecipeModal.title}
                </h2>
              </div>
            </div>

            {/* Halal Verification Alert Box */}
            {selectedRecipeModal.hasNonHalalIngredient &&
            selectedRecipeModal.substitutedIngredients ? (
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>Panduan Substitusi Bahan Halal Terverifikasi</span>
                </div>
                <p className="text-amber-900">
                  Resep asli dari API mengandung bahan berisiko non-halal. Ikuti rekomendasi substitusi syar'i berikut:
                </p>
                <div className="space-y-1.5 pt-1">
                  {selectedRecipeModal.substitutedIngredients.map((sub, i) => (
                    <div
                      key={i}
                      className="bg-white p-2.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                    >
                      <span className="line-through text-red-600 font-medium">
                        Asli: {sub.original}
                      </span>
                      <span className="text-emerald-900 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Substitusi Halal: {sub.substitute}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-950 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <strong>Jaminan Kebersihan & Kehalalan Bahan:</strong>
                  <span className="block text-gray-700 text-[11px]">
                    {selectedRecipeModal.halalNotes ||
                      '100% Bebas kandungan non-halal berdasarkan verifikasi bahan otomatis.'}
                  </span>
                </div>
              </div>
            )}

            {/* Ingredients Checkist */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-950 text-sm font-serif flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Bahan & Takaran ({selectedRecipeModal.ingredients.length} items):</span>
                </strong>
                <span className="text-gray-500 text-[11px]">Centang bahan yang sudah siap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                {selectedRecipeModal.ingredients.map((ing, idx) => {
                  const key = `${selectedRecipeModal.id}-ing-${idx}`;
                  const isChecked = checkedIngredients[key] || false;

                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                          : 'bg-white hover:bg-emerald-50 text-gray-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setCheckedIngredients((prev) => ({
                            ...prev,
                            [key]: e.target.checked
                          }))
                        }
                        className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                      />
                      <span className="font-medium text-xs">{ing.name}</span>
                      {ing.measure && (
                        <span className="ml-auto text-[11px] font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {ing.measure}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-xs">
              <strong className="text-emerald-950 text-sm font-serif flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-emerald-700" />
                <span>Petunjuk Langkah Memasak:</span>
              </strong>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2 text-gray-800 leading-relaxed whitespace-pre-line font-serif">
                {selectedRecipeModal.instructions}
              </div>
            </div>

            {/* YouTube Link / Video Button if exists */}
            {selectedRecipeModal.youtubeUrl && (
              <div className="pt-1">
                <a
                  href={selectedRecipeModal.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Youtube className="w-5 h-5 text-white" />
                  <span>Tonton Video Panduan Memasak di YouTube</span>
                </a>
              </div>
            )}

            {/* Share to WA button */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Assalamu'alaikum Ibu-Ibu Majelis Taklim,\n\nBerikut resep kuliner halal lezat:\n*${selectedRecipeModal.title}*\n\nMari coba masak untuk keluarga atau acara Dapur Berkah Masjid!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Bagikan Resep ke Majelis Taklim WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
