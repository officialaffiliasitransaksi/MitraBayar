import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Car, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X, 
  Download,
  AlertTriangle,
  Zap,
  ArrowRight,
  ArrowRightCircle,
  Search,
  Bell,
  Home,
  User,
  FileText,
  Cloud,
  TrendingUp,
  Wifi,
  Battery,
  Signal,
  MapPin,
  MessageSquare,
  Quote,
  Plane,
  Train,
  Ship,
  Bus,
  Building2,
  LayoutGrid,
  Compass,
  Star
} from 'lucide-react';
import LoginModal from './components/LoginModal';
import RoleDashboards from './components/RoleDashboards';
import PotensiHasil from './components/PotensiHasil';

interface MitraBayarLogoProps {
  size?: number;
  showText?: boolean;
  showCenteredText?: boolean;
  textColor?: string;
}

export const MitraBayarLogo = ({ 
  size = 40, 
  showText = false, 
  showCenteredText = false, 
  textColor = "text-[#0d2e5c]" 
}: MitraBayarLogoProps) => {
  return (
    <div className={`flex ${showCenteredText ? 'flex-col items-center' : 'items-center'} gap-2`}>
      <div style={{ width: size, height: size * 0.95 }} className="relative flex-shrink-0 select-none">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            {/* Pink/Magenta Left Gradient */}
            <linearGradient id="logoPinkGrad" x1="201" y1="81" x2="201" y2="351" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            {/* Sky Blue Right Gradient */}
            <linearGradient id="logoSkyGrad" x1="334" y1="125" x2="334" y2="423" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            {/* Dark Blue Center Pill Gradient */}
            <linearGradient id="logoPillGrad" x1="214" y1="125" x2="334" y2="378" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#414ff0" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          
          {/* Left Pink Shape */}
          <path 
            d="M201.2 81.3 C251.7 81.3 268.4 123.4 268.4 165.5 L268.4 262.1 C268.4 316.5 244.6 351.4 179.3 351.4 C114.1 351.4 102.1 316.5 102.1 262.1 L102.1 165.5 C102.1 114.3 133.5 81.3 201.2 81.3 Z" 
            fill="url(#logoPinkGrad)" 
          />
          
          {/* Right Sky Blue Shape */}
          <path 
            d="M334.2 125.1 C283.7 125.1 267.0 167.2 267.0 209.3 L267.0 327.9 C267.0 382.3 290.8 422.2 356.1 422.2 C421.3 422.2 433.3 382.3 433.3 327.9 L433.3 209.3 C433.3 158.1 401.9 125.1 334.2 125.1 Z" 
            fill="url(#logoSkyGrad)" 
            style={{ mixBlendMode: 'multiply' }}
          />
          
          {/* Center Deep Blue Diagonal Pill */}
          <rect 
            x="180" 
            y="190" 
            width="230" 
            height="100" 
            rx="50" 
            transform="rotate(-47 280 230)" 
            fill="url(#logoPillGrad)" 
            stroke="#ffffff"
            strokeWidth="12"
          />
        </svg>
      </div>

      {/* Horizontal style */}
      {showText && !showCenteredText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`text-base sm:text-lg font-black uppercase tracking-wider ${textColor}`}>MITRABAYAR</span>
          <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-widest text-[#10d024] mt-0.5">Hadir Pemberi Solusi</span>
        </div>
      )}

      {/* Centered style exactly matches user's uploaded mockup */}
      {showCenteredText && (
        <div className="flex flex-col items-center text-center mt-3 leading-none">
          <span className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-widest ${textColor}`}>MITRABAYAR</span>
          <span className="text-[9.5px] sm:text-xs font-bold uppercase tracking-widest text-[#10d024] mt-2 tracking-[0.16em]">Hadir Pemberi Solusi</span>
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  userRole: 'customer' | 'marketing' | 'manager' | 'admin' | null;
  onLogout: () => void;
  currentView: 'landing' | 'potensi';
  onChangeView: (view: 'landing' | 'potensi', targetHref?: string) => void;
}

const Header = ({ onOpenLogin, isLoggedIn, userRole, onLogout, currentView, onChangeView }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#home' },
    { name: 'Program', href: '#program' },
    { name: 'Potensi Hasil', href: '#potensi-hasil' },
    { name: 'Cara Kerja', href: '#how-it-works' },
    { name: 'Syarat', href: '#requirements' },
    { name: 'Testimony', href: '#testimony' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (href === '#potensi-hasil') {
      onChangeView('potensi', '#potensi-hasil');
    } else {
      onChangeView('landing', href);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-3 sm:py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={(e) => handleLinkClick(e, '#home')}
          >
            <MitraBayarLogo size={36} showText={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-medium text-sm transition-colors ${
                  (link.href === '#potensi-hasil' && currentView === 'potensi') || 
                  (link.href !== '#potensi-hasil' && currentView === 'landing' && window.location.hash === link.href)
                    ? 'text-blue-600 font-bold' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1.5 bg-blue-50 text-blue-800 font-bold rounded-lg uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                  <User size={13} />
                  {userRole === 'customer' 
                    ? 'Debitur/Peminjam' 
                    : userRole === 'marketing' 
                    ? 'Marketing Finance' 
                    : userRole === 'manager' 
                    ? 'Manager Finance' 
                    : 'Global Admin'} Portal
                </span>
                <button 
                  onClick={onLogout}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl font-bold transition-all text-xs cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="bg-blue-50 hover:bg-blue-600 border border-blue-200 text-blue-700 hover:text-white px-5 py-2.5 rounded-full font-bold transition-all text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <User size={16} />
                <span>Akses Mitra Finance</span>
              </button>
            )}

            <a href="#download" onClick={(e) => handleLinkClick(e, '#download')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 text-sm">
              <Download size={18} />
              Unduh Aplikasi
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 bg-gray-50 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`lg:hidden absolute w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden py-0'}`}>
        <div className="px-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                (link.href === '#potensi-hasil' && currentView === 'potensi')
                  ? 'text-blue-600 bg-blue-50 font-bold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}

          {isLoggedIn ? (
            <div className="pt-2 flex flex-col gap-2">
              <div className="bg-blue-50 px-4 py-3.5 rounded-xl flex items-center justify-between text-sm border border-blue-100">
                <span className="text-slate-500 font-medium">Masuk Sebagai:</span>
                <span className="font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                  <User size={14} />
                  {userRole === 'customer' 
                    ? 'Debitur/Peminjam' 
                    : userRole === 'marketing' 
                    ? 'Marketing Finance' 
                    : userRole === 'manager' 
                    ? 'Manager Finance' 
                    : 'Global Admin'}
                </span>
              </div>
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }} 
                className="flex justify-center items-center gap-2 w-full px-4 py-3 rounded-xl text-base font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                Keluar Portal
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button 
                onClick={() => { onOpenLogin(); setIsOpen(false); }} 
                className="flex justify-center items-center gap-2 w-full px-4 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors cursor-pointer"
              >
                <User size={20} />
                <span>Akses Mitra Finance</span>
              </button>
            </div>
          )}

          <div className="pt-2 pb-2">
            <a 
              href="#download" 
              className="flex justify-center items-center gap-2 w-full px-4 py-3 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
              onClick={(e) => handleLinkClick(e, '#download')}
            >
              <Download size={20} />
              Unduh Aplikasi Sekarang
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroSection = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  return (
    <section id="home" className="pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-br from-[#dbeafe] via-[#f0f9ff] to-[#bfdbfe]/50 overflow-hidden min-h-[95vh] flex items-center relative">
      
      {/* Glossy 3D Glassmorphic Green Spheres (matching the uploaded image's signature style) */}
      <div 
        className="absolute top-16 left-[-100px] sm:left-[-50px] w-56 h-56 rounded-full shadow-2xl opacity-80 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #a7f3d0, #10b981, #064e3b)',
          filter: 'drop-shadow(0 20px 30px rgba(4, 120, 87, 0.25))'
        }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-[2px]"></div>
      </div>
      
      <div 
        className="absolute bottom-[-100px] right-[5%] w-80 h-80 rounded-full shadow-2xl opacity-75 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #34d399, #059669, #022c22)',
          filter: 'drop-shadow(0 30px 40px rgba(2, 44, 34, 0.3))'
        }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[3px]"></div>
      </div>

      <div 
        className="absolute top-[20%] right-[-120px] lg:right-[-60px] w-48 h-48 rounded-full shadow-2xl opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #34d399, #047857, #064e3b)',
          filter: 'drop-shadow(0 15px 25px rgba(2, 44, 34, 0.15))'
        }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10 font-sans">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content (aligned exactly with the layout of the user's image) */}
          <div className="w-full lg:w-[55%] text-center lg:text-left animate-fade-in-up">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0d2e5c] leading-[1.1] mb-4 tracking-tight">
              Bangun Kepercayaan<br className="hidden sm:block" /> Nama Anda di Komunitas Finance
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-5 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Ayo segera download Aplikasi Mitra Bayar, lakukan rutinitas transaksi bulanan anda, dan nikmati ketenangan pikiran tanpa denda di lembaga Finance, kendaraan Anda otomatis terlindungi.
            </p>
            
            {/* PlayStore & AppStore Badge Rows */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start items-center w-full mb-5">
              {/* Play Store Badge */}
              <a 
                href="#download-playstore" 
                className="flex items-center gap-3 bg-black hover:bg-slate-900 text-white min-w-[170px] px-5 py-2.5 rounded-xl border border-gray-800 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-950/20 group"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6 transition-transform group-hover:scale-110">
                  <path d="M32.5 12c-5.5 5.5-8.5 13-8.5 22v444c0 9 3 16.5 8.5 22L262 256z" fill="#ea4335" />
                  <path d="M386 132L262 256l124 124 100-57c28.5-16 28.5-42.5 0-58.5z" fill="#fbbc05" />
                  <path d="M262 256L32.5 478c8.5 8.5 22.5 9.5 37.5 1L386 380z" fill="#34a853" />
                  <path d="M262 256L68 15c-15-8.5-29-7.5-37.5 1l231.5 240z" fill="#4285f4" />
                </svg>
                <div className="text-left font-sans">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold leading-none">Dapatkan di</p>
                  <p className="text-sm font-black text-white leading-tight mt-0.5">Google Play</p>
                </div>
              </a>

              {/* App Store Badge */}
              <a 
                href="#download-appstore" 
                className="flex items-center gap-3 bg-black hover:bg-slate-900 text-white min-w-[170px] px-5 py-2.5 rounded-xl border border-gray-800 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-950/20 group"
              >
                <svg viewBox="0 0 170 170" className="w-6 h-6 text-white transition-transform group-hover:scale-110" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.14-3.57-2.88-7.39-7.5-11.47-13.85-5.12-8.08-9.45-17.75-12.98-29.02-3.54-11.27-5.31-21.94-5.31-32.01 0-14.54 3.73-25.96 11.2-34.25 7.46-8.29 16.63-12.44 27.5-12.44 5.02 0 10.28 1.34 15.77 4.01 5.49 2.68 9.42 4.01 11.8 4.01 1.9 0 5.48-1.23 10.74-3.69 6.25-2.9 11.94-4.24 17.06-4.01 12.62.67 22.48 5.24 29.58 13.73-10.72 6.47-16.03 15.22-15.92 26.24.11 8.59 3.29 15.77 9.54 21.53 6.25 5.76 13.79 9.07 22.61 9.94-2.23 6.64-5.02 13.11-8.37 19.41zM119.22 12.44c0 7.82-2.8 14.88-8.4 21.17-5.61 6.3-12.28 10.14-20.02 11.53.11-6.7 2.76-13.56 7.95-20.59 5.2-7.03 11.66-11.13 19.38-12.31.78 6.47.09 13.2-2.09 20.2z" />
                </svg>
                <div className="text-left font-sans">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold leading-none">Unduh di</p>
                  <p className="text-sm font-black text-white leading-tight mt-0.5">App Store</p>
                </div>
              </a>
            </div>

            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              Mitra Bayar - Aplikasi PPOB & Pembayaran Tagihan Terlengkap.
            </p>
          </div>

          {/* Right Smartphone Screen Mockup (with realistic responsive glass design matching the uploaded image exactly) */}
          <div className="w-full sm:w-[85%] md:w-[70%] lg:w-[45%] relative mx-auto lg:mx-0 mt-8 lg:mt-0 z-20">
            {/* Ring of light behind the phone */}
            <div className="absolute inset-x-4 inset-y-12 bg-emerald-400/25 rounded-[3rem] blur-3xl -z-10 animate-pulse"></div>

            {/* Smartphone Outer Container with smooth modern floating animation and delicate tilt interaction */}
            <motion.div 
              initial={{ y: 0, rotate: 1 }}
              animate={{ 
                y: [0, -12, 0],
                rotate: [1, -1, 1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.04,
                rotateY: 8,
                rotateX: -4,
                transition: { duration: 0.3 }
              }}
              className="mx-auto w-full max-w-[310px] sm:max-w-[330px] h-[640px] bg-slate-50 rounded-[3rem] p-3 shadow-[0_25px_60px_-15px_rgba(2,44,34,0.12)] border-[6px] border-slate-200 relative select-none cursor-pointer duration-500 transition-shadow hover:shadow-[0_30px_70px_-10px_rgba(16,185,129,0.2)]"
            >
              
              {/* Phone Speaker Cutout / Dynamic Island */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-850"></div>
              </div>

              {/* Glass Reflection Over Screen */}
              <div className="absolute inset-3 rounded-[2.5rem] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-20"></div>

              {/* Screen Content Wrapper */}
              <div className="w-full h-full bg-slate-50 rounded-[2.3rem] overflow-hidden flex flex-col relative text-slate-800 font-sans shadow-inner border border-slate-100/50">
                
                {/* Custom Status Bar (Sits on top of the blue block exactly like the screenshot) */}
                <div className="bg-[#0088e3] px-3.5 pt-2.5 pb-1 flex justify-between items-center text-[9px] text-white font-medium select-none">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">17.38</span>
                    {/* Tiny social app icons mimicking screenshot notifications */}
                    <div className="flex items-center gap-0.5 ml-1 select-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3b5998] text-[5.5px] font-black text-white flex items-center justify-center">f</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1da1f2] text-[5.5px] font-black text-white flex items-center justify-center">t</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25d366] text-[5.5px] font-black text-white flex items-center justify-center">w</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-sans text-[8px] font-bold">
                    <span>0.71 KB/s</span>
                    <Wifi size={9} strokeWidth={2.5} className="text-white" />
                    <span className="text-[7.5px] font-black tracking-tighter uppercase leading-none border border-white/50 rounded-xs px-1 scale-90">VoLTE</span>
                    <Signal size={9} strokeWidth={2.5} className="text-white" />
                    <div className="flex items-center gap-0.5 border border-white rounded-xs px-0.5 py-0 scale-90 bg-white/10 font-black">
                      <span className="text-[7.5px]">100</span>
                    </div>
                  </div>
                </div>

                {/* Search Bar / Profile Header (Sits on top of the blue block mimicking the screenshot) */}
                <div className="bg-[#0088e3] px-3 pb-3 pt-1.5 flex items-center gap-2 select-none">
                  <div className="flex-1 bg-white rounded-full py-1.5 px-3.5 flex items-center gap-2 shadow-2xs">
                    <Search size={12} className="text-slate-400 shrink-0" />
                    <span className="text-[9.5px] text-slate-400 font-bold truncate">Cari disini...</span>
                  </div>
                  <div className="relative w-7.5 h-7.5 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-2xs shrink-0 cursor-pointer">
                    <Bell size={13} className="text-emerald-500 fill-emerald-500" strokeWidth={2.5} />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                  </div>
                </div>

                {/* Main Screen Area - scrollable */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pb-4 scrollbar-none bg-slate-50">
                  
                  {/* Sky Blue Cruise Ship Promotional Hero Banner Card */}
                  <div className="bg-gradient-to-b from-[#0088e3] to-[#019af8] px-4 pt-1.5 pb-4 relative overflow-hidden text-left flex flex-col justify-between h-[120px] select-none">
                    {/* Clouds and Sun decoration in background */}
                    <div className="absolute top-2 right-24 text-lg animate-pulse" style={{ animationDuration: '3s' }}>☀️</div>
                    <div className="absolute top-4 left-2 text-2xl opacity-75">☁️</div>

                    {/* Ship illustration sailing gracefully */}
                    <div className="absolute bottom-1 -left-1 w-[115px] h-[65px] z-10 pointer-events-none drop-shadow-md">
                      <svg viewBox="0 0 120 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M5 45 C40 45, 95 45, 115 32 L110 52 C95 56, 30 56, 5 52 Z" fill="#ffffff" />
                        <path d="M5 45 L115 32 L112 36 L5 48 Z" fill="#1d4ed8" />
                        <rect x="15" y="22" width="70" height="15" rx="3" fill="#ffffff" />
                        <rect x="25" y="10" width="45" height="13" rx="2" fill="#f1f5f9" />
                        <rect x="55" y="5" width="8" height="6" fill="#ef4444" />
                        <rect x="55" y="3" width="8" height="2" fill="#0f172a" />
                        <circle cx="22" cy="29.5" r="2.2" fill="#1e293b" />
                        <circle cx="32" cy="29.5" r="2.2" fill="#1e293b" />
                        <circle cx="42" cy="29.5" r="2.2" fill="#1e293b" />
                        <circle cx="52" cy="29.5" r="2.2" fill="#1e293b" />
                        <circle cx="62" cy="29.5" r="2.2" fill="#1e293b" />
                        <circle cx="72" cy="29.5" r="2.2" fill="#1e293b" />
                        <path d="M0 50 Q10 47, 20 50 T40 50 T60 50 T80 50 T100 50 T120 50 L120 65 L0 65 Z" fill="#0088e3" opacity="0.3" />
                      </svg>
                    </div>

                    {/* Banner Main wording aligned perfectly to standard user image */}
                    <div className="ml-auto w-[62%] text-right pr-1 pt-1 z-10">
                      <h4 className="text-[11px] font-extrabold leading-tight text-white tracking-wide">
                        Tiket Kapal PELNI
                      </h4>
                      <p className="text-[9px] font-bold text-sky-100 leading-none mt-0.5">
                        kini tersedia di
                      </p>
                      <p className="text-[12.5px] font-black text-white leading-tight mt-0.5 tracking-tight uppercase">
                        MitraBayar!
                      </p>
                      
                      {/* PELNI Brand white tag */}
                      <div className="mt-2.5 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-sm shadow-3xs scale-90">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-3xs flex items-center justify-center text-[7px] font-black text-white">▲</div>
                        <span className="text-[7.5px] font-extrabold tracking-widest text-[#0d2e5c]">PELNI</span>
                      </div>
                    </div>
                  </div>

                  {/* White Balance & Cashback Overlapping Card (Slightly overflows over the blue banner) */}
                  <div className="mx-3 relative z-20 -mt-5 bg-white border border-slate-100 rounded-xl p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-center justify-between text-left divide-x divide-slate-100/90 select-none">
                    <div className="flex-1 pr-1 flex items-center gap-1.5">
                      <div className="w-7.5 h-7.5 rounded-lg bg-sky-55 flex items-center justify-center text-sky-500 shrink-0 border border-sky-100">
                        <CreditCard size={14} strokeWidth={2.5} className="text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-black tracking-tighter text-slate-800 truncate" title="Rp 12.000.000.000">Rp 12.000.000.000</p>
                        <p className="text-[7.5px] font-extrabold text-slate-450 leading-none mt-0.5">Dana Global Talangan</p>
                      </div>
                    </div>
                    <div className="flex-1 pl-2.5 flex items-center gap-1.5">
                       <div className="w-7.5 h-7.5 rounded-lg bg-amber-55 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                        <Star size={14} className="fill-amber-400 text-amber-500" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-black tracking-tighter text-[#1e293b] truncate" title="Rp 420.000">Rp 420.000</p>
                        <p className="text-[7.5px] font-extrabold text-slate-450 leading-none mt-0.5">Saldo Debitur/Peminjam</p>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal 8-PPOB Service Icons Grid as requested */}
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4 pt-2.5 px-3 select-none">
                    {[
                      { icon: <Building2 size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-emerald-500", label: "Hotel" },
                      { icon: <Plane size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-sky-500", label: "Pesawat" },
                      { icon: <Train size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-[#0ea5e9]", label: "Kereta Api" },
                      { icon: <Ship size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-cyan-500", label: "Pelni" },
                      { icon: <Bus size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-indigo-500", label: "Bus" },
                      { icon: <Smartphone size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-amber-500", label: "Pulsa" },
                      { icon: <FileText size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-orange-500", label: "Tagihan" },
                      { icon: <LayoutGrid size={16} strokeWidth={2.5} className="text-white" />, bg: "bg-[#10d024]", label: "Lainnya" }
                    ].map((item, i) => (
                      <motion.div 
                        whileHover={{ scale: 1.12, y: -2 }}
                        key={i} 
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <div className={`w-[36px] h-[36px] rounded-full ${item.bg} flex items-center justify-center shadow-2xs`}>
                          {item.icon}
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-700 text-center leading-none mt-1.5 tracking-tight">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Referral Share Banner matches exact screenshot dimensions */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="mx-3 bg-gradient-to-r from-[#5fb057] to-[#429d3a] rounded-xl p-3 flex justify-between items-center text-left text-white shadow-3xs"
                  >
                    <div className="max-w-[70%]">
                      <p className="text-[8.5px] font-bold leading-tight">
                        Bagikan referral kamu dan nikmati berbagai keuntungannya
                      </p>
                    </div>
                    <button className="bg-transparent hover:bg-white/10 text-white border border-white/60 text-[8px] font-extrabold px-2.5 py-1 rounded-full shadow-3xs transition-all cursor-pointer">
                      Share
                    </button>
                  </motion.div>

                  {/* Papigo Campaign Promotional Card Section exactly as requested */}
                  <div className="px-3.5 text-left pb-1">
                    <h5 className="text-[11px] font-black text-slate-800 tracking-wider uppercase mb-1.5">Papigo</h5>
                    <div className="bg-gradient-to-r from-red-500 via-amber-400 to-sky-505 rounded-xl h-[95px] relative overflow-hidden flex flex-col justify-end p-2.5 shadow-3xs border border-slate-100">
                      {/* Indonesian Red-White Bunting/Flags Decoration */}
                      <div className="absolute top-0 left-0 right-0 h-4 flex gap-1 justify-around px-2 pointer-events-none">
                        {[...Array(8)].map((_, idx) => (
                          <div key={idx} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-600 drop-shadow-3xs"></div>
                        ))}
                      </div>
                      <div className="absolute top-1 left-0 right-0 h-4 flex gap-1 justify-around px-4 pointer-events-none">
                        {[...Array(6)].map((_, idx) => (
                          <div key={idx} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white drop-shadow-3xs"></div>
                        ))}
                      </div>
                      
                      {/* Papigo title layout with elegant shadow */}
                      <div className="relative z-10 text-center flex flex-col items-center select-none pb-1">
                        <span className="text-[16px] font-black text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          PAPIGO
                        </span>
                        <span className="text-[7.5px] font-black text-blue-50 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          Karnaval Kejutan Promo Merdeka
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* App Bottom Navigation Bar inside first mockup (5 items matching screenshot exactly) */}
                <div className="border-t border-slate-100 bg-white px-1 py-1.5 grid grid-cols-5 gap-0.5 text-center font-sans tracking-tight shrink-0 select-none">
                  <div className="flex flex-col items-center text-[#429d3a] cursor-pointer">
                    <Home size={14} strokeWidth={3} className="fill-[#429d3a]/10" />
                    <span className="text-[7.5px] font-extrabold mt-0.5">Beranda</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                    <Compass size={14} strokeWidth={2} />
                    <span className="text-[7.5px] font-bold mt-0.5">Explore</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                    <Star size={14} strokeWidth={2} />
                    <span className="text-[7.5px] font-bold mt-0.5">Kemitraan</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                    <FileText size={14} strokeWidth={2} />
                    <span className="text-[7.5px] font-bold mt-0.5">Transaksi</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                    <div className="w-[15px] h-[15px] rounded-full border border-slate-250 overflow-hidden flex items-center justify-center bg-slate-100">
                      <User size={10} className="text-slate-500" />
                    </div>
                    <span className="text-[7.5px] font-bold mt-0.5">Profil</span>
                  </div>
                </div>

                {/* Real Android/System Core Navigation Keys (mimicking full experience) */}
                <div className="bg-black text-[#858585] py-0.5 flex items-center justify-around text-[10px] select-none h-6 tracking-widest shrink-0 font-sans z-25 border-t border-zinc-910">
                  <span className="cursor-pointer hover:text-white transition-colors">☰</span>
                  <span className="cursor-pointer hover:text-white transition-colors scale-120 opacity-90">⬔</span>
                  <span className="cursor-pointer hover:text-white transition-colors scale-75">◀</span>
                </div>

              </div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
const ComparisonTable = () => {
  const points = [
    {
      title: "Beban Biaya",
      desc: "Metode pembebanan denda & biaya tambahan",
      traditional: "Denda harian sangat tinggi & terus berbunga tiada henti.",
      mitra: "Biaya admin terjangkau & transparan sejak awal pengkalkulasian."
    },
    {
      title: "Kebutuhan Tunai",
      desc: "Cara pelunasan tunggakan",
      traditional: "Wajib membayar pelunasan tunai dalam jumlah besar sekaligus.",
      mitra: "Bisa dicicil secara fleksibel menggunakan aplikasi kami."
    },
    {
      title: "Status Kendaraan",
      desc: "Tingkat keamanan aset berharga",
      traditional: "Risiko tinggi ditarik debt collector secara paksa di jalan.",
      mitra: "Unit aman terlindungi karena denda otomatis terbayar lunas."
    },
    {
      title: "Syarat Bantuan",
      desc: "Proses & kriteria pengajuan program",
      traditional: "Negosiasi rumit, menekan, serta memerlukan jaminan tambahan.",
      mitra: "Cukup aktif bertransaksi & loyal membayar angsuran di Mitra Bayar."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#f0f9ff] via-[#e2f1fc]/85 to-[#f0f9ff] border-t border-b border-blue-100 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold tracking-wider uppercase mb-4 shadow-3xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Aset & Proteksi Finansial
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0d2e5c] tracking-tight leading-tight">
            Tradisional <span className="text-slate-400 font-light">vs.</span> Solusi Mitra Bayar
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Perbandingan pendekatan modern dalam menyelamatkan unit kendaraan Anda dari bahaya penarikan sepihak dan akumulasi denda.
          </p>
        </div>

        {/* Major Visual Side-by-Side Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Sistem Tradisional (Lefthand Dark Reality) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.015)] relative flex flex-col justify-between overflow-hidden">
            {/* Soft grid background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-500">Kondisi Umum</span>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">Sistem Tradisional</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <AlertTriangle size={20} />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {points.map((pt, i) => (
                  <div key={i} className="flex gap-4 items-start pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 text-xs font-black">
                      <X size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">{pt.title}</h4>
                      <p className="text-sm text-slate-600 font-semibold mt-1 leading-relaxed">{pt.traditional}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-rose-50/50 border border-rose-100/60 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-rose-700 flex items-center justify-center gap-1.5">
                ❌ Penuh Tekanan, Risiko Unit Disita Tinggi
              </span>
            </div>
          </div>

          {/* VS Center Indicator Element (Visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-slate-200 via-blue-200 to-slate-200"></div>
            <div className="h-12 w-12 rounded-full bg-slate-900 border-4 border-white text-white text-sm font-black flex items-center justify-center shadow-md relative z-10">
              VS
            </div>
          </div>

          {/* Card 2: Solusi Mitra Bayar (Righthand Gorgeous Secure Tech-Card) */}
          <div className="lg:col-span-5 bg-[#0d2e5c] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(13,46,92,0.15)] relative flex flex-col justify-between overflow-hidden text-white border border-blue-900/40">
            {/* Futuristic glowing circular gradient */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none"></div>

            {/* Glowing Tag */}
            <div className="absolute top-6 right-6">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md inline-flex items-center gap-1">
                <ShieldCheck size={11} strokeWidth={3} /> Terjamin Aman
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-300">Penyelamatan Aset</span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">Solusi Mitra Bayar</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Zap size={18} className="text-emerald-400 fill-emerald-400" />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {points.map((pt, i) => (
                  <div key={i} className="flex gap-4 items-start pb-5 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-black shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                      <CheckCircle size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wide">{pt.title}</h4>
                      <p className="text-sm text-slate-100 font-semibold mt-1 leading-relaxed">{pt.mitra}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                ��️ BPKB Aman, Unit Aman, Kendaraan Tetap Milik Anda
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

const ProgramDetails = () => {
  const features = [
    {
      icon: <ShieldCheck size={36} className="text-blue-600" />,
      title: "Mencegah Penarikan Unit",
      bgClass: "bg-blue-50",
      description: "Jangan biarkan mobil atau motor ditarik karena denda menumpuk. Kami talangi pembayarannya segera ke pihak leasing."
    },
    {
      icon: <CreditCard size={36} className="text-green-600" />,
      title: "Cukup Transaksi Rutin",
      bgClass: "bg-green-50",
      description: "Tanpa jaminan BPKB atau dokumen tambahan rumit. Syarat utama hanyalah rutin membayar angsuran/PPOB di aplikasi."
    },
    {
      icon: <Clock size={36} className="text-orange-500" />,
      title: "Pencairan Langsung",
      bgClass: "bg-orange-50",
      description: "Bukan pinjaman uang tunai. Dana sementara disalurkan LANGSUNG ke perusahaan pembiayaan (leasing) Anda dengan aman."
    }
  ];

  return (
    <section id="program" className="py-16 md:py-24 bg-gradient-to-b from-[#f0f9ff]/50 via-[#e0f2fe]/40 to-[#f0f9ff]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Program Apresiasi Customer <span className="text-blue-600">Reward Loyalitas</span></h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Dana Sementara hadir khusus untuk membantu member setia kami. Ubah rutinitas pembayaran <strong className="text-gray-900">angsuran kendaraan bulanan</strong> Anda menjadi jaring pengaman finansial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className={`${feature.bgClass} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Unduh & Daftar",
      description: "Download aplikasi Mitra Bayar secara gratis di Play Store dan daftar akun Premium.",
      icon: <Smartphone size={24} />
    },
    {
      number: "02",
      title: "Rutin Bayar Angsuran",
      description: "Gunakan aplikasi untuk bayar Angsuran Kendaraan, Listrik, dsb. (Min. 10x/bulan).",
      icon: <Zap size={24} />
    },
    {
      number: "03",
      title: "Ajukan Bantuan",
      description: "Masuk menu 'Dana Sementara', input no kontrak leasing Anda (BFI, FIF, Adira, dll).",
      icon: <CreditCard size={24} />
    },
    {
      number: "04",
      title: "Kendaraan Aman",
      description: "Sistem mencairkan dana langsung ke leasing. Kendaraan Anda bebas dari denda!",
      icon: <ShieldCheck size={24} />
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-[#dbeafe] via-[#f0f9ff] to-[#bfdbfe] text-slate-800 relative overflow-hidden border-t border-b border-blue-100">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="0" r="100" fill="currentColor"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-semibold tracking-wider text-xs sm:text-sm mb-4">CARA CERDAS BEBAS DENDA</span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-[#0d2e5c]">Jangan remehkan Denda tagihan berjalan Anda</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">4 Langkah mudah mengaktifkan Dana Sementara Anda.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[2.5rem] left-[12%] w-[76%] h-0.5 bg-blue-200">
             <div className="h-full bg-blue-400 w-full opacity-50"></div>
          </div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-blue-500 group-hover:border-emerald-500 flex items-center justify-center text-blue-600 mb-6 shadow-md transition-all duration-300 relative">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold border-4 border-white">
                  {step.number}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-[#0d2e5c]">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-[250px]">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 text-center px-4 sm:px-0 flex justify-center">
          <div className="bg-white/80 border border-blue-200 rounded-2xl p-6 sm:p-8 max-w-3xl backdrop-blur-sm relative overflow-hidden shadow-sm">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h4 className="font-bold text-lg sm:text-xl mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-[#0d2e5c]">
               Transaksi Apa Saja yang Dihitung?
            </h4>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed text-center">
              Semua layanan PPOB dihitung! Namun <strong className="text-[#0d2e5c] bg-blue-100/50 px-2 py-1 rounded border border-blue-250 font-bold mx-1">Sangat Diutamakan Membayar Angsuran Kendaraan (Leasing) Bulanan</strong>, Token PLN, Pulsa & Data, BPJS, PDAM, dsb di aplikasi. <br className="hidden sm:block mt-2"/>
              <span className="text-xs text-slate-400 mt-3 block">*(Transfer sesama akun Mitra Bayar tidak dihitung)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const EcosystemFlow = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#f0f9ff]/45 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Ekosistem Keamanan Finansial Anda</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Anda tidak sekadar membayar tagihan bulanan. Anda sedang membangun jaring pengaman finansial darurat tanpa perlu membayar premi asuransi tambahan.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative max-w-4xl mx-auto">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center w-full md:w-1/3 z-10 group">
            <div className="bg-white rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border-4 border-gray-50 flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 relative group-hover:border-blue-100 transition-all duration-350">
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Background soft pulse circle */}
                <span className="absolute inset-0 bg-blue-50/80 rounded-full scale-110 opacity-70 animate-pulse"></span>
                {/* Main device/smartphone icon */}
                <Smartphone size={32} className="text-slate-700 relative z-10" />
                {/* Overlapping car icon badge */}
                <div className="absolute -top-1.5 -right-1.5 bg-white border border-blue-150 rounded-lg p-1 shadow-3xs z-20 hover:scale-110 transition-transform">
                  <Car size={16} className="text-blue-600" />
                </div>
                {/* Overlapping lighting bolt badge */}
                <div className="absolute -bottom-1.5 -left-1.5 bg-white border border-amber-150 rounded-lg p-1 shadow-3xs z-20 hover:scale-110 transition-transform">
                  <Zap size={16} className="text-amber-500 fill-amber-50" />
                </div>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base mt-5 text-center leading-snug px-2">
              Rutinitas Pembayaran PPOB<br/>
              <span className="text-blue-600 text-xs font-medium block mt-1">(Utama: Angsuran Kendaraan)</span>
            </h3>
          </div>

          {/* Arrow 1 */}
          <div className="flex flex-col items-center justify-center text-blue-200 my-2 md:my-0">
            <ArrowRightCircle size={36} className="hidden md:block transform transition-transform" />
            <ArrowRightCircle size={32} className="md:hidden transform rotate-90" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center w-full md:w-1/3 z-10">
            <div className="bg-blue-600 p-6 rounded-full shadow-lg shadow-blue-600/30 border-4 border-blue-100 flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 text-white transform scale-105">
              <div className="text-center">
                <span className="text-2xl font-black block leading-none">Mitra</span>
                <span className="text-2xl font-black text-green-400 block leading-none">Bayar</span>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base mt-5 text-center leading-snug px-2">
              Dikonversi menjadi<br/>
              <span className="text-blue-600 text-xs font-medium block mt-1">Nilai Loyalitas Member</span>
            </h3>
          </div>

          {/* Arrow 2 */}
          <div className="flex flex-col items-center justify-center text-green-300 my-2 md:my-0">
            <ArrowRightCircle size={36} className="hidden md:block" />
            <ArrowRightCircle size={32} className="md:hidden transform rotate-90" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center w-full md:w-1/3 z-10 group">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-full shadow-lg shadow-green-500/30 border-4 border-green-100 flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 text-white group-hover:scale-105 transition-transform">
              <ShieldCheck size={56} />
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base mt-5 text-center leading-snug px-2">
              Kepercayaan Finansial untuk<br/>
              <span className="text-green-600 text-xs font-medium block mt-1">Aset Kendaraan Anda</span>
            </h3>
          </div>
          
        </div>
      </div>
    </section>
  );
};

const Requirements = () => {
  return (
    <section id="requirements" className="py-16 md:py-24 bg-gradient-to-b from-white via-[#e0f2fe]/45 to-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          
          <div className="w-full lg:w-1/2 order-2 lg:order-1 flex justify-center">
            <div className="relative mx-auto">
              {/* Outer Glow behind the phone frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[50px] opacity-15 blur-xl"></div>
              
              {/* Phone Frame Mockup in Standing Position with smooth floating & elegant tilt interaction */}
              <motion.div 
                initial={{ y: 0, rotate: -1 }}
                animate={{ 
                  y: [0, 12, 0],
                  rotate: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  scale: 1.04,
                  rotateY: -8,
                  rotateX: 4,
                  transition: { duration: 0.3 }
                }}
                className="relative w-[310px] sm:w-[330px] h-[610px] bg-slate-50 rounded-[46px] p-3 shadow-2xl border-4 border-slate-200 relative z-10 flex flex-col justify-between overflow-hidden cursor-pointer duration-500 transition-shadow hover:shadow-[0_30px_70px_-10px_rgba(16,185,129,0.18)]"
              >
                
                {/* Dynamic Island / Speaker */}
                <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-between px-3">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full"></div>
                  <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full"></div>
                </div>

                {/* Inner Screen Content */}
                <div className="w-full h-full bg-white rounded-[36px] overflow-hidden flex flex-col justify-between pt-6 pb-2 select-none relative font-sans text-left border border-slate-100/50">
                  
                  {/* Custom top header/status bar inside the screen */}
                  <div className="px-5 pt-1.5 pb-2 flex justify-between items-center text-[10.5px] text-zinc-700 font-bold">
                    <span>10.18  <span className="text-[9px] font-black text-emerald-650">◀</span></span>
                    <div className="flex items-center gap-1.5">
                      <Signal size={11} className="text-zinc-800" strokeWidth={2.5} />
                      <span className="text-[9px] font-black tracking-tighter leading-none text-zinc-800">LTE</span>
                      <div className="flex items-center gap-0.5 border border-zinc-700 rounded-xs px-1 py-0.5 scale-90 bg-zinc-800 text-white">
                        <span className="text-[7.5px] font-black leading-none px-0.5">80</span>
                      </div>
                    </div>
                  </div>

                  {/* App Navigation inside screen */}
                  <div className="px-4 py-2.5 flex justify-between items-center border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 bg-[#10d024] rounded-lg flex items-center justify-center text-white text-xs font-black shadow-3xs">MB</div>
                      <div>
                        <span className="font-black text-[#10d024] text-xs tracking-tight">Mitra</span>
                        <span className="font-black text-slate-800 text-xs tracking-tight">Bayar</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-500 cursor-pointer shadow-3xs">
                        <Bell size={12} />
                      </div>
                      <div className="w-6 h-6 bg-emerald-100 rounded-full text-[10px] text-emerald-700 font-black flex items-center justify-center border border-emerald-250 shadow-3xs">
                        P
                      </div>
                    </div>
                  </div>

                  {/* Main screen area - scrollable style */}
                  <div className="flex-1 p-3.5 space-y-3 overflow-y-auto scrollbar-none pb-6">
                    
                    {/* User greeting */}
                    <div className="flex justify-between items-center px-1">
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold leading-none">Selamat Datang,</p>
                        <h4 className="text-xs font-black text-slate-800 mt-0.5">Yth. Affiliasi Transaksi</h4>
                      </div>
                      <span className="text-[8px] font-extrabold text-[#10d024] bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-3xs animate-pulse">
                        Premium
                      </span>
                    </div>

                    {/* Main balance and limit wallet style */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 text-slate-900 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden border border-emerald-150 transition-shadow hover:shadow-md"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl"></div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Saldo Transaksi</p>
                          <h3 className="text-sm font-black tracking-tight mt-0.5 text-slate-900">Rp 480.000</h3>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            Limit Dana Sementara
                          </p>
                          <h3 className="text-base font-black tracking-tight mt-0.5 text-emerald-800">Rp 15.000.000</h3>
                        </div>
                        <span className="text-[9px] font-black bg-[#10d024]/10 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200">
                          Siap Pakai
                        </span>
                      </div>
                    </motion.div>

                    {/* Green Promo Banner */}
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="bg-gradient-to-br from-[#10d024] to-[#0ba81b] rounded-xl p-3 text-white shadow-3xs text-left relative overflow-hidden"
                    >
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full pointer-events-none"></div>
                      <p className="text-[8.5px] text-emerald-100 font-black leading-tight max-w-[80%]">
                        Pembayaran MitraBayar mendukung kartu Visa & Mastercard
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 scale-90 origin-left">
                        <span className="bg-white text-blue-900 font-black px-1.5 py-0.3 rounded-xs text-[8px] italic leading-none">VISA</span>
                        <div className="bg-white px-1.5 py-0.3 rounded-xs text-[6.5px] font-black italic flex items-center gap-0.5">
                          <span className="flex -space-x-1 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block -ml-0.8"></span>
                          </span>
                          <span className="text-zinc-800">mastercard</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick Menu Icons Grid matches horizontal row in Holigo */}
                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {[
                        { icon: <span className="text-sm">��</span>, color: "bg-emerald-50 border-emerald-100", label: "Hotel" },
                        { icon: <span className="text-sm">✈️</span>, color: "bg-sky-50 border-sky-100", label: "Pesawat" },
                        { icon: <span className="text-sm">��</span>, color: "bg-blue-50 border-blue-100", label: "Kereta" },
                        { icon: <span className="text-sm">��</span>, color: "bg-orange-50 border-orange-100", label: "Pulsa" },
                        { icon: <span className="text-sm">��</span>, color: "bg-amber-50 border-amber-100", label: "Tagihan" }
                      ].map((item, i) => (
                        <motion.div 
                          whileHover={{ scale: 1.15, y: -2 }}
                          key={i} 
                          className="flex flex-col items-center justify-center p-0.5 cursor-pointer"
                        >
                          <div className={`w-8.5 h-8.5 rounded-full ${item.color} flex items-center justify-center mb-1 shadow-3xs border`}>
                            {item.icon}
                          </div>
                          <span className="text-[8px] font-black text-slate-700 text-center leading-none tracking-tight truncate w-full">{item.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Active Protection Card/Promo */}
                    <motion.div whileHover={{ scale: 1.02, x: 2 }} className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 flex items-start gap-2 cursor-pointer">
                      <div className="p-1 px-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 flex items-center justify-center">
                        <ShieldCheck size={13} className="animate-pulse" />
                      </div>
                      <div className="space-y-0.5 leading-none">
                        <h5 className="text-[9px] font-extrabold text-emerald-950">Proteksi Unit Aktif</h5>
                        <p className="text-[8px] text-emerald-800 leading-snug">
                          Status kendaraan terpantau aman terkendali.
                        </p>
                      </div>
                    </motion.div>

                    {/* Mini Transaction Feed Widget inside phone screen */}
                    <div className="bg-white border border-slate-100 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex justify-between items-center leading-none">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Aktivitas</span>
                        <span className="text-[7.5px] text-emerald-600 font-extrabold cursor-pointer">Semua</span>
                      </div>
                      
                      <motion.div whileHover={{ scale: 1.01, x: 2 }} className="flex justify-between items-center text-[9px] border-b border-slate-50 pb-1 cursor-pointer">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-[7px] shrink-0">TX</div>
                          <div className="truncate min-w-0">
                            <p className="font-extrabold text-slate-800 text-[8.5px] truncate">Pembayaran FIF Group</p>
                            <p className="text-[7px] text-zinc-400">Hari ini, 08:30</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 shrink-0 text-[8.5px]">+Rp 150rb</span>
                      </motion.div>
                    </div>

                  </div>

                  {/* App bar bottom menu navigation */}
                  <div className="border-t border-slate-100 bg-white px-4 py-2 grid grid-cols-4 gap-1 text-center">
                    <div className="flex flex-col items-center text-[#10d024] cursor-pointer">
                      <Home size={15} strokeWidth={2.5} />
                      <span className="text-[8px] font-black mt-0.5">Beranda</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                      <CreditCard size={15} />
                      <span className="text-[8px] font-bold mt-0.5">Bayar</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                      <Zap size={15} />
                      <span className="text-[8px] font-bold mt-0.5">Talangan</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400 hover:text-emerald-500 cursor-pointer">
                      <User size={15} />
                      <span className="text-[8px] font-bold mt-0.5">Akun</span>
                    </div>
                  </div>

                </div>

                {/* Android / iOS bottom gesture bar */}
                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full z-20"></div>

              </motion.div>

              {/* Floating "Status Bantuan Dana Disetujui" Card - pointing to mobile app mockup */}
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.03, 1] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -bottom-2 -right-6 sm:-bottom-4 sm:-right-8 bg-white p-3 sm:p-4 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-20 flex items-center gap-3 sm:gap-4 cursor-pointer"
              >
                <div className="bg-emerald-100 p-2 sm:p-2.5 rounded-full shrink-0">
                  <CheckCircle className="text-emerald-600" size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Status Bantuan</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">Dana Disetujui</p>
                </div>
              </motion.div>

            </div>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6 text-center lg:text-left">Syarat & Ketentuan Umum</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 text-center lg:text-left leading-relaxed">
              Kami merancang program ini agar semudah mungkin diakses oleh member yang benar-benar membutuhkan dan aktif menggunakan layanan kami.
            </p>

            <ul className="space-y-4 md:space-y-5">
              {[
                "Akun Mitra Bayar telah terverifikasi Identitas/KTP (Akun Premium).",
                <span>Telah melakukan <strong>minimal 10x transaksi sukses</strong> (utamakan bayar angsuran kendaraan) dalam 30 hari terakhir.</span>,
                "Nama pada akun Mitra Bayar wajib sama dengan nama pada kontrak leasing kendaraan yang diajukan.",
                "Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna.",
                "Dana sementara wajib dikembalikan/dicicil sesuai tenor fleksibel (1 hingga 2 bulan) melalui Top-Up di aplikasi."
              ].map((item, index) => (
                <li key={index} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-green-500 bg-green-50 rounded-full" size={22} />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 bg-yellow-50 border border-yellow-200 rounded-xl text-sm md:text-base text-yellow-800 flex gap-4 items-start shadow-sm">
              <AlertTriangle className="flex-shrink-0 text-yellow-600 mt-0.5" size={24} />
              <div className="leading-relaxed">
                <strong className="block text-yellow-900 mb-1">Penting Diketahui:</strong> 
                <p className="text-xs sm:text-sm font-semibold text-amber-950 mt-1">
                  ⚠️ Maksimal dana sementara disesuaikan dengan limit/profil skor transaksi akun masing-masing pengguna dan sudah bertraksaksi maksimal 3 bulan.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Testimony = () => {
  const testimonies = [
    {
      name: "Ahmad Fauzi",
      city: "Jakarta Pusat",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      biller: "FIF Group",
      vehicle: "Honda Beat",
      amount: "Rp 1.450.000",
      text: "Alhamdulillah denda nunggak FIF kelar dibayar Mitra Bayar, motor aman tak jadi disita kolektor.",
      status: "Ditalangi",
      badgeColor: "bg-blue-50/50 border-blue-105/30 text-blue-600",
      textColor: "text-blue-600",
      hoverColor: "hover:border-blue-200"
    },
    {
      name: "Siti Rahma",
      city: "Surabaya Timur",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      biller: "Adira Finance",
      vehicle: "Yamaha NMAX",
      amount: "Rp 1.900.000",
      text: "Sangat terbantu! Pas keuangan lagi seret, denda ditanggulangi dulu. Prosesnya transparan dan amanah.",
      status: "Sukses",
      badgeColor: "bg-emerald-50/50 border-emerald-105/30 text-emerald-600",
      textColor: "text-emerald-600",
      hoverColor: "hover:border-emerald-200"
    },
    {
      name: "Budi Santoso",
      city: "Semarang Candi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      biller: "BFI Finance",
      vehicle: "Toyota Avanza",
      amount: "Rp 4.200.000",
      text: "Bantuan talangan mobil tercepat. Tidak perlu khawatir unit ditarik karena urusan denda langsung beres.",
      status: "Ditalangi",
      badgeColor: "bg-blue-50/50 border-blue-105/30 text-blue-600",
      textColor: "text-blue-600",
      hoverColor: "hover:border-blue-200"
    },
    {
      name: "Dewi Lestari",
      city: "Bandung Kota",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      biller: "WOM Finance",
      vehicle: "Honda Vario",
      amount: "Rp 1.100.000",
      text: "Syarat 10x transaksi terpenuhi langsung bisa disetujui. Pengembaliannya juga sangat ringan bisa dicicil.",
      status: "Sukses",
      badgeColor: "bg-emerald-50/50 border-emerald-105/30 text-emerald-600",
      textColor: "text-emerald-600",
      hoverColor: "hover:border-emerald-200"
    },
    {
      name: "Roni Wijaya",
      city: "Medan Baru",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      biller: "OTO Finance",
      vehicle: "Suzuki Carry",
      amount: "Rp 2.800.000",
      text: "Keren sekali program Dana Sementara ini. Memang khusus untuk member setia Mitra Bayar yang tertib.",
      status: "Ditalangi",
      badgeColor: "bg-blue-50/50 border-blue-105/30 text-blue-600",
      textColor: "text-blue-600",
      hoverColor: "hover:border-blue-200"
    },
    {
      name: "Andi Wijaya",
      city: "Makassar Petarani",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      biller: "MCF Finance",
      vehicle: "Honda Scoopy",
      amount: "Rp 950.000",
      text: "Solusi penyelamatan motor terbaik pas kondisi bener-bener mepet denda menumpuk harian.",
      status: "Sukses",
      badgeColor: "bg-emerald-50/50 border-emerald-105/30 text-emerald-600",
      textColor: "text-emerald-600",
      hoverColor: "hover:border-emerald-200"
    },
    {
      name: "Diana Putri",
      city: "Yogyakarta Sleman",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      biller: "Adira Finance",
      vehicle: "Yamaha Lexi",
      amount: "Rp 1.250.000",
      text: "Tinggal input no kontrak leasing, langsung dikoordinasi cepat. Rekomendasi banget untuk rescue aset.",
      status: "Ditalangi",
      badgeColor: "bg-blue-50/50 border-blue-105/30 text-blue-600",
      textColor: "text-blue-600",
      hoverColor: "hover:border-blue-200"
    },
    {
      name: "Putu Gede",
      city: "Denpasar Selatan",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
      biller: "FIF Group",
      vehicle: "Honda PCX",
      amount: "Rp 2.100.000",
      text: "Mitra Bayar memang andalan saya bayar cicilan angsuran rutin. Begitu butuh dana sementara, langsung cair.",
      status: "Sukses",
      badgeColor: "bg-emerald-50/50 border-emerald-105/30 text-emerald-600",
      textColor: "text-emerald-600",
      hoverColor: "hover:border-emerald-200"
    },
    {
      name: "Eko Prasetyo",
      city: "Palembang Ulu",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      biller: "BFI Finance",
      vehicle: "Daihatsu Gran Max",
      amount: "Rp 3.500.000",
      text: "Penyelamatan kredit macet dadakan terbaik. Admin transparan dan BPKB tetap aman bersama leasing-nya.",
      status: "Ditalangi",
      badgeColor: "bg-blue-50/50 border-blue-105/30 text-blue-600",
      textColor: "text-blue-600",
      hoverColor: "hover:border-blue-200"
    },
    {
      name: "Yenni Marlina",
      city: "Malang Dinoyo",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      biller: "WOM Finance",
      vehicle: "Honda Beat",
      amount: "Rp 800.000",
      text: "Denda leasing auto lunas berkat program talangan ini. Adminnya ramah dan penjelasannya sangat jelas.",
      status: "Sukses",
      badgeColor: "bg-emerald-50/50 border-emerald-105/30 text-emerald-600",
      textColor: "text-emerald-600",
      hoverColor: "hover:border-emerald-200"
    }
  ];

  return (
    <section id="testimony" className="py-16 md:py-24 bg-gradient-to-b from-white via-[#e0f2fe]/40 to-white relative overflow-hidden border-t border-b border-blue-100">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#10d024 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Modern abstract light glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
        <span className="text-[#10d024] font-black tracking-widest uppercase text-xs sm:text-sm mb-3 block animate-pulse">Testimoni Debitur/Peminjam</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0d2e5c] tracking-tight leading-tight">
          Ribuan Debitur/Peminjam kami bantu penyelesaian Denda Tunggakan
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
          Ribuan Debitur/Peminjam dari berbagai kota di Indonesia telah mengaktifkan fasilitas <strong className="text-[#0d2e5c]">Dana Sementara</strong> untuk menyelesaikan tunggakan denda darurat secara aman dan tepercaya.
        </p>
      </div>

      {/* Infinite Scrolling Ticker (Single Row) */}
      <div className="w-full overflow-hidden flex flex-col gap-6 relative select-none">
        
        {/* Single Row ticker wrapper */}
        <div className="relative py-4 overflow-x-hidden flex w-full">
          <div className="animate-marquee flex gap-6 whitespace-nowrap">
            {[...testimonies, ...testimonies].map((item, idx) => (
              <motion.div 
                key={`testimony-${idx}`}
                whileHover={{ 
                  scale: 1.04, 
                  y: -8,
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.08)",
                  borderColor: "rgba(16, 208, 36, 0.4)"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-[310px] sm:w-[360px] bg-gradient-to-br from-white via-slate-50 to-zinc-100/90 border border-slate-200 rounded-3xl p-6 shadow-[0_4px_22px_rgba(0,0,0,0.015)] flex flex-col justify-between shrink-0 relative overflow-hidden group cursor-grab active:cursor-grabbing transition-colors duration-300"
              >
                {/* Visual Accent Top Right */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#10d024]/10 to-transparent rounded-full group-hover:scale-125 transition-transform duration-500"></div>

                <div>
                  {/* Status & City Bar */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-3xs border ${item.badgeColor}`}>
                      <ShieldCheck size={12} className="shrink-0 text-[#10d024]" />
                      {item.biller}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${item.status === 'Ditalangi' ? 'text-rose-600 bg-rose-50 border border-rose-100' : 'text-emerald-600 bg-emerald-50 border border-emerald-100'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Trust Rating Stars to make it "lebih hidup" / realistic */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-amber-400 text-xs sm:text-sm drop-shadow-3xs">⭐</span>
                    ))}
                    <span className="text-[10px] font-black text-slate-400 ml-1.5">5.0</span>
                  </div>

                  {/* Quote Body */}
                  <div className="relative mb-4">
                    <Quote className="absolute -top-3.5 -left-2 text-[#10d024]/10 h-9 w-9 -z-1" strokeWidth={3} />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold italic whitespace-normal pl-4 border-l-2 border-[#10d024]/30">
                      "{item.text}"
                    </p>
                  </div>
                </div>

                {/* Sender/Creditor Footer Grid info */}
                <div className="flex items-center gap-3.5 border-t border-slate-150 pt-4 mt-3">
                  <div className="relative shrink-0">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className={`w-11 h-11 rounded-full object-cover border-2 shadow-inner ${item.status === 'Ditalangi' ? 'border-blue-105' : 'border-[#10d024]'}`}
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[7.5px] text-white font-black font-sans shadow-3xs">✓</span>
                  </div>
                  <div className="text-left leading-normal overflow-hidden min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate leading-tight flex items-center gap-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1 leading-none mt-1">
                      <MapPin size={11} className="text-[#10d024]" />
                      <span className="truncate">{item.city}</span>
                    </p>
                    <p className="text-[9px] font-extrabold text-slate-400 mt-1.5 uppercase tracking-wider truncate bg-slate-100/70 inline-block px-1.5 py-0.5 rounded border border-slate-205/40">
                      {item.vehicle} • {item.amount}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Glass Gradient overlays for edge fading */}
          <div className="absolute top-0 left-0 w-12 sm:w-24 h-full bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-12 sm:w-24 h-full bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-10"></div>
        </div>

      </div>

      {/* Real-time rescue data counters widget */}
      <div className="max-w-4xl mx-auto px-4 mt-12 sm:mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-150 p-6 md:p-8 rounded-[2rem] shadow-md text-center">
          <div>
            <h4 className="text-2xl sm:text-3xl font-black text-[#0d2e5c]">34+</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Kota Terkoneksi</p>
          </div>
          <div className="border-l border-slate-100">
            <h4 className="text-2xl sm:text-3xl font-black text-emerald-600">99.4%</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Aset Terselamatkan</p>
          </div>
          <div className="border-l border-slate-100">
            <h4 className="text-2xl sm:text-3xl font-black text-[#0d2e5c]">Rp 8.1B+</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Total Dana Sementara ditalangi</p>
          </div>
          <div className="border-l border-slate-100">
            <h4 className="text-2xl sm:text-3xl font-black text-blue-600">12k+</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Member Terbantu</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Apakah Program Dana Sementara ini mengenakan bunga/potongan yang besar?",
      answer: "Sangat ringan! Karena ini adalah fasilitas reward loyalitas untuk member aktif, biaya admin yang dikenakan sangat transparan dan ringan sejak awal pengajuan, nilainya jauh di bawah denda harian leasing."
    },
    {
      question: "Berapa lama proses pencairan dana ke pihak leasing?",
      answer: "Proses cepat. Setelah Anda mengajukan dan sistem verifikasi syarat 10x transaksi terpenuhi, pembayaran langsung ke pihak leasing akan diproses maksimal 1x24 jam di hari kerja."
    },
    {
      question: "Apakah saya bisa mencairkan Dana Sementara dalam bentuk Uang Tunai?",
      answer: "TIDAK BISA. Dana tidak pernah dicairkan dalam bentuk uang tunai (cash) ke rekening pengguna untuk menjamin ketepatan tujuan program. Dana langsung di-transfer/dibayarkan ke nomor kontrak leasing Anda."
    },
    {
      question: "Bagaimana cara saya mengembalikan dana sementara tersebut?",
      answer: "Sangat fleksibel. Setelah denda leasing lunas dibayarkan oleh kami, tagihan akan muncul di aplikasi Mitra Bayar. Anda bisa mencicilnya secara fleksibel (tenor 1-2 bulan) melalui top-up saldo aplikasi Anda."
    },
    {
      question: "Perusahaan Leasing (Biller) mana saja yang di-cover?",
      answer: "Berlaku untuk tunggakan/denda motor maupun mobil, selama perusahaan pembiayaan (leasing seperti BFI, FIF, Adira, Mandiri Utama Finance, dll) terdaftar di menu Pembayaran Angsuran Mitra Bayar."
    },
    {
      question: "Apa risiko jika saya gagal bayar tagihan Dana Sementara ini?",
      answer: "Jika tagihan Dana Sementara di Mitra Bayar tidak dilunasi sesuai batas waktu yang disepakati, maka pihak Leasing asal akan kembali memanggil Anda untuk penyelesaian pemenuhan tagihan sebelum penyerahan BPKB dapat dilakukan."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-white via-[#e0f2fe]/30 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Pusat Bantuan</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Fakta Penting & Pertanyaan Umum</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Jawaban transparan untuk memastikan Anda memahami penuh keunggulan program Dana Sementara.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-blue-500 shadow-md bg-blue-50/20' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <button
                className="w-full px-5 sm:px-8 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className={`font-bold text-base sm:text-lg pr-4 ${openIndex === index ? 'text-blue-700' : 'text-gray-800'}`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                   {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              
              <div 
                className={`px-5 sm:px-8 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="h-px w-full bg-blue-100 mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section id="download" className="py-20 md:py-28 relative bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#bfdbfe]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 bg-blue-400 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0d2e5c] mb-6 leading-tight">Bangun Kepercayaan Finansial<br className="hidden sm:block"/> Anda Mulai Hari Ini!</h2>
        <p className="text-slate-600 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Jangan tunggu sampai leasing mengirimkan surat peringatan penarikan unit. Mulai bayar angsuran mobil & motor bulanan Anda di Mitra Bayar sekarang!
        </p>
        <div className="flex flex-col gap-6 items-center justify-center">
          <p className="text-blue-700 text-sm font-extrabold tracking-wider uppercase">Download Aplikasi Mitra Bayar Sekarang juga</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            {/* Play Store Badge */}
            <a 
              href="#download-playstore" 
              className="flex items-center gap-3 bg-black hover:bg-slate-900 text-white px-6 py-3 rounded-xl border border-blue-400/30 hover:border-green-400 transition-all duration-300 w-full sm:w-auto justify-center hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_25px_rgba(34,197,94,0.2)] group"
            >
              <svg viewBox="0 0 512 512" className="w-7 h-7 transition-transform group-hover:scale-110">
                <path d="M32.5 12c-5.5 5.5-8.5 13-8.5 22v444c0 9 3 16.5 8.5 22L262 256z" fill="#ea4335" />
                <path d="M386 132L262 256l124 124 100-57c28.5-16 28.5-42.5 0-58.5z" fill="#fbbc05" />
                <path d="M262 256L32.5 478c8.5 8.5 22.5 9.5 37.5 1L386 380z" fill="#34a853" />
                <path d="M262 256L68 15c-15-8.5-29-7.5-37.5 1l231.5 240z" fill="#4285f4" />
              </svg>
              <div className="text-left font-sans">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium leading-none">GET IT ON</p>
                <p className="text-base font-bold text-white leading-tight mt-1">Google Play</p>
              </div>
            </a>

            {/* App Store Badge */}
            <a 
              href="#download-appstore" 
              className="flex items-center gap-3 bg-black hover:bg-slate-900 text-white px-6 py-3 rounded-xl border border-blue-400/30 hover:border-blue-400 transition-all duration-300 w-full sm:w-auto justify-center hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_25px_rgba(59,130,246,0.2)] group"
            >
              <svg viewBox="0 0 170 170" className="w-7 h-7 text-white transition-transform group-hover:scale-110" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.14-3.57-2.88-7.39-7.5-11.47-13.85-5.12-8.08-9.45-17.75-12.98-29.02-3.54-11.27-5.31-21.94-5.31-32.01 0-14.54 3.73-25.96 11.2-34.25 7.46-8.29 16.63-12.44 27.5-12.44 5.02 0 10.28 1.34 15.77 4.01 5.49 2.68 9.42 4.01 11.8 4.01 1.9 0 5.48-1.23 10.74-3.69 6.25-2.9 11.94-4.24 17.06-4.01 12.62.67 22.48 5.24 29.58 13.73-10.72 6.47-16.03 15.22-15.92 26.24.11 8.59 3.29 15.77 9.54 21.53 6.25 5.76 13.79 9.07 22.61 9.94-2.23 6.64-5.02 13.11-8.37 19.41zM119.22 12.44c0 7.82-2.8 14.88-8.4 21.17-5.61 6.3-12.28 10.14-20.02 11.53.11-6.7 2.76-13.56 7.95-20.59 5.2-7.03 11.66-11.13 19.38-12.31.78 6.47.09 13.2-2.09 20.2z" />
              </svg>
              <div className="text-left font-sans">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium leading-none">Download on the</p>
                <p className="text-base font-bold text-white leading-tight mt-1">App Store</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-450 pt-20 pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="flex flex-col items-center">
          
          {/* Centered Large Logo stacked exactly matching the uploaded image */}
          <div className="mb-12 flex flex-col items-center">
            <MitraBayarLogo size={135} showCenteredText={true} textColor="text-white" />
          </div>



          <div className="w-full border-t border-slate-800/50 mb-10"></div>

          {/* Bottom layout */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400/70 font-sans">
            <div className="text-center md:text-left">
              <p className="font-extrabold text-slate-200 mb-1 tracking-wider">PT AFFILIASI TRANSAKSI INDONESIA</p>
              <p>© 2026 PT Affiliasi Transaksi Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
            </div>
            

          </div>

        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'marketing' | 'manager' | 'admin' | null>(null);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [activeView, setActiveView] = useState<'landing' | 'potensi'>('landing');
  const [deferredAnchor, setDeferredAnchor] = useState<string | null>(null);

  // Sync scroll on view switch Or hash link clicks
  useEffect(() => {
    if (deferredAnchor) {
      const element = document.querySelector(deferredAnchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Set actual window hash to match link expectation
        window.history.pushState(null, '', deferredAnchor);
        setDeferredAnchor(null);
      } else {
        const timer = setTimeout(() => {
          const retryElement = document.querySelector(deferredAnchor);
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', deferredAnchor);
          }
          setDeferredAnchor(null);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [activeView, deferredAnchor]);

  const handleLoginSuccess = (role: 'customer' | 'marketing' | 'manager' | 'admin', identifier: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserIdentifier(identifier);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserIdentifier('');
  };

  const handleChangeView = (view: 'landing' | 'potensi', targetHref?: string) => {
    setActiveView(view);
    if (targetHref) {
      setDeferredAnchor(targetHref);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '#');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] via-[#e2f1fc] to-[#f8fafc] font-sans selection:bg-blue-200 selection:text-blue-900 scroll-smooth">
      <Header 
        onOpenLogin={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleLogout}
        currentView={activeView}
        onChangeView={handleChangeView}
      />
      <main className="relative">
        {isLoggedIn && userRole ? (
          <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RoleDashboards 
              role={userRole}
              userIdentifier={userIdentifier}
              onLogout={handleLogout}
            />
          </div>
        ) : activeView === 'potensi' ? (
          <div className="pt-24">
            <PotensiHasil />
            <CTA />
            <Footer />
          </div>
        ) : (
          <>
            <HeroSection onOpenLogin={() => setIsLoginOpen(true)} />
            <ComparisonTable />
            <ProgramDetails />
            <HowItWorks />
            <EcosystemFlow />
            <Requirements />
            <Testimony />
            <FAQ />
            <CTA />
            <Footer />
          </>
        )}
      </main>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}