import React, { useState } from 'react';
import { Calculator, Coins, Landmark, ShoppingBag, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Info, Scale, ShieldCheck, HeartHandshake, Sparkles, HelpCircle } from 'lucide-react';

interface ZakatCalculatorProps {
  onOpenInfaqModal: (campaignTitle?: string, presetAmount?: number) => void;
}

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({ onOpenInfaqModal }) => {
  const [calcType, setCalcType] = useState<'maal-dagang' | 'penghasilan' | 'fitrah'>('maal-dagang');

  // Custom Gold & Silver Prices per gram
  const [goldPrice, setGoldPrice] = useState<number>(1150000); // Rp 1.150.000 / gr
  const [silverPrice, setSilverPrice] = useState<number>(14000); // Rp 14.000 / gr

  // Zakat Maal & Perdagangan Inputs
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(0);
  const [silverWeightGrams, setSilverWeightGrams] = useState<number>(0);
  const [cashAndSavings, setCashAndSavings] = useState<number>(85000000);
  const [tradeGoodsValue, setTradeGoodsValue] = useState<number>(45000000); // Stok barang dagangan
  const [tradeReceivables, setTradeReceivables] = useState<number>(10000000); // Piutang lancar
  const [shortTermDebts, setShortTermDebts] = useState<number>(15000000); // Utang jatuh tempo
  const [isHaulFulfilled, setIsHaulFulfilled] = useState<boolean>(true); // Tersimpan 1 tahun

  // Zakat Penghasilan Inputs
  const [monthlySalary, setMonthlySalary] = useState<number>(10000000);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(2000000);
  const [basicMonthlyNeeds, setBasicMonthlyNeeds] = useState<number>(4000000);

  // Zakat Fitrah Inputs
  const [familyMembersCount, setFamilyMembersCount] = useState<number>(4);
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(15000); // Rp 15.000 / kg beras (2.5 kg - 3 kg per jiwa)
  const riceKgPerPerson = 2.7; // Standard 2.7 kg per jiwa

  // NISAB CALCULATIONS
  // Nisab Emas = 85 Gram Emas
  const nisabGoldValue = 85 * goldPrice; // Rp 97.750.000
  const nisabPenghasilanMonthly = nisabGoldValue / 12; // ~Rp 8.145.833 / bulan

  // Zakat Maal & Perdagangan Calculations
  const goldValueTotal = goldWeightGrams * goldPrice;
  const silverValueTotal = silverWeightGrams * silverPrice;
  const grossAssetsMaal = goldValueTotal + silverValueTotal + cashAndSavings + tradeGoodsValue + tradeReceivables;
  const netZakatableAssetsMaal = Math.max(0, grossAssetsMaal - shortTermDebts);

  const isNisabMaalReached = netZakatableAssetsMaal >= nisabGoldValue;
  const isWajibZakatMaal = isNisabMaalReached && isHaulFulfilled;
  const zakatMaalAmount = isWajibZakatMaal ? Math.round(netZakatableAssetsMaal * 0.025) : 0;

  // Zakat Penghasilan Calculations
  const grossMonthlyIncome = monthlySalary + otherMonthlyIncome;
  const isNisabPenghasilanReached = grossMonthlyIncome >= nisabPenghasilanMonthly;
  const zakatPenghasilanAmount = isNisabPenghasilanReached ? Math.round(grossMonthlyIncome * 0.025) : 0;

  // Zakat Fitrah Calculations
  const zakatFitrahTotal = Math.round(familyMembersCount * riceKgPerPerson * ricePricePerKg);

  // Preset Handlers
  const handleLoadTraderPreset = () => {
    setCalcType('maal-dagang');
    setGoldWeightGrams(15);
    setCashAndSavings(50000000);
    setTradeGoodsValue(75000000);
    setTradeReceivables(15000000);
    setShortTermDebts(20000000);
    setIsHaulFulfilled(true);
  };

  const handleLoadProfessionalPreset = () => {
    setCalcType('penghasilan');
    setMonthlySalary(12000000);
    setOtherMonthlyIncome(3000000);
    setBasicMonthlyNeeds(5000000);
  };

  const handleReset = () => {
    setGoldWeightGrams(0);
    setSilverWeightGrams(0);
    setCashAndSavings(0);
    setTradeGoodsValue(0);
    setTradeReceivables(0);
    setShortTermDebts(0);
    setIsHaulFulfilled(true);
    setMonthlySalary(0);
    setOtherMonthlyIncome(0);
    setBasicMonthlyNeeds(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-950 text-white p-6 rounded-3xl border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Kalkulator Syariah Kaffah
              </span>
              <span className="text-xs text-amber-300 font-medium">Standar Nisab MUI & Baznas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
              Kalkulator Zakat & Nisab Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
              Hitung kewajiban Zakat Maal, Harta Perdagangan, dan Penghasilan secara presisi berdasar nisab emas 85 gram dan haul 1 tahun Hijriah.
            </p>
          </div>

          <div className="bg-emerald-900/80 p-3.5 rounded-2xl border border-amber-400/30 text-right space-y-1">
            <span className="text-[10px] text-emerald-300 font-bold uppercase block">Acuan Standard Nisab Emas (85g)</span>
            <span className="font-mono text-base font-extrabold text-amber-300 block">
              Rp {nisabGoldValue.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-emerald-200 block">
              Harga Emas: Rp {goldPrice.toLocaleString('id-ID')}/gram
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setCalcType('maal-dagang')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            calcType === 'maal-dagang'
              ? 'bg-emerald-800 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white text-emerald-950 border-emerald-100 hover:bg-emerald-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            calcType === 'maal-dagang' ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm block">Zakat Maal & Perdagangan</span>
            <span className={`text-[11px] block ${calcType === 'maal-dagang' ? 'text-emerald-200' : 'text-gray-500'}`}>
              Emas, Kas, Stok Dagang & Piutang
            </span>
          </div>
        </button>

        <button
          onClick={() => setCalcType('penghasilan')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            calcType === 'penghasilan'
              ? 'bg-emerald-800 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white text-emerald-950 border-emerald-100 hover:bg-emerald-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            calcType === 'penghasilan' ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm block">Zakat Penghasilan</span>
            <span className={`text-[11px] block ${calcType === 'penghasilan' ? 'text-emerald-200' : 'text-gray-500'}`}>
              Gaji, Profesi & Bonus Bulanan
            </span>
          </div>
        </button>

        <button
          onClick={() => setCalcType('fitrah')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            calcType === 'fitrah'
              ? 'bg-emerald-800 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white text-emerald-950 border-emerald-100 hover:bg-emerald-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            calcType === 'fitrah' ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm block">Zakat Fitrah</span>
            <span className={`text-[11px] block ${calcType === 'fitrah' ? 'text-emerald-200' : 'text-gray-500'}`}>
              2.7 Kg Beras / Jiwa Anggota Keluarga
            </span>
          </div>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Asset Inputs */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-emerald-100 shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-emerald-100 pb-4 gap-2">
            <div>
              <h3 className="font-bold text-emerald-950 font-serif text-lg">
                {calcType === 'maal-dagang' && 'Rincian Aset Maal & Perdagangan'}
                {calcType === 'penghasilan' && 'Rincian Penghasilan & Profesi'}
                {calcType === 'fitrah' && 'Rincian Jiwa & Zakat Fitrah'}
              </h3>
              <p className="text-xs text-gray-500">
                Masukkan nilai aset bersih milik pribadi/usaha yang tidak berasal dari dana haram.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={calcType === 'maal-dagang' ? handleLoadTraderPreset : handleLoadProfessionalPreset}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-emerald-200 transition-all"
              >
                Isi Contoh Simulasi
              </button>
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-all"
                title="Reset Input"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MODE 1: ZAKAT MAAL & PERDAGANGAN */}
          {calcType === 'maal-dagang' && (
            <div className="space-y-4 text-xs">
              
              {/* Emas & Perak */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                  <Coins className="w-4 h-4 text-amber-500" /> Emas & Perak Simpanan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Emas Batangan / Perhiasan (Gram):</label>
                    <input
                      type="number"
                      value={goldWeightGrams}
                      onChange={(e) => setGoldWeightGrams(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 font-mono font-bold text-emerald-950 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Nilai: Rp {goldValueTotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Perak Simpanan (Gram):</label>
                    <input
                      type="number"
                      value={silverWeightGrams}
                      onChange={(e) => setSilverWeightGrams(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 font-mono font-bold text-emerald-950 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Nilai: Rp {silverValueTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Uang Tunai, Tabungan, Deposito */}
              <div>
                <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-emerald-700" /> Total Uang Tunai, Tabungan & Rekening Bank (Rp):
                </label>
                <input
                  type="number"
                  value={cashAndSavings}
                  onChange={(e) => setCashAndSavings(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Termasuk simpanan giro, deposito cair, reksadana, dan uang tunai di dompet/brankas.
                </span>
              </div>

              {/* Aset Perdagangan / Usaha */}
              <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60 space-y-3">
                <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                  <ShoppingBag className="w-4 h-4 text-amber-600" /> Aset Bisnis & Perdagangan
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Stok Barang Dagangan Siap Jual (Rp):</label>
                    <input
                      type="number"
                      value={tradeGoodsValue}
                      onChange={(e) => setTradeGoodsValue(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 font-mono font-bold text-gray-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Piutang Lancar Usaha (Rp):</label>
                    <input
                      type="number"
                      value={tradeReceivables}
                      onChange={(e) => setTradeReceivables(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 font-mono font-bold text-gray-900 focus:outline-none focus:border-amber-600"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">Piutang yang berpotensi besar cair</span>
                  </div>
                </div>
              </div>

              {/* Pengurang: Hutang Jatuh Tempo */}
              <div>
                <label className="block font-bold text-red-900 mb-1">
                  Pengurang: Hutang Usaha / Jatuh Tempo 1 Tahun (Rp):
                </label>
                <input
                  type="number"
                  value={shortTermDebts}
                  onChange={(e) => setShortTermDebts(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-red-50/50 border border-red-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-red-950 focus:outline-none focus:border-red-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Hutang cicilan/usaha yang wajib dilunasi dalam waktu dekat.
                </span>
              </div>

              {/* Checkbox Haul 1 Tahun */}
              <div className="bg-emerald-900 text-white p-4 rounded-2xl flex items-center justify-between border border-emerald-700">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-amber-300 block">Syarat Haul (Tersimpan 1 Tahun Hijriah)</span>
                  <span className="text-[11px] text-emerald-200">
                    Harta telah mengendap secara sempurna selama 12 bulan berturut-turut.
                  </span>
                </div>
                <button
                  onClick={() => setIsHaulFulfilled(!isHaulFulfilled)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    isHaulFulfilled ? 'bg-amber-400' : 'bg-emerald-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-all shadow-md ${
                    isHaulFulfilled ? 'right-0.5 bg-emerald-950' : 'left-0.5 bg-gray-300'
                  }`} />
                </button>
              </div>

            </div>
          )}

          {/* MODE 2: ZAKAT PENGHASILAN */}
          {calcType === 'penghasilan' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-emerald-950 mb-1">Gaji Utama Bulanan (Rp):</label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-950 mb-1">Penghasilan Tambahan / Bonus / Tunjangan (Rp):</label>
                <input
                  type="number"
                  value={otherMonthlyIncome}
                  onChange={(e) => setOtherMonthlyIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-950 mb-1">Pengeluaran Kebutuhan Pokok Bulanan (Rp):</label>
                <input
                  type="number"
                  value={basicMonthlyNeeds}
                  onChange={(e) => setBasicMonthlyNeeds(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Metode pencapaian nisab dihitung dari Total Kotor Penghasilan per bulan (Nisab: Rp {Math.round(nisabPenghasilanMonthly).toLocaleString('id-ID')}).
                </span>
              </div>
            </div>
          )}

          {/* MODE 3: ZAKAT FITRAH */}
          {calcType === 'fitrah' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-emerald-950 mb-1">Jumlah Anggota Keluarga (Jiwa):</label>
                <input
                  type="number"
                  min={1}
                  value={familyMembersCount}
                  onChange={(e) => setFamilyMembersCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-950 mb-1">Harga Beras Kualitas Konsumsi per Kg (Rp):</label>
                <input
                  type="number"
                  value={ricePricePerKg}
                  onChange={(e) => setRicePricePerKg(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Standar Zakat Fitrah = 2.7 Kg beras / jiwa ({familyMembersCount} jiwa = {(familyMembersCount * riceKgPerPerson).toFixed(1)} Kg beras).
                </span>
              </div>
            </div>
          )}

          {/* Adjusted Gold Price Settings Bar */}
          <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
            <span>Ubah Standar Harga Acuan Pasar:</span>
            <div className="flex items-center gap-2">
              <label>Harga Emas/gr:</label>
              <input
                type="number"
                value={goldPrice}
                onChange={(e) => setGoldPrice(Number(e.target.value))}
                className="w-28 bg-gray-50 border border-gray-300 rounded px-2 py-0.5 font-mono text-xs text-gray-800"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Calculation Summary & Payment CTA */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-white p-6 rounded-3xl border border-emerald-800 shadow-xl flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                Laporan Ringkasan Nisab
              </span>
              <Scale className="w-5 h-5 text-amber-400" />
            </div>

            {/* SUMMARY FOR ZAKAT MAAL */}
            {calcType === 'maal-dagang' && (
              <div className="space-y-3">
                <div className="space-y-1.5 text-xs text-emerald-200">
                  <div className="flex justify-between">
                    <span>Total Harta Kotor (Gross):</span>
                    <span className="font-mono font-bold text-white">Rp {grossAssetsMaal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-red-300">
                    <span>Pengurang (Hutang Jatuh Tempo):</span>
                    <span className="font-mono font-bold">- Rp {shortTermDebts.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-emerald-800 text-sm font-bold text-amber-300">
                    <span>Harta Bersih Wajib Zakat:</span>
                    <span className="font-mono">Rp {netZakatableAssetsMaal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-2 pt-2">
                  <div className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
                    isNisabMaalReached
                      ? 'bg-emerald-900/90 text-amber-300 border-amber-400/40'
                      : 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60'
                  }`}>
                    {isNisabMaalReached ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block">
                        {isNisabMaalReached ? 'Mencapai Nisab (≥ 85g Emas)' : 'Belum Mencapai Nisab'}
                      </span>
                      <span className="text-[10px] opacity-90">
                        Nisab Minimal: Rp {nisabGoldValue.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
                    isHaulFulfilled
                      ? 'bg-emerald-900/90 text-amber-300 border-amber-400/40'
                      : 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60'
                  }`}>
                    {isHaulFulfilled ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block">
                        {isHaulFulfilled ? 'Syarat Haul Terpenuhi (1 Tahun)' : 'Belum Mencapai Haul 1 Tahun'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Calculation Amount */}
                <div className="bg-emerald-900/80 p-4 rounded-2xl border border-amber-400/40 text-center space-y-1 my-2">
                  <span className="text-xs text-emerald-300 font-semibold block">
                    Kewajiban Zakat Maal & Perdagangan (2.5%):
                  </span>
                  <span className="text-3xl font-extrabold font-mono text-amber-300 block">
                    Rp {zakatMaalAmount.toLocaleString('id-ID')}
                  </span>
                  {!isWajibZakatMaal && (
                    <span className="text-[11px] text-emerald-200 block italic pt-1">
                      Belum Wajib Zakat Maal. Disarankan menyalurkan Infaq / Sedekah Sukarela.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* SUMMARY FOR ZAKAT PENGHASILAN */}
            {calcType === 'penghasilan' && (
              <div className="space-y-3">
                <div className="space-y-1.5 text-xs text-emerald-200">
                  <div className="flex justify-between">
                    <span>Total Penghasilan Bulanan:</span>
                    <span className="font-mono font-bold text-white">Rp {grossMonthlyIncome.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Nisab Penghasilan Bulanan:</span>
                    <span className="font-mono font-bold">Rp {Math.round(nisabPenghasilanMonthly).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
                  isNisabPenghasilanReached
                    ? 'bg-emerald-900/90 text-amber-300 border-amber-400/40'
                    : 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60'
                }`}>
                  {isNisabPenghasilanReached ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {isNisabPenghasilanReached ? 'Wajib Zakat Penghasilan' : 'Belum Mencapai Nisab Bulanan'}
                    </span>
                    <span className="text-[10px] opacity-90">
                      Standar Nisab: Rp {Math.round(nisabPenghasilanMonthly).toLocaleString('id-ID')} / bulan
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-900/80 p-4 rounded-2xl border border-amber-400/40 text-center space-y-1 my-2">
                  <span className="text-xs text-emerald-300 font-semibold block">
                    Kewajiban Zakat Profesi Bulanan (2.5%):
                  </span>
                  <span className="text-3xl font-extrabold font-mono text-amber-300 block">
                    Rp {zakatPenghasilanAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* SUMMARY FOR ZAKAT FITRAH */}
            {calcType === 'fitrah' && (
              <div className="space-y-3">
                <div className="space-y-1.5 text-xs text-emerald-200">
                  <div className="flex justify-between">
                    <span>Jumlah Anggota Keluarga:</span>
                    <span className="font-mono font-bold text-white">{familyMembersCount} Jiwa</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Total Kebutuhan Beras:</span>
                    <span className="font-mono font-bold">{(familyMembersCount * riceKgPerPerson).toFixed(1)} Kg</span>
                  </div>
                </div>

                <div className="bg-emerald-900/80 p-4 rounded-2xl border border-amber-400/40 text-center space-y-1 my-2">
                  <span className="text-xs text-emerald-300 font-semibold block">
                    Nilai Zakat Fitrah (Dikonversi Uang):
                  </span>
                  <span className="text-3xl font-extrabold font-mono text-amber-300 block">
                    Rp {zakatFitrahTotal.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-emerald-200 block">
                    Atau menyalurkan langsung {(familyMembersCount * riceKgPerPerson).toFixed(1)} Kg Beras ke Amil Masjid.
                  </span>
                </div>
              </div>
            )}

            {/* Fiqih Dalil Footnote */}
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 text-[11px] text-amber-200 space-y-1">
              <span className="font-bold text-amber-300 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Landasan Syariah:
              </span>
              <p className="leading-snug text-emerald-100">
                "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan menyucikan mereka..." (QS. At-Taubah [9]: 103)
              </p>
            </div>

          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              let title = "Penyaluran Zakat Maal & Perdagangan";
              let amount = zakatMaalAmount || 100000;
              if (calcType === 'penghasilan') {
                title = "Penyaluran Zakat Penghasilan";
                amount = zakatPenghasilanAmount || 100000;
              } else if (calcType === 'fitrah') {
                title = "Penyaluran Zakat Fitrah";
                amount = zakatFitrahTotal || 50000;
              }
              onOpenInfaqModal(title, amount);
            }}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold py-3.5 rounded-2xl shadow-xl transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Salurkan Zakat Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
