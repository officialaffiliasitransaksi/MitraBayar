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
  Calendar,
  ShoppingBag,
  Tag,
  Home,
  MessageCircle,
  Search,
  Filter,
  Check,
  Layers,
  Percent,
  MapPin,
  Building,
  Lock,
  Unlock
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
import AdminDashboard from './AdminDashboard';

interface RoleDashboardsProps {
  role: 'customer' | 'marketing' | 'manager' | 'admin';
  userIdentifier: string;
  onLogout: () => void;
}

// Initial Mock Data
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Budi Santoso', phone: '081299881122', lease: 'FIF Group', unit: 'Honda Scoopy 2023', installment: 'Rp 850.000', status: 'Aktif Terlindungi', debtStatus: 'Belum Lunas', remainingDebt: 8500000, bpkbStatus: 'Noted (Ditahan)', invoiceClaimCreated: false },
  { id: 2, name: 'Siti Aminah', phone: '085711223344', lease: 'Adira Finance', unit: 'Toyota Avanza 2021', installment: 'Rp 3.400.000', status: 'Terlambat - Bayar Sementara', debtStatus: 'Masa Pelunasan', remainingDebt: 3400000, bpkbStatus: 'Noted (Ditahan)', invoiceClaimCreated: true },
  { id: 3, name: 'Farhan Azis', phone: '089900112233', lease: 'OTO Finance', unit: 'Yamaha NMAX 2022', installment: 'Rp 1.250.000', status: 'Menunggu Verifikasi', debtStatus: 'Belum Lunas', remainingDebt: 12500000, bpkbStatus: 'Noted (Ditahan)', invoiceClaimCreated: false },
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

const INITIAL_MARKETING_PARTNERS = [
  { id: 'MB-7789', name: 'Andi Pratama', code: 'MB-7789', phone: '081299881122', email: 'andi.pratama@mitrabayar.co.id', status: 'Aktif Partner', region: 'DKI Jakarta', tier: 'Gold Specialist' },
  { id: 'MB-308', name: 'Rina Astuti', code: 'MB-308', phone: '085799887766', email: 'rina.astuti@mitrabayar.co.id', status: 'Aktif Partner', region: 'Jawa Barat', tier: 'Senior Consultant' },
  { id: 'MB-101', name: 'Bambang Sudewo', code: 'MB-101', phone: '085711223344', email: 'bambang.s@mitrabayar.co.id', status: 'Aktif Partner', region: 'Jawa Tengah', tier: 'Executive Referral' },
  { id: 'MB-552', name: 'Adi Saputra', code: 'MB-552', phone: '081233445566', email: 'adi.saputra@mitrabayar.co.id', status: 'Aktif Partner', region: 'Jawa Timur', tier: 'Partner Advisor' },
];

export default function RoleDashboards({ role, userIdentifier, onLogout }: RoleDashboardsProps) {
  // Common states
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedCustId, setSelectedCustId] = useState<number | string>(2); // Default to Siti Aminah (Masa Pelunasan)


  // Customer Dashboard states
  const [customerUnit, setCustomerUnit] = useState('Honda Vario 160 (2023)');
  const [customerLeasing, setCustomerLeasing] = useState('Adira Finance');
  const [customerInstallment, setCustomerInstallment] = useState('Rp 920.000');
  const [emergencyFundsUsed, setEmergencyFundsUsed] = useState(0); 
  const [requestPopup, setRequestPopup] = useState(false);
  const [reqAmount, setReqAmount] = useState('920000');
  const [reqReason, setReqReason] = useState('Kendala keterlambatan gajian dari kantor');

  // States for Debitur/Peminjam's Fine and Marketing Commission
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // E-Commerce states
  const [marketingTab, setMarketingTab] = useState<'summary' | 'ecommerce'>('summary');
  const [ecommerceAssets, setEcommerceAssets] = useState<any[]>([
    {
      id: 'ast-101',
      category: 'motor',
      title: 'Akomodasi Likuidasi FIF Group',
      type: 'Honda ADV 160 ABS 2023',
      biller: 'FIF Group',
      creditTag: 'TAG-ECC-8812',
      liquidationPrice: 18500000,
      marketPrice: 34000000,
      condition: 'Mulus 95%, Pajak Jalan, Kunci Lengkap',
      location: 'Surabaya Timur',
      status: 'Ready',
      description: 'Unit tarikan jaminan macet milik debitur FIF. Selisih harga tebus sangat tinggi dibandingkan harga pasaran luar.'
    },
    {
      id: 'ast-102',
      category: 'motor',
      title: 'Lelang Tebusan Terbatas Adira',
      type: 'Yamaha XMAX 250 Connected 2022',
      biller: 'Adira Finance',
      creditTag: 'TAG-ECC-1122',
      liquidationPrice: 35000000,
      marketPrice: 58000000,
      condition: 'Kilometer rendah (12rb km), Variasi Ringan',
      location: 'DKI Jakarta',
      status: 'Ready',
      description: 'Aset jaminan diserahkan sukarela oleh debitur terdahulu. Surat dilepas resmi dari kelembagaan.'
    },
    {
      id: 'ast-103',
      category: 'mobil',
      title: 'Aset Sitaan Premium BCA Finance',
      type: 'Toyota Innova Reborn 2.4 V Diesel AT 2019',
      biller: 'BCA Finance',
      creditTag: 'TAG-ECC-5544',
      liquidationPrice: 195000000,
      marketPrice: 285000000,
      condition: 'Mesin Kering, Kaki-kaki Sunyi, Interior Orisinil',
      location: 'Bandung Kota',
      status: 'Ready',
      description: 'Transmisi matic responsif. BPKB dalam status release dan siap balik nama langsung.'
    },
    {
      id: 'ast-104',
      category: 'mobil',
      title: 'Satya Murah Likuidasi OTO',
      type: 'Honda Brio Satya 1.2 E CVT 2021',
      biller: 'OTO Finance',
      creditTag: 'TAG-ECC-4433',
      liquidationPrice: 82500000,
      marketPrice: 135000000,
      condition: 'Kunci Serep Ada, Warna Putih Favorit, Record Dealer',
      location: 'Semarang Candi',
      status: 'Proses',
      description: 'Sedang peninjauan berkas tebusan bersama penjamin. Siap dipihak-ketigakan kembali.'
    },
    {
      id: 'ast-105',
      category: 'rumah',
      title: 'KPR Macet BTN Syariah',
      type: 'Rumah Hunian Minimalis Modern Type 45/90',
      biller: 'BTN Syariah',
      creditTag: 'TAG-ECC-3322',
      liquidationPrice: 245000000,
      marketPrice: 450000000,
      condition: 'SHM, Listrik 1300W, Air Sumur Bersih, 2 KT 1 KM',
      location: 'Malang Dinoyo',
      status: 'Ready',
      description: 'Kawasan bebas banjir, siap huni. Likuidasi cepat akibat gagal angsuran akhir tahun ke-3.'
    },
    {
      id: 'ast-106',
      category: 'rumah',
      title: 'Ruko Usaha Mandiri Macet',
      type: 'Ruko Niaga Strategis 2 Lantai',
      biller: 'Bank Mandiri',
      creditTag: 'TAG-ECC-9900',
      liquidationPrice: 450000000,
      marketPrice: 850000000,
      condition: 'SHGB, Parkiran Luas, Pinggir Jalan Utama Raya',
      location: 'Sidoarjo',
      status: 'Ready',
      description: 'Sangat cocok untuk kantor, toko, atau minimarket. Harga jual cepat di bawah NJOP.'
    }
  ]);
  const [ecCategoryFilter, setEcCategoryFilter] = useState<string>('semua');
  const [ecSearch, setEcSearch] = useState<string>('');
  const [showAddAssetForm, setShowAddAssetForm] = useState<boolean>(false);
  const [newAssetCategory, setNewAssetCategory] = useState<'motor' | 'mobil' | 'rumah'>('motor');
  const [newAssetType, setNewAssetType] = useState<string>('');
  const [newAssetBiller, setNewAssetBiller] = useState<string>('Adira Finance');
  const [newAssetTag, setNewAssetTag] = useState<string>('');
  const [newAssetLiqPrice, setNewAssetLiqPrice] = useState<string>('');
  const [newAssetMktPrice, setNewAssetMktPrice] = useState<string>('');
  const [newAssetCondition, setNewAssetCondition] = useState<string>('');
  const [newAssetLocation, setNewAssetLocation] = useState<string>('');
  const [newAssetDesc, setNewAssetDesc] = useState<string>('');
  const [bidValue, setBidValue] = useState<{ [key: string]: string }>({});
  const [selectedSimulateAsset, setSelectedSimulateAsset] = useState<any | null>(null);
  const [simulateTenor, setSimulateTenor] = useState<number>(12);

  // Manager states
  const [requestQueue, setRequestQueue] = useState<any[]>([]);
  const [disbursedCount, setDisbursedCount] = useState(1428);
  const [totalDisbursedFunds, setTotalDisbursedFunds] = useState(1935000000);

  // Manager states for fine tracking and commissions from applicator
  const [managerCommissionsTotal, setManagerCommissionsTotal] = useState(1250000);
  const [managerCommissionsReceived, setManagerCommissionsReceived] = useState<any[]>([]);
  const [potentialDendaList, setPotentialDendaList] = useState<any[]>([]);
  const [mktSearch, setMktSearch] = useState('');
  const [selectedInvoiceCreditor, setSelectedInvoiceCreditor] = useState<any | null>(null);
  const [bpkbSearch, setBpkbSearch] = useState('');

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
              debtStatus: c.debtStatus,
              remainingDebt: c.remainingDebt,
              bpkbStatus: c.bpkbStatus,
              invoiceClaimCreated: c.invoiceClaimCreated,
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
  
  const handleUpdateDebtStatus = async (id: string | number, newDebtStatus: string, remainingDebtVal?: number) => {
    try {
      const updateData: any = { debtStatus: newDebtStatus };
      if (newDebtStatus === 'Masa Pelunasan') {
        updateData.invoiceClaimCreated = true;
      }
      if (newDebtStatus === 'Lunas') {
        updateData.remainingDebt = 0;
        updateData.bpkbStatus = 'Released (Diserahkan)';
        updateData.invoiceClaimCreated = false;
      } else if (remainingDebtVal !== undefined) {
        updateData.remainingDebt = remainingDebtVal;
      }
      await updateDoc(doc(db, 'customers', String(id)), updateData);
      triggerSuccess(`Status debitur/peminjam berhasil diperbarui ke '${newDebtStatus}'!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `customers/${id}`);
    }
  };

  const handleProcessClaimWithdrawReport = async (id: string | number, creditorName: string) => {
    try {
      await updateDoc(doc(db, 'customers', String(id)), {
        debtStatus: 'Lunas',
        remainingDebt: 0,
        bpkbStatus: 'Released (Diserahkan)',
        invoiceClaimCreated: false
      });
      setSelectedInvoiceCreditor(null);
      triggerSuccess(`Sukes! Invoice Klaim Penarikan Laporan disetujui, Berkas Penarikan Unit ${creditorName} telah otomatis ditarik dari Sistem Leasing & BPKB dinyatakan Release.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `customers/${id}`);
    }
  };

  const activeCustomer = customers.find(c => String(c.id) === String(selectedCustId)) || {
    id: 2,
    name: 'Siti Aminah',
    phone: '085711223344',
    lease: 'Adira Finance',
    unit: 'Toyota Avanza 2021',
    installment: 'Rp 3.400.000',
    status: 'Terlambat - Bayar Sementara',
    debtStatus: 'Masa Pelunasan',
    remainingDebt: 3400000,
    bpkbStatus: 'Noted (Ditahan)',
    invoiceClaimCreated: true
  };

  const displayUser = userIdentifier || "User Demo";

  // Filter customers for marketing search and status queries
  const filteredCustomers = customers.filter(c => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(term) || 
      (c.phone || '').includes(term) ||
      (c.unit || '').toLowerCase().includes(term) ||
      (c.lease || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'Semua' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    triggerSuccess('Simulasi penyembuhan denda debitur/peminjam disetel ulang.');
  };

  // Marketing action: add client
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustUnit || !newCustInstallment) {
      triggerSuccess('Tolong lengkapi semua kolom pendaftaran!');
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
    <div className="w-full bg-gradient-to-br from-white/95 via-[#f0f9ff]/95 to-[#e0f2fe]/75 border border-blue-100/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-md select-none font-sans backdrop-blur-md">

      
      {/* Banner / Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className={`py-1 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              role === 'customer' ? 'bg-blue-100 text-blue-700' :
              role === 'marketing' ? 'bg-emerald-100 text-emerald-700' :
              'bg-indigo-100 text-indigo-700'
            }`}>
              Portal {role === 'customer' ? 'Debitur/Peminjam' : role === 'marketing' ? 'Marketing Finance' : 'Manager Finance'}
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
        <div className="space-y-6">
          
          {/* SIMULATION CONTROLLER */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row hover:border-indigo-200 transition-all justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles size={11} className="text-indigo-600" /> SIMULATOR CONTOH ALUR MULTI-SKENARIO
              </span>
              <h3 className="text-base font-black text-slate-850 flex items-center gap-1.5">
                Simulasi Kasus & Akun Contoh Debitur/Peminjam
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl">
                Alur sistem dirancang realtime & sinkron. Klik salah satu profil di bawah untuk memuat profil aset, status BPKB, sisa outstanding, dan live claim invoice.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
              {customers.map((c) => {
                const debtStatus = c.debtStatus || (c.id === 2 ? 'Masa Pelunasan' : 'Belum Lunas');
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCustId(c.id);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 border ${
                      selectedCustId === c.id
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-700 shadow-md shadow-indigo-600/10'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-extrabold">{c.name}</p>
                      <p className="text-[9px] opacity-80">{c.unit.split(' ')[0]} - {debtStatus}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
                    <h3 className="text-xl sm:text-2xl font-black mt-1">{activeCustomer.unit || customerUnit}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-blue-200 block uppercase font-semibold">Leasing Terdaftar</span>
                      <span className="text-sm font-bold">{activeCustomer.lease || customerLeasing}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-200 block uppercase font-semibold">Besar Angsuran</span>
                      <span className="text-sm font-bold">{activeCustomer.installment || customerInstallment} / Bln</span>
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
                  <p className="text-xs text-slate-500 mt-0.5">Layanan penanganan keterlambatan dari aplikator untuk melidungi debitur/peminjam dari risiko sita unit.</p>
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
                          ��️ Anda sangat direkomendasikan mengaktifkan alokasi **Dana Sementara Denda** dari aplikator agar nama kredit Anda tetap bersih, berperingkat Lunas Lancar, dan terhindar dari keterlambatan denda.
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

            {/* NEW MODULE: SISTEM PENAHANAN BPKB & KLAIM INVOICE PENARIKAN (INTERACTIVE DEMO) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 border border-slate-750/70 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                  <ShieldCheck size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#f1f5f9] text-base">Status Penahanan BPKB & Berkas Penarikan</h4>
                  <p className="text-[11px] text-slate-400">Sistem otomatisasi penahanan, terbit klaim invoice, dan pencabutan surat jalan penarikan unit.</p>
                </div>
              </div>

              {/* Educational Workflow Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-705/50 border-slate-700/50 text-[10.5px]">
                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-1">
                  <span className="inline-flex items-center gap-1.5 font-bold text-indigo-400">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[9px]">1</span>
                    BPKB Aman Ditahan
                  </span>
                  <p className="text-slate-400 leading-normal">Selama status kredit Belum Lunas, dokumen BPKB resmi ditahan di khazanah sistem untuk proteksi preventif.</p>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-1">
                  <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-305 flex items-center justify-center text-[9px]">2</span>
                    Klaim Invoice Otomatis
                  </span>
                  <p className="text-slate-400 leading-normal">Saat masuk Masa Pelunasan, sistem otomatis mencetak Invoice Klaim guna menarik kuasa tim pencari di lapangan.</p>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-1">
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-305 flex items-center justify-center text-[9px]">3</span>
                    BPKB Rilis Instan
                  </span>
                  <p className="text-slate-400 leading-normal">Pembayaran Invoice Klaim menyelesaikan status. BPKB otomatis rilis (Released) dan siap diserahterimakan.</p>
                </div>
              </div>

              {/* Status Display Area */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-800 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">Debitur Aktif</span>
                    <p className="font-extrabold text-white text-sm">{activeCustomer.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Status BPKB:</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${
                      (activeCustomer.bpkbStatus || '').includes('Released')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {(activeCustomer.bpkbStatus || '').includes('Released') ? <Unlock size={11} /> : <Lock size={11} />}
                      {activeCustomer.bpkbStatus || (activeCustomer.debtStatus === 'Lunas' ? 'Released (Diserahkan)' : 'Noted (Ditahan)')}
                    </span>
                  </div>
                </div>

                {activeCustomer.debtStatus === 'Belum Lunas' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-200 leading-relaxed text-[11px]">
                      🔒 <strong>BPKB Ditahan (Noted):</strong> Sisa kredit berjalan milik <strong>{activeCustomer.name}</strong> belum lunas sebesar <strong>Rp {activeCustomer.remainingDebt !== undefined ? activeCustomer.remainingDebt.toLocaleString('id-ID') : '8.500.000'}</strong>. Laporan penarikan siaga aktif untuk jaminan keamanan leasing.
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <p className="font-bold text-slate-200">Uji Coba Alur Otomatisasi Klaim</p>
                        <p className="text-[10px] text-slate-400">Masuk masa pelunasan untuk mencetak draf Invoice Klaim Penarikan secara instan.</p>
                      </div>
                      <button
                        onClick={() => handleUpdateDebtStatus(activeCustomer.id, 'Masa Pelunasan')}
                        className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-[10.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer active:scale-95 transition-transform shrink-0"
                      >
                        Masa Pelunasan
                      </button>
                    </div>
                  </div>
                )}

                {activeCustomer.debtStatus === 'Masa Pelunasan' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-200 leading-relaxed text-[11px]">
                      ⚡ <strong>Masuk Masa Pelunasan:</strong> Tagihan denda berjalan & angsuran sedang dimonitor. Sistem menerbitkan <strong>Invoice Klaim Menarik Laporan</strong> untuk mencabut surat jalan Tim Lapangan secara tersistem.
                    </div>

                    {/* Draf Invoice Visual */}
                    <div className="bg-white text-slate-800 rounded-2xl p-4 font-sans border-2 border-dashed border-indigo-400 shadow-xl relative overflow-hidden">
                      <div className="absolute top-2 right-2 border-2 border-indigo-600/30 text-indigo-600/30 text-[9px] font-black tracking-widest px-2 py-0.5 uppercase transform rotate-12">
                        INVOICE KLAIM
                      </div>
                      <div className="flex justify-between items-start border-b border-slate-200 pb-2 mb-3">
                        <div>
                          <p className="font-bold text-indigo-900 text-xs tracking-wide">MITRA BAYAR DIGITAL</p>
                          <p className="text-[9px] text-slate-500">Sistem Otomatisasi Klaim Jaminan Terpadu</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[9px] font-bold text-slate-700">INV/CLAIM/MB-{activeCustomer.id}</p>
                          <p className="text-[9px] text-slate-400">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-[10.5px] text-slate-600 font-medium">
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Nasabah Debitur:</span>
                          <span className="font-bold text-slate-800">{activeCustomer.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Mitra Leasing:</span>
                          <span className="font-bold text-slate-800">{activeCustomer.lease}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Jenis Mobil/Motor:</span>
                          <span className="font-bold text-slate-800">{activeCustomer.unit}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Uraian Penyehatan:</span>
                          <span className="font-bold text-indigo-700">Pencabutan Berkas Laporan & Rilis BPKB</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1.5 font-bold">
                          <span className="text-slate-700 text-xs">Total Sisa Tebusan Pokok:</span>
                          <span className="text-slate-900 text-xs font-black">Rp {activeCustomer.remainingDebt?.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => handleProcessClaimWithdrawReport(activeCustomer.id, activeCustomer.name)}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-750 text-white text-[10px] font-black rounded-lg uppercase tracking-wide cursor-pointer text-center hover:scale-[1.01] active:scale-95 transition-all text-block shadow-md block"
                        >
                          Simulasikan Pelunasan & Rilis Jaminan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCustomer.debtStatus === 'Lunas' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-300 leading-relaxed text-[11px] font-semibold">
                      🎉 <strong>Kredit Lunas & Laporan Berhasil Dicabut:</strong>
                      <p className="text-[10px] font-normal text-emerald-400 mt-1">
                        Sistem Mitra Bayar telah menyiarkan clearance ke server tracking lapangan. BPKB dinyatakan <strong className="text-emerald-300">Released (Diserahkan)</strong> dan dapat diambil di Kantor Cabang terdekat.
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateDebtStatus(activeCustomer.id, 'Belum Lunas', 8500000)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-300 border border-slate-800 text-[10px] font-bold rounded-lg uppercase pointer-events-auto cursor-pointer"
                    >
                      Ulangi Simulasi (Reset ke Belum Lunas)
                    </button>
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
      </div>
    )}

      {/* ======================================= */}
      {/* 2. MARKETING DASHBOARD LAYOUT           */}
      {/* ======================================= */}
      {role === 'marketing' && (
        <div className="space-y-8 border-t border-slate-100 pt-3">
          
          {/* Header Panel with Custom Subrouting Tabs */}
          <div className="bg-white border border-slate-105 rounded-[1.8rem] p-5 shadow-3xs flex flex-col md:flex-row justify-between items-center gap-5 text-left">
            <div className="flex-1 w-full md:w-auto">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-extrabold text-[11px] uppercase tracking-widest inline-block mb-1">�� Portal Partner Marketing Finance</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Debitur/Peminjam & E-Commerce Jaminan</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Grup Afiliasi ID: <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{userIdentifier || 'MB-7789'}</span></p>
            </div>
            
            {/* Elegant Sub-navigation Tabs */}
            <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-full md:w-auto border border-slate-205/30 shrink-0">
              <button
                onClick={() => setMarketingTab('summary')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  marketingTab === 'summary' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users size={15} />
                <span>Ringkasan & Debitur</span>
              </button>
              
              <button
                onClick={() => setMarketingTab('ecommerce')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all relative cursor-pointer ${
                  marketingTab === 'ecommerce' 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingBag size={15} />
                <span>E-Commerce Jual Beli Aset</span>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </button>
            </div>
          </div>

          {marketingTab === 'summary' ? (
            <div className="space-y-8 animate-fade-in text-left">
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
                  Apabila terjadi pembatasan/penyembuhan denda (baik secara mandiri maupun ditalangi menggunakan <span className="font-bold">Dana Sementara Denda</span>) oleh debitur/peminjam ke Aplikator, skema komisi bagi hasil apresiasi yang dilimpahkan oleh Aplikator secara realtime adalah:
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="bg-white/90 border border-teal-200/50 px-3 py-1.5 rounded-xl text-teal-950 font-bold shadow-2xs flex items-center gap-1.5">
                    �� Mitra Marketing Finance: <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">40% Komisi</strong>
                  </span>
                  <span className="bg-white/90 border border-teal-200/50 px-3 py-1.5 rounded-xl text-teal-950 font-bold shadow-2xs flex items-center gap-1.5">
                    �� Manager Finance Pusat: <strong className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">10% Komisi</strong>
                  </span>
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-teal-200/40 text-[11px] text-teal-900 leading-relaxed font-semibold flex items-start gap-1.5">
                  <span>⚠️</span>
                  <span>Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna dan sudah bertraksaksi maksimal 3 bulan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI ILUSTRASI KONDISI KREDITUR BINAAN (ID TAGIHAN, PINJAMAN, ANGSURAN, DENDA) */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-105 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={16} /></span>
                  <span>Ilustrasi Kondisi Finansial Debitur/Peminjam Binaan</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Visualisasi komprehensif profil tagihan, denda berjalan, tenor, sisa plafon, serta riwayat pendanaan talangan
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-[10px] font-black text-amber-700 border border-amber-100">
                  Total Kelolaan: Rp 81.800.000
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 rounded-lg text-[10px] font-black text-emerald-700 border border-emerald-100">
                  Rasio Aman: 92%
                </span>
              </div>
            </div>

            {/* Bento-style metrics of the portfolio illustration */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <span className="text-[9px] text-indigo-805 block font-black uppercase tracking-wider">Debitur/Peminjam Rekrutan</span>
                <span className="text-sm sm:text-base font-sans font-black text-indigo-950 block mt-1">4 Jiwa</span>
                <span className="text-[9px] text-indigo-600 font-semibold mt-0.5">Aktif binaan langsung Anda</span>
              </div>
              <div className="p-3.5 bg-slate-50/85 border border-slate-100 rounded-2xl">
                <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Total Pinjaman (Plafon)</span>
                <span className="text-sm sm:text-base font-mono font-black text-slate-800 block mt-1">Rp 81.800.000</span>
                <span className="text-[9px] text-slate-450 block font-semibold mt-0.5">Akumulasi limit 4 debitur/peminjam</span>
              </div>
              <div className="p-3.5 bg-slate-50/85 border border-slate-100 rounded-2xl">
                <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Angsuran Bulanan</span>
                <span className="text-sm sm:text-base font-mono font-black text-indigo-600 block mt-1">Rp 3.610.000</span>
                <span className="text-[9px] text-indigo-505 block font-semibold mt-0.5">&Sigma; Kewajiban bulan berjalan</span>
              </div>
              <div className="p-3.5 bg-amber-50/40 border border-amber-100/60 rounded-2xl">
                <span className="text-[9px] text-amber-805 block font-black uppercase tracking-wider">Denda Jatuh Tempo</span>
                <span className="text-sm sm:text-base font-mono font-black text-red-600 block mt-1">Rp 625.000</span>
                <span className="text-[9px] text-amber-600 font-semibold mt-0.5">2 Debitur/Peminjam terlambat denda</span>
              </div>
              <div className="p-3.5 bg-emerald-50/30 border border-emerald-100/60 rounded-2xl">
                <span className="text-[9px] text-emerald-805 block font-black uppercase tracking-wider">Bonus Komisi Estimasi</span>
                <span className="text-sm sm:text-base font-mono font-black text-emerald-600 block mt-1">Rp 250.005</span>
                <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Komisi 40% denda ditalangi</span>
              </div>
            </div>

            {/* Simulated Live interactive controller */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {/* Card 1: Budi Santoso */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                        TAG-9023-BS
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">Budi Santoso</h4>
                      <p className="text-[9px] text-slate-400 font-mono">0812-9988-1122</p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-md text-[9px] font-black">
                      Lancar
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-dashed border-slate-100 py-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pembiayaan:</span>
                      <span className="font-bold text-slate-700">Adira Finance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unit:</span>
                      <span className="font-semibold text-slate-600 truncate max-w-[110px]">Honda Scoopy 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jumlah Pinjaman:</span>
                      <span className="font-bold text-slate-800 font-mono">Rp 18.500.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nilai Angsuran:</span>
                      <span className="font-mono text-indigo-650 font-bold">Rp 850.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Denda Berjalan:</span>
                      <span className="font-mono text-green-600 font-bold">Rp 0</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Tenor: 12 / 24 bln</span>
                  <span className="text-green-600 font-extrabold flex items-center gap-0.5">
                    <CheckCircle size={10} /> Terlindungi
                  </span>
                </div>
              </div>

              {/* Card 2: Siti Aminah */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-md font-mono">
                        TAG-4411-SA
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">Siti Aminah</h4>
                      <p className="text-[9px] text-slate-400 font-mono">0857-1122-3344</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-[9px] font-black animate-pulse">
                      Terlambat 4 Hari
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-dashed border-slate-100 py-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pembiayaan:</span>
                      <span className="font-bold text-slate-700">FIF Group</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unit:</span>
                      <span className="font-semibold text-slate-600 truncate max-w-[110px]">Suzuki NEX II 2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jumlah Pinjaman:</span>
                      <span className="font-bold text-slate-800 font-mono">Rp 14.200.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nilai Angsuran:</span>
                      <span className="font-mono text-indigo-650 font-bold">Rp 720.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Denda Berjalan:</span>
                      <span className="font-mono text-red-650 font-extrabold bg-red-50 px-1 rounded">Rp 145.000</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                    <span>Tenor: 6 / 18 Bln</span>
                    <span className="text-amber-600 font-bold">Dana Sementara</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerSuccess('Sukses simulasi! Dana Talangan Rp 145.000 disalurkan ke FIF Group. Sisa Denda Siti Aminah terbayar Rp 0. Komisi marketing 40% (Rp 58.000 / Rp 145.000 denda) dialokasikan.');
                    }}
                    className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg text-[10px] shadow-2xs hover:from-amber-600 active:scale-95 transition cursor-pointer"
                  >
                    Simulasikan Talangan
                  </button>
                </div>
              </div>

              {/* Card 3: Farhan Azis */}
              <div className="bg-white border-2 border-red-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded-md font-mono">
                        TAG-1155-FA
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">Farhan Azis</h4>
                      <p className="text-[9px] text-slate-400 font-mono">0899-0011-2233</p>
                    </div>
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-md text-[9px] font-black animate-bounce">
                      Terlambat 8 Hari
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-dashed border-slate-100 py-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pembiayaan:</span>
                      <span className="font-bold text-slate-700">Adira Finance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unit:</span>
                      <span className="font-semibold text-slate-600 truncate max-w-[110px]">Yamaha NMAX 2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jumlah Pinjaman:</span>
                      <span className="font-bold text-slate-800 font-mono">Rp 32.000.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nilai Angsuran:</span>
                      <span className="font-mono text-indigo-650 font-bold">Rp 1.250.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Denda Berjalan:</span>
                      <span className="font-mono text-red-700 font-black bg-red-100 px-1 rounded animate-pulse">Rp 480.000</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                    <span>Tenor: 24 / 36 Bln</span>
                    <span className="text-red-700 font-bold font-sans">Risiko Sita</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerSuccess('Sukses simulasi! Dana Talangan Rp 480.000 disalurkan ke Adira Finance. Denda Farhan Azis disembuhkan. Komisi marketing 40% (Rp 192.000) dialokasikan.');
                    }}
                    className="w-full py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg text-[10px] shadow-2xs hover:from-red-655 active:scale-95 transition cursor-pointer"
                  >
                    Darurat Talangi Denda
                  </button>
                </div>
              </div>

              {/* Card 4: Hendra Wijaya */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md font-mono">
                        TAG-7819-HW
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">Hendra Wijaya</h4>
                      <p className="text-[9px] text-slate-400 font-mono">0852-9988-7755</p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-[9px] font-black">
                      Baru Registrasi
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-dashed border-slate-100 py-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pembiayaan:</span>
                      <span className="font-bold text-slate-700">OTO Finance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unit:</span>
                      <span className="font-semibold text-slate-600 truncate max-w-[110px]">Honda Beat Sporty</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jumlah Pinjaman:</span>
                      <span className="font-bold text-slate-800 font-mono">Rp 17.100.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nilai Angsuran:</span>
                      <span className="font-mono text-indigo-650 font-bold">Rp 790.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Denda Berjalan:</span>
                      <span className="font-mono text-green-600 font-bold">Rp 0</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Tenor: 35 / 36 bln</span>
                  <span className="text-indigo-650 font-extrabold flex items-center gap-0.5">
                    <Sparkles size={10} /> Garansi Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Users size={20} className="text-emerald-600" />
                  <span>Daftar & Manajemen Data Debitur/Peminjam</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Data debitur/peminjam (pelanggan/debitur) yang terdaftar memakai kode referral Mitra ID Anda</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4  py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer self-start sm:self-auto shadow-md"
              >
                <Plus size={16} />
                <span>Daftarkan Debitur/Peminjam Baru</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-slate-50/75 p-4 rounded-2xl border border-slate-100">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Cari nama debitur/peminjam, no handphone, leasing, atau unit..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:w-48">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif Terlindungi">Aktif Terlindungi</option>
                  <option value="Terlambat - Bayar Sementara">Terlambat - Bayar Sementara</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                </select>
              </div>
            </div>

            {/* Add customer slide/form */}
            {showAddForm && (
              <div className="mb-8 p-6 bg-emerald-50/70 border border-emerald-100 rounded-2xl animate-fade-in space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2.5">
                  <span className="font-black text-sm text-emerald-800 block">Formulir Registrasi Debitur/Peminjam Baru</span>
                  <X size={18} className="text-emerald-500 cursor-pointer" onClick={() => setShowAddForm(false)} />
                </div>
                
                <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nama Lengkap Debitur/Peminjam</label>
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
                      Tambahkan Debitur/Peminjam Secara Instan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-55/40 rounded-2xl border border-slate-100 text-slate-500 font-medium">
                <p className="text-sm">Data Debitur/Peminjam tidak ditemukan</p>
                <p className="text-xs text-slate-400 font-normal mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
              </div>
            ) : (
              /* Table layout responsive */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold text-slate-500">Nama Debitur/Peminjam</th>
                      <th className="py-3 px-4 font-bold text-slate-500">No HP</th>
                      <th className="py-3 px-4 font-bold text-slate-500">Debitur/Peminjam Leasing / Unit Aset</th>
                      <th className="py-3 px-4 font-bold text-slate-500">Angsuran Bulanan</th>
                      <th className="py-3 px-4 font-bold text-slate-500">Status Proteksi Denda</th>
                      <th className="py-3 px-4 font-bold text-slate-500 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredCustomers.map((c) => (
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
            )}
          </div>

        </div>
      ) : (
        /* ==================================================== */
        /* E-COMMERCE PORTAL: JUAL BELI ASET JAMINAN PEMBIAYAAN */
        /* ==================================================== */
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* Banner Hero */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-750 to-teal-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
              <ShoppingBag size={300} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                �� Pasar Likuidasi Jaminan Macet
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white mt-3 leading-tight">
                Sentra Tebus Aset Jaminan Pembiayaan (Over-Kredit)
              </h3>
              <p className="text-xs sm:text-sm text-emerald-105 mt-2 leading-relaxed font-medium">
                Platform e-commerce eksklusif penyelesaian aset jaminan nasabah binaan yang mengalami gagal bayar. Dapatkan aset Motor, Mobil, & Rumah berkualitas dengan diskonto tinggi (30% - 50% di bawah harga pasar) legal, aman, langsung dari lembaga pembiayaan mitra tebus.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Layers size={16} />
                <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block">Total Aset Listing</span>
              </div>
              <span className="text-xl font-black text-slate-800 font-mono">{ecommerceAssets.length} Unit</span>
              <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Motor, Mobil, & Properti</span>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Percent size={16} />
                <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block">Rata-rata Diskonto</span>
              </div>
              <span className="text-xl font-black text-indigo-600 font-mono">35% - 48%</span>
              <span className="text-[9px] text-indigo-500 block font-semibold mt-0.5">Di bawah harga pasar umum</span>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Check size={16} />
                <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block">Keabsahan Legalitas</span>
              </div>
              <span className="text-xl font-black text-amber-600">100% Valid</span>
              <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Berita acara pelepasan resmi</span>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <Tag size={16} />
                <span className="text-[10px] text-slate-455 font-extrabold uppercase tracking-wider block font-sans">Sistem Tebus</span>
              </div>
              <span className="text-xl font-black text-rose-600">Over Kredit</span>
              <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Sisa tenor & angsuran fleksi</span>
            </div>
          </div>

          {/* Controls: Search, Category Filter, and Add asset button */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit border border-slate-200/50 text-xs font-bold text-slate-600">
              {['semua', 'motor', 'mobil', 'rumah'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEcCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-lg font-black transition capitalize cursor-pointer ${
                    ecCategoryFilter === cat
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {cat === 'semua' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>

            {/* Search Input & Action Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1 md:justify-end">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari tipe kendaraan, nama asisten, denda, atau lokasi..."
                  value={ecSearch}
                  onChange={(e) => setEcSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <button
                onClick={() => setShowAddAssetForm(!showAddAssetForm)}
                className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                <Plus size={15} />
                <span>Upload Aset Likuidasi</span>
              </button>
            </div>
          </div>

          {/* Form Create New Asset */}
          {showAddAssetForm && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-6 shadow-3xs space-y-4 animate-fade-in text-left">
              <div className="flex justify-between items-center border-b border-emerald-200/40 pb-2.5">
                <div>
                  <h4 className="font-black text-sm text-emerald-800">Tambahkan Aset Lelang / Likuidasi Jaminan</h4>
                  <p className="text-[11px] text-emerald-600/80 font-semibold mt-0.5">Asosiasikan aset sitaan milik nasabah gagal bayar untuk ditawarkan tebus ke investor atau publik</p>
                </div>
                <button 
                  onClick={() => setShowAddAssetForm(false)} 
                  className="p-1 text-emerald-500 hover:text-emerald-700 rounded-full hover:bg-emerald-100/50 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newAssetType || !newAssetLiqPrice) {
                  triggerSuccess('Isi data wajib terlebih dahulu!');
                  return;
                }
                const newAsset = {
                  id: `ast-${Date.now()}`,
                  category: newAssetCategory,
                  title: `Peletakan Hak Tagih ${newAssetBiller}`,
                  type: newAssetType,
                  biller: newAssetBiller,
                  creditTag: newAssetTag || `TAG-ECC-${Math.floor(1000 + Math.random() * 9000)}`,
                  liquidationPrice: Number(newAssetLiqPrice),
                  marketPrice: Number(newAssetMktPrice) || Number(newAssetLiqPrice) * 1.5,
                  condition: newAssetCondition || 'Kondisi Sesuai Standar Unit Tarikan Jaminan',
                  location: newAssetLocation || 'Gudang Pusat',
                  status: 'Ready',
                  description: newAssetDesc || 'Unit dalam proses penyerahan sukarela secara mufakat oleh nasabah dan siap dinalangi atau dilelang tebus.'
                };
                setEcommerceAssets([newAsset, ...ecommerceAssets]);
                // Reset form
                setNewAssetType('');
                setNewAssetTag('');
                setNewAssetLiqPrice('');
                setNewAssetMktPrice('');
                setNewAssetCondition('');
                setNewAssetLocation('');
                setNewAssetDesc('');
                setShowAddAssetForm(false);
                triggerSuccess(`Sukses! Aset Jaminan ${newAssetType} resmi terdaftar di e-commerce likuidasi.`);
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-705 mb-1 font-bold">Kategori Aset</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e: any) => setNewAssetCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="motor">��️ Sepeda Motor</option>
                    <option value="mobil">�� Mobil</option>
                    <option value="rumah">�� Rumah & Ruko</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-705 mb-1 font-bold">Lembaga Pembiayaan (Biller)</label>
                  <select
                    value={newAssetBiller}
                    onChange={(e) => setNewAssetBiller(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold"
                  >
                    <option value="Adira Finance">Adira Finance</option>
                    <option value="FIF Group">FIF Group</option>
                    <option value="BCA Finance">BCA Finance</option>
                    <option value="OTO Finance">OTO Finance</option>
                    <option value="BTN Syariah">BTN Syariah</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-705 mb-1 font-bold">ID Debitur/Peminjam Jaminan / No Tagihan</label>
                  <input
                    type="text"
                    placeholder="Contoh: TAG-9932-SA"
                    value={newAssetTag}
                    onChange={(e) => setNewAssetTag(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-705 mb-1 font-bold">Nama Model / Detail Aset</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toyota Fortuner VRZ Diesel AT 2021 atau Ruko Dinoyo Type 3"
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-705 mb-1 font-bold">Lokasi Aset Sekarang</label>
                  <input
                    type="text"
                    placeholder="Contoh: Malang, Surabaya Timur, Jakarta Selatan"
                    value={newAssetLocation}
                    onChange={(e) => setNewAssetLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-705 mb-1 font-bold">Harga Tebus / Nilai Tagihan Macet (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 15500000"
                    value={newAssetLiqPrice}
                    onChange={(e) => setNewAssetLiqPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-705 mb-1 font-bold">Estimasi Harga Pasar Wajar (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 28000000"
                    value={newAssetMktPrice}
                    onChange={(e) => setNewAssetMktPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-705 mb-1 font-bold">Keadaan Fisik & Kelengkapan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pajak Hidup, Cat Ori, Kunci Serep Ada"
                    value={newAssetCondition}
                    onChange={(e) => setNewAssetCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-705 mb-1 font-bold">Deskripsi Tambahan / Alasan Likuidasi</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan latar belakang aset ini jatuh tempo atau keistimewaan unit tebus ini..."
                    value={newAssetDesc}
                    onChange={(e) => setNewAssetDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-medium"
                  />
                </div>

                <div className="md:col-span-3 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition"
                  >
                    Simpan dan Umumkan Aset Likuidasi
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Interactive Calculator Overlay/Modal context */}
          {selectedSimulateAsset && (
            <div className="bg-indigo-950 text-white border border-indigo-900 rounded-3xl p-5 sm:p-6 shadow-md space-y-4 animate-fade-in relative text-left">
              <button 
                onClick={() => setSelectedSimulateAsset(null)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <X size={15} />
              </button>
              
              <div className="flex items-center gap-1.5">
                <span className="p-1.5 bg-white/10 rounded-lg text-indigo-300"><Percent size={14} /></span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">Kalkulator Simulasi Kredit / Tebus Aset Jaminan</h4>
                  <p className="text-[10px] text-indigo-300">Menghitung besaran cicilan fleksibel dengan diskon sisa angsuran</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Asset summary */}
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="font-bold text-xs text-indigo-300 block uppercase tracking-wider">Aset Terpilih</span>
                  <div>
                    <h5 className="font-black text-sm text-white">{selectedSimulateAsset.type}</h5>
                    <p className="text-[10px] text-slate-400 capitalize">{selectedSimulateAsset.category} | {selectedSimulateAsset.biller}</p>
                  </div>
                  <div className="space-y-1.5 text-[11px] border-t border-dashed border-white/15 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tebusan Pokok:</span>
                      <span className="font-bold text-emerald-400 font-mono">Rp {selectedSimulateAsset.liquidationPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450">Harga Wajar:</span>
                      <span className="font-bold text-slate-300 font-mono">Rp {selectedSimulateAsset.marketPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-yellow-400 font-bold border-t border-white/5 pt-1.5">
                      <span>Rentang Hemat:</span>
                      <span className="font-mono">Rp {(selectedSimulateAsset.marketPrice - selectedSimulateAsset.liquidationPrice).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Simulation controls */}
                <div className="space-y-3 text-xs font-semibold md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1.5 font-bold">Uang Muka / DP Minimal 15% (Rp)</label>
                      <input
                        type="number"
                        disabled
                        value={Math.round(selectedSimulateAsset.liquidationPrice * 0.15)}
                        id="form-dp-input"
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white font-bold opacity-80"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1.5 font-bold">Pilih Tenor Baru (Bulan)</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[12, 24, 36, 48].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSimulateTenor(t)}
                            className={`py-2 rounded-lg font-black transition cursor-pointer text-[11px] ${
                              simulateTenor === t
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                          >
                            {t} Bln
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-900/60 border border-indigo-800 rounded-xl flex justify-between items-center text-xs mt-3">
                    <div>
                      <span className="text-[10px] text-indigo-305 font-bold uppercase block tracking-wider">Estimasi Angsuran Baru</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        Rp {Math.round(
                          ((selectedSimulateAsset.liquidationPrice - (selectedSimulateAsset.liquidationPrice * 0.15)) * (1 + (0.08 * (simulateTenor / 12)))) / simulateTenor
                        ).toLocaleString('id-ID')} <span className="text-[10px] text-white">/ bln</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        triggerSuccess(`Sukses! Pengajuan Over-Kredit untuk ${selectedSimulateAsset.type} berhasil diajukan ke ${selectedSimulateAsset.biller} melalui koordinasi Marketing. Petugas akan menghubungi Anda.`);
                        setSelectedSimulateAsset(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[11px] transition"
                    >
                      Ajukan Over-Kredit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Asset List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecommerceAssets
              .filter(ast => {
                if (ecCategoryFilter !== 'semua' && ast.category !== ecCategoryFilter) return false;
                if (ecSearch) {
                  const s = ecSearch.toLowerCase();
                  return (
                    ast.type.toLowerCase().includes(s) ||
                    ast.biller.toLowerCase().includes(s) ||
                    ast.location.toLowerCase().includes(s) ||
                    ast.creditTag.toLowerCase().includes(s)
                  );
                }
                return true;
              })
              .map((ast) => {
                const discountPercent = Math.round(((ast.marketPrice - ast.liquidationPrice) / ast.marketPrice) * 100);

                return (
                  <div key={ast.id} className="bg-white border border-slate-205 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition duration-200 group relative text-left">
                    
                    {/* Corner badge discount */}
                    <div className="absolute top-4 right-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-full py-1 px-2.5 font-black text-[10px] tracking-wider uppercase flex items-center gap-0.5 shadow-2xs">
                      <Percent size={10} />
                      <span>Hemat {discountPercent}%</span>
                    </div>

                    <div className="space-y-4">
                      {/* Top info and category */}
                      <div className="flex items-center gap-2">
                        {ast.category === 'motor' && (
                          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl text-lg">��️</span>
                        )}
                        {ast.category === 'mobil' && (
                          <span className="p-2 bg-amber-50 text-amber-600 rounded-xl text-lg">��</span>
                        )}
                        {ast.category === 'rumah' && (
                          <span className="p-2 bg-teal-50 text-teal-600 rounded-xl text-lg">��</span>
                        )}
                        <div>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded-md font-mono tracking-wide uppercase">
                            {ast.creditTag}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 capitalize">{ast.category} • {ast.location}</span>
                        </div>
                      </div>

                      {/* Header and Title */}
                      <div>
                        <span className="text-[10px] font-black text-[#0d2e5c] uppercase block tracking-wider bg-slate-50 p-1.5 rounded-lg border border-slate-105 mb-1.5">
                          �� Jaminan Asal: {ast.biller}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-emerald-700 transition">
                          {ast.type}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5 line-clamp-3">
                          {ast.description}
                        </p>
                      </div>

                      {/* Info & Specs list */}
                      <div className="space-y-2 border-t border-b border-dashed border-slate-100 py-3.5 text-xs font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Keadaan Fisik:</span>
                          <span className="text-slate-700 text-right truncate max-w-[170px]">{ast.condition}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Harga Jual / Tebus:</span>
                          <span className="font-mono text-emerald-600 font-black text-sm">
                            Rp {ast.liquidationPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Harga Pasar Wajar:</span>
                          <span className="font-mono text-slate-400 line-through">
                            Rp {ast.marketPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] bg-emerald-50/50 p-1.5 rounded-lg">
                          <span className="text-emerald-700 font-extrabold flex items-center gap-0.5"><Sparkles size={11} /> Selisih Hemat</span>
                          <span className="font-mono text-emerald-800 font-extrabold">
                            Rp {(ast.marketPrice - ast.liquidationPrice).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Bidding */}
                    <div className="pt-4 space-y-3">
                      
                      {/* Mini Bidding Box */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 text-[10px] font-bold">Rp</span>
                          <input
                            type="number"
                            id={`bid-price-${ast.id}`}
                            placeholder="Tawar harga..."
                            className="w-full pl-6 pr-2 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const bidInput = document.getElementById(`bid-price-${ast.id}`) as HTMLInputElement;
                            const bidVal = bidInput ? bidInput.value : '';
                            if (!bidVal) {
                              triggerSuccess('Silakan isi nominal penawaran harga Anda.');
                              return;
                            }
                            triggerSuccess(`Sukses mengajukan penawaran (Bid) sebesar Rp ${Number(bidVal).toLocaleString('id-ID')} untuk unit ${ast.type}. Tim marketing akan memverifikasi kesanggupan.`);
                            if (bidInput) bidInput.value = '';
                          }}
                          className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-extrabold text-[11px] rounded-xl transition cursor-pointer"
                        >
                          Tawar
                        </button>
                      </div>

                      {/* Main Action buttons */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <button
                          onClick={() => {
                            setSelectedSimulateAsset(ast);
                          }}
                          className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl transition cursor-pointer text-center"
                        >
                          ⚙️ Simulasi Over-Kredit
                        </button>

                        <button
                          onClick={() => {
                            triggerSuccess(`Permintaan tebus langsung senilai Rp ${ast.liquidationPrice.toLocaleString('id-ID')} untuk aset ${ast.type} berhasil dikirimkan ke pihak ${ast.biller}. Berita Acara Tebus (BAT) diterbitkan.`);
                          }}
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer text-center"
                        >
                          �� Tebus Langsung Cash
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>

          {/* Empty indicator */}
          {ecommerceAssets.filter(ast => {
            if (ecCategoryFilter !== 'semua' && ast.category !== ecCategoryFilter) return false;
            if (ecSearch) {
              const s = ecSearch.toLowerCase();
              return (
                ast.type.toLowerCase().includes(s) ||
                ast.biller.toLowerCase().includes(s) ||
                ast.location.toLowerCase().includes(s) ||
                ast.creditTag.toLowerCase().includes(s)
              );
            }
            return true;
          }).length === 0 && (
            <div className="text-center py-12 px-4 bg-slate-50 border border-slate-100 rounded-3xl text-slate-500 font-medium w-full">
              <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm">Belum ada aset jaminan likuidasi dalam kategori filter ini</p>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter kategori.</p>
            </div>
          )}

        </div>
      )}
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
                  Apabila terjadi pembatasan/penyembuhan denda (baik secara mandiri maupun ditalangi menggunakan <span className="font-bold">Dana Sementara Denda</span>) oleh debitur/peminjam yang dikelola Mitra Marketing ke Aplikator, skema komisi bagi hasil apresiasi yang dilimpahkan oleh Aplikator secara realtime adalah:
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="bg-white/90 border border-indigo-200/50 px-3 py-1.5 rounded-xl text-indigo-950 font-bold shadow-2xs flex items-center gap-1.5">
                    �� Mitra Marketing Finance: <strong className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">40% Komisi</strong>
                  </span>
                  <span className="bg-white/90 border border-indigo-200/50 px-3 py-1.5 rounded-xl text-indigo-950 font-bold shadow-2xs flex items-center gap-1.5">
                    �� Manager Finance Pusat: <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">10% Komisi</strong>
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
            {/* Left Column: Potential Bailout List (Debitur/Peminjam & Marketing) */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <span>Potensi Penggunaan Dana Sementara Denda</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Daftar Debitur/Peminjam & Marketing dengan probabilitas tinggi menggunakan talangan denda Aplikator</p>
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
                  <p className="text-xs text-slate-500 font-normal">Debitur/Peminjam yang dikelola Marketing Finance telah lunas denda dan komisi Manager dicarikan.</p>
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
                          �� Potensi denda terakumulasi sebesar <span className="font-bold text-red-650">Rp {item.potentialDenda.toLocaleString('id-ID')}</span>.
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
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Komisi apresiasi atas penyehatan denda debitur/peminjam yang diawasi oleh Mitra Marketing Finance setempat.</p>
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
                <p className="text-[10px] text-indigo-200">�� Komisi ditransfer langsung oleh Aplikator secara realtime.</p>
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

          {/* ========================================================================= */}
          {/* NEW MODULE: SISTEM PENAHANAN BPKB & KLAIM INVOICE PENARIKAN LAPORAN (REALTIME) */}
          {/* ========================================================================= */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <FileText size={22} className="text-indigo-600 font-black" />
                  <span>Sistem Penahanan BPKB & Klaim Invoice Penarikan Laporan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Pantau status jaminan BPKB nasabah belum lunas dan proses otomatisasi klaim pencabutan perkara penarikan unit.</p>
              </div>
              <div className="w-full sm:w-72">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search size={14} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Cari Debitur/Peminjam / Leasing / Unit..." 
                    value={bpkbSearch}
                    onChange={(e) => setBpkbSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* List and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {customers
                .filter(c => {
                  const term = bpkbSearch.toLowerCase();
                  return !term || 
                    (c.name || '').toLowerCase().includes(term) ||
                    (c.lease || '').toLowerCase().includes(term) ||
                    (c.unit || '').toLowerCase().includes(term);
                })
                .map(c => {
                  // Fallbacks for empty database properties
                  const debtStatus = c.debtStatus || (c.status === 'Aktif Terlindungi' ? 'Belum Lunas' : (c.name === 'Siti Aminah' ? 'Masa Pelunasan' : 'Belum Lunas'));
                  const remainingDebt = c.remainingDebt !== undefined ? c.remainingDebt : (debtStatus === 'Belum Lunas' ? (c.installment ? parseInt(c.installment.replace(/\D/g, '')) * 10 : 8500000) : (debtStatus === 'Masa Pelunasan' ? 3400000 : 0));
                  const bpkbStatus = c.bpkbStatus || (debtStatus === 'Lunas' ? 'Released (Diserahkan)' : 'Noted (Ditahan)');
                  const isClaimInvoiceActive = c.invoiceClaimCreated !== undefined ? c.invoiceClaimCreated : (debtStatus === 'Masa Pelunasan');

                  return (
                    <div key={c.id} className="p-5 border border-slate-150 rounded-2xl hover:border-slate-300 bg-slate-50/45 hover:bg-slate-50/70 transition-all flex flex-col justify-between gap-4 text-xs">
                      <div className="space-y-3">
                        {/* Title and ID */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-black text-sm text-slate-850 select-none">{c.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{c.phone}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                            bpkbStatus.includes('Released') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {bpkbStatus.includes('Released') ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                            {bpkbStatus}
                          </span>
                        </div>

                        {/* Financial and Contract details */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-b border-slate-150/60 py-3 text-[11px] font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase text-block block">Lembaga Leasing</span>
                            <span className="font-extrabold text-slate-800">{c.lease}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase text-block block">Aset Jaminan</span>
                            <span className="font-extrabold text-slate-800">{c.unit}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase text-block block">Outstanding Kredit</span>
                            <span className={`font-black ${debtStatus === 'Lunas' ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {debtStatus === 'Lunas' ? 'Rp 0 (Lunas)' : `Rp ${remainingDebt.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase text-block block">Fase Penyehatan</span>
                            <span className={`inline-block font-extrabold px-1.5 py-0.5 rounded text-[10px] ${
                              debtStatus === 'Lunas' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              debtStatus === 'Masa Pelunasan' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {debtStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Controls Area */}
                      <div className="space-y-2 pt-1">
                        {debtStatus === 'Belum Lunas' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateDebtStatus(c.id, 'Masa Pelunasan')}
                              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black rounded-lg cursor-pointer transition-colors text-[10px] uppercase shadow-2xs"
                            >
                              Masuk Masa Pelunasan
                            </button>
                            <button
                              onClick={() => handleUpdateDebtStatus(c.id, 'Lunas')}
                              className="py-2 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-extrabold rounded-lg cursor-pointer transition-colors text-[10px]"
                            >
                              Set Lunas
                            </button>
                          </div>
                        )}

                        {debtStatus === 'Masa Pelunasan' && (
                          <div className="space-y-2">
                            <div className="p-2.5 bg-gradient-to-r from-blue-50/50 to-indigo-50 border border-indigo-150 rounded-xl flex items-start gap-2 select-none">
                              <Sparkles size={14} className="text-indigo-600 animate-pulse shrink-0 mt-0.5" />
                              <p className="text-[10px] leading-relaxed text-indigo-950 font-bold">
                                Invoice klaim penarikan laporan dibuat otomatis!
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedInvoiceCreditor({ ...c, debtStatus, remainingDebt, bpkbStatus, invoiceClaimCreated: isClaimInvoiceActive })}
                              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black rounded-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 text-[10px] uppercase flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <FileText size={12} />
                              <span>Buka Invoice Klaim Menarik Laporan</span>
                            </button>
                          </div>
                        )}

                        {debtStatus === 'Lunas' && (
                          <div className="p-2.5 bg-emerald-50/60 border border-emerald-150 rounded-xl flex items-center gap-2 text-emerald-800 select-none">
                            <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                            <p className="text-[10px] text-slate-600 font-medium">
                              Debitur/Peminjam lunas. BPKB telah dinyatakan <span className="text-emerald-700 font-bold">Released (Diserahkan)</span> dan laporan penarikan unit sengketa telah ditarik permanen.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              {customers.filter(c => {
                const term = bpkbSearch.toLowerCase();
                return !term || 
                  (c.name || '').toLowerCase().includes(term) ||
                  (c.lease || '').toLowerCase().includes(term) ||
                  (c.unit || '').toLowerCase().includes(term);
              }).length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-semibold select-none">
                  Debitur/Peminjam tidak ditemukan.
                </div>
              )}
            </div>
          </div>

          {/* ======================================= */}
          {/* NEW SECTION: DATA MARKETING FINANCE & TURUNAN KREDITUR */}
          {/* ======================================= */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Briefcase size={22} className="text-indigo-600" />
                  <span>Data Marketing Finance & Jaringan Debitur/Peminjam</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Pantau kinerja mitra marketing finance dan data seluruh debitur/peminjam (debitur) binaan mereka</p>
              </div>
              <div className="w-full sm:w-72">
                <input 
                  type="text" 
                  placeholder="Cari nama marketing, kode, atau kota..." 
                  value={mktSearch}
                  onChange={(e) => setMktSearch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Jaringan Marketing Grid */}
            <div className="space-y-6">
              {INITIAL_MARKETING_PARTNERS.filter(p => {
                const term = mktSearch.toLowerCase();
                return p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term) || p.region.toLowerCase().includes(term);
              }).map(partner => {
                const partnerDebitur = customers.filter(c => 
                  String(c.marketingId || '').toLowerCase() === partner.code.toLowerCase() || 
                  String(c.marketingId || '').toLowerCase() === partner.id.toLowerCase() ||
                  (partner.code === 'MB-7789' && (!c.marketingId || c.marketingId === 'Mitra Bayar Demo' || c.marketingId === 'MB-7789'))
                );

                const activeCount = partnerDebitur.filter(c => c.status === 'Aktif Terlindungi').length;

                return (
                  <div key={partner.id} className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/45 hover:bg-slate-50/70 transition-all shadow-xs space-y-4">
                    {/* Partner Info Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dashed border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 shrink-0">
                          {partner.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-850">{partner.name}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 font-extrabold rounded-md">ID: {partner.code}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-850 font-extrabold rounded-md">{partner.tier}</span>
                          </div>
                          <div className="flex items-center gap-x-4 gap-y-0.5 flex-wrap text-slate-500 text-[11px] font-medium mt-0.5">
                            <span>�� {partner.phone}</span>
                            <span>�� {partner.email}</span>
                            <span>�� Wilayah: {partner.region}</span>
                          </div>
                        </div>
                      </div>

                      {/* Partner Stats Row */}
                      <div className="flex items-center gap-3 text-center md:text-right shrink-0">
                        <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-xs">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Debitur/Peminjam Binaan</span>
                          <span className="text-xs font-black text-slate-850">{partnerDebitur.length} Orang</span>
                        </div>
                        <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-xs">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sehat Proteksi</span>
                          <span className="text-xs font-black text-emerald-600">{activeCount} / {partnerDebitur.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Associated Creditors (Turunan Debitur/Peminjam Binaan) Block */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] text-indigo-950 font-black tracking-wider uppercase block">�� Data Turunan Debitur/Peminjam (Binaan {partner.name})</span>
                      
                      {partnerDebitur.length === 0 ? (
                        <p className="text-[11px] text-slate-400 font-semibold bg-white p-4.5 rounded-xl border border-slate-100 text-center">
                          Belum ada Debitur/Peminjam yang didaftarkan oleh Mitra Marketing ini.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                            <thead>
                              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-black uppercase text-[9px] tracking-wider">
                                <th className="py-2.5 px-3">Nama Debitur/Peminjam</th>
                                <th className="py-2.5 px-3">Kontak/No HP</th>
                                <th className="py-2.5 px-3">Debitur/Peminjam Leasing & Unit Aset</th>
                                <th className="py-2.5 px-3">Angsuran Bulanan</th>
                                <th className="py-2.5 px-3">Status Kontrol Denda</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                              {partnerDebitur.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                                  <td className="py-3 px-3 text-slate-500 text-[11px]">{c.phone}</td>
                                  <td className="py-3 px-3 text-slate-600">
                                    <span className="font-bold text-slate-850 block text-[11px]">{c.lease}</span>
                                    <span className="text-[10px] text-slate-400 block">{c.unit}</span>
                                  </td>
                                  <td className="py-3 px-3 font-bold text-slate-800">{c.installment}</td>
                                  <td className="py-3 px-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                      c.status === 'Aktif Terlindungi' ? 'bg-green-150/70 text-green-700' :
                                      c.status === 'Terlambat - Bayar Sementara' ? 'bg-amber-150/70 text-amber-700 animate-pulse' :
                                      'bg-blue-150/70 text-blue-700'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Aktif Terlindungi' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                      {c.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CLAIM INVOICE DETAIL SHEET MODAL OVERLAY */}
          {/* ========================================================================= */}
          {selectedInvoiceCreditor && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-150 animate-in fade-in zoom-in duration-205">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
                  <div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block w-max">
                      Invoice Klaim Otomatis
                    </span>
                    <h3 className="font-extrabold text-base mt-2 flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                      <span>Invoice Klaim Menarik Laporan & Serah Terima BPKB</span>
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedInvoiceCreditor(null)}
                    className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 font-sans overflow-y-auto max-h-[75vh]">
                  <div className="flex justify-between items-start border-b border-dashed border-slate-250 pb-4">
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Penerbit Klaim</p>
                      <p className="text-xs font-black text-slate-800">MITRA BAYAR FINANCE PUSAT</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Divisi Penyelamatan Sandi Darurat</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">No. Invoice Klaim</p>
                      <p className="text-xs font-mono font-black text-indigo-700">INV/CLAIM/MB-{selectedInvoiceCreditor.id}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Info table */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-3.5">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-black block uppercase text-[9px] tracking-wider">Data Debitur/Peminjam</span>
                        <span className="font-black text-slate-800 block text-[13px]">{selectedInvoiceCreditor.name}</span>
                        <span className="text-slate-500 font-bold">{selectedInvoiceCreditor.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black block uppercase text-[9px] tracking-wider">Aset Jaminan & Leasing</span>
                        <span className="font-black text-slate-800 block text-[13px]">{selectedInvoiceCreditor.unit}</span>
                        <span className="text-indigo-650 font-extrabold">Lease: {selectedInvoiceCreditor.lease}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3.5 text-xs space-y-2">
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>Sisa Hutang Pokok Debitur/Peminjam</span>
                        <span>Rp {(selectedInvoiceCreditor.remainingDebt || 3400000).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>Biaya Mediasi & Penyehatan Lapangan</span>
                        <span className="text-emerald-600 font-black">- Rp {Math.floor((selectedInvoiceCreditor.remainingDebt || 3400000) * 0.1).toLocaleString('id-ID')} (Ditalangi)</span>
                      </div>
                      <div className="flex justify-between text-indigo-950 font-black text-xs pt-2.5 border-t border-slate-200 border-dashed uppercase">
                        <span>TOTAL INVOICE KLAIM PENARIKAN LAPORAN</span>
                        <span className="text-indigo-600 text-sm">Rp {Math.floor((selectedInvoiceCreditor.remainingDebt || 3400000) * 0.1).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Warn Box */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed font-semibold flex gap-2.5">
                    <span className="text-sm">⚠️</span>
                    <div>
                      <span className="font-black block text-xs text-amber-950 mb-0.5">Ketentuan Penarikan Laporan Terpadu</span>
                      Dengan menyetujui klaim invoice ini, program digital akan otomatis memicu clearance kepada leasing <strong>{selectedInvoiceCreditor.lease}</strong> untuk menyetop berkas penarikan unit di lapangan dan mengembalikan BPKB menjadi lunas lancar.
                    </div>
                  </div>

                  {/* CTA Actions */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => handleProcessClaimWithdrawReport(selectedInvoiceCreditor.id, selectedInvoiceCreditor.name)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
                    >
                      Cairkan Klaim & Setop Laporan Penarikan Unit
                    </button>
                    <button
                      onClick={() => setSelectedInvoiceCreditor(null)}
                      className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[11px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {role === 'admin' && (
        <AdminDashboard adminIdentifier={userIdentifier} onLogout={onLogout} />
      )}

    </div>
  );
}
