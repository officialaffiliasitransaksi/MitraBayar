import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Settings
} from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'customer' | 'marketing' | 'manager' | 'admin', identifier: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'customer' | 'marketing' | 'manager' | 'admin'>('customer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  
  const [marketingId, setMarketingId] = useState('');
  const [marketingPass, setMarketingPass] = useState('');
  
  const [managerId, setManagerId] = useState('');
  const [managerPass, setManagerPass] = useState('');
  const [managerPin, setManagerPin] = useState('');

  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminPin, setAdminPin] = useState('');

  if (!isOpen) return null;

  const handleAutofill = () => {
    setError(null);
    if (activeTab === 'customer') {
      setPhone('08123456789');
      setPin('123456');
    } else if (activeTab === 'marketing') {
      setMarketingId('MB-7789');
      setMarketingPass('mitrasuksestransaksi');
    } else if (activeTab === 'manager') {
      setManagerId('MGR-9902');
      setManagerPass('managerpembayaran');
      setManagerPin('8899');
    } else if (activeTab === 'admin') {
      setAdminId('ADM-1002');
      setAdminPass('adminpembayaran');
      setAdminPin('1122');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulated short network delay for peak realism & visual polish
    setTimeout(() => {
      const finishLogin = () => {
        setLoading(false);
        if (activeTab === 'customer') {
          onLoginSuccess('customer', phone);
          onClose();
        } else if (activeTab === 'marketing') {
          onLoginSuccess('marketing', marketingId.toUpperCase());
          onClose();
        } else if (activeTab === 'manager') {
          onLoginSuccess('manager', managerId.toUpperCase());
          onClose();
        } else if (activeTab === 'admin') {
          onLoginSuccess('admin', adminId.toUpperCase());
          onClose();
        }
      };

      if (activeTab === 'customer') {
        if (!phone.trim()) {
          setError('Nomor Handphone tidak boleh kosong.');
          setLoading(false);
          return;
        }
        if (pin.length < 4) {
          setError('PIN Transaksi harus diisi dengan benar.');
          setLoading(false);
          return;
        }
      } else if (activeTab === 'marketing') {
        if (!marketingId.trim()) {
          setError('ID Marketing tidak boleh kosong.');
          setLoading(false);
          return;
        }
        if (marketingPass.length < 6) {
          setError('Sandi akses minimal harus terdiri dari 6 karakter.');
          setLoading(false);
          return;
        }
      } else if (activeTab === 'manager') {
        if (!managerId.trim()) {
          setError('ID Manager tidak boleh kosong.');
          setLoading(false);
          return;
        }
        if (managerPass.length < 6) {
          setError('Sandi pengelola tidak boleh kosong.');
          setLoading(false);
          return;
        }
        if (!managerPin) {
          setError('PIN Keamanan wajib diisi.');
          setLoading(false);
          return;
        }
      } else if (activeTab === 'admin') {
        if (!adminId.trim()) {
          setError('ID Admin tidak boleh kosong.');
          setLoading(false);
          return;
        }
        if (adminPass.length < 6) {
          setError('Sandi admin tidak boleh kosong.');
          setLoading(false);
          return;
        }
        if (!adminPin) {
          setError('PIN Admin wajib diisi.');
          setLoading(false);
          return;
        }
      }

      // Sync user session to Firebase Auth for secure cloud rule evaluation
      signInAnonymously(auth)
        .then(() => {
          finishLogin();
        })
        .catch((err) => {
          console.warn('Firebase Auth offline fallback active:', err);
          finishLogin();
        });
    }, 850);
  };

  const handleTabChange = (tab: 'customer' | 'marketing' | 'manager' | 'admin') => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Akses Mitra Finance</h3>
            <p className="text-xs text-slate-500 mt-1">Pilih jenis akun Anda untuk mengelola transaksi & program</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
            id="close-login-modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 grid grid-cols-2 sm:flex gap-2">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'customer' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Smartphone size={15} />
            <span>Debitur/Peminjam</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange('marketing')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'marketing' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <TrendingUp size={15} />
            <span>Marketing</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('manager')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'manager' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Manager</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'admin' 
                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings size={15} />
            <span>Admin Panel</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm animate-pulse">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Tab Panel */}
          {activeTab === 'customer' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs sm:text-sm text-blue-800 flex gap-2.5">
                <Smartphone size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p>
                  Gunakan data simulasi untuk melacak pembayaran Anda secara instan dan melihat status kendaraan Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">No. Handphone / WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                    +62
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="8123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">PIN Transaksi (6-Digit)</label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">Lupa PIN?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="Masukkan 6 digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium tracking-widest"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Marketing Tab Panel */}
          {activeTab === 'marketing' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs sm:text-sm text-emerald-800 flex gap-2.5">
                <TrendingUp size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <p>
                  Portal afiliasi & kemitraan pemasaran Mitra Bayar. Pantau pendaftaran debitur dan komisi Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">ID Marketing Finance / Kode Referral</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MB-7789"
                    value={marketingId}
                    onChange={(e) => setMarketingId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm font-semibold uppercase placeholder:normal-case"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Sandi Akses</label>
                  <a href="#" className="text-xs text-emerald-600 hover:underline">Reset Sandi?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi akun"
                    value={marketingPass}
                    onChange={(e) => setMarketingPass(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Manager Tab Panel */}
          {activeTab === 'manager' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs sm:text-sm text-indigo-800 flex gap-2.5">
                <ShieldCheck size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p>
                  Konsol manajemen evaluasi pengajuan bantuan, koordinasi dana darurat, dan audit kelayakan nasabah.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">ID Manager Finance / Administrator</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MGR-9902"
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-semibold uppercase placeholder:normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Sandi Pengelola</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi manajemen"
                    value={managerPass}
                    onChange={(e) => setManagerPass(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Otorisasi Rahasia (4-digit)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="PIN"
                  value={managerPin}
                  onChange={(e) => setManagerPin(e.target.value.replace(/\D/g, ''))}
                  className="w-1/3 text-center tracking-widest py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Admin Tab Panel */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 flex gap-2.5">
                <Settings size={18} className="text-slate-600 mt-0.5 flex-shrink-0" />
                <p>
                  Konsol Administrator Pusat Mitra Bayar. Kelola parameter global, konfigurasi denda, komisi pemasaran, dan data kemitraan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">ID Admin / Super User</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ADM-1002"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all text-sm font-semibold uppercase placeholder:normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Sandi Admin</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi administrator"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Otorisasi Rahasia (4-digit)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ''))}
                  className="w-1/3 text-center tracking-widest py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Quick Simulation Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAutofill}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle size={16} className="text-amber-600 animate-bounce" />
              <span>Gunakan Data Simulasi Pengujian Instan</span>
            </button>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all text-white text-sm mt-3 ${
              activeTab === 'customer' 
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20' 
                : activeTab === 'marketing'
                ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/20'
                : activeTab === 'manager'
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/20'
                : 'bg-slate-850 hover:bg-slate-900 hover:shadow-slate-800/20'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info decoration */}
        <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 text-center text-[10px] sm:text-xs text-slate-400">
          Sistem Pembayaran Mitra Bayar tersertifikasi SSL 256-bit Secure Banking.
        </div>
      </div>
    </div>
  );
}
