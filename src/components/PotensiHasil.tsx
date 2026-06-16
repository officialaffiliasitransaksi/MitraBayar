import React, { useState } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Shield, 
  Users, 
  ArrowRight, 
  Layers, 
  Zap, 
  CreditCard, 
  Calculator, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Award,
  Car
} from 'lucide-react';

export default function PotensiHasil() {
  // Simulator State
  const [totalUserTarget, setTotalUserTarget] = useState(1000000); // 1 Million total download target
  const [penetrationRate, setPenetrationRate] = useState(10); // 10% penetration rate default
  const [txCount, setTxCount] = useState<string>('10'); // Default to 10 transactions (perfect score)
  
  // Installment Illustration State
  const [vehicleType, setVehicleType] = useState<'motor' | 'mobil'>('motor');
  const [angsuranAmount, setAngsuranAmount] = useState<string>('750000');
  const [tenorMonths, setTenorMonths] = useState<string>('12');
  
  // Calculate debiturs
  const activeDebitur = Math.round((totalUserTarget * penetrationRate) / 100);
  
  // Financial metrics
  const activationFee = 100000; // Rp 100.000
  const monthlyInstallmentAdmin = 25000; // Rp 25.000
  const monthlyPpobAdmin = 22500; // 9x @ Rp 2.505
  const totalMonthlyLtv = monthlyInstallmentAdmin + monthlyPpobAdmin; // Rp 47.500

  // Yield projections
  const oneTimeActivationRevenue = activeDebitur * activationFee;
  const monthlyRecurringRevenue = activeDebitur * totalMonthlyLtv;
  const annualRecurringRevenue = monthlyRecurringRevenue * 12;

  // Format IDR helper
  const formatIDR = (num: number) => {
    if (num >= 1000000000) {
      const bio = num / 1000000000;
      return `Rp ${bio.toLocaleString('id-ID', { maximumFractionDigits: 2 })} Miliar`;
    }
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <section id="potensi-hasil" className="py-16 md:py-24 bg-gradient-to-b from-[#f8fafc] via-[#eff6ff]/35 to-[#f1f5f9] border-t border-b border-blue-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1 py-1 px-3.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold tracking-wider text-xs uppercase mb-4">
            <Sparkles size={13} className="text-indigo-600" /> BISNIS MODEL & INTEGRASI EKOSISTEM
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d2e5c] tracking-tight leading-tight mb-4">
            Potensi Ekonomi & Model Bisnis <span className="text-blue-600 block sm:inline">Ekosistem MitraBayar</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Analisis proyeksi pendapatan ganda, tata kelola risiko debitur, jaminan keamanan kepemilikan aset, dan skema kemitraan struktural.
          </p>
        </div>

        {/* 1. TIGA PILAR FONDASI CARD ROW */}
        <div className="mb-16">
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
              <span className="p-1 px-2.5 bg-blue-100 text-blue-800 text-sm font-black rounded-lg">1</span>
              Tiga Pilar Fondasi Ekosistem MitraBayar
            </h3>
            <p className="text-xs text-slate-500 mt-1">Struktur pilar keamanan, pendapatan, dan manajemen kredit yang menopang pertumbuhan platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pilar 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full flex items-center justify-end pr-3 pt-3 text-blue-500 font-black text-2xl">
                1
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-5 group-hover:scale-105 transition-transform">
                <Coins size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#0d2e5c] mb-3">Sistem Pendapatan</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Mengelola aliran dana terstruktur dari ekstraksi nilai aktivasi lisensi sekali bayar serta akumulasi selisih admin transaksi harian secara realtime.
              </p>
              <div className="h-px bg-slate-100 my-4"></div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Aktivasi satu waktu: Rp 100.000</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Pendapatan pasif admin bulanan stabil</span>
                </li>
              </ul>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full flex items-center justify-end pr-3 pt-3 text-indigo-500 font-black text-2xl">
                2
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-5 group-hover:scale-105 transition-transform">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#0d2e5c] mb-3">Pengelolaan Debitur & Risiko</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Strategi mitigasi komprehensif tertaut langsung sistem OJK & leasing untuk memisahkan debitur patuh dan menunggak demi kelancaran penyelesaian denda.
              </p>
              <div className="h-px bg-slate-100 my-4"></div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Penyelarasan denda & pemutihan angsuran</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Penilaian skor loyalitas kredit debitur</span>
                </li>
              </ul>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full flex items-center justify-end pr-3 pt-3 text-purple-500 font-black text-2xl">
                3
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-5 group-hover:scale-105 transition-transform">
                <Shield size={24} />
              </div>
              <h4 className="text-lg font-bold text-[#0d2e5c] mb-3">Kemitraan & Keamanan</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Sistematis kemitraan struktural mengikat dengan Lembaga Pembiayaan guna mengamankan draf rilis BPKB dan legalitas pencabutan laporan denda di lapangan.
              </p>
              <div className="h-px bg-slate-100 my-4"></div>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Jaminan regulasi refund dana denda</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span>Protokol terenkripsi pelunasan jaminan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. ARUS EKSTRAKSI NILAI GANDA & ANATOMI TRANSAKSI */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Block: Mesin Pendapatan */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-7 sm:p-8 rounded-3xl flex flex-col justify-between border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>
            
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/25 text-indigo-300 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                PROSES ALUR MODEL
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Mesin Pendapatan: Arus Ekstraksi Nilai Ganda
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                MitraBayar meluncurkan formula arus pendapatan yang terbagi menjadi pendapatan sekali waktu dan pendapatan bulanan berulang secara pasif.
              </p>
              
              <div className="space-y-4 pt-4">
                {/* Flow Step 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-xl shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                      Pendaftar Baru & Aktivasi 
                      <span className="text-[9px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-mono font-bold">Sekali Waktu</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-normal">
                      Setiap pengguna premium baru membayar biaya aktivasi sitem senilai <strong className="text-blue-300">Rp 100.000</strong> sekali di awal guna asuransi denda & akses dana taktis.
                    </p>
                  </div>
                </div>

                {/* Flow Step 2 */}
                <div className="flex justify-center my-1 text-slate-400">
                  <ArrowRight size={20} className="transform rotate-90" />
                </div>

                {/* Flow Step 3 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                      Aplikasi MitraBayar & Selisih Admin 
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">Berulang Bulanan</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-normal">
                      Pendapatan recurring bulanan mengalir pasif dari margin split admin dari transaksi pembayaran denda angsuran dan tagihan harian digital.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Anatomi LTV */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                NILAI SIKLUS HIDUP (LTV)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0d2e5c]">
                Anatomi Transaksi Bulanan per Debitur Aktif
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Rincian margin biaya admin yang dibayarkan oleh debitur aktif dalam satu sikon bulanan berputar di platform.
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                {/* Item 1 */}
                <div className="flex justify-between items-center sm:gap-4 border-b border-slate-200 pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                      <CreditCard size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-805">1x Transaksi Angsuran</p>
                      <p className="text-[10px] text-slate-400">Pembayaran bulanan pokok</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Biaya Admin</p>
                    <p className="font-extrabold text-indigo-700">Rp 25.000</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex justify-between items-center sm:gap-4 border-b border-slate-200 pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <Zap size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-805">9x Transaksi PPOB</p>
                      <p className="text-[10px] text-slate-400">Rata-rata @ Rp 2.500 per transaksi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Subtotal Admin</p>
                    <p className="font-extrabold text-[#0d2e5c]">Rp 22.500</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center sm:gap-4 pt-1">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                      <Coins size={15} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm">Total LTV Mutlak</p>
                      <p className="text-[10px] text-slate-400">Per Debitur Aktif per Bulan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Terbaca Pasif</p>
                    <p className="font-black text-emerald-600 text-base sm:text-lg">Rp 47.500</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-center text-xs text-blue-800 font-semibold leading-normal mt-5">
              💡 Seluruh transaksi diproses terintegrasi pada server bank penampung utama secara realtime.
            </div>
          </div>
        </div>

        {/* 3. SIMULATOR INTERAKTIF */}
        <div id="mrr-simulator" className="p-6 sm:p-10 bg-white border border-slate-150 rounded-3xl shadow-lg shadow-blue-500/5 mb-16 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 mt-10 mr-10 rounded-full blur-2xl pointer-events-none opacity-50"></div>
          
          <div className="border-b border-slate-100 pb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-indigo-50 text-indigo-700 font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Calculator size={12} /> KALKULATOR SKALABILITAS NOMINAL
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0d2e5c]" id="simulator-calculator">
              Kalkulator Proyeksi Pendapatan Pemegang Lisensi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Geser simulator untuk menghitung total Dana Suntikan Aktivasi (One-Time) dan Dana Rutin MRR bulanan berdasarkan penetrasi jumlah debitur aktif.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Control Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Target User Base Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-extrabold text-slate-800">Target Total Ekosistem User</label>
                  <span className="font-mono font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {totalUserTarget.toLocaleString('id-ID')} Member
                  </span>
                </div>
                <input 
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={totalUserTarget}
                  onChange={(e) => setTotalUserTarget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10.000</span>
                  <span>1 Juta (Default)</span>
                  <span>2 Juta</span>
                </div>
              </div>

              {/* Penetration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-extrabold text-slate-800">Tingkat Penetrasi Debitur Aktif</label>
                  <span className="font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {penetrationRate}% Penetrasi
                  </span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={penetrationRate}
                  onChange={(e) => setPenetrationRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1%</span>
                  <span>10% (Rata-rata OJK)</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Informative Label Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-500">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="font-extrabold text-slate-700 text-xs font-mono">{activeDebitur.toLocaleString('id-ID')}</p>
                  <p>Jumlah Debitur Aktif</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="font-extrabold text-[#0d2e5c] text-xs font-mono">Rp 47.500</p>
                  <p>LTV per Debitur/Bln</p>
                </div>
              </div>

            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 sm:p-7 border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-5 relative">
              
              {/* Highlight 1: Active Capital One-Time */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    SUNTIKAN AKTIVASI (ONE-TIME)
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-850 mt-2 tracking-tight">
                    {formatIDR(oneTimeActivationRevenue)}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-3">
                  Diperoleh dari total pendownload berbayar yang mengaktifkan fitur perlindungan denda dengan kontribusi awal sekali bayar Rp 100.000.
                </p>
              </div>

              {/* Highlight 2: MRR (Monthly Recurring) */}
              <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/5 rounded-full"></div>
                <div className="relative z-10">
                  <span className="text-[9px] text-indigo-200 font-extrabold bg-indigo-500/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    PENDAPATAN BERULANG (MRR / BLN)
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
                    {formatIDR(monthlyRecurringRevenue)}
                  </h4>
                </div>
                <p className="text-[10px] text-indigo-200 leading-normal mt-3 relative z-10">
                  Arus tagihan terstruktur aktif per bulan secara pasif dari margin split admin angsuran kendaraan dan transaksi digital PPOB.
                </p>
              </div>

              {/* Total Annual Column */}
              <div className="md:col-span-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-250 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">Proyeksi Pendapatan Berulang Tahunan (ARR)</span>
                  <p className="text-base sm:text-lg font-black text-emerald-700">{formatIDR(annualRecurringRevenue)} / Tahun</p>
                </div>
                <div className="text-[10.5px] text-emerald-600 font-medium leading-relaxed max-w-sm">
                  Proyeksi finansial stabil dengan asumsi retensi debitor berada di rasio <strong className="text-emerald-700">92%+</strong> sesuai model ekosistem proteksi jaminan MitraBayar.
                </div>
              </div>
              
            </div>

          </div>
        </div>

        {/* 4. KALKULATOR RUMUS SKOR & KELAYAKAN TALANGAN DENDA */}
        <div id="rumus-skor-talangan" className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-10 shadow-lg mb-16 space-y-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 mt-10 mr-10 rounded-full blur-2xl pointer-events-none opacity-40"></div>
          
          <div className="border-b border-slate-100 pb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-50 text-blue-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Calculator size={12} /> SISTEM SKOR LOYALITAS MITRA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0d2e5c]">
              Menu Rumus Skor Kelayakan Talangan Denda
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluasi otomatis status kelayakan debitur untuk mendapatkan bantuan dana talangan penyelesaian denda angsuran finance berdasarkan frekuensi transaksi bulanan.
            </p>
          </div>

          {/* Kolom Input Utama & Analisis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Column */}
            <div className="lg:col-span-4 bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Jumlah Transaksi Debitur (Bulanan)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Contoh: 10"
                    value={txCount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 100)) {
                        setTxCount(val);
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border border-slate-250 rounded-xl font-bold text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Transaksi
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 mt-2 leading-relaxed">
                  Ketik angka transaksi di atas. Coba ketik <strong className="text-slate-600">1</strong> atau <strong className="text-emerald-600">10</strong> untuk melihat simulasi perbedaan skor dan status kelayakan langsung secara instan.
                </p>
              </div>

              {/* Quick Actions preset */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Preset Cepat:</span>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 10, 15].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setTxCount(preset.toString())}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        parseInt(txCount) === preset
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset} Transaksi
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-[11.5px] text-blue-900 leading-relaxed font-semibold flex items-start gap-2">
                <span className="shrink-0 mt-0.5">💡</span>
                <span>Setiap transaksi sukses menyumbang <strong className="text-blue-800">10 Poin Skor</strong>. Target minimal kelayakan talangan mandiri adalah <strong className="text-blue-850">100 Poin (10 Transaksi)</strong>.</span>
              </div>
            </div>

            {/* Kolom Hasil & Analisis (Format Tampilan Kolom) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Output Columns Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Column 1: Kalkulasi Skor */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                      <Award size={18} />
                    </div>
                    <span className="block text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest">AKUMULASI SKOR</span>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tight">
                      {Math.min((parseInt(txCount) || 0) * 10, 100)} <span className="text-xs text-slate-400">/ 100 Poin</span>
                    </h4>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          ((parseInt(txCount) || 0) * 10) >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(((parseInt(txCount) || 0) * 10), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold block mt-1">Loyalty progress denda</span>
                  </div>
                </div>

                {/* Column 2: Status Kelayakan */}
                <div className={`border p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between ${
                  ((parseInt(txCount) || 0) * 10) >= 100 
                    ? 'bg-emerald-50/40 border-emerald-250' 
                    : 'bg-amber-50/30 border-amber-200'
                }`}>
                  <div className="space-y-2">
                    <div className={`p-2 rounded-lg w-fit ${
                      ((parseInt(txCount) || 0) * 10) >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {((parseInt(txCount) || 0) * 10) >= 100 ? <CheckCircle size={18} /> : <HelpCircle size={18} />}
                    </div>
                    <span className="block text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">STATUS OTORISASI</span>
                    <p className={`text-sm font-black leading-tight mt-1 ${
                      ((parseInt(txCount) || 0) * 10) >= 100 ? 'text-emerald-800' : 'text-amber-800'
                    }`}>
                      {((parseInt(txCount) || 0) * 10) >= 100 
                        ? '🟢 LAYAK / ELIGIBLE' 
                        : '🚨 BELUM LAYAK / AJUKAN DONGKRAK'}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-150/60 text-[10px] text-slate-500 leading-snug">
                    {((parseInt(txCount) || 0) * 10) >= 100 
                      ? 'Diberikan fasilitas dana talangan denda angsuran finance 100% tanpa potongan admin!'
                      : 'Kekurangan transaksi terdeteksi. Debitur harus menambah minimal ' + Math.max(10 - (parseInt(txCount) || 0), 0) + ' transaksi lagi.'
                    }
                  </div>
                </div>

                {/* Column 3: Estimasi Plafon & Bunga */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                      <Coins size={18} />
                    </div>
                    <span className="block text-[9px] text-blue-600 font-extrabold uppercase tracking-widest">DANA TALANGAN MAKS</span>
                    <h4 className="text-xl font-bold text-slate-805 tracking-tight">
                      {((parseInt(txCount) || 0) * 10) >= 100 ? 'Rp 5.000.000' : 'Rp ' + (((parseInt(txCount) || 0) * 500000).toLocaleString('id-ID'))}
                    </h4>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="text-slate-450 font-semibold">Tingkat Bunga:</span>
                    <span className={`font-black px-1.5 py-0.5 rounded ${
                      ((parseInt(txCount) || 0) * 10) >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {((parseInt(txCount) || 0) * 10) >= 100 ? '0% Bunga' : '1.5% Tenor'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Tabel Skala Penilaian Kolom (Reference Grid) */}
              <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-50 p-4 border-b border-slate-150 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Tabel Rumus Distribusi Hubungan Transaksi vs Skor Kelayakan</h4>
                    <p className="text-[10px] text-slate-450">Standarisasi legalitas verifikasi denda di system otomatisasi MitraBayar.</p>
                  </div>
                  <span className="text-[9px] font-mono bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max">Mitra Otoritas</span>
                </div>
                
                <div className="divide-y divide-slate-100 text-xs">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50/40 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider text-center">
                    <div className="col-span-3 text-left">Jumlah Transaksi</div>
                    <div className="col-span-3">Poin Skor yang Diperoleh</div>
                    <div className="col-span-4">Status & Kelayakan Dana Talangan</div>
                    <div className="col-span-2 text-right">Plafon Cair</div>
                  </div>

                  {/* Row 1 Transaksi */}
                  <div className={`grid grid-cols-12 gap-2 p-3 items-center text-center transition-colors ${parseInt(txCount) === 1 ? 'bg-blue-50/60 font-semibold' : ''}`}>
                    <div className="col-span-3 text-left flex items-center gap-1.5 font-bold text-slate-700 font-sans">
                      <span>1 Transaksi</span>
                      {parseInt(txCount) === 1 && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                    </div>
                    <div className="col-span-3 font-mono font-bold text-indigo-600 text-sm">10 Poin</div>
                    <div className="col-span-4">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full font-extrabold text-[9px] tracking-wide uppercase">🚫 Tidak Layak (Skor Terlampau Rendah)</span>
                    </div>
                    <div className="col-span-2 text-right font-semibold text-slate-500 font-mono">Rp 500.000</div>
                  </div>

                  {/* Row 3 Transaksi */}
                  <div className={`grid grid-cols-12 gap-2 p-3 items-center text-center transition-colors ${parseInt(txCount) === 3 ? 'bg-blue-50/60 font-semibold' : ''}`}>
                    <div className="col-span-3 text-left flex items-center gap-1.5 font-bold text-slate-700 font-sans">
                      <span>3 Transaksi</span>
                      {parseInt(txCount) === 3 && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                    </div>
                    <div className="col-span-3 font-mono font-bold text-indigo-600 text-sm">30 Poin</div>
                    <div className="col-span-4">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full font-extrabold text-[9px] tracking-wide uppercase">🚫 Tidak Layak (Skor Terlampau Rendah)</span>
                    </div>
                    <div className="col-span-2 text-right font-semibold text-slate-500 font-mono">Rp 1.500.000</div>
                  </div>

                  {/* Row 5 Transaksi */}
                  <div className={`grid grid-cols-12 gap-2 p-3 items-center text-center transition-colors ${parseInt(txCount) === 5 ? 'bg-blue-50/60 font-semibold' : ''}`}>
                    <div className="col-span-3 text-left flex items-center gap-1.5 font-bold text-slate-700 font-sans">
                      <span>5 Transaksi</span>
                      {parseInt(txCount) === 5 && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                    </div>
                    <div className="col-span-3 font-mono font-bold text-indigo-600 text-sm">50 Poin</div>
                    <div className="col-span-4">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-extrabold text-[9px] tracking-wide uppercase">⚠️ Masa Pantau (Butuh Co-Signer)</span>
                    </div>
                    <div className="col-span-2 text-right font-semibold text-slate-500 font-mono">Rp 2.500.000</div>
                  </div>

                  {/* Row 10 Transaksi */}
                  <div className={`grid grid-cols-12 gap-2 p-3 items-center text-center transition-colors ${parseInt(txCount) === 10 ? 'bg-emerald-50 font-bold' : ''}`}>
                    <div className="col-span-3 text-left flex items-center gap-1.5 font-extrabold text-emerald-850 font-sans">
                      <span>10 Transaksi</span>
                      {(parseInt(txCount) === 10 || (parseInt(txCount) >= 10 && parseInt(txCount) < 15)) && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>}
                    </div>
                    <div className="col-span-3 font-mono font-extrabold text-emerald-600 text-sm">100 Poin</div>
                    <div className="col-span-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-extrabold text-[9px] tracking-wide uppercase">🟢 LAYAK UTAMA (Penuh Tanpa Potongan)</span>
                    </div>
                    <div className="col-span-2 text-right font-black text-emerald-700 font-mono">Rp 5.000.000</div>
                  </div>

                  {/* Row 15+ Transaksi */}
                  <div className={`grid grid-cols-12 gap-2 p-3 items-center text-center transition-colors ${parseInt(txCount) >= 15 ? 'bg-emerald-100/50 font-bold' : ''}`}>
                    <div className="col-span-3 text-left flex items-center gap-1.5 font-extrabold text-[#0d2e5c] font-sans">
                      <span>15+ Transaksi</span>
                      {parseInt(txCount) >= 15 && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>}
                    </div>
                    <div className="col-span-3 font-mono font-black text-indigo-700 text-sm">100+ Poin</div>
                    <div className="col-span-4">
                      <span className="px-2 py-0.5 bg-[#0d2e5c] text-white rounded-full font-extrabold text-[9px] tracking-wide uppercase">👑 PRIORITAS VVIP (Bailout Instan)</span>
                    </div>
                    <div className="col-span-2 text-right font-black text-indigo-700 font-mono">Rp 7.500.000</div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ILUSTRASI PEMBAYARAN ANGSURAN MOTOR & MOBIL */}
        <div id="ilustrasi-angsuran" className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-10 shadow-lg mb-16 space-y-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 mt-10 mr-10 rounded-full blur-2xl pointer-events-none opacity-40"></div>
          
          <div className="border-b border-slate-100 pb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-indigo-50 text-indigo-750 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <CreditCard size={12} className="text-indigo-600" /> SIMULATOR TRANSAKSI ANGSURAN
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0d2e5c]">
              Ilustrasi Pembayaran Angsuran Khusus Motor & Mobil
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Perhitungan rincian pembayaran angsuran kredit kendaraan dengan biaya administrasi tetap sebesar</span>
              <strong className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-105 font-black text-xs">Rp 25.000</strong>
              <span>per transaksi.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Input Configurator (Col-4) */}
            <div className="lg:col-span-5 bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between gap-6">
              <div className="space-y-5">
                
                {/* Vehicle Type Selection */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2.5">
                    1. Pilih Jenis Kendaraan Pembiayaan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      id="btn-vehicle-motor"
                      type="button"
                      onClick={() => {
                        setVehicleType('motor');
                        setAngsuranAmount('750000');
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-sm tracking-tight flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                        vehicleType === 'motor'
                          ? 'bg-[#0d2e5c] text-white border-[#0d2e5c] shadow-md shadow-slate-905/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>🛵 Motor (Roda Dua)</span>
                    </button>
                    <button
                      id="btn-vehicle-mobil"
                      type="button"
                      onClick={() => {
                        setVehicleType('mobil');
                        setAngsuranAmount('3500000');
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-sm tracking-tight flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                        vehicleType === 'mobil'
                          ? 'bg-[#0d2e5c] text-white border-[#0d2e5c] shadow-md shadow-slate-905/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>🚗 Mobil (Roda Empat)</span>
                    </button>
                  </div>
                </div>

                {/* Local Presets depending on Vehicle Type */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-450 uppercase mb-2">
                    {vehicleType === 'motor' ? 'Preset Motor Populer:' : 'Preset Mobil Populer:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {vehicleType === 'motor' ? (
                      <>
                        <button
                          id="preset-motor-beat"
                          type="button"
                          onClick={() => setAngsuranAmount('720000')}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            angsuranAmount === '720000'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Honda Beat (Rp 720K)
                        </button>
                        <button
                          id="preset-motor-vario"
                          type="button"
                          onClick={() => setAngsuranAmount('980000')}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            angsuranAmount === '980000'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Vario 160 (Rp 980K)
                        </button>
                        <button
                          id="preset-motor-nmax"
                          type="button"
                          onClick={() => setAngsuranAmount('1250000')}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            angsuranAmount === '1250000'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          NMAX 155 (Rp 1.25M)
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          id="preset-mobil-brio"
                          type="button"
                          onClick={() => setAngsuranAmount('2650000')}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            angsuranAmount === '2650000'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Honda Brio (Rp 2.65M)
                        </button>
                        <button
                          id="preset-mobil-avanza"
                          type="button"
                          onClick={() => setAngsuranAmount('3850000')}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            angsuranAmount === '3850000'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Toyota Avanza (Rp 3.85M)
                        </button>
                        <button
                          id="preset-mobil-xpander"
                          type="button"
                          onClick={() => setAngsuranAmount('4500000')}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            angsuranAmount === '4500000'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Xpander (Rp 4.5M)
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Manual Installment Amount input */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                    2. Nominal Angsuran Pokok Bulanan (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                    <input
                      id="input-angsuran-pokok"
                      type="number"
                      min="10000"
                      max="100000000"
                      step="50000"
                      value={angsuranAmount}
                      onChange={(e) => setAngsuranAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-250 rounded-xl font-bold text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Tenor / Duration selection */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      3. Tenor Kredit Yang Ingin Dihitung
                    </label>
                    <span className="text-xs font-extrabold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-md">{tenorMonths} Bulan</span>
                  </div>
                  <input
                    id="input-installment-tenor"
                    type="range"
                    min="1"
                    max="60"
                    value={tenorMonths}
                    onChange={(e) => setTenorMonths(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1 mt-1">
                    <span>1 Bln</span>
                    <span>12 Bln</span>
                    <span>24 Bln</span>
                    <span>36 Bln</span>
                    <span>48 Bln</span>
                    <span>60 Bln</span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-[#eff6ff] border border-blue-150 rounded-2xl text-[11px] text-blue-900 leading-relaxed font-semibold">
                🔔 <strong className="text-blue-800">Skema Transaksi Sehat:</strong> Pembayaran dilakukan langsung via jaringan kasir pintar MitraBayar, menekan denda bunga berbunga hingga 0% karena terintegrasi langsung ke host leasing bersangkutan.
              </div>
            </div>

            {/* Calculations Breakdown (Col-7 in grid) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              
              {/* Output Columns details */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-6 flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <div>
                      <h4 className="text-sm font-extrabold font-sans">Estimasi Invoice Resmi Transaksi</h4>
                      <p className="text-[10px] text-slate-400">Format tagihan tag-system bergaransi MitraBayar</p>
                    </div>
                    <span className="text-[10px] bg-indigo-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {vehicleType === 'motor' ? '🏍️ Roda Dua' : '🚗 Roda Empat'}
                    </span>
                  </div>

                  {/* Calculations Block */}
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Angsuran Pokok Bulanan</span>
                      <span className="font-mono font-bold">
                        Rp {(parseFloat(angsuranAmount) || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>Biaya Administrasi Transaksi</span>
                        <span className="bg-blue-600/35 border border-blue-500/40 text-blue-300 font-extrabold px-1.5 py-0.5 rounded text-[8.5px] uppercase tracking-wide">FIXED RATE</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        Rp 25.000
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-white/5 font-extrabold text-[#93c5fd]">
                      <span>Kontribusi Pembayaran Per Bulan</span>
                      <span className="font-mono text-base text-blue-300">
                        Rp {((parseFloat(angsuranAmount) || 0) + 25000).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Proyeksi Tenor Terpilih</span>
                      <span className="font-mono font-black text-indigo-300">
                        {tenorMonths} Bulan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full Term Block */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 mt-4">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">
                    TOTAL AKUMULASI SELAMA TENOR ({tenorMonths} BULAN)
                  </span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-300">Hubungan Angsuran + Admin</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                      Rp {(((parseFloat(angsuranAmount) || 0) + 25000) * (parseInt(tenorMonths) || 1)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-450 leading-relaxed font-medium pt-1.5 border-t border-white/5">
                    Rincian: Pokok (Rp {((parseFloat(angsuranAmount) || 0) * (parseInt(tenorMonths) || 1)).toLocaleString('id-ID')}) + Total Administrasi (Rp {(25000 * (parseInt(tenorMonths) || 1)).toLocaleString('id-ID')}).
                  </div>
                </div>

              </div>

              {/* Unique Features Comparison Grid for MitraBayar Fixed rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <span className="text-xl shrink-0">🛡️</span>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs">Biaya Admin Fixed Rp 25K</h5>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">Berbeda dari loket lain yang membebankan biaya komisi ganda tersembunyi, di MitraBayar biaya admin rata dan resmi.</p>
                  </div>
                </div>
                <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <span className="text-xl shrink-0">📈</span>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs">Siklus Perlindungan Otomatis</h5>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">Tiap pembayaran yang diinput langsung berkontribusi pada poin kelayakan skor talangan dana denda Anda.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 5. PERISAI KEAMANAN STRUKTURAL */}
        <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <Shield size={12} /> SISTEM STRUKTURAL MITRA LEMBAGA
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mt-3">
              Perisai Keamanan Struktural Kemitraan Pembiayaan
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2">
              Hubungan logistik digital yang kuat antara operasional internal MitraBayar dengan lembaga pembiayaan dalam melindungi aset bergerak milik debitur secara sah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-xs">
            {/* Benefit Row 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
              <div className="bg-indigo-500/20 text-indigo-300 p-2 rounded-xl w-fit mb-4">
                <CheckCircle size={18} />
              </div>
              <h4 className="font-bold text-white text-sm mb-2">1. Keamanan Transaksi Terkunci</h4>
              <p className="text-slate-350 leading-relaxed">
                Setiap pembayaran dana penyehatan denda dari plafon Dana Sementara langsung tersalurkan pada hari kerja yang sama ke instansi pemegang jaminan mobil/motor.
              </p>
            </div>

            {/* Benefit Row 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
              <div className="bg-blue-500/20 text-blue-300 p-2 rounded-xl w-fit mb-4">
                <CheckCircle size={18} />
              </div>
              <h4 className="font-bold text-white text-sm mb-2">2. Jaminan Dana Refund denda</h4>
              <p className="text-slate-350 leading-relaxed">
                Sistem MitraBayar mengantrekan proses refund denda keterlambatan langsung dari leasing mitra apabila terjadi kesalahan sinkronisasi data denda di lapangan.
              </p>
            </div>

            {/* Benefit Row 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
              <div className="bg-emerald-500/20 text-emerald-300 p-2 rounded-xl w-fit mb-4">
                <CheckCircle size={18} />
              </div>
              <h4 className="font-bold text-white text-sm mb-2">3. Siklus Retensi Koin Transaksi</h4>
              <p className="text-slate-350 leading-relaxed">
                Tiap potongan denda menghasilkan cash-refund dalam bentuk koin yang otomatis rilis kembali ke saldo wallet debitur untuk transaksi harian (PPOB).
              </p>
            </div>
          </div>

          {/* Footer badge */}
          <p className="text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-8">
            © MITRABAYAR EKOSISTEM - TATA KELOLA TINGKAT INDUK OJK & INDUSTRI KEUANGAN
          </p>

        </div>

      </div>
    </section>
  );
}
