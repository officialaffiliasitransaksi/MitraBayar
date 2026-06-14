import React, { useState, useEffect } from 'react';
import { 
  User, 
  Smartphone, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Car, 
  Briefcase, 
  CheckCircle, 
  X, 
  Users, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  HelpCircle,
  FileCheck,
  Calendar
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

interface RoleDashboardsProps {
  role: 'customer' | 'marketing' | 'manager';
  userIdentifier: string;
  onLogout: () => void;
}

// Initial Mock Data
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Budi Santoso', phone: '081299881122', lease: 'FIF Group', unit: 'Honda Scoopy 2023', installment: 'Rp 850.000', status: 'Aktif Terlindungi' },
  { id: 2, name: 'Siti Aminah', phone: '085711223344', lease: 'Adira Finance', unit: 'Toyota Avanza 2021', installment: 'Rp 3.400.000', status: 'Terlambat - Bayar Sementara' },
  { id: 3, name: 'Farhan Azis', phone: '089900112233', lease: 'OTO Finance', unit: 'Yamaha NMAX 2022', installment: 'Rp 1.250.000', status: 'Menunggu Verifikasi' },
];

const INITIAL_REQUEST_QUEUE = [
  { id: 101, name: 'Arief Kurniawan', phone: '081344556600', unit: 'Honda Vario 160', leasing: 'FIF Group', amount: 'Rp 950.000', delayedDays: 3, score: 92, reason: 'Telat gajian', status: 'Menunggu Verifikasi' },
  { id: 102, name: 'Hendra Wijaya', phone: '085299887755', unit: 'Suzuki XL7', leasing: 'Indomobil Finance', amount: 'Rp 4.100.000', delayedDays: 5, score: 87, reason: 'Masalah ekonomi', status: 'Menunggu Verifikasi' },
  { id: 103, name: 'Mega Lestari', phone: '087711224488', unit: 'Yamaha Aerox 155', leasing: 'Adira Finance', amount: 'Rp 1.350.000', delayedDays: 2, score: 95, reason: 'Uang kuliah anak', status: 'Menunggu Verifikasi' },
];

const INITIAL_COMMISSIONS = [
  { id: 201, date: '12 Juni 2026', creditor: 'Siti Aminah', marketing: 'Andi Pratama', finePaid: 'Rp 450.000', managerCommission: 'Rp 67.500', status: 'Cair (Talangan Denda)' },
  { id: 202, date: '11 Juni 2026', creditor: 'Hendra Wijaya', marketing: 'Rina Wijaya', finePaid: 'Rp 800.000', managerCommission: 'Rp 120.050', status: 'Cair (Bayar Mandiri)' }
];

const INITIAL_DENDA = [
  { id: 301, creditorName: 'Agus Setiawan', phone: '081233445566', marketingName: 'Adi Saputra (ID: M-552)', unit: 'Honda Vario 160', lease: 'FIF Group', potentialDenda: 450000, probPercent: 95, status: 'Keterlambatan 6 Hari' },
  { id: 302, creditorName: 'Siti Rahmawati', phone: '085799887766', marketingName: 'Bambang Sudewo (ID: M-101)', unit: 'Toyota Avanza 2020', lease: 'Adira Finance', potentialDenda: 1200000, probPercent: 88, status: 'Keterlambatan 9 Hari' },
  { id: 303, creditorName: 'Rian Hidayat', phone: '089855443322', marketingName: 'Rina Astuti (ID: M-308)', unit: 'Yamaha Aerox 2022', lease: 'OTO Finance', potentialDenda: 350000, probPercent: 92, status: 'Keterlambatan 4 Hari' }
];

export default function RoleDashboards({ role, userIdentifier, onLogout }: RoleDashboardsProps) {
  // Common states
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Customer Dashboard states
  const [customerUnit, setCustomerUnit] = useState('Honda Vario 160 (2023)');
  const [customerLeasing, setCustomerLeasing] = useState('Adira Finance');
  const [customerInstallment, setCustomerInstallment] = useState('Rp 920.000');
  const [emergencyFundsUsed, setEmergencyFundsUsed] = useState(0); 
  const [requestPopup, setRequestPopup] = useState(false);
  const [reqAmount, setReqAmount] = useState('920000');
  const [reqReason, setReqReason] = useState('Kendala keterlambatan gajian dari kantor');

  // States for Kreditur's Fine and Marketing Commission
  const [hasFinePotential, setHasFinePotential] = useState(true);
  const [fineAmount, setFineAmount] = useState(450000); // Rp 450.000
  const [fineBailoutUsed, setFineBailoutUsed] = useState(false);
  const [finePaidMandiri, setFinePaidMandiri] = useState(false);
  const [marketingReferralCode, setMarketingReferralCode] = useState('MB-7789');
  const [marketingCommissionAmount, setMarketingCommissionAmount] = useState(150000); // Rp 150.000 commission from applicator
  const [commissionDisbursed, setCommissionDisbursed] = useState(false);

  // Marketing states
  const [customers, setCustomers] = useState<any[]>([]);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustLease, setNewCustLease] = useState('Adira Finance');
  const [newCustUnit, setNewCustUnit] = useState('');
  const [newCustInstallment, setNewCustInstallment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Manager states
  const [requestQueue, setRequestQueue] = useState<any[]>([]);
  const [disbursedCount, setDisbursedCount] = useState(1428);
  const [totalDisbursedFunds, setTotalDisbursedFunds] = useState(1935000000);

  // Manager states for fine tracking and commissions from applicator
  const [managerCommissionsTotal, setManagerCommissionsTotal] = useState(1250000);
  const [managerCommissionsReceived, setManagerCommissionsReceived] = useState<any[]>([]);
  const [potentialDendaList, setPotentialDendaList] = useState<any[]>([]);

  // 1. Subscribe and sync Customers Collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'customers'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_CUSTOMERS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'customers', String(c.id)), {
              name: c.name,
              phone: c.phone,
              lease: c.lease,
              unit: c.unit,
              installment: c.installment,
              status: c.status,
              marketingId: 'MB-7789',
              createdAt: new Date().toISOString()
            });
          } catch (err) {
            console.error('Error seeding initial customer', err);
          }
        });
      } else {
        const sorted = snapshot.docs.map(d => ({
          id: isNaN(Number(d.id)) ? d.id : Number(d.id),
          ...d.data()
        }));
        setCustomers(sorted);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'customers');
    });
    return () => unsub();
  }, [userIdentifier]);

  // 2. Subscribe and sync Requests Queue
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'requests'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_REQUEST_QUEUE.forEach(async (req) => {
          try {
            await setDoc(doc(db, 'requests', String(req.id)), {
              name: req.name,
              phone: req.phone,
              unit: req.unit,
              leasing: req.leasing,
              amount: req.amount,
              delayedDays: req.delayedDays,
              score: req.score,
              reason: req.reason,
              status: req.status,
              createdAt: new Date().toISOString()
            });
          } catch (err) {
            console.error('Error seeding requests', err);
          }
        });
      } else {
        const list = snapshot.docs.map(d => ({
          id: isNaN(Number(d.id)) ? d.id : Number(d.id),
          ...d.data()
        }));
        setRequestQueue(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'requests');
    });
    return () => unsub();
  }, [userIdentifier]);

  // 3. Subscribe and sync Commissions Logs
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'commissions'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_COMMISSIONS.forEach(async (comm) => {
          try {
            await setDoc(doc(db, 'commissions', String(comm.id)), {
              date: comm.date,
              creditor: comm.creditor,
              marketing: comm.marketing,
              finePaid: comm.finePaid,
              managerCommission: comm.managerCommission,
              status: comm.status,
              createdAt: new Date().toISOString()
            });
          } catch (err) {
            console.error('Error seeding commissions', err);
          }
        });
      } else {
        const list = snapshot.docs.map(d => ({
          id: isNaN(Number(d.id)) ? d.id : Number(d.id),
          ...d.data()
        }));
        setManagerCommissionsReceived(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'commissions');
    });
    return () => unsub();
  }, [userIdentifier]);

  // 4. Subscribe and sync Potential Denda Alerts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'denda'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_DENDA.forEach(async (d) => {
          try {
            await setDoc(doc(db, 'denda', String(d.id)), {
              creditorName: d.creditorName,
              phone: d.phone,
              marketingName: d.marketingName,
              unit: d.unit,
              lease: d.lease,
              potentialDenda: d.potentialDenda,
              probPercent: d.probPercent,
              status: d.status,
              createdAt: new Date().toISOString()
            });
          } catch (err) {
            console.error('Error seeding potential denda', err);
          }
        });
      } else {
        const list = snapshot.docs.map(d => ({
          id: isNaN(Number(d.id)) ? d.id : Number(d.id),
          ...d.data()
        }));
        setPotentialDendaList(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'denda');
    });
    return () => unsub();
  }, [userIdentifier]);

  // Manager action: Settle fine & release Manager Commission
  const handleSettleFineManager = async (id: number | string, creditorName: string, marketingName: string, fineAmountVal: number, isBailout: boolean) => {
    const commVal = Math.floor(fineAmountVal * 0.15); // 15% Manager commission from applicator
    setManagerCommissionsTotal(prev => prev + commVal);
    
    const commId = String(Date.now());
    const newLog = {
      date: 'Hari ini',
      creditor: creditorName,
      marketing: marketingName,
      finePaid: 'Rp ' + fineAmountVal.toLocaleString('id-ID'),
      managerCommission: 'Rp ' + commVal.toLocaleString('id-ID'),
      status: `Cair (${isBailout ? 'Talangan Denda' : 'Bayar Mandiri'})`,
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'commissions', commId), newLog);
      await deleteDoc(doc(db, 'denda', String(id)));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `commissions/${commId}`);
    }
    
    if (isBailout) {
      setDisbursedCount(prev => prev + 1);
      setTotalDisbursedFunds(prev => prev + fineAmountVal);
    }
    
    triggerSuccess(`Sukses! Pembayaran denda ${creditorName} (dikelola oleh ${marketingName}) sebesar Rp ${fineAmountVal.toLocaleString('id-ID')} tuntas diproses. Komisi apresiasi Manager Rp ${commVal.toLocaleString('id-ID')} cair otomatis dari Aplikator Mitra Bayar.`);
  };

  const handleResetManagerDendaDemo = async () => {
    for (const d of INITIAL_DENDA) {
      try {
        await setDoc(doc(db, 'denda', String(d.id)), {
          creditorName: d.creditorName,
          phone: d.phone,
          marketingName: d.marketingName,
          unit: d.unit,
          lease: d.lease,
          potentialDenda: d.potentialDenda,
          probPercent: d.probPercent,
          status: d.status,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `denda/${d.id}`);
      }
    }
    triggerSuccess('Simulasi potensi denda & komisi manager disetel ulang.');
  };

  const displayUser = userIdentifier || "User Demo";

  // Customer action: request fund
  const handleRequestEmergencyFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencyFundsUsed(prev => prev + parseInt(reqAmount));
    setRequestPopup(false);

    const reqId = String(Date.now());
    const newRequest = {
      name: userIdentifier || 'Budi Santoso',
      phone: '08123456789',
      unit: customerUnit,
      leasing: customerLeasing,
      amount: 'Rp ' + parseInt(reqAmount).toLocaleString('id-ID'),
      delayedDays: 1,
      score: 95,
      reason: reqReason,
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'requests', reqId), newRequest);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `requests/${reqId}`);
    }

    triggerSuccess('Permintaan dana sementara berhasil diajukan! Tim Manager Finance sedang memverifikasi secara langsung.');
  };

  // Customer action: Pay Fine via Emergency Bailout Fund (Dana Sementara Denda)
  const handlePayFineWithBailout = () => {
    setFineBailoutUsed(true);
    setCommissionDisbursed(true);
    setFineAmount(0);
    setEmergencyFundsUsed(prev => prev + 450000);
    triggerSuccess('Sukses! Denda keterlambatan ditalangi sepenuhnya menggunakan Dana Sementara Denda. Status kredit Anda terlindungi secara realtime.');
  };

  // Customer action: Pay Fine manually/out-of-pocket
  const handlePayFineMandiri = () => {
    setFinePaidMandiri(true);
    setCommissionDisbursed(true);
    setFineAmount(0);
    triggerSuccess('Sukses! Pembayaran Denda secara Mandiri lunas terlaksana. Status nama kredit Anda dinyatakan Lunas Lancar.');
  };

  // Reset demo fine state
  const handleResetFineDemo = () => {
    setFineBailoutUsed(false);
    setFinePaidMandiri(false);
    setCommissionDisbursed(false);
    setFineAmount(450000);
    triggerSuccess('Simulasi penyembuhan denda kreditur disetel ulang.');
  };

  // Marketing action: add client
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustUnit || !newCustInstallment) {
      alert('Tolong lengkapi semua kolom pendaftaran!');
      return;
    }
    const formatInstallment = 'Rp ' + parseInt(newCustInstallment.replace(/\D/g, '')).toLocaleString('id-ID');
    const custId = String(Date.now());
    const newCust = {
      name: newCustName,
      phone: '08' + newCustPhone.replace(/\D/g, ''),
      lease: newCustLease,
      unit: newCustUnit,
      installment: formatInstallment,
      status: 'Menunggu Verifikasi',
      marketingId: userIdentifier || 'MB-7789',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'customers', custId), newCust);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `customers/${custId}`);
    }

    setNewCustName('');
    setNewCustPhone('');
    setNewCustUnit('');
    setNewCustInstallment('');
    setShowAddForm(false);
    triggerSuccess(`Sukses mendaftarkan customer baru: ${newCust.name}!`);
  };

  const handleDeleteCustomer = async (id: number | string) => {
    try {
      await deleteDoc(doc(db, 'customers', String(id)));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `customers/${id}`);
    }
    triggerSuccess('Data debitur berhasil dihapus.');
  };

  // Manager action: Approve or reject
  const handleApproveQueue = async (id: number | string, name: string, amountStr: string) => {
    const rawVal = parseInt(amountStr.replace(/\D/g, '')) || 0;
    
    try {
      await updateDoc(doc(db, 'requests', String(id)), {
        status: 'Disetujui'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `requests/${id}`);
    }

    setDisbursedCount(prev => prev + 1);
    setTotalDisbursedFunds(prev => prev + rawVal);
    triggerSuccess(`Permintaan ${name} sebesar ${amountStr} berhasil DISETUJUI & Dana Utama disalurkan ke leasing terkait!`);
  };

  const handleRejectQueue = async (id: number | string, name: string) => {
    try {
      await updateDoc(doc(db, 'requests', String(id)), {
        status: 'Ditolak'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `requests/${id}`);
    }
    triggerSuccess(`Permintaan ${name} telah DITOLAK karena penilaian kelayakan di bawah rata-rata.`);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4500);
  };

  return (
    <div className="w-full bg-slate-50 border border-gray-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-inner select-none font-sans">

      
      {/* Banner / Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className={`py-1 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              role === 'customer' ? 'bg-blue-100 text-blue-700' :
              role === 'marketing' ? 'bg-emerald-100 text-emerald-700' :
              'bg-indigo-100 text-indigo-700'
            }`}>
              Portal {role === 'customer' ? 'Kreditur' : role === 'marketing' ? 'Marketing Finance' : 'Manager Finance'}
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-slate-500 font-semibold">Live Mode</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Selamat Datang, <span className="text-blue-700">{displayUser}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Berikut adalah konsol aktivitas pengurusan kredit angsuran kendaraan Anda.</p>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Keluar Portal</span>
        </button>
      </div>

      {/* Global Toast Success Message */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-md animate-fade-in">
          <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ======================================= */}
      {/* 1. CUSTOMER DASHBOARD LAYOUT            */}
      {/* ======================================= */}
      {role === 'customer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Left Column: Credit Card / Asset Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Guard Card */}
            <div className="p-6 bg-gradient-to-tr from-blue-700 via-blue-800 to-[#0e3b7e] rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-5 bg-white/5 rounded-bl-3xl">
                <Car size={36} className="text-white/20" />
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Aset Proteksi Kendaraan</p>
                  <h3 className="text-xl sm:text-2xl font-black mt-1">{customerUnit}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-blue-200 block uppercase font-semibold">Leasing Terdaftar</span>
                    <span className="text-sm font-bold">{customerLeasing}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-200 block uppercase font-semibold">Besar Angsuran</span>
                    <span className="text-sm font-bold">{customerInstallment} / Bln</span>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 my-1"></div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">Status Amankan Denda</span>
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-green-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle size={14} /> Otomatis Terlindungi
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-200 font-bold block uppercase">Dana Talangan Terpakai</span>
                    <span className="text-lg font-black text-amber-300">
                      Rp {emergencyFundsUsed.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTIFIKASI POTENSI DENDA & KOMISI MITRA MARKETING (APLIKATOR) */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              {/* Highlight ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                    <AlertTriangle size={12} /> Status Keterlambatan Denda
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                    Penyelamatan & Potensi Dana Sementara Denda
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Layanan penanganan keterlambatan dari aplikator untuk melidungi kreditur dari risiko sita unit.</p>
                </div>
                {fineAmount === 0 && (
                  <button 
                    onClick={handleResetFineDemo}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1 cursor-pointer"
                  >
                    Simulasi Lagi (Reset)
                  </button>
                )}
              </div>

              {/* Status boxes */}
              <div className="my-4">
                {/* Potential usage card */}
                <div className={`p-5 rounded-3xl border transition-all ${
                  fineAmount > 0 
                  ? 'bg-amber-50/60 border-amber-200' 
                  : 'bg-emerald-50/60 border-emerald-200'
                }`}>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Potensi Pemakaian Dana</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-slate-800">Dana Sementara Denda:</span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      fineAmount > 0 
                      ? 'bg-amber-100 text-amber-805 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {fineAmount > 0 ? 'SANGAT LAYAK (98%)' : 'TERLINDUNGI'}
                    </span>
                  </div>
                  <div className="mt-3">
                    {fineAmount > 0 ? (
                      <div>
                        <div className="text-xs text-amber-900 leading-relaxed">
                          Anda memiliki masa keterlambatan akumulatif dengan potensi denda berjalan leasing sebesar <span className="font-bold text-red-655">Rp 450.000</span>.
                        </div>
                        <div className="mt-2 text-xs text-slate-500 leading-relaxed">
                          🛡️ Anda sangat direkomendasikan mengaktifkan alokasi **Dana Sementara Denda** dari aplikator agar nama kredit Anda tetap bersih, berperingkat Lunas Lancar, dan terhindar dari keterlambatan denda.
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-800 flex items-center gap-1.5 font-semibold">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span>Denda berjalan Anda telah diselesaikan! Skor status amankan denda Anda aktif prima.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              {fineAmount > 0 ? (
                <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handlePayFineWithBailout}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <ShieldCheck size={16} />
                    <span>Tepati Denda via Dana Sementara</span>
                  </button>
                  
                  <button
                    onClick={handlePayFineMandiri}
                    className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer hover:border-slate-300"
                  >
                    <DollarSign size={16} className="text-slate-500" />
                    <span>Bayar Denda Secara Mandiri</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-800 text-xs sm:text-sm font-semibold flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-500 animate-spin" />
                    <div>
                      <p className="font-bold">Transaksi Penyembuhan Denda Sukses!</p>
                      <p className="text-[11px] text-emerald-600 font-normal">Denda keterlambatan Anda telah diselesaikan. Skor kredit Anda kembali prima dan terlindungi dari risiko penarikan.</p>
                    </div>
                  </div>
                  <div className="bg-white/95 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-[11px] text-emerald-800 font-extrabold shrink-0 shadow-xs">
                    LUNAS TERLINDUNGI
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Payment History / Status */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                  <FileCheck size={20} className="text-blue-600" />
                  <span>Riwayat Transaksi Angsuran</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">Update: Hari ini</span>
              </div>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Pembayaran Angsuran Juni</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12} className="inline"/> 10 Juni 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-800">Rp 920.000</p>
                    <span className="text-[10px] bg-emerald-100 text-green-800 font-bold px-2 py-0.5 rounded-full">Lunas via Mitra Bayar</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Pembayaran Angsuran Mei</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12} className="inline" /> 09 Mei 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-800">Rp 920.000</p>
                    <span className="text-[10px] bg-emerald-100 text-green-800 font-bold px-2 py-0.5 rounded-full">Lunas via Mitra Bayar</span>
                  </div>
                </div>

                {emergencyFundsUsed > 0 && (
                  <div className="flex justify-between items-center p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-amber-800">Dana Sementara Baru Diajukan</p>
                        <p className="text-xs text-amber-600">Sedang diverifikasi berkas oleh Manager Finance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-amber-800">Rp {parseInt(reqAmount).toLocaleString('id-ID')}</p>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Proses Review</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Score & Request panel */}
          <div className="space-y-6">
            
            {/* Trust Credit Score */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm text-center">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Nilai Kepercayaan Finansial</h4>
              
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                {/* SVG Circle Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" />
                  <circle cx="64" cy="64" r="54" className="text-green-500" strokeWidth="10" strokeDasharray="339" strokeDashoffset="34" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-800">94</span>
                  <span className="text-xs text-slate-400 block font-medium">dari 100</span>
                </div>
              </div>

              <h5 className="font-bold text-green-700 text-sm">Sangat Sempurna</h5>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Anda aktif bertransaksi tagihan harian di Mitra Bayar sehingga berstatus aman tinggi dari risiko penarikan unit.
              </p>
            </div>

            {/* Quick Request Button */}
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h4 className="font-bold text-blue-900 text-base mb-1">Butuh Dana Talangan?</h4>
              <p className="text-xs text-blue-700 leading-relaxed mb-3">
                Ajukan alokasi Dana Sementara apabila sedang mengalami kendala keuangan mendesak. Mitra Bayar menalangi angsuran Anda.
              </p>
              <p className="text-[10px] text-blue-800 bg-blue-100/40 p-2.5 rounded-xl border border-blue-200/30 leading-relaxed mb-4">
                ⚠️ <span className="font-bold">Info Limit:</span> Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna dan sudah bertraksaksi maksimal 3 bulan.
              </p>
              <button
                onClick={() => setRequestPopup(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-600/10 transition-transform active:scale-95 cursor-pointer"
              >
                Ajukan Pembayaran Sementara
              </button>
            </div>
          </div>

          {/* Interactive Request Popup Modal */}
          {requestPopup && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl relative">
                <button 
                  onClick={() => setRequestPopup(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <h3 className="text-lg font-black text-slate-900 mb-2">Formulir Dana Sementara</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Harap lengkapi nilai angsuran di bawah ini untuk dikoordinasikan kepada leasing terkait.
                </p>
                <div className="mb-4 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl text-[10.5px] leading-relaxed text-slate-600 font-semibold">
                  ⚠️ Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna dan sudah bertraksaksi maksimal 3 bulan.
                </div>
                
                <form onSubmit={handleRequestEmergencyFund} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Aset Kendaraan</label>
                    <input type="text" disabled value={customerUnit} className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nilai Angsuran (Rp)</label>
                    <input 
                      type="number" 
                      required
                      value={reqAmount}
                      onChange={(e) => setReqAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Alasan Keterlambatan</label>
                    <textarea 
                      required
                      value={reqReason}
                      onChange={(e) => setReqReason(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition-transform active:scale-95"
                  >
                    Kirim Pengajuan Sekarang
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================= */}
      {/* 2. MARKETING DASHBOARD LAYOUT           */}
      {/* ======================================= */}
      {role === 'marketing' && (
        <div className="space-y-8">
          
          {/* Status cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Users size={24} />
              </div>
              <div>
                <span className="text-slate-400 rounded-full font-bold uppercase tracking-wider text-[10px]">Total Debitur Direkrut</span>
                <p className="text-2xl font-black text-slate-800">{customers.length} Debitur</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <DollarSign size={24} />
              </div>
              <div>
                <span className="text-slate-400 rounded-full font-bold uppercase tracking-wider text-[10px]">Komisi Bulanan Terkumpul</span>
                <p className="text-2xl font-black text-slate-800">Rp {(customers.length * 200000).toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Car size={24} />
              </div>
              <div>
                <span className="text-slate-400 rounded-full font-bold uppercase tracking-wider text-[10px]">Proteksi Amankan Unit</span>
                <p className="text-2xl font-black text-slate-800">100% Kondusif</p>
              </div>
            </div>
          </div>

          {/* SKEMA BAGI HASIL KOMISI PENYELAMATAN (DANA SEMENTARA) */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
            <div className="flex items-start gap-3 w-full">
              <div className="p-2.5 bg-teal-100 text-teal-800 rounded-2xl shrink-0">
                <Sparkles size={20} className="text-teal-700 font-extrabold" />
              </div>
              <div className="w-full">
                <h4 className="font-extrabold text-teal-950 text-sm sm:text-base">Informasi Pembagian Komisi Bagi Hasil Aplikator</h4>
                <p className="text-xs text-teal-850 mt-1 leading-relaxed">
                  Apabila terjadi pembatasan/penyembuhan denda (baik secara mandiri maupun ditalangi menggunakan <span className="font-bold">Dana Sementara Denda</span>) oleh kreditur ke Aplikator, skema komisi bagi hasil apresiasi yang dilimpahkan oleh Aplikator secara realtime adalah:
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="bg-white/90 border border-teal-200/50 px-3 py-1.5 rounded-xl text-teal-950 font-bold shadow-2xs flex items-center gap-1.5">
                    👥 Mitra Marketing Finance: <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">40% Komisi</strong>
                  </span>
                  <span className="bg-white/90 border border-teal-200/50 px-3 py-1.5 rounded-xl text-teal-950 font-bold shadow-2xs flex items-center gap-1.5">
                    💼 Manager Finance Pusat: <strong className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">10% Komisi</strong>
                  </span>
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-teal-200/40 text-[11px] text-teal-900 leading-relaxed font-semibold flex items-start gap-1.5">
                  <span>⚠️</span>
                  <span>Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna dan sudah bertraksaksi maksimal 3 bulan.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Users size={20} className="text-emerald-600" />
                  <span>Daftar Debitur dalam Jaringan Afiliasi Anda</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Daftar pelanggan yang terdaftar memakai kode referral Mitra ID Anda</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4  py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer self-start sm:self-auto shadow-md"
              >
                <Plus size={16} />
                <span>Daftarkan Debitur Baru</span>
              </button>
            </div>

            {/* Add customer slide/form */}
            {showAddForm && (
              <div className="mb-8 p-6 bg-emerald-50/70 border border-emerald-100 rounded-2xl animate-fade-in space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2.5">
                  <span className="font-black text-sm text-emerald-800 block">Formulir Registrasi Debitur Baru</span>
                  <X size={18} className="text-emerald-500 cursor-pointer" onClick={() => setShowAddForm(false)} />
                </div>
                
                <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nama Lengkap Debitur</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Nama Lengkap" 
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">No Handphone (Format HP)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-bold">08</span>
                      <input 
                        type="tel" 
                        required 
                        placeholder="12345678" 
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Jenis Leasing Kendaraan</label>
                    <select 
                      value={newCustLease}
                      onChange={(e) => setNewCustLease(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                    >
                      <option value="Adira Finance">Adira Finance</option>
                      <option value="FIF Group">FIF Group</option>
                      <option value="OTO Finance">OTO Finance</option>
                      <option value="Indomobil Finance">Indomobil Finance</option>
                      <option value="BAF (Bussan Auto Finance)">BAF (Bussan Auto Finance)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Merek & Seri Kendaraan</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Contoh: Yamaha NMAX 2023" 
                      value={newCustUnit}
                      onChange={(e) => setNewCustUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Besar Angsuran Bulanan (Rp)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="Contoh: 1250000" 
                      value={newCustInstallment}
                      onChange={(e) => setNewCustInstallment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all"
                    >
                      Tambahkan Pelanggan Secara Instan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Table layout responsive */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold text-slate-500">Nama Debitur</th>
                    <th className="py-3 px-4 font-bold text-slate-500">No HP</th>
                    <th className="py-3 px-4 font-bold text-slate-500">Leasing / Unit</th>
                    <th className="py-3 px-4 font-bold text-slate-500">Angsuran</th>
                    <th className="py-3 px-4 font-bold text-slate-500">Status Proteksi denda</th>
                    <th className="py-3 px-4 font-bold text-slate-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-4.5 px-4 text-slate-600">{c.phone}</td>
                      <td className="py-4.5 px-4 text-slate-700">
                        <span className="font-bold text-slate-800 block">{c.lease}</span>
                        <span className="text-xs text-slate-500">{c.unit}</span>
                      </td>
                      <td className="py-4.5 px-4 font-bold text-slate-850">{c.installment}</td>
                      <td className="py-4.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          c.status === 'Aktif Terlindungi' ? 'bg-green-100 text-green-700' :
                          c.status === 'Terlambat - Bayar Sementara' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Aktif Terlindungi' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* 3. MANAGER DASHBOARD LAYOUT             */}
      {/* ======================================= */}
      {role === 'manager' && (
        <div className="space-y-8">
          
          {/* Header metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl relative overflow-hidden shadow-lg">
              <span className="text-[10px] text-indigo-200 uppercase font-black tracking-wider block">Dana Kontingensi Penyelamatan</span>
              <p className="text-3xl font-black mt-1 text-emerald-400">Rp 2.500.000.000</p>
              <span className="text-[11px] text-indigo-300 mt-2 block font-medium">Batas Maksimal Penggunaan Periode Ini</span>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Bantuan Disetujui</span>
              <p className="text-3xl font-black mt-1 text-slate-800">{disbursedCount} Transaksi</p>
              <span className="text-[11px] text-slate-500 mt-2 block font-semibold">+12 Penyelamatan Baru Hari Ini</span>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Dana Terbayar Darurat</span>
              <p className="text-3xl font-black mt-1 text-slate-850">Rp {totalDisbursedFunds.toLocaleString('id-ID')}</p>
              <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-2 font-bold">100% Likuiditas Sehat</span>
            </div>
          </div>

          {/* SKEMA BAGI HASIL KOMISI PENYELAMATAN (DANA SEMENTARA) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
            <div className="flex items-start gap-3 w-full">
              <div className="p-2.5 bg-indigo-150 text-indigo-800 rounded-2xl shrink-0">
                <Sparkles size={20} className="text-indigo-700 font-extrabold animate-pulse" />
              </div>
              <div className="w-full">
                <h4 className="font-extrabold text-indigo-950 text-sm sm:text-base">Informasi Pembagian Komisi Bagi Hasil Aplikator</h4>
                <p className="text-xs text-indigo-850 mt-1 leading-relaxed">
                  Apabila terjadi pembatasan/penyembuhan denda (baik secara mandiri maupun ditalangi menggunakan <span className="font-bold">Dana Sementara Denda</span>) oleh kreditur yang dikelola Mitra Marketing ke Aplikator, skema komisi bagi hasil apresiasi yang dilimpahkan oleh Aplikator secara realtime adalah:
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="bg-white/90 border border-indigo-200/50 px-3 py-1.5 rounded-xl text-indigo-950 font-bold shadow-2xs flex items-center gap-1.5">
                    👥 Mitra Marketing Finance: <strong className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">40% Komisi</strong>
                  </span>
                  <span className="bg-white/90 border border-indigo-200/50 px-3 py-1.5 rounded-xl text-indigo-950 font-bold shadow-2xs flex items-center gap-1.5">
                    💼 Manager Finance Pusat: <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">10% Komisi</strong>
                  </span>
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-indigo-200/40 text-[11px] text-indigo-900 leading-relaxed font-semibold flex items-start gap-1.5">
                  <span>⚠️</span>
                  <span>Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna dan sudah bertraksaksi maksimal 3 bulan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* POTENSI DENDA KREDITUR & MARKETING DAN KOMISI MANAGER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Potential Bailout List (Kreditur & Marketing) */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <span>Potensi Penggunaan Dana Sementara Denda</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Daftar Kreditur & Marketing dengan probabilitas tinggi menggunakan talangan denda Aplikator</p>
                </div>
                {potentialDendaList.length === 0 && (
                  <button 
                    onClick={handleResetManagerDendaDemo}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
                  >
                    Reset Simulasi
                  </button>
                )}
              </div>

              {potentialDendaList.length === 0 ? (
                <div className="text-center py-10 px-4 bg-emerald-50/50 border border-emerald-150 rounded-2xl text-emerald-800 font-bold space-y-2">
                  <CheckCircle className="text-emerald-500 mx-auto" size={36} />
                  <p className="text-sm">Semua Potensi Denda Telah Diselesaikan!</p>
                  <p className="text-xs text-slate-500 font-normal">Kreditur yang dikelola Marketing Finance telah lunas denda dan komisi Manager dicarikan.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {potentialDendaList.map((item) => (
                    <div key={item.id} className="p-4 border border-slate-100 hover:border-slate-200 bg-slate-50/70 hover:bg-slate-50 rounded-2xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800 text-sm">{item.creditorName}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 font-extrabold rounded-full">{item.status}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-150 text-amber-900 font-bold rounded-full">Potensi: {item.probPercent}%</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                          <div>
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">Aset & Lease</span>
                            <span className="font-semibold text-slate-700">{item.unit} ({item.lease})</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">Mitra Marketing</span>
                            <span className="font-semibold text-teal-700">{item.marketingName}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 text-slate-700 leading-normal">
                          💰 Potensi denda terakumulasi sebesar <span className="font-bold text-red-650">Rp {item.potentialDenda.toLocaleString('id-ID')}</span>.
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-150 justify-end">
                        <button
                          onClick={() => handleSettleFineManager(item.id, item.creditorName, item.marketingName, item.potentialDenda, true)}
                          className="flex-1 md:flex-none px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-lg hover:scale-105 transition-transform active:scale-95 text-[10px] uppercase cursor-pointer"
                        >
                          Talangi via Dana Sementara
                        </button>
                        
                        <button
                          onClick={() => handleSettleFineManager(item.id, item.creditorName, item.marketingName, item.potentialDenda, false)}
                          className="flex-1 md:flex-none px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-black rounded-lg transition-colors text-[10px] uppercase cursor-pointer"
                        >
                          Selesaikan Mandiri
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Manager Commission Dashboard Menu */}
            <div className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-indigo-100/10">
                  <div>
                    <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max">Aplikator Reward</span>
                    <h4 className="font-extrabold text-lg mt-1 text-white">Menu Komisi Manager</h4>
                  </div>
                  <div className="p-2.5 bg-indigo-800/60 rounded-2xl text-yellow-400">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                </div>

                <div className="my-5 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-indigo-200 text-xs font-semibold block">Total Komisi Manager Terkumpul:</span>
                  <p className="text-3xl font-black text-yellow-400 mt-1">Rp {managerCommissionsTotal.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Komisi apresiasi atas penyehatan denda kreditur yang diawasi oleh Mitra Marketing Finance setempat.</p>
                </div>

                {/* History List */}
                <div className="space-y-3">
                  <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider block">Log Pencairan Komisi</span>
                  
                  <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                    {managerCommissionsReceived.map((log) => (
                      <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] flex justify-between items-center transition-all hover:bg-white/10">
                        <div>
                          <p className="font-extrabold text-white">{log.creditor}</p>
                          <p className="text-[10px] text-slate-400">Via: {log.marketing}</p>
                          <p className="text-[9px] text-amber-300/90">{log.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-green-400">+{log.managerCommission}</p>
                          <span className="text-[9px] text-slate-400 block">{log.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center mt-4">
                <p className="text-[10px] text-indigo-200">💰 Komisi ditransfer langsung oleh Aplikator secara realtime.</p>
              </div>
            </div>
          </div>

          {/* Queue Verification Section */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <ShieldCheck size={20} className="text-indigo-600" />
                  <span>Antrean Persetujuan Alokasi Dana Sementara</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Tinjau pengajuan debitur untuk otorisasi transfer angsuran penyelamatan dari denda leasing</p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                {requestQueue.length} Tertunda
              </span>
            </div>

            {requestQueue.length === 0 ? (
              <div className="text-center py-12 p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-emerald-800 font-bold space-y-2">
                <CheckCircle className="text-emerald-500 mx-auto" size={42} />
                <p className="text-base">Semua Antrean Bersih!</p>
                <p className="text-xs text-slate-500 font-normal">Tidak ada pengajuan alokasi dana sementara yang perlu dievaluasi saat ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requestQueue.map((item) => (
                  <div key={item.id} className="p-5 border border-gray-100 hover:border-gray-200 bg-slate-50/60 hover:bg-slate-50 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 text-sm">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-black text-slate-800">{item.name}</span>
                        <span className="text-xs text-slate-500 font-medium">({item.phone})</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs">
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px]">Aset Motor/Mobil</span>
                          <span className="font-bold text-slate-700">{item.unit}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px]">Instansi Kredit</span>
                          <span className="font-bold text-slate-700">{item.leasing}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px]">Nilai Kebutuhan</span>
                          <span className="font-extrabold text-blue-700">{item.amount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px]">Keterlambatan</span>
                          <span className="font-bold text-red-600 flex items-center gap-0.5">
                            <AlertTriangle size={12} /> {item.delayedDays} Hari
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-200/60">
                      <div className="text-left md:text-right mr-3">
                        <span className="text-[10px] text-slate-400 block font-bold">Komisi yang diterima</span>
                        <span className="text-sm font-black text-emerald-600">
                          Rp {Math.floor(parseInt(item.amount.replace(/\D/g, '')) * 0.15).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
