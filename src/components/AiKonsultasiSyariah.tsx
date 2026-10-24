import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  RefreshCw,
  Share2,
  Trash2,
  Heart,
  HelpCircle,
  Volume2,
  VolumeX,
  ChevronRight,
  AlertCircle,
  Briefcase,
  Sun
} from 'lucide-react';

interface ConsultationMessage {
  id: string;
  sender: 'user' | 'ustadz';
  category: string;
  text: string;
  timestamp: string;
  isSaved?: boolean;
}

interface AiKonsultasiSyariahProps {
  onOpenInfaqModal: (campaignTitle?: string, presetAmount?: number) => void;
}

const CATEGORIES = [
  'Fiqih Muamalah & Bisnis',
  'Ibadah & Kehidupan Sehari-hari',
  'Keuangan & Investasi Syariah',
  'Hukum Zakat & Infaq',
  'Pernikahan & Keluarga',
  'Gaya Hidup & Makanan Halal'
];

const PRESET_QUESTIONS: { [key: string]: string[] } = {
  'Fiqih Muamalah & Bisnis': [
    'Bagaimana hukum jual beli online dengan sistem Dropshipping & Reseller menurut Fiqih Muamalah?',
    'Apa syarat sah akad Mudharabah & Musyarakah agar terhindar dari gharar dan riba?',
    'Bagaimana ketentuan pengembalian cacat barang (Khiyar Aib) dalam etika perdagangan syariah?',
    'Apakah skema komisi afiliasi (Affiliate Marketing) dan PPOB sesuai syariat?'
  ],
  'Ibadah & Kehidupan Sehari-hari': [
    'Bagaimana cara mengqadha salat fardhu yang terlewat karena ketidaksengajaan atau pekerjaan?',
    'Apa saja syarat sah Salat Jamak & Qashar bagi musafir dalam perjalanan bisnis?',
    'Bagaimana hukum pekerja yang tidak sempat salat Jumat karena tugas darurat?',
    'Apa amalan dzikir dan wirid harian yang dianjurkan untuk keberkahan rizki?'
  ],
  'Keuangan & Investasi Syariah': [
    'Bagaimana perbedaan utama bunga bank konvensional dengan bagi hasil Bank Syariah?',
    'Bagaimana hukum investasi saham, reksadana syariah, dan crypto currency dalam Islam?',
    'Bagaimana cara memisahkan dan membersihkan (Cleansing) harta dari pendapatan syubhat?',
    'Bagaimana hukum transaksi bayar nanti (PayLater) dan pinjaman online syariah?'
  ],
  'Hukum Zakat & Infaq': [
    'Bagaimana cara menghitung zakat penghasilan profesi dan bonus tahunan?',
    'Apakah aset rumah pribadi atau kendaraan operasional wajib dikeluarkan zakat maal-nya?',
    'Siapa saja 8 golongan (Asnaf) yang paling berhak menerima manfaat penyaluran zakat?',
    'Bagaimana keutamaan Infaq Subuh dan Sedekah Jariyah untuk pembangunan masjid?'
  ],
  'Pernikahan & Keluarga': [
    'Bagaimana pedoman tata cara pembagian harta waris (Faraidh) secara adil dan islami?',
    'Apa saja rukun dan syarat sah pernikahan dalam Islam yang wajib dipenuhi?',
    'Bagaimana membina keluarga Sakinah, Mawaddah, Warahmah di tengah tantangan era digital?'
  ],
  'Gaya Hidup & Makanan Halal': [
    'Bagaimana cara mengidentifikasi titik kritis kehalalan produk makanan dan obat-obatan?',
    'Apakah masakan yang menggunakan alkohol/arak masak tetap haram walau sudah menguap?',
    'Bagaimana standar penyembelihan hewan halal menurut fatwa MUI?'
  ]
};

export const AiKonsultasiSyariah: React.FC<AiKonsultasiSyariahProps> = ({ onOpenInfaqModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Fiqih Muamalah & Bisnis');
  const [promptInput, setPromptInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [savedConsultations, setSavedConsultations] = useState<ConsultationMessage[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_saved_consultations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved consultations', e);
    }
    return [];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'ustadz',
          category: 'Umum',
          text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di **AI Syariah Consultant ABDICity**. Saya adalah asisten Konsultan Syariah AI yang siap membantu menjawab pertanyaan Anda seputar Fiqih Ibadah Kehidupan Sehari-hari, Hukum Muamalah Bisnis, Zakat, Keuangan Syariah, dan Kehidupan Islami berbasis Gemini 3.6 Flash dengan rujukan Al-Qur'an dan As-Sunnah.\n\nSilakan pilih topik di bawah ini atau ketikkan pertanyaan Anda secara langsung.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Sync saved consultations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_saved_consultations', JSON.stringify(savedConsultations));
    } catch (e) {
      console.error('Failed to save consultations', e);
    }
  }, [savedConsultations]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendConsultation = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptInput;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ConsultationMessage = {
      id: userMsgId,
      sender: 'user',
      category: selectedCategory,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPromptInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          category: selectedCategory
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses jawaban dari Ustadz AI');
      }

      const ustadzMsg: ConsultationMessage = {
        id: `ustadz-${Date.now()}`,
        sender: 'ustadz',
        category: selectedCategory,
        text: data.response || 'Mohon maaf, tidak dapat menghasilkan jawaban saat ini.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, ustadzMsg]);
    } catch (err: any) {
      const errorMsg: ConsultationMessage = {
        id: `err-${Date.now()}`,
        sender: 'ustadz',
        category: selectedCategory,
        text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nMohon maaf, kendala teknis terjadi: ${err.message || 'Gagal tersambung ke layanan Gemini AI'}. Silakan pastikan GEMINI_API_KEY dikonfigurasi di menu Secrets.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveConsultation = (msg: ConsultationMessage) => {
    setSavedConsultations((prev) => {
      const exists = prev.some((item) => item.id === msg.id);
      if (exists) {
        return prev.filter((item) => item.id !== msg.id);
      } else {
        return [{ ...msg, isSaved: true }, ...prev];
      }
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTextToSpeech = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Gemini 3.6 Flash
              </span>
              <h2 className="font-bold text-xl sm:text-2xl font-serif text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" /> AI Syariah Consultant ABDICity
              </h2>
            </div>
            <p className="text-xs text-emerald-200 max-w-2xl">
              Konsultan Hukum Islam & Fiqih Muamalah Interaktif: Solusi syariah untuk persoalan bisnis, perdagangan, ibadah harian, dan gaya hidup halal.
            </p>
          </div>

          <button
            onClick={() => onOpenInfaqModal('Infaq Pengembangan AI Dakwah ABDICity', 50000)}
            className="bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-600 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap self-start sm:self-center"
          >
            <Heart className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Dukung AI Dakwah</span>
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60 text-[11px] text-emerald-200 flex items-start gap-2 relative z-10">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Panduan Etika Syariah:</strong> Jawaban dirumuskan berdasarkan Al-Qur'an, Hadits Shahih, dan Fatwa MUI/Lembaga Fiqih Internasional. Untuk keputusan hukum mengikat, jamaah tetap disarankan berkonsultasi langsung dengan Dewan Syariah / Ulama DKM.
          </span>
        </div>
      </div>

      {/* Category Selection Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
        <span className="text-xs font-bold text-emerald-950 px-1 block flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-500" /> Pilih Domain Konsultasi Syariah:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Area (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-emerald-100 shadow-lg flex flex-col h-[620px] overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-emerald-50/20 via-white to-emerald-50/10">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSaved = savedConsultations.some((s) => s.id === msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-bold text-gray-400">{msg.timestamp}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                      {msg.category}
                    </span>
                  </div>

                  <div
                    className={`max-w-[88%] rounded-3xl p-4 sm:p-5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-800 text-white rounded-tr-none'
                        : 'bg-white border-2 border-emerald-100 text-gray-800 rounded-tl-none border-l-4 border-l-amber-400'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs shadow-sm">
                          🕌
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-950 font-serif text-xs">Konsultan Syariah AI</h4>
                          <span className="text-[9px] text-emerald-600 block">Gemini 3.6 Flash • Rujukan Fiqih Islam Kaffah</span>
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-line font-normal space-y-2">
                      {msg.text}
                    </div>

                    {!isUser && (
                      <div className="pt-3 mt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="hover:text-emerald-950 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all text-[11px]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => toggleSaveConsultation(msg)}
                            className={`font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                              isSaved
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                                <span>Tersimpan</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Simpan</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleTextToSpeech(msg.text, msg.id)}
                            className={`font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                              speakingId === msg.id
                                ? 'bg-amber-400 text-emerald-950 border-amber-500 animate-pulse'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title="Dengarkan Jawaban Suara"
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>Berhenti</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Audio</span>
                              </>
                            )}
                          </button>
                        </div>

                        <span className="text-[10px] text-gray-400 font-serif italic">Syukron Jazakallah</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex flex-col items-start space-y-1.5">
                <div className="bg-white border-2 border-emerald-200 rounded-3xl rounded-tl-none p-4 shadow-md max-w-[85%] border-l-4 border-l-amber-400 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>AI Konsultan Syariah sedang menelaah dalil Al-Qur'an & Hadits...</span>
                  </div>
                  <p className="text-[11px] text-gray-400 animate-pulse">Memformulasikan panduan muamalah & ibadah kaffah...</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Box Row */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-emerald-100 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendConsultation();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={`Tanyakan hukum Syariah / Bisnis kategori ${selectedCategory}...`}
                className="flex-1 bg-emerald-50/60 border border-emerald-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={isLoading || !promptInput.trim()}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold p-3 sm:px-5 sm:py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline text-xs">Kirim</span>
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Panel (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommended Preset Questions */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="font-bold text-emerald-950 font-serif text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" /> Topik Pertanyaan Populer
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">Klik untuk tanya</span>
            </div>

            <div className="space-y-2">
              {(PRESET_QUESTIONS[selectedCategory] || PRESET_QUESTIONS['Fiqih Muamalah & Bisnis']).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendConsultation(q)}
                  className="w-full text-left p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/80 border border-emerald-200/80 text-xs text-emerald-950 font-medium transition-all group flex items-start gap-2"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  <span className="leading-snug">{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Consultations Sidebar */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="font-bold text-emerald-950 font-serif text-sm flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-emerald-600" /> Jawaban Tersimpan
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                {savedConsultations.length} Item
              </span>
            </div>

            {savedConsultations.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Belum ada jawaban konsultasi yang disimpan. Klik ikon bookmark pada jawaban Konsultan AI.
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-none">
                {savedConsultations.map((item) => (
                  <div key={item.id} className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                        {item.category}
                      </span>
                      <button
                        onClick={() => toggleSaveConsultation(item)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-gray-700 font-medium line-clamp-2">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

