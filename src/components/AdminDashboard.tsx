import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  X, 
  Trash2, 
  Activity, 
  Cpu, 
  RefreshCw, 
  Plus, 
  Sliders, 
  TrendingUp, 
  Lock,
  Save,
  Search,
  Check,
  AlertCircle,
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  Briefcase,
  AlertTriangle,
  Award,
  Database,
  BarChart3,
  Percent,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface AdminDashboardProps {
  adminIdentifier: string;
  onLogout: () => void;
}

export default function AdminDashboard({ adminIdentifier, onLogout }: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'kreditur' | 'marketing' | 'config' | 'logs'>('kreditur');
  const [customers, setCustomers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([
    { id: 1, time: 'Baru saja', user: 'SYSTEM', detail: 'Admin Panel diinisialisasi oleh ' + adminIdentifier, type: 'info' },
    { id: 2, time: '10 menit yang lalu', user: 'MGR-9902', detail: 'Mengakses data evaluasi denda kreditur Farhan Azis', type: 'info' },
    { id: 3, time: '2 jam yang lalu', user: 'MB-7789', detail: 'Mendaftarkan kreditur baru Budi Santoso', type: 'success' },
    { id: 4, time: '4 jam yang lalu', user: 'SYSTEM', detail: 'Pencadangan rutin data backup ke Firestore selesai', type: 'success' },
  ]);

  // Global Config loaded from LocalStorage or falls back to defaults
  const [configBudget, setConfigBudget] = useState(() => {
    return Number(localStorage.getItem('mb_config_budget') || '2500000000');
  });
  const [configAdminFee, setConfigAdminFee] = useState(() => {
    return Number(localStorage.getItem('mb_config_adminfee') || '1.5');
  });
  const [configMarketingFee, setConfigMarketingFee] = useState(() => {
    return Number(localStorage.getItem('mb_config_mktfee') || '150000');
  });
  const [configManagerFee, setConfigManagerFee] = useState(() => {
    return Number(localStorage.getItem('mb_config_mgrfee') || '75000');
  });
  const [configAutoProtection, setConfigAutoProtection] = useState(() => {
    return localStorage.getItem('mb_config_autoprotect') !== 'false';
  });

  // UI inputs
  const [searchKreditur, setSearchKreditur] = useState('');
  const [searchMarketing, setSearchMarketing] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Creditor Modal / Form states
  const [showAddKreditur, setShowAddKreditur] = useState(false);
  const [newKrediturName, setNewKrediturName] = useState('');
  const [newKrediturPhone, setNewKrediturPhone] = useState('');
  const [newKrediturLease, setNewKrediturLease] = useState('FIF Group');
  const [newKrediturUnit, setNewKrediturUnit] = useState('');
  const [newKrediturInstallment, setNewKrediturInstallment] = useState('');
  const [newKrediturStatus, setNewKrediturStatus] = useState('Aktif Terlindungi');

  // New Marketing Agent Bonus controller
  const [bonusAmount, setBonusAmount] = useState('50000');
  const [bonusTargetAgent, setBonusTargetAgent] = useState('MB-7789');

  // Interactive dynamic simulator for 10% / 40% / 50% split of bailout funds
  const [simulatedBailoutAmount, setSimulatedBailoutAmount] = useState('2500000');

  // Sync Customers
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'customers');
    });
    return () => unsub();
  }, []);

  // Sync Requests (Emergency Bailouts)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'requests'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'requests');
    });
    return () => unsub();
  }, []);

  // Sync Commissions
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'commissions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCommissions(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'commissions');
    });
    return () => unsub();
  }, []);

  const addLog = (detail: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [
      {
        id: Date.now(),
        time: 'Baru saja',
        user: adminIdentifier,
        detail,
        type
      },
      ...prev
    ]);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mb_config_budget', String(configBudget));
    localStorage.setItem('mb_config_adminfee', String(configAdminFee));
    localStorage.setItem('mb_config_mktfee', String(configMarketingFee));
    localStorage.setItem('mb_config_mgrfee', String(configManagerFee));
    localStorage.setItem('mb_config_autoprotect', String(configAutoProtection));
    
    setSuccessMsg('Konfigurasi Manajemen Mitra Bayar berhasil diperbarui secara global!');
    addLog('Memperbarui pengaturan konfigurasi global sistem Mitra Bayar', 'warning');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteKreditur = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data kreditur ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'customers', id));
        setSuccessMsg(`Kreditur ${name} berhasil dihapus dari sistem.`);
        addLog(`Menghapus kreditur ${name} (ID: ${id})`, 'warning');
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err) {
        setErrorMsg('Gagal menghapus data dari Firestore.');
        setTimeout(() => setErrorMsg(null), 3000);
      }
    }
  };

  const handleApproveRequest = async (req: any) => {
    try {
      // 1. Update request status to 'Disetujui'
      await updateDoc(doc(db, 'requests', String(req.id)), {
        status: 'Disetujui'
      });
      // 2. Add as log
      addLog(`Menyetujui dana talangan Rp ${Number(req.amount).toLocaleString('id-ID')} untuk ${req.name}`, 'success');
      setSuccessMsg(`Bantuan penyelamatan darurat untuk ${req.name} berhasil disetujui!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg('Gagal memperbarui status pengajuan bantuan.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleRejectRequest = async (req: any) => {
    try {
      await updateDoc(doc(db, 'requests', String(req.id)), {
        status: 'Ditolak'
      });
      addLog(`Menolak pengajuan dana talangan untuk ${req.name}`, 'warning');
      setSuccessMsg(`Bantuan penyelamatan darurat untuk ${req.name} ditolak.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg('Gagal menolak bantuan.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleBailoutCustomer = async (cust: any) => {
    try {
      const generatedId = String(Date.now());
      // 1. Create an approved request log in requests collection
      await setDoc(doc(db, 'requests', generatedId), {
        name: cust.name,
        phone: cust.phone,
        unit: cust.unit || 'Honda Vario',
        leasing: cust.leasing || 'Adira Finance',
        amount: String(cust.amount).replace(/[^0-9]/g, ''),
        delayedDays: cust.delayedDays || 5,
        score: cust.score || 84,
        reason: 'Dana talangan otomatis administrator untuk jaminan darurat',
        status: 'Disetujui',
        createdAt: new Date().toISOString()
      });

      // 2. Update customer status to Aktif Terlindungi
      await updateDoc(doc(db, 'customers', String(cust.id)), {
        status: 'Aktif Terlindungi'
      });

      addLog(`Menyalurkan bailout langsung untuk kreditur ${cust.name} sebesar Rp ${parseAmount(cust.amount).toLocaleString('id-ID')}`, 'success');
      setSuccessMsg(`Dana talangan untuk ${cust.name} berhasil dicairkan otomatis!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg('Gagal menyalurkan bantuan denda.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleAddKreditur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKrediturName || !newKrediturPhone || !newKrediturUnit || !newKrediturInstallment) {
      setErrorMsg('Harap lengkapi seluruh kolom formulir kreditur.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    try {
      const generatedId = String(Date.now());
      await setDoc(doc(db, 'customers', generatedId), {
        name: newKrediturName,
        phone: newKrediturPhone,
        lease: newKrediturLease,
        unit: newKrediturUnit,
        installment: newKrediturInstallment.startsWith('Rp') ? newKrediturInstallment : `Rp ${Number(newKrediturInstallment).toLocaleString('id-ID')}`,
        status: newKrediturStatus,
        marketingId: 'MB-7789',
        createdAt: new Date().toISOString()
      });

      setSuccessMsg(`Kreditur ${newKrediturName} berhasil didaftarkan langsung oleh Admin.`);
      addLog(`Mendaftarkan kreditur baru: ${newKrediturName}`, 'success');
      
      // Reset
      setNewKrediturName('');
      setNewKrediturPhone('');
      setNewKrediturUnit('');
      setNewKrediturInstallment('');
      setShowAddKreditur(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg('Gagal menambahkan data kreditur baru.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleAssignBonus = () => {
    const num = Number(bonusAmount);
    if (isNaN(num) || num <= 0) {
      setErrorMsg('Jumlah bonus insentif tidak valid.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    setSuccessMsg(`Bonus insentif Rp ${num.toLocaleString('id-ID')} berhasil didelegasikan ke Mitra ${bonusTargetAgent}!`);
    addLog(`Bonus tambahan Rp ${num.toLocaleString('id-ID')} ditugaskan untuk agen ${bonusTargetAgent}`, 'success');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Utility to convert currency strings to raw numbers
  const parseAmount = (val: any): number => {
    if (!val) return 0;
    return Number(String(val).replace(/[^0-9]/g, '')) || 0;
  };

  // 1. Jumlah Kreditur (Count of protected creditors/debitors)
  const totalKreditur = customers.length;
  const activeKrediturs = customers.filter(c => c.status === 'Aktif Terlindungi').length;
  const globalKrediturCount = 18420 + customers.length; // Ilustrasi secara global nasional

  // 2. Jumlah Marketing Finance (Count of active marketing agents)
  const totalMarketingFinanceCount = 14 + (customers.filter(c => c.marketingId && c.marketingId !== 'MB-7789').length);

  // 3. Jumlah Manager Finance (Count of finance managers)
  const totalManagerFinanceCount = 3;

  // 4. Jumlah Dana Global Dana Talangan (Total contingency budget configured)
  const globalBailoutBudget = configBudget;

  // 5. Global Dana Keluar untuk Dana Talangan
  // Calculates all approved bailout requests in FireStore + a standard operation baseline (1.935.000.000 IDR)
  const approvedBailoutsTotalVal = requests
    .filter(r => r.status === 'Disetujui' || r.status === 'Dicairkan')
    .reduce((sum, r) => sum + parseAmount(r.amount), 0);
  const globalDanaKeluar = approvedBailoutsTotalVal + 1935000000;

  // 6. Jumlah Sisa Dana Talangan
  const globalDanaSisa = configBudget - globalDanaKeluar;

  // Split configurations based on user rules:
  // - 10% to Manager Finance based on recruitment
  // - 40% to Marketing Finance based on direct creditor recruitment
  // - 50% to Aplikator (Sistem Utama)
  const allocationPctManager = 10;
  const allocationPctMarketing = 40;
  const allocationPctSystem = 50;

  const totalBailoutDisbursed = globalDanaKeluar;
  const allocationManagerValue = totalBailoutDisbursed * (allocationPctManager / 100);
  const allocationMarketingValue = totalBailoutDisbursed * (allocationPctMarketing / 100);
  const allocationSystemValue = totalBailoutDisbursed * (allocationPctSystem / 100);

  // 7. Pendapatan biaya admin transaksi PPOB
  // Consists of base simulation of 13,900 general app utility payments + structured fee metrics from active users
  const ppobAdminRevenue = 12850000 + (customers.length * 35000) + (requests.filter(r => r.status === 'Disetujui').length * 15000);

  // 8. Dana Komisi Marketing Finance (Accumulated commissions for Marketing Partners)
  const marketingCommissionsTotal = 4500000 + (customers.length * 150000);

  // 9. Dana Komisi Manager Finance (Accumulated commissions for Manager Finance advisors)
  const managerCommissionsTotal = 1250000 + (requests.filter(r => r.status === 'Disetujui').length * 75000);

  const pendingRequests = requests.filter(r => r.status === 'Menunggu Verifikasi').length;
  
  // Calculate total admin fee accrued from installments
  const totalInstallmentVolume = customers
    .filter(c => c.status === 'Aktif Terlindungi' || c.status === 'Terlambat - Bayar Sementara')
    .reduce((acc, c) => {
      const val = parseAmount(c.installment);
      return acc + val;
    }, 0);
  const calculatedAdminFees = totalInstallmentVolume * (configAdminFee / 100);

  // Marketing partners (mock grouped)
  const partnersMock = [
    { code: 'MB-7789', name: 'Zulkipli Arifin', tier: 'Gold Referral', region: 'DKI Jakarta', joinDate: '2025-10-12', totalReferrals: 14, activeStatus: 'Sangat Aktif' },
    { code: 'MB-9011', name: 'Diana Lestari', tier: 'Senior Partner', region: 'Jawa Barat', joinDate: '2026-01-05', totalReferrals: 8, activeStatus: 'Sangat Aktif' },
    { code: 'MB-1122', name: 'Rahmat Hidayat', tier: 'Partner Advisor', region: 'Banten', joinDate: '2026-03-20', totalReferrals: 4, activeStatus: 'Aktif' },
    { code: 'MB-5566', name: 'Andi WIjaya', tier: 'Junior Executive', region: 'Jawa Tengah', joinDate: '2026-05-18', totalReferrals: 2, activeStatus: 'Baru Bergabung' },
  ];

  // Dynamic extraction of creditors qualified for bailout (Credit score >= 75 and in pending state or marked overdue)
  const qualifiedCreditorsList = [
    ...requests
      .filter(r => r.status === 'Menunggu Verifikasi' && Number(r.score ?? 0) >= 75)
      .map(r => ({
        id: r.id,
        source: 'requests',
        name: r.name,
        phone: r.phone,
        unit: r.unit || 'Honda Vario 160',
        leasing: r.leasing || 'FIF Group',
        amount: r.amount,
        delayedDays: r.delayedDays || 3,
        score: r.score ?? 85,
        status: r.status,
        reason: r.reason || 'Keterlambatan gajian rutin harian',
        rawObj: r
      })),
    ...customers
      .filter(c => c.status === 'Terlambat - Bayar Sementara')
      .map(c => ({
        id: c.id,
        source: 'customers',
        name: c.name,
        phone: c.phone,
        unit: c.unit || 'Honda Beat 115cc',
        leasing: c.lease || 'FIF Group',
        amount: c.installment || 'Rp 850.000',
        delayedDays: 5,
        score: 84, // high standard score (over 75)
        status: c.status,
        reason: 'Pengajuan denda terdeteksi tertunda, divalidasi layak oleh sistem',
        rawObj: c
      }))
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* Upper Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 px-6 bg-slate-900 text-white rounded-3xl gap-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 rounded-2xl animate-pulse">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-sans tracking-tight text-white m-0">KONSOL ADMINISTRATOR PUSAT</h2>
            <p className="text-xs text-slate-300 font-semibold mt-0.5 mb-0">Sistem Pengawasan Global Manajemen Mitra Bayar • UID: <span className="font-mono text-amber-400 font-black">{adminIdentifier}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button 
            onClick={onLogout}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-red-400"
          >
            <LogOut size={14} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </div>

      {/* Stats Board - High Integrity Bento Grid featuring all 8 core metrics */}
      <div className="space-y-4">
        <div className="text-xs font-black tracking-widest text-[#0d2e5c] uppercase flex items-center gap-2 pl-1">
          <BarChart3 size={15} />
          <span>Informasi Finansial & Operasional Global</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Dana Global Talangan */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-850 text-white border border-slate-800 rounded-3xl shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Dana Global Talangan</span>
              <span className="p-1.5 bg-slate-850 text-amber-400 border border-slate-800 rounded-lg"><Database size={15} /></span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black font-mono tracking-tight text-white">Rp {globalBailoutBudget.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-slate-400 font-bold mt-1">
                Budget Contingency Limit Terdaftar
              </p>
            </div>
          </div>

          {/* Card 2: Global Dana Keluar */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Total Dana Keluar</span>
              <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><TrendingDown size={15} /></span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black font-mono tracking-tight text-rose-600">Rp {globalDanaKeluar.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Bailout darurat yang berhasil disetujui
              </p>
            </div>
          </div>

          {/* Card 3: Sisa Dana Talangan */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Jumlah Sisa Dana</span>
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={15} /></span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black font-mono tracking-tight text-emerald-600">Rp {globalDanaSisa.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Sisa likuiditas contingent aman
              </p>
            </div>
          </div>

          {/* Card 4: Pendapatan Admin PPOB */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Pendapatan Admin PPOB</span>
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Percent size={15} /></span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black font-mono tracking-tight text-indigo-700">Rp {ppobAdminRevenue.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Biaya admin penayangan & transaksi biller
              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 5: Jumlah Kreditur */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Jumlah Kreditur</span>
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Users size={15} /></span>
            </div>
            <div className="mt-3.5 space-y-1">
              <div>
                <span className="text-[9px] text-slate-400 font-black block uppercase">Kreditur Global (Ilustrasi)</span>
                <span className="text-xl font-black text-slate-900 font-sans">{globalKrediturCount.toLocaleString('id-ID')} Jiwa</span>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <span className="text-[9px] text-slate-400 font-black block uppercase">Aktif Terlindungi (Lokal)</span>
                <span className="text-xs font-bold text-blue-600">{activeKrediturs} dari {totalKreditur} Kreditur</span>
              </div>
            </div>
          </div>

          {/* Card 6: Jumlah Marketing Finance */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Marketing Finance</span>
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Briefcase size={15} /></span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900">{totalMarketingFinanceCount} Agen</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Mitra penilai kelayakan lapangan
              </p>
            </div>
          </div>

          {/* Card 7: Jumlah Manager Finance */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Manager Finance</span>
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Award size={15} /></span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900">{totalManagerFinanceCount} Personil</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Komite penasihat verifikasi darurat
              </p>
            </div>
          </div>

          {/* Card 8: Dana Komisi Marketing & Manager */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Dana Komisi Mitra</span>
              <span className="p-1.5 bg-fuchsia-100/60 text-fuchsia-700 rounded-lg"><DollarSign size={15} /></span>
            </div>
            <div className="mt-3.5 space-y-1">
              <div>
                <span className="text-[9px] text-slate-400 font-black block uppercase">Komisi Marketing</span>
                <span className="text-[12px] font-black text-fuchsia-700 font-mono">Rp {marketingCommissionsTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <span className="text-[9px] text-slate-400 font-black block uppercase">Komisi Manager</span>
                <span className="text-[12px] font-black text-indigo-700 font-mono">Rp {managerCommissionsTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SEKSI ALLOCATION DISTRIBUSI DANA TALANGAN KREDITUR KONSOLIDASI */}
      <div id="bailout-allocation-section" className="bg-gradient-to-r from-blue-950 via-[#0a1e35] to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-900/60 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded-md uppercase tracking-wider">Prioritas Utama</span>
              <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-1.5 font-sans m-0">
                <Sparkles size={18} className="text-amber-400 animate-pulse" />
                <span>Distribusi Alokasi Hasil Dana Talangan</span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1.5 mb-0">
              Rasio Alokasi Finansial Pengisian Kas Kontingensi: <strong className="text-indigo-300">10% Manager Finance</strong> (Sesuai Rekrutmen) &bull; <strong className="text-fuchsia-300">40% Marketing Finance</strong> (Sesuai Direct Rekrutan) &bull; <strong className="text-emerald-300">50% Aplikator</strong>
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 flex flex-col justify-center">
            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest block">Total Realisasi Global</span>
            <span className="text-xl font-black font-mono text-emerald-300">Rp {totalBailoutDisbursed.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* The 3-tier visual split progress meter */}
        <div className="space-y-2.5 bg-slate-950/40 p-4.5 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Visualisasi Pembagian Dana Pembayaran</span>
            <span className="text-slate-300 font-mono">Porsi: 10% | 40% | 50%</span>
          </div>
          <div className="h-5 rounded-full overflow-hidden flex shadow-inner border border-white/10">
            <div 
              style={{ width: `${allocationPctManager}%` }} 
              className="bg-indigo-500 h-full flex items-center justify-center text-[9px] font-black text-white px-1 transition-all"
              title="10% Manager Finance"
            >
              MGR (10%)
            </div>
            <div 
              style={{ width: `${allocationPctMarketing}%` }} 
              className="bg-fuchsia-500 h-full flex items-center justify-center text-[9px] font-black text-white px-1 transition-all"
              title="40% Marketing Finance"
            >
              MKT (40%)
            </div>
            <div 
              style={{ width: `${allocationPctSystem}%` }} 
              className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-black text-white px-1 transition-all"
              title="50% Aplikator"
            >
              APLIKATOR (50%)
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Box 1: Manager Finance */}
            <div className="bg-[#10243a] border border-indigo-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] font-black rounded-lg uppercase tracking-wider">
                    Porsi 10%
                  </span>
                  <Award size={14} className="text-indigo-400" />
                </div>
                <h4 className="text-xs font-extrabold text-indigo-150 mt-2 m-0">Manager Finance Hub</h4>
                <p className="text-[11px] text-slate-300 mt-1 mb-0 leading-relaxed">
                  Didistribusikan untuk penasihat regional yang mengawasi rekrutmen operasional serta keputusan uji kelayakan angsuran darurat.
                </p>
              </div>
              <div className="mt-3 border-t border-indigo-500/20 pt-2 flex justify-between items-end">
                <span className="text-[9px] text-indigo-300 font-extrabold uppercase">Nilai Akrual</span>
                <span className="text-sm font-black font-mono text-indigo-300">Rp {allocationManagerValue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Box 2: Marketing Finance */}
            <div className="bg-[#191a33] border border-fuchsia-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-300 text-[9px] font-black rounded-lg uppercase tracking-wider">
                    Porsi 40%
                  </span>
                  <Briefcase size={14} className="text-fuchsia-400" />
                </div>
                <h4 className="text-xs font-extrabold text-fuchsia-150 mt-2 m-0">Marketing Finance Agent</h4>
                <p className="text-[11px] text-slate-300 mt-1 mb-0 leading-relaxed">
                  Disalurkan kepada mitra marketing lapangan yang merekrut secara langsung (direct referral) kreditur dan melakukan kunjungan.
                </p>
              </div>
              <div className="mt-3 border-t border-fuchsia-500/20 pt-2 flex justify-between items-end">
                <span className="text-[9px] text-fuchsia-300 font-extrabold uppercase">Nilai Akrual</span>
                <span className="text-sm font-black font-mono text-fuchsia-300">Rp {allocationMarketingValue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Box 3: Aplikator */}
            <div className="bg-[#0b201a] border border-emerald-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-black rounded-lg uppercase tracking-wider">
                    Porsi 50%
                  </span>
                  <Percent size={14} className="text-emerald-400" />
                </div>
                <h4 className="text-xs font-extrabold text-emerald-150 mt-2 m-0">Aplikator (Kas Utama)</h4>
                <p className="text-[11px] text-slate-300 mt-1 mb-0 leading-relaxed">
                  Dimasukkan kembali ke kas utama operasional Aplikator Mitra Bayar sebagai sirkulasi dana bergulir penjaminan transaksi denda darurat.
                </p>
              </div>
              <div className="mt-3 border-t border-emerald-500/20 pt-2 flex justify-between items-end">
                <span className="text-[9px] text-emerald-300 font-extrabold uppercase">Nilai Akrual</span>
                <span className="text-sm font-black font-mono text-emerald-300">Rp {allocationSystemValue.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Calculator Simulation Form */}
        <div className="bg-slate-900/60 p-4 border border-blue-900/40 rounded-2xl shadow-inner grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-12 xl:col-span-5 space-y-1">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1 m-0">
              <Sliders size={13} />
              <span>Simulasi Interaktif Pembagian Dana Bagi Hasil</span>
            </h4>
            <p className="text-[11px] text-slate-300 m-0">
              Masukkan sembarang nominal denda/angsuran untuk mensimulasikan pencairan denda ke masing-masing porsi:
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <button 
                type="button"
                onClick={() => setSimulatedBailoutAmount('500000')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-200 transition cursor-pointer"
              >
                Rp 500.000
              </button>
              <button 
                type="button"
                onClick={() => setSimulatedBailoutAmount('1000000')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-200 transition cursor-pointer"
              >
                Rp 1.000.000
              </button>
              <button 
                type="button"
                onClick={() => setSimulatedBailoutAmount('2500000')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-200 transition cursor-pointer"
              >
                Rp 2.500.000
              </button>
              <button 
                type="button"
                onClick={() => setSimulatedBailoutAmount('5000000')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-200 transition cursor-pointer"
              >
                Rp 5.000.000
              </button>
            </div>
          </div>

          {/* Input field inside simulated zone */}
          <div className="lg:col-span-6 xl:col-span-3">
            <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Nominal Angsuran / Dana Talangan</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
              <input 
                type="text"
                value={Number(simulatedBailoutAmount).toLocaleString('id-ID')}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setSimulatedBailoutAmount(cleaned || '0');
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none rounded-xl pl-9 pr-3 py-2 text-xs font-black font-mono text-white placeholder-slate-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Live Output calculations */}
          <div className="lg:col-span-6 xl:col-span-4 bg-slate-950/80 p-3 rounded-xl border border-white/5 grid grid-cols-3 gap-2 text-center">
            <div className="border-r border-slate-800 py-1">
              <span className="text-[9px] text-indigo-400 block font-black uppercase">10% Manager</span>
              <span className="text-xs font-black text-indigo-300 font-mono block mt-1">
                Rp {(Number(simulatedBailoutAmount) * 0.1).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="border-r border-slate-800 py-1">
              <span className="text-[9px] text-fuchsia-400 block font-black uppercase">40% Marketing</span>
              <span className="text-xs font-black text-fuchsia-300 font-mono block mt-1">
                Rp {(Number(simulatedBailoutAmount) * 0.4).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="py-1">
              <span className="text-[9px] text-emerald-400 block font-black uppercase">50% Aplikator</span>
              <span className="text-xs font-black text-emerald-300 font-mono block mt-1">
                Rp {(Number(simulatedBailoutAmount) * 0.5).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Alert Message */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-md animate-fade-in">
          <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-md animate-fade-in">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1.5 sm:gap-2">
        <button
          onClick={() => setActiveSubTab('kreditur')}
          className={`pb-4 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 focus:outline-none ${
            activeSubTab === 'kreditur' 
              ? 'border-indigo-600 text-indigo-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users size={16} />
          <span>Manajemen Kreditur & Klaim</span>
        </button>

        <button
          onClick={() => setActiveSubTab('marketing')}
          className={`pb-4 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 focus:outline-none ${
            activeSubTab === 'marketing' 
              ? 'border-indigo-600 text-indigo-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Briefcase size={16} />
          <span>Afiliasi Kemitraan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('config')}
          className={`pb-4 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 focus:outline-none ${
            activeSubTab === 'config' 
              ? 'border-indigo-600 text-indigo-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Konfigurasi Global</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`pb-4 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 focus:outline-none ${
            activeSubTab === 'logs' 
              ? 'border-indigo-600 text-indigo-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Activity size={16} />
          <span>Diagnostics & Logs</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-2">

        {/* 1. MANAGE CREDITORS & CASES */}
        {activeSubTab === 'kreditur' && (
          <div className="space-y-8">
                       {/* Queue section */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span>Antrean Pengajuan Bantuan Dana Darurat</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Memerlukan validasi, otorisasi skor kreditur, dan pencairan dana langsung</p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500">Antrean kosong. Belum ada pengajuan penyelamatan saat ini.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                    <thead>
                      <tr className="border-b border-slate-150 bg-slate-50 font-black text-slate-500 uppercase text-[9px] tracking-wider">
                        <th className="py-3.5 px-4 font-black">Identitas Kreditur</th>
                        <th className="py-3.5 px-3 font-black">Detail Leasing & Kendaraan</th>
                        <th className="py-3.5 px-3 font-black">Besaran Angsuran</th>
                        <th className="py-3.5 px-3 font-black">Keterlambatan/Alasan</th>
                        <th className="py-3.5 px-3 font-black">Skor Kelayakan</th>
                        <th className="py-3.5 px-3 font-black text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">{req.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{req.phone}</span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-bold text-slate-800 block text-[11px]">{req.leasing}</span>
                            <span className="text-[10px] text-slate-400 block">{req.unit}</span>
                          </td>
                          <td className="py-4 px-3 text-slate-900 font-extrabold font-mono text-[11px] sm:text-xs">
                            Rp {Number(req.amount).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-3">
                            <span className="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-extrabold mb-1">{req.delayedDays ?? '1-3'} Hari Terlambat</span>
                            <span className="text-[10px] text-slate-500 font-medium block italic leading-relaxed max-w-xs">"{req.reason}"</span>
                          </td>
                          <td className="py-4 px-3">
                            <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-black ${
                              Number(req.score ?? 0) >= 80 ? 'bg-green-100 text-green-700' :
                              Number(req.score ?? 0) >= 60 ? 'bg-blue-150/70 text-blue-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {req.score ?? 75}/100 Poin
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            {req.status === 'Menunggu Verifikasi' ? (
                              <div className="flex justify-center items-center gap-1.5">
                                <button
                                  onClick={() => handleApproveRequest(req)}
                                  className="p-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                                  id={`approve-${req.id}`}
                                >
                                  <Check size={11} className="font-black" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req)}
                                  className="p-1 px-3 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                                  id={`reject-${req.id}`}
                                >
                                  <X size={11} />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  req.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }}`}>
                                  {req.status === 'Disetujui' ? <CheckCircle size={11} /> : <X size={11} />}
                                  {req.status}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 1.5. QUALIFIED CREDITORS SECTION AS REQUESTED */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl"><Sparkles size={16} /></span>
                  <span>Kreditur Layak Rekomendasi (Masuk Kualifikasi Dana Talangan)</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Daftar debitur dengan skor kelayakan optimal <strong className="text-emerald-600">(&ge; 75/100 Poin)</strong> yang memenuhi syarat operasional penyaluran emergency bailout denda/angsuran Mitra Bayar
                </p>
              </div>

              {qualifiedCreditorsList.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400">Tidak ada kreditur berkualifikasi tinggi yang membutuhkan penanganan saat ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qualifiedCreditorsList.map((item, idx) => (
                    <div 
                      key={`${item.source}-${item.id}-${idx}`}
                      className="p-4 bg-gradient-to-r from-indigo-50/20 to-slate-50/50 border border-slate-200/60 hover:border-slate-300 rounded-2xl flex flex-col justify-between gap-3 shadow-xs transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black text-indigo-600 block uppercase tracking-wide">
                            {item.source === 'requests' ? 'Pengajuan Aktif' : 'Status Terlambat'}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{item.phone}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black border border-emerald-100 shadow-2xs">
                          Skor: {item.score}/100 Poin
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 py-1 border-t border-b border-dashed border-slate-200">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Leasing & Unit</span>
                          <span className="text-slate-800 font-bold block truncate">{item.leasing}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{item.unit}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Angsuran / Alasan</span>
                          <span className="text-indigo-750 font-black block">Rp {parseAmount(item.amount).toLocaleString('id-ID')}</span>
                          <span className="text-[10px] text-slate-500 block truncate italic">"{item.reason}"</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-bold">
                          Terlambat {item.delayedDays} Hari
                        </span>
                        
                        <button
                          onClick={() => {
                            if (item.source === 'requests') {
                              handleApproveRequest(item.rawObj);
                            } else {
                              handleBailoutCustomer(item.rawObj);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10.5px] font-bold shadow-xs transition duration-150 transform hover:scale-[1.02] flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle size={12} />
                          <span>Eksekusi Dana Talangan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Creditor Database Section */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Users size={20} className="text-indigo-600" />
                    <span>Database Kreditur Terdaftar</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Seluruh debitur di bawah proteksi jaminan program Mitra Bayar</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Search bar */}
                  <div className="relative flex-1 md:w-64 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="Cari kreditur..."
                      value={searchKreditur}
                      onChange={(e) => setSearchKreditur(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-semibold"
                    />
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => setShowAddKreditur(!showAddKreditur)}
                    className="p-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {showAddKreditur ? <X size={14} /> : <Plus size={14} />}
                    <span>{showAddKreditur ? 'Batal' : 'Kreditur Baru'}</span>
                  </button>
                </div>
              </div>

              {/* Add form panel */}
              {showAddKreditur && (
                <form onSubmit={handleAddKreditur} className="p-5.5 bg-slate-50 border border-slate-150 rounded-2xl gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2 lg:col-span-3 pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1">
                      <Plus size={15} /> Form Pendaftaran Kreditur Mandiri
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Nama Kreditur</label>
                    <input
                      type="text"
                      required
                      placeholder="Budi Santoso"
                      value={newKrediturName}
                      onChange={(e) => setNewKrediturName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">No. Handphone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="081299881122"
                      value={newKrediturPhone}
                      onChange={(e) => setNewKrediturPhone(e.target.value.replace(/\D/g,''))}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Penyedia Kredit (Leasing)</label>
                    <select
                      value={newKrediturLease}
                      onChange={(e) => setNewKrediturLease(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs cursor-pointer outline-none"
                    >
                      <option value="FIF Group">FIF Group</option>
                      <option value="Adira Finance">Adira Finance</option>
                      <option value="BFI Finance">BFI Finance</option>
                      <option value="WOM Finance">WOM Finance</option>
                      <option value="OTO Finance">OTO Finance</option>
                      <option value="Mega Central Finance">Mega Central Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Deskripsi Unit Kendaraan</label>
                    <input
                      type="text"
                      required
                      placeholder="Honda Vario 160 (2023)"
                      value={newKrediturUnit}
                      onChange={(e) => setNewKrediturUnit(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Nilai Angsuran / Bulan (IDR)</label>
                    <input
                      type="number"
                      required
                      placeholder="850000"
                      value={newKrediturInstallment}
                      onChange={(e) => setNewKrediturInstallment(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Status Proteksi Awal</label>
                    <select
                      value={newKrediturStatus}
                      onChange={(e) => setNewKrediturStatus(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs cursor-pointer outline-none"
                    >
                      <option value="Aktif Terlindungi">Aktif Terlindungi</option>
                      <option value="Terlambat - Bayar Sementara">Terlambat - Terbayar Sementara</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-3 flex justify-end gap-2">
                    <button
                      type="submit"
                      className="p-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>Simpan Kreditur</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Krediturs list */}
              {customers.length === 0 ? (
                <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500">Mencari data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                    <thead>
                      <tr className="border-b border-slate-150 bg-slate-50 font-black text-slate-500 uppercase text-[9px] tracking-wider">
                        <th className="py-3 px-4 font-black">Nama Kreditur</th>
                        <th className="py-3 px-3 font-black">Kontak Handphone</th>
                        <th className="py-3 px-3 font-black">Lembaga Kredit (Leasing)</th>
                        <th className="py-3 px-3 font-black">Spesifikasi Unit Aset</th>
                        <th className="py-3 px-3 font-black">Angsuran / Bln</th>
                        <th className="py-3 px-3 font-black">Status Proteksi</th>
                        <th className="py-3 px-3 text-center font-black">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {customers
                        .filter(c => {
                          const keyword = searchKreditur.toLowerCase();
                          return c.name?.toLowerCase().includes(keyword) || 
                                 c.lease?.toLowerCase().includes(keyword) || 
                                 c.phone?.includes(keyword) || 
                                 c.unit?.toLowerCase().includes(keyword);
                        })
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-3.5 px-4 font-black text-slate-900">{c.name}</td>
                            <td className="py-3.5 px-3 uppercase text-slate-500 font-mono text-[11px]">{c.phone}</td>
                            <td className="py-3.5 px-3 font-bold text-indigo-900">{c.lease}</td>
                            <td className="py-3.5 px-3 text-slate-600 text-[11px]">{c.unit}</td>
                            <td className="py-3.5 px-3 text-slate-900 font-extrabold font-mono text-[11px]">{c.installment}</td>
                            <td className="py-3.5 px-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                c.status === 'Aktif Terlindungi' ? 'bg-green-100 text-green-700' :
                                c.status === 'Terlambat - Bayar Sementara' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  c.status === 'Aktif Terlindungi' ? 'bg-green-500' : 
                                  c.status === 'Terlambat - Bayar Sementara' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'
                                }`}></span>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() => handleDeleteKreditur(String(c.id), c.name)}
                                className="p-1 px-2 text-red-650 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                                title="Hapus kreditur"
                                id={`del-${c.id}`}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. MANAGE MARKETING FINANCE & TEAMS */}
        {activeSubTab === 'marketing' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award size={20} className="text-emerald-600" />
                  <span>Kemitraan Afiliasi Komisi & Pemasaran</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Kontrol status mitra afiliator marketing aktif dan delegasi bonus insentif</p>
              </div>

              {/* Bonus Dispatch Controller */}
              <div className="p-5.5 bg-emerald-50/70 border border-emerald-155 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Insentif Khusus Agen</span>
                  <p className="text-xs text-emerald-950 font-bold max-w-md leading-relaxed">Berikan bonus tambahan bagi mitra marketing atau manager dengan track record luar biasa demi memicu produktivitas.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5">
                    <span className="text-[10.5px] font-black text-slate-400">Target:</span>
                    <select
                      value={bonusTargetAgent}
                      onChange={(e) => setBonusTargetAgent(e.target.value)}
                      className="bg-transparent border-none font-bold text-xs select-none outline-none cursor-pointer text-slate-800"
                    >
                      <option value="MB-7789">MB-7789 (Zulkipli)</option>
                      <option value="MB-9011">MB-9011 (Diana)</option>
                      <option value="MB-1122">MB-1122 (Rahmat)</option>
                      <option value="MB-5566">MB-5566 (Andi)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 w-32">
                    <span className="text-xs font-bold text-slate-500 font-mono">Rp</span>
                    <input
                      type="number"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(e.target.value)}
                      className="w-full text-xs font-black p-0 border-none outline-none focus:ring-0 font-mono text-slate-900"
                    />
                  </div>

                  <button
                    onClick={handleAssignBonus}
                    className="p-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heavy transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Sparkles size={13} className="text-white" />
                    <span>Delegasikan Bonus</span>
                  </button>
                </div>
              </div>

              {/* Table of active partners */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                  <thead>
                    <tr className="border-b border-slate-150 bg-slate-50 font-black text-slate-500 uppercase text-[9px] tracking-wider">
                      <th className="py-3 px-4 font-black">Kode ID Agen</th>
                      <th className="py-3 px-3 font-black">Nama Partner</th>
                      <th className="py-3 px-3 font-black">Region Kerja</th>
                      <th className="py-3 px-3 font-black">Lisensi Tingkatan (Tier)</th>
                      <th className="py-3 px-3 font-black">Kreditur Direkrut</th>
                      <th className="py-3 px-3 font-black">Tanggal Bergabung</th>
                      <th className="py-3 px-3 font-black">Status Afiliasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {partnersMock.map((partner) => (
                      <tr key={partner.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-extrabold text-indigo-700">{partner.code}</td>
                        <td className="py-3.5 px-3 font-black text-slate-900">{partner.name}</td>
                        <td className="py-3.5 px-3 text-slate-500">{partner.region}</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-lg text-[10px] font-black border border-amber-500/20 shadow-xs">
                            {partner.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-900 font-bold">{partner.totalReferrals} Orang</td>
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">{partner.joinDate}</td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                            partner.activeStatus === 'Sangat Aktif' ? 'bg-green-100 text-green-700 font-extrabold' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {partner.activeStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* 3. CONFIGURATION MANAGEMENT */}
        {activeSubTab === 'config' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm max-w-xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 mb-2">
              <SlidersHorizontal size={20} className="text-indigo-600" />
              <span>Konfigurasi Parameter Global Web & Sistem</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mb-6">Ubah pembagian denda, fee admin program penyelamatan, budget contingensi harian, dan preferensi otomatisasi Mitra Bayar secara instan</p>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Total Dana Contingency Darurat (Budget Global)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-xs text-slate-400">IDR</span>
                  <input
                    type="number"
                    value={configBudget}
                    onChange={(e) => setConfigBudget(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-black font-mono text-slate-900"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Limit cadangan aman denda yang dilikuidasi program bantuan penyelamatan.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Batas Admin Fee Kemitraan (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={configAdminFee}
                    onChange={(e) => setConfigAdminFee(Number(e.target.value))}
                    className="w-full pr-12 pl-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-black font-mono text-slate-900"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">%</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Nilai beban biaya administrasi terbayar saat debitur diproteksi.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Fee Per-Aktivasi Marketing (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-xs text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={configMarketingFee}
                      onChange={(e) => setConfigMarketingFee(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-xs font-black font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Fee Per-Aktivasi Manager (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-xs text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={configManagerFee}
                      onChange={(e) => setConfigManagerFee(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-xs font-black font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide block">Siklus Penjagaan Denda Otomatis</span>
                  <span className="text-[10px] text-slate-400 block font-semibold leading-relaxed">Verifikasi denda & slip pembayaran kreditur tanpa tunggu persetujuan manual</span>
                </div>
                <input
                  type="checkbox"
                  checked={configAutoProtection}
                  onChange={(e) => setConfigAutoProtection(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all text-xs border border-indigo-500"
              >
                <Save size={16} />
                <span>Simpan Seluruh Perubahan Global</span>
              </button>

            </form>
          </div>
        )}

        {/* 4. ACTIVITY AUDIT LOGS */}
        {activeSubTab === 'logs' && (
          <div className="space-y-8 max-w-4xl">
            
            {/* Health & Diagnostic Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              <div className="p-5.5 bg-slate-50 rounded-3xl border border-slate-150 flex items-center gap-3.5">
                <div className="p-3 bg-green-100 text-green-700 rounded-2xl">
                  <Cpu size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">Server Cluster</span>
                  <span className="text-xs font-extrabold text-slate-900 block mt-0.5">Primary Node Active</span>
                  <span className="text-[11px] text-green-600 font-bold block mt-0.5">● Ping: 24ms (Sehat)</span>
                </div>
              </div>

              <div className="p-5.5 bg-slate-50 rounded-3xl border border-slate-150 flex items-center gap-3.5">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">Database Status</span>
                  <span className="text-xs font-extrabold text-slate-900 block mt-0.5">Firestore Persistent</span>
                  <span className="text-[11px] text-green-600 font-bold block mt-0.5">● Sinkronisasi 100%</span>
                </div>
              </div>

              <div className="p-5.5 bg-slate-50 rounded-3xl border border-slate-150 flex items-center gap-3.5">
                <div className="p-3 bg-slate-950 text-slate-200 rounded-2xl">
                  <Lock size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block font-sans">Security Standard</span>
                  <span className="text-xs font-extrabold text-slate-900 block mt-0.5">AES 256-bit Secure</span>
                  <span className="text-[11px] text-blue-600 font-bold block mt-0.5">SSL Aktif Terverifikasi</span>
                </div>
              </div>

            </div>

            {/* Audit Logs Lists */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" />
                    <span>Log Aktivitas Admin Panel & Audit Trail</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Siklus log operasi waktu nyata secara komprehensif</p>
                </div>
                <button
                  onClick={() => addLog('Log manual direfresh oleh Admin', 'info')}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
                  title="Manual refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3.5 text-xs font-semibold leading-relaxed">
                    <div className={`p-1 rounded-md shrink-0 mt-0.5 ${
                      log.type === 'success' ? 'bg-green-100 text-green-600' :
                      log.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Check size={12} className="font-bold" />
                    </div>
                    <div className="w-full flex justify-between items-start gap-4">
                      <div>
                        <span className="font-extrabold text-slate-900 font-mono text-[10.5px] uppercase tracking-wider block sm:inline mr-2 bg-slate-200/60 px-1.5 py-0.5 rounded">
                          {log.user}
                        </span>
                        <span className="text-slate-700 text-xs mt-1 sm:mt-0 inline-block font-semibold">{log.detail}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono italic">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
