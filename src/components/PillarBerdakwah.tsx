import React, { useState } from 'react';
import { SURAH_LIST, KAJIAN_LIST } from '../data/mockData';
import { QuranSurah, AIConsultMessage } from '../types';
import { BookOpen, Bot, Send, Sparkles, Image, Video, Play, Bookmark, Copy, Check, Share2, MessageCircle, Calendar, RefreshCw, Quote, Flame } from 'lucide-react';
import { HaditsHarianWidget } from './HaditsHarianWidget';
import { DailyIbadahTracker } from './DailyIbadahTracker';

interface PillarBerdakwahProps {
  onOpenInfaqModal?: (title?: string, amount?: number) => void;
}

export const PillarBerdakwah: React.FC<PillarBerdakwahProps> = ({ onOpenInfaqModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ibadah-tracker' | 'hadits-harian' | 'ai-ustadz' | 'quran' | 'poster-generator' | 'kajian'>('ibadah-tracker');

  // AI Ustadz Chat State
  const [chatMessages, setChatMessages] = useState<AIConsultMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh. Saya Ustadz AI ABDICity, siap membantu konsultasi seputar Fiqih, Ibadah, Dakwah, dan Kehidupan Islami 4B Kaffah. Apa yang ingin Anda tanyakan hari ini?',
      timestamp: '10:00'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loadingConsult, setLoadingConsult] = useState(false);

  // Quran Explorer State
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(SURAH_LIST[0]);
  const [quranSearch, setQuranSearch] = useState('');

  // Poster Generator State
  const [posterTopic, setPosterTopic] = useState('');
  const [posterAudience, setPosterAudience] = useState('Jamaah Remaja & Pemuda');
  const [loadingPoster, setLoadingPoster] = useState(false);
  const [generatedPoster, setGeneratedPoster] = useState<{
    judul?: string;
    ayatAtauHadits?: string;
    terjemahan?: string;
    poinInspirasi?: string[];
    callToAction?: string;
    saranDesainTheme?: string;
  } | null>(null);

  const [copiedPoster, setCopiedPoster] = useState(false);

  // Suggested Prompts
  const samplePrompts = [
    "Bagaimana adab berdakwah yang santun di era digital?",
    "Penjelasan ringkas konsep 4B Kaffah (Berdakwah, Bersyariah, Berjamaah, Bermuamalah)",
    "Hukum dan keutamaan sedekah subuh berantai",
    "Tips istiqamah sholat berfluktuasi saat sibuk kerja"
  ];

  // Send Chat to Gemini
  const handleSendConsult = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loadingConsult) return;

    const userMsg: AIConsultMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setLoadingConsult(true);

    try {
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, category: 'Berdakwah' })
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: AIConsultMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: AIConsultMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Mohon maaf, terjadi kendala koneksi: ${err.message || 'Gagal memproses pertanyaan'}. Silakan coba lagi.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoadingConsult(false);
    }
  };

  // Generate Poster Content
  const handleGeneratePoster = async () => {
    if (!posterTopic.trim() || loadingPoster) return;
    setLoadingPoster(true);

    try {
      const res = await fetch('/api/gemini/poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: posterTopic, targetAudience: posterAudience })
      });
      const data = await res.json();
      setGeneratedPoster(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPoster(false);
    }
  };

  const filteredSurahs = SURAH_LIST.filter(
    (s) =>
      s.latinName.toLowerCase().includes(quranSearch.toLowerCase()) ||
      s.translatedName.toLowerCase().includes(quranSearch.toLowerCase()) ||
      s.number.toString() === quranSearch
  );

  return (
    <div className="space-y-8">
      {/* Subtab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('ibadah-tracker')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'ibadah-tracker'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Tracker Ibadah Harian</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hadits-harian')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'hadits-harian'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Quote className="w-4 h-4 text-amber-400" />
            <span>Hadits Harian</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ai-ustadz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'ai-ustadz'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Tanya AI Ustadz ABDICity</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quran')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'quran'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Al-Qur'an Digital Kaffah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('poster-generator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'poster-generator'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Image className="w-4 h-4 text-amber-400" />
            <span>AI Story & Poster Dakwah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('kajian')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'kajian'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Video className="w-4 h-4 text-teal-400" />
            <span>Agenda Kajian Live</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 0: DAILY IBADAH TRACKER */}
      {activeSubTab === 'ibadah-tracker' && (
        <DailyIbadahTracker
          onOpenInfaqModal={onOpenInfaqModal}
          onNavigateToQuran={() => setActiveSubTab('quran')}
        />
      )}

      {/* SUBTAB 1: HADITS HARIAN WIDGET */}
      {activeSubTab === 'hadits-harian' && (
        <div className="space-y-6">
          <HaditsHarianWidget
            onNavigateToPoster={(topic) => {
              setPosterTopic(topic);
              setActiveSubTab('poster-generator');
            }}
          />
        </div>
      )}

      {/* TAB 1: AI USTADZ CONSULTATION */}
      {activeSubTab === 'ai-ustadz' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden flex flex-col min-h-[550px]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-4 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    Ustadz AI ABDICity <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">Gemini 3.6 Flash</span>
                  </h3>
                  <p className="text-xs text-emerald-200">Asisten Konsultasi Fiqih, Ibadah & Dakwah 4B</p>
                </div>
              </div>

              <button
                onClick={() => setChatMessages([chatMessages[0]])}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/60 rounded-xl transition-colors text-xs flex items-center gap-1"
                title="Reset Percakapan"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-emerald-50/20 max-h-[420px]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center flex-shrink-0 text-white mt-1 shadow-sm">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-800 text-white rounded-br-none shadow-md'
                        : 'bg-white text-gray-800 rounded-bl-none border border-emerald-100 shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {loadingConsult && (
                <div className="flex gap-3 items-center text-emerald-700 text-xs font-medium bg-emerald-100/60 p-3 rounded-2xl w-max border border-emerald-200 animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>Ustadz AI sedang menyusun dalil & riwayat jawaban...</span>
                </div>
              )}
            </div>

            {/* Prompt Chips */}
            <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 overflow-x-auto">
              <div className="text-[11px] font-semibold text-emerald-900 mb-1.5 flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>Rekomendasi Topik Pertanyaan:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendConsult(p)}
                    className="text-xs bg-white text-emerald-800 border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100/50 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all shadow-2xs"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3.5 bg-white border-t border-emerald-100 flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendConsult()}
                placeholder="Tanyakan masalah Fiqih, Ibadah, atau Dakwah Islami..."
                className="flex-1 bg-emerald-50/40 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
              <button
                onClick={() => handleSendConsult()}
                disabled={loadingConsult || !inputPrompt.trim()}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold p-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center min-w-[44px]"
              >
                <Send className="w-4 h-4 text-amber-300" />
              </button>
            </div>

          </div>

          {/* Right Column: Dakwah Info Card */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl border border-emerald-800 shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <h4 className="font-bold text-lg font-serif text-amber-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Prinsip Berdakwah 4B
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                Berdakwah di ABDICity mengusung semangat hikmah, keteladanan, dan ilmu yang bersumber shahih dari Al-Qur'an & As-Sunnah.
              </p>
              <ul className="space-y-2 text-xs text-emerald-200">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span><strong>Bil Hikmah:</strong> Penyampaian yang lemah lembut dan penuh kearifan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span><strong>Mau'izhah Hasanah:</strong> Nasihat yang menyejukkan hati jamaah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span><strong>Mujadalah Ahsan:</strong> Diskusi terbaik tanpa memicu perpecahan.</span>
                </li>
              </ul>
            </div>

            {/* Ayat Pilihan */}
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                Keutamaan Ilmu & Dakwah
              </span>
              <p className="font-serif text-right text-base font-bold text-emerald-950 my-3 leading-loose">
                مَنْ دَعَا إِلَى هُدًى كَانَ لَهُ مِنَ الأَجْرِ مِثْلُ أُجُورِ مَنْ تَبِعَهُ
              </p>
              <p className="text-xs text-gray-700 italic">
                "Barangsiapa mengajak kepada kebaikan, maka ia mendapatkan pahala seperti pahala orang-orang yang mengikutinya..." (HR. Muslim)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL QURAN */}
      {activeSubTab === 'quran' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Surah Selection List */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-emerald-100 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-950 font-serif text-lg">Daftar Surah Pilihan</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                {SURAH_LIST.length} Surah
              </span>
            </div>

            <input
              type="text"
              placeholder="Cari Surah (contoh: Yasin, Al-Baqarah)..."
              value={quranSearch}
              onChange={(e) => setQuranSearch(e.target.value)}
              className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
            />

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.number}
                  onClick={() => setSelectedSurah(surah)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                    selectedSurah.number === surah.number
                      ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white border-emerald-700 shadow-md'
                      : 'bg-emerald-50/30 text-gray-800 border-emerald-100 hover:bg-emerald-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl font-bold font-mono text-xs flex items-center justify-center ${
                        selectedSurah.number === surah.number
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {surah.number}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{surah.latinName}</h4>
                      <p className={`text-[11px] ${selectedSurah.number === surah.number ? 'text-emerald-200' : 'text-gray-500'}`}>
                        {surah.translatedName} • {surah.numberOfAyahs} Ayat
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-lg block">{surah.name}</span>
                    <span className="text-[10px] opacity-80">{surah.revelationType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surah Detail View */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl text-white shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-widest">Surah Ke-{selectedSurah.number}</span>
                  <h3 className="text-2xl font-bold font-serif text-white mt-1">{selectedSurah.latinName} ({selectedSurah.name})</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">{selectedSurah.translatedName} • {selectedSurah.numberOfAyahs} Ayat • {selectedSurah.revelationType}</p>
                </div>
                <button
                  onClick={() => alert(`Memutar murottal Surah ${selectedSurah.latinName}`)}
                  className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center shadow-lg transition-transform transform active:scale-95"
                  title="Putar Audio Surah"
                >
                  <Play className="w-6 h-6 ml-1 fill-emerald-950" />
                </button>
              </div>

              {/* Sample Ayah Highlight */}
              <div className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold border-b border-emerald-200 pb-2">
                  <span className="bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-mono">Ayat Utama</span>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Bookmark className="w-4 h-4 cursor-pointer hover:text-emerald-700" />
                    <Share2 className="w-4 h-4 cursor-pointer hover:text-emerald-700" />
                  </div>
                </div>

                <p className="text-right font-serif text-2xl font-bold text-emerald-950 leading-loose tracking-wide">
                  {selectedSurah.sampleAyahArabic}
                </p>

                <p className="text-xs font-semibold text-emerald-700 italic">
                  "{selectedSurah.sampleAyahLatin}"
                </p>

                <p className="text-sm text-gray-800 leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                  "{selectedSurah.sampleAyahTranslation}"
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Tafsir & Tadabbur AI:</strong> Dapatkan penjelasan mendalam per-ayat dengan menanyakan langsung ke Ustadz AI ABDICity di menu Tab sebelah.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI POSTER & STORY DAKWAH GENERATOR */}
      {activeSubTab === 'poster-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-5">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-xl flex items-center gap-2">
                <Image className="w-5 h-5 text-amber-500" /> Generasi Content & Story Dakwah
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Buat materi poster & ucapan hikmah Islami otomatis bertenaga AI Gemini untuk dibagikan ke WhatsApp Group, Instagram, atau Jamaah Masjid.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Topik Pesan Dakwah:</label>
                <input
                  type="text"
                  placeholder="Contoh: Keutamaan Sedekah Subuh, Adab Kepada Orang Tua, Menjaga Lisan"
                  value={posterTopic}
                  onChange={(e) => setPosterTopic(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Sasaran Audiens Jamaah:</label>
                <select
                  value={posterAudience}
                  onChange={(e) => setPosterAudience(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Jamaah Remaja & Pemuda">Jamaah Remaja & Pemuda Hijrah</option>
                  <option value="Keluarga & Orang Tua">Keluarga & Orang Tua</option>
                  <option value="Pengusaha & Pelaku Bisnis">Pengusaha & Pelaku Bisnis Syariah</option>
                  <option value="Masyarakat Umum">Masyarakat Umum & Pekerja</option>
                </select>
              </div>

              <button
                onClick={handleGeneratePoster}
                disabled={loadingPoster || !posterTopic.trim()}
                className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
              >
                {loadingPoster ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>AI Sedang Menyusun Kata & Visual...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Buat Poster Dakwah Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Poster Card Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {generatedPoster ? (
              <div className="w-full max-w-md bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white p-7 rounded-3xl border-2 border-amber-400/60 shadow-2xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                    ABDICity.cloud • Story Dakwah
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">Theme: {generatedPoster.saranDesainTheme}</span>
                </div>

                {/* Judul & Content */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold font-serif text-amber-200 leading-tight">
                    {generatedPoster.judul}
                  </h3>

                  {generatedPoster.ayatAtauHadits && (
                    <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/60">
                      <p className="font-serif text-base text-amber-100 font-bold leading-relaxed mb-2">
                        {generatedPoster.ayatAtauHadits}
                      </p>
                      <p className="text-xs text-emerald-200 italic font-sans">
                        "{generatedPoster.terjemahan}"
                      </p>
                    </div>
                  )}

                  {generatedPoster.poinInspirasi && (
                    <div className="text-left bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800 space-y-1.5 text-xs text-emerald-100">
                      <span className="font-bold text-amber-300 block mb-1">Hikmah & Poin Kunci:</span>
                      {generatedPoster.poinInspirasi.map((poin, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{poin}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {generatedPoster.callToAction && (
                    <div className="pt-2 text-xs font-bold text-amber-300 bg-amber-500/10 py-2 rounded-xl border border-amber-500/20">
                      {generatedPoster.callToAction}
                    </div>
                  )}
                </div>

                {/* Footer Copy CTA */}
                <div className="pt-2 flex items-center justify-between border-t border-emerald-800 text-xs">
                  <span className="text-emerald-400 font-medium">#BerdakwahKaffah #ABDICity</span>
                  <button
                    onClick={() => {
                      const txt = `${generatedPoster.judul}\n\n"${generatedPoster.ayatAtauHadits}"\n${generatedPoster.terjemahan}\n\n${generatedPoster.callToAction}\n\nVia ABDICity.cloud`;
                      navigator.clipboard.writeText(txt);
                      setCopiedPoster(true);
                      setTimeout(() => setCopiedPoster(false), 2000);
                    }}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-1.5 rounded-lg shadow-md transition-all text-xs"
                  >
                    {copiedPoster ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPoster ? "Tersalin!" : "Salin Pesan"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-emerald-300 text-emerald-800 space-y-3 w-full">
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-base">Materi Poster Dakwah Belum Dibuat</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Ketik topik di panel sebelah kiri dan klik "Buat Poster Dakwah" untuk menghasilkan poster & kata hikmah otomatis.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: KAJIAN AGENDA */}
      {activeSubTab === 'kajian' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-xl">Agenda Kajian & Live Streaming Dakwah</h3>
              <p className="text-xs text-gray-600">Ikuti majelis ilmu rutin masjid se-network ABDICity.cloud</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KAJIAN_LIST.map((k) => (
              <div key={k.id} className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                      {k.theme}
                    </span>
                    {k.isLiveStream && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" /> Live Stream
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-emerald-950 text-base leading-snug">{k.title}</h4>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <p className="font-semibold text-emerald-800">Pemateri: {k.speaker}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> {k.date} • {k.time}</p>
                    <p className="text-gray-500">Lokasi: {k.mosqueName}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{k.attendeesCount} Jamaah Terdaftar</span>
                  <button
                    onClick={() => alert(`Pengingat kajian "${k.title}" berhasil diaktifkan!`)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
                  >
                    Ingatkan Saya
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
