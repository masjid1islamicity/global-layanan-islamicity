import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/mockData';
import { ShieldCheck, Calculator, FileText, CheckCircle2, AlertTriangle, Sparkles, Award, ArrowRight, HelpCircle, Check, X, MessageSquare } from 'lucide-react';
import { AiKonsultasiSyariah } from './AiKonsultasiSyariah';
import { ZakatCalculator } from './ZakatCalculator';

interface PillarBersyariahProps {
  onOpenInfaqModal: (campaignTitle?: string, presetAmount?: number) => void;
}

export const PillarBersyariah: React.FC<PillarBersyariahProps> = ({ onOpenInfaqModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'consultation' | 'zakat' | 'contract-checker' | 'halal-check' | 'quiz'>('consultation');

  // Contract Checker State
  const [contractType, setContractType] = useState('Mudharabah');
  const [businessDesc, setBusinessDesc] = useState('');
  const [profitSharing, setProfitSharing] = useState('60% Pengelola : 40% Pemilik Modal');
  const [capitalTerms, setCapitalTerms] = useState('Modal disetor 100% di awal oleh Pemilik Modal');
  const [loadingContract, setLoadingContract] = useState(false);
  const [contractResult, setContractResult] = useState<{
    kesesuaianSkor?: number;
    statusSyariah?: string;
    analisisRukunDanSyarat?: string;
    potensiRisikoSyariah?: string[];
    rekomendasiPerbaikan?: string[];
    dalilPemerkuat?: string;
  } | null>(null);

  // Halal Search State
  const [ingredientQuery, setIngredientQuery] = useState('');
  const halalDatabase = [
    { name: "Gelatin Sapi (Sertifikat Halal)", status: "Halal", notes: "Aman digunakan jika bersumber dari sembelihan syar'i." },
    { name: "Kode E471 (Mono and Diglycerides)", status: "Syubhat", notes: "Bisa berasal dari tumbuhan atau nabati, perlu konfirmasi sertifikasi halal MUI." },
    { name: "Lard (Minyak Babi)", status: "Haram", notes: "Turunan bahan haram, tidak boleh dikonsumsi." },
    { name: "Pektin Buah", status: "Halal", notes: "100% nabati, halal digunakan untuk pengental." },
    { name: "Rum / Essen Alkohol Khamar", status: "Haram", notes: "Sensori & rasa khamar dilarang dalam standar Halal MUI." },
  ];

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const handleAnalyzeContract = async () => {
    if (!businessDesc.trim() || loadingContract) return;
    setLoadingContract(true);

    try {
      const res = await fetch('/api/gemini/contract-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType,
          businessDescription: businessDesc,
          profitSharing,
          capitalTerms
        })
      });
      const data = await res.json();
      setContractResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContract(false);
    }
  };

  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  const handleSelectQuizAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === currentQuiz.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Subtab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('consultation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'consultation'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Syariah Consultant</span>
          </button>

          <button
            onClick={() => setActiveSubTab('zakat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'zakat'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Kalkulator Zakat & Infaq</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contract-checker')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'contract-checker'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Analisis Akad & Muamalah AI</span>
          </button>

          <button
            onClick={() => setActiveSubTab('halal-check')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'halal-check'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Pemeriksa Komposisi Halal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'quiz'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Kuis Edukasi Syariah</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 0: AI KONSULTASI SYARIAH */}
      {activeSubTab === 'consultation' && (
        <AiKonsultasiSyariah onOpenInfaqModal={onOpenInfaqModal} />
      )}

      {/* SUBTAB 1: ZAKAT CALCULATOR */}
      {activeSubTab === 'zakat' && (
        <ZakatCalculator onOpenInfaqModal={onOpenInfaqModal} />
      )}

      {/* SUBTAB 2: AI SYARIAH CONTRACT CHECKER */}
      {activeSubTab === 'contract-checker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-4">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" /> Analisis Kepatuhan Akad Muamalah AI
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Uji skema bisnis atau transaksi Anda (Murabahah, Mudharabah, Musyarakah, Ijarah) untuk mencegah unsur Riba, Gharar, dan Maysir.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">Pilih Jenis Akad Utama:</label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-gray-900 font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value="Mudharabah">Mudharabah (Pemilik Modal & Pengelola Usaha)</option>
                  <option value="Musyarakah">Musyarakah (Kemitraan Modal Bersama)</option>
                  <option value="Murabahah">Murabahah (Jual Beli dengan Margin Keuntungan Transparan)</option>
                  <option value="Ijarah">Ijarah (Sewa Menyawa Barang atau Jasa)</option>
                  <option value="Salam / Istisna'">Salam / Istisna' (Pemesanan Barang dengan Spesifikasi)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Deskripsi Usaha / Skema Transaksi:</label>
                <textarea
                  rows={3}
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  placeholder="Contoh: Saya membuka usaha kedai kopi halal. Investor menyetor modal Rp 50 Juta untuk pembelian mesin sangrai..."
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Rencana Bagi Hasil / Keuntungan:</label>
                <input
                  type="text"
                  value={profitSharing}
                  onChange={(e) => setProfitSharing(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Ketentuan Modal & Penanggungan Risiko:</label>
                <input
                  type="text"
                  value={capitalTerms}
                  onChange={(e) => setCapitalTerms(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-2 text-gray-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                onClick={handleAnalyzeContract}
                disabled={loadingContract || !businessDesc.trim()}
                className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingContract ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>AI Sedang Menganalisis Kaidah Fiqih Muamalah...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Uji Kepatuhan Akad Syariah</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results Display */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {contractResult ? (
              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500">Hasil Evaluasi Muamalah</span>
                    <h4 className="font-bold text-emerald-950 text-lg">{contractType}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-emerald-700">{contractResult.kesesuaianSkor}%</span>
                    <span className="text-[10px] block font-bold text-emerald-600">Skor Kesesuaian</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Status: {contractResult.statusSyariah}</span>
                </div>

                {contractResult.analisisRukunDanSyarat && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-emerald-900 block">Analisis Rukun & Syarat Akad:</span>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed">
                      {contractResult.analisisRukunDanSyarat}
                    </p>
                  </div>
                )}

                {contractResult.rekomendasiPerbaikan && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-emerald-900 block">Rekomendasi Perbaikan Akad:</span>
                    <ul className="space-y-1 text-gray-700">
                      {contractResult.rekomendasiPerbaikan.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {contractResult.dalilPemerkuat && (
                  <div className="text-[11px] bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 italic font-serif">
                    "{contractResult.dalilPemerkuat}"
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-emerald-300 text-emerald-800 space-y-3">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Hasil Analisis Akad Belum Tersedia</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Isi rincian transaksi atau perjanjian usaha Anda di panel kiri untuk mendapatkan rekomendasi Fiqih Muamalah langsung dari AI.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: HALAL INGREDIENTS CHECKER */}
      {activeSubTab === 'halal-check' && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h3 className="font-bold text-emerald-950 font-serif text-xl">Pemeriksa Bahan Komposisi Makanan & Produk</h3>
            <p className="text-xs text-gray-600">Cari nama emulsifier, pengawet, kode E-number, atau bahan pangan untuk mengecek kehalalannya.</p>
            
            <input
              type="text"
              value={ingredientQuery}
              onChange={(e) => setIngredientQuery(e.target.value)}
              placeholder="Ketik nama bahan (contoh: Gelatin, E471, Pektin, Rum)..."
              className="w-full bg-emerald-50/50 border border-emerald-300 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {halalDatabase
              .filter((item) => item.name.toLowerCase().includes(ingredientQuery.toLowerCase()))
              .map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border bg-emerald-50/30 border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-950">{item.name}</h4>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Halal'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : item.status === 'Syubhat'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.notes}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: SYARIAH QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="max-w-2xl mx-auto bg-white p-7 rounded-3xl border border-emerald-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Pertanyaan {quizIndex + 1} dari {QUIZ_QUESTIONS.length}
              </span>
              <h3 className="font-bold text-emerald-950 text-lg font-serif mt-1">Kuis Edukasi Syariah & Muamalah</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800">Skor: {quizScore} Point</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-emerald-950 text-base leading-snug">
              {currentQuiz.question}
            </h4>

            <div className="space-y-2.5">
              {currentQuiz.options.map((option, idx) => {
                let btnStyle = "bg-emerald-50/50 text-gray-800 border-emerald-200 hover:bg-emerald-100";
                if (selectedAnswer !== null) {
                  if (idx === currentQuiz.correctIndex) {
                    btnStyle = "bg-emerald-700 text-white border-emerald-800 font-bold";
                  } else if (idx === selectedAnswer) {
                    btnStyle = "bg-red-100 text-red-800 border-red-300 font-bold";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizAnswer(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
                <span className="font-bold block flex items-center gap-1 text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-600" /> Penjelasan Ulama:
                </span>
                <p className="leading-relaxed">{currentQuiz.explanation}</p>

                {quizIndex < QUIZ_QUESTIONS.length - 1 && (
                  <button
                    onClick={handleNextQuiz}
                    className="mt-2 bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all"
                  >
                    <span>Soal Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
