import React, { useEffect, useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe, 
  ChevronRight, 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles,
  Camera,
  Music,
  BookOpen,
  ShoppingBag,
  Instagram,
  Youtube,
  Feather,
  Zap,
  Moon,
  MessageSquare
} from 'lucide-react';
import { WebsiteSettings, WebsiteContent, ColorPalette, FontPairing } from '../types';

interface TemplateRendererProps {
  settings: WebsiteSettings;
  content: WebsiteContent;
  palette: ColorPalette;
  font: FontPairing;
  onSelectField?: (fieldKey: string) => void;
}

export default function TemplateRenderer({
  settings,
  content,
  palette,
  font,
  onSelectField
}: TemplateRendererProps) {
  const { template, isDarkMode } = settings;
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rendererAlert, setRendererAlert] = useState<string | null>(null);

  const triggerRendererAlert = (msg: string) => {
    setRendererAlert(msg);
    setTimeout(() => setRendererAlert(null), 3500);
  };

  // Inject Google Font link dynamically
  useEffect(() => {
    if (font.importUrl) {
      let linkElement = document.getElementById('selected-google-font') as HTMLLinkElement | null;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = 'selected-google-font';
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
      }
      linkElement.href = font.importUrl;
    }
  }, [font]);

  // Utility to map dynamic Tailwind colors safely
  const getThemeVars = () => {
    const isCyber = palette.id === 'cyber';
    
    if (isDarkMode) {
      return {
        bg: isCyber ? 'bg-neutral-950' : 'bg-slate-950',
        textMain: isCyber ? 'text-neutral-50' : 'text-slate-100',
        textMuted: isCyber ? 'text-neutral-400' : 'text-slate-400',
        cardBg: isCyber ? 'bg-neutral-900 border border-neutral-800' : 'bg-slate-900/60 border border-slate-800',
        borderColor: isCyber ? 'border-neutral-800' : 'border-slate-800',
        metaText: isCyber ? 'text-lime-400' : `text-${palette.primary}`,
        accentBg: isCyber ? 'bg-lime-400/10 text-lime-400' : `bg-${palette.primary}/10 text-${palette.primary}`,
        btnBg: isCyber ? 'bg-lime-400 text-neutral-950' : `bg-${palette.primary}`,
        btnHover: isCyber ? 'hover:bg-lime-300' : `hover:opacity-90`
      };
    } else {
      return {
        bg: palette.neutralBg,
        textMain: palette.textPrimary,
        textMuted: palette.textSecondary,
        cardBg: 'bg-white border border-slate-100 shadow-sm',
        borderColor: 'border-slate-100',
        metaText: `text-${palette.primary}`,
        accentBg: `bg-${palette.primary}/5 text-${palette.primary}`,
        btnBg: `bg-${palette.primary}`,
        btnHover: palette.primaryHover
      };
    }
  };

  const themeVars = getThemeVars();

  // Load custom Lucide Icon dynamically
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Camera': return <Camera className={className} />;
      case 'Music': return <Music className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'Feather': return <Feather className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Moon': return <Moon className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // Click handler to trigger auto-focuser on editor
  const handleFieldClick = (e: React.MouseEvent, fieldKey: string) => {
    e.stopPropagation();
    if (onSelectField) {
      onSelectField(fieldKey);
    }
  };

  // Render font classes
  const getTitleFontClass = () => {
    switch (font.id) {
      case 'modern': return 'font-space-grotesk font-bold tracking-tight';
      case 'editorial': return 'font-serif font-semibold italic';
      case 'mono': return 'font-mono font-bold tracking-tight';
      case 'caps': return 'font-sans font-bold tracking-wide uppercase';
      case 'classic': return 'font-serif font-bold';
      default: return 'font-sans font-bold';
    }
  };

  const getBodyFontClass = () => {
    switch (font.id) {
      case 'mono': return 'font-mono text-sm leading-relaxed';
      case 'classic': return 'font-serif text-[15px] leading-relaxed';
      default: return 'font-sans text-[15px] leading-relaxed';
    }
  };

  // RENDER PORTFOLIO TEMPLATE
  const renderPortfolio = () => {
    const data = content.portfolio;
    return (
      <div className={`min-h-full ${themeVars.bg} ${themeVars.textMain} ${getBodyFontClass()} transition-colors duration-200`}>
        {/* Navigation block */}
        <header className={`border-b ${themeVars.borderColor} py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 ${themeVars.bg} bg-opacity-95 backdrop-blur-sm z-10`}>
          <div 
            onClick={(e) => handleFieldClick(e, 'portfolio-name')}
            className={`font-semibold cursor-pointer ${getTitleFontClass()} ${themeVars.metaText} text-lg md:text-xl p-1 rounded hover:bg-slate-200/20`}
          >
            {data.name.split(' ').map(n => n[0]).join('') || 'AR'}.
          </div>
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <span className="hidden sm:inline text-slate-400">Available for projects</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            
            <a 
              href={`mailto:${data.email}`}
              onClick={(e) => handleFieldClick(e, 'portfolio-email')}
              className={`flex items-center gap-1.5 font-medium border ${themeVars.borderColor} px-3 py-1.5 rounded-full text-xs hover:scale-[1.02] transition-all`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Me
            </a>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="py-14 md:py-24 px-6 md:px-12 max-w-4xl mx-auto flex flex-col gap-6 text-center sm:text-left">
          <div className="inline-flex self-center sm:self-start gap-2 items-center px-3 py-1 rounded-full text-xs font-mono uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin-slow" />
            Live Portfolio
          </div>
          <h1 
            onClick={(e) => handleFieldClick(e, 'portfolio-name')}
            className={`text-4xl sm:text-6xl cursor-pointer p-1 rounded hover:bg-slate-200/20 leading-none ${getTitleFontClass()}`}
          >
            {data.name}
          </h1>
          <p 
            onClick={(e) => handleFieldClick(e, 'portfolio-role')}
            className={`text-xl sm:text-2xl cursor-pointer p-1 rounded hover:bg-slate-200/20 font-medium ${themeVars.metaText}`}
          >
            {data.role}
          </p>
          <p 
            onClick={(e) => handleFieldClick(e, 'portfolio-bio')}
            className="text-base sm:text-lg opacity-85 leading-relaxed max-w-2xl cursor-pointer p-1 rounded hover:bg-slate-200/20"
          >
            {data.bio}
          </p>

          <div className="flex gap-4 mt-2 justify-center sm:justify-start">
            {data.github && (
              <a href={data.github} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100 hover:scale-110 transition-transform">
                <Github className="w-5 h-5" />
              </a>
            )}
            {data.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100 hover:scale-110 transition-transform">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {data.twitter && (
              <a href={data.twitter} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100 hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </section>

        {/* Selected Projects Grid */}
        <section className={`py-12 border-t ${themeVars.borderColor} bg-slate-50/10`}>
          <div className="px-6 md:px-12 max-w-4xl mx-auto">
            <h2 className={`text-2xl mb-8 ${getTitleFontClass()}`}>Selected Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project, idx) => (
                <div 
                  key={project.id || idx}
                  onClick={(e) => handleFieldClick(e, `portfolio-project-${idx}`)}
                  className={`p-6 rounded-2xl cursor-pointer group ${themeVars.cardBg} hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono uppercase opacity-50">Project 0{idx + 1}</span>
                    <ArrowUpRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${themeVars.metaText}`} />
                  </div>
                  <h3 className={`text-lg font-medium mb-2 ${getTitleFontClass()}`}>{project.title}</h3>
                  <p className="text-sm opacity-80 mb-4 h-16 overflow-hidden text-ellipsis line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`text-2xs px-2.5 py-0.5 rounded-full font-mono ${themeVars.accentBg}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto border-t border-dashed border-slate-200/50">
          <h2 className={`text-2xl mb-8 ${getTitleFontClass()}`}>Milestones</h2>
          <div className="space-y-6">
            {data.experience.map((job, idx) => (
              <div 
                key={job.id || idx}
                onClick={(e) => handleFieldClick(e, `portfolio-experience-${idx}`)}
                className={`p-5 rounded-xl cursor-pointer relative pl-6 border-l-2 border-slate-300 hover:bg-slate-200/10 transition-colors`}
              >
                <div className="absolute w-3 h-3 rounded-full bg-slate-300 -left-[7px] top-[26px]"></div>
                <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1.5">
                  <h3 className="font-semibold">{job.role}</h3>
                  <span className="text-xs font-mono opacity-60 bg-slate-200/20 px-2 py-0.5 rounded">{job.duration}</span>
                </div>
                <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${themeVars.metaText}`}>{job.company}</p>
                <p className="text-sm opacity-75">{job.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Contact */}
        <footer className={`border-t ${themeVars.borderColor} py-12 px-6 text-center`}>
          <div className="max-w-md mx-auto space-y-4">
            <h3 className={`text-xl ${getTitleFontClass()}`}>Let's craft something memorable</h3>
            <p className="text-sm opacity-70">Always open to creative collaboration, consultancies, or system architectural reviews.</p>
            <div className="pt-3">
              <a 
                href={`mailto:${data.email}`}
                className={`inline-block px-6 py-2.5 rounded-full text-sm font-medium ${themeVars.btnBg} text-white ${themeVars.btnHover} shadow-sm transition-all`}
              >
                Inquire via Email
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // RENDER PRODUCT LANDING TEMPLATE
  const renderProduct = () => {
    const data = content.product;
    return (
      <div className={`min-h-full ${themeVars.bg} ${themeVars.textMain} ${getBodyFontClass()} transition-colors duration-200`}>
        {/* Navigation Toolbar */}
        <header className={`border-b ${themeVars.borderColor} py-4 px-6 md:px-12 flex justify-between items-center ${themeVars.bg} sticky top-0 bg-opacity-95 backdrop-blur-sm z-10`}>
          <div 
            onClick={(e) => handleFieldClick(e, 'product-name')}
            className={`font-bold cursor-pointer text-xl p-1 rounded hover:bg-slate-200/20 ${getTitleFontClass()} flex items-center gap-1.5`}
          >
            <Feather className={`w-5 h-5 ${themeVars.metaText}`} />
            {data.name}
          </div>
          <a 
            href="#pricing"
            className={`px-4 py-1.5 rounded text-xs font-medium ${themeVars.btnBg} text-white shadow-sm transition-all text-center`}
          >
            {data.ctaText}
          </a>
        </header>

        {/* Product Hero Grid */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 flex flex-col gap-6 text-left">
            <div className={`inline-flex self-start px-2.5 py-0.5 rounded font-mono text-xs uppercase ${themeVars.accentBg}`}>
              Product Launch • Now Shipping
            </div>
            <h1 
              onClick={(e) => handleFieldClick(e, 'product-tagline')}
              className={`text-4xl md:text-5xl cursor-pointer p-1 rounded hover:bg-slate-200/20 !leading-[1.1] ${getTitleFontClass()}`}
            >
              {data.tagline}
            </h1>
            <p 
              onClick={(e) => handleFieldClick(e, 'product-description')}
              className="text-base sm:text-lg opacity-80 cursor-pointer p-1 rounded hover:bg-slate-200/20"
            >
              {data.description}
            </p>
            <div>
              <a 
                href="#pricing"
                onClick={(e) => handleFieldClick(e, 'product-ctaText')}
                className={`inline-block px-7 py-3 rounded-lg font-medium text-white ${themeVars.btnBg} ${themeVars.btnHover} shadow-sm transition-all hover:translate-y-[-1px]`}
              >
                {data.ctaText}
              </a>
            </div>
          </div>
          
          <div className="md:col-span-5 relative group">
            <div className={`absolute inset-0 bg-gradient-to-tr from-${palette.primary}/10 to-transparent rounded-2xl filter blur-xl`}></div>
            <img 
              onClick={(e) => handleFieldClick(e, 'product-imageUrl')}
              src={data.imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'} 
              alt="Device preview" 
              referrerPolicy="no-referrer"
              className="w-full h-72 md:h-80 object-cover rounded-2xl shadow-md border border-slate-200/20 cursor-pointer hover:rotate-1 hover:scale-102 transition-all duration-300"
            />
          </div>
        </section>

        {/* Feature Grid */}
        <section className={`py-16 border-t ${themeVars.borderColor} bg-slate-100/10`}>
          <div className="px-6 md:px-12 max-w-5xl mx-auto">
            <h2 className={`text-2xl text-center mb-12 ${getTitleFontClass()}`}>Engineered for Flow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.features.map((feat, idx) => (
                <div 
                  key={feat.id || idx}
                  onClick={(e) => handleFieldClick(e, `product-feature-${idx}`)}
                  className={`p-6 rounded-xl cursor-pointer ${themeVars.cardBg} hover:shadow-sm transition-all duration-200`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-4 ${themeVars.accentBg}`}>
                    {renderIcon(feat.icon)}
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feat.title}</h3>
                  <p className="text-xs opacity-75">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Matrix */}
        <section id="pricing" className={`py-16 px-6 md:px-12 border-t ${themeVars.borderColor} max-w-3xl mx-auto text-center`}>
          <h2 className={`text-2xl md:text-3xl mb-4 ${getTitleFontClass()}`}>Secure Yours Today</h2>
          <p className="text-sm opacity-70 mb-10 max-w-md mx-auto">Choose a simple startup model. No recurring subscriptions or telemetry logs.</p>
          
          <div 
            onClick={(e) => handleFieldClick(e, 'product-pricing')}
            className={`p-8 md:p-10 rounded-2xl cursor-pointer text-left ${themeVars.cardBg} border-2 border-${palette.primary} relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 ${themeVars.btnBg} text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-bl`}>
              Premium Edition
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-200/40">
              <div>
                <h3 className={`text-xl ${getTitleFontClass()}`}>{data.name} Starter Kit</h3>
                <p className="text-xs opacity-75">Includes premium stylus companion pen</p>
              </div>
              <div className="text-right">
                <span className={`text-3xl md:text-4xl font-semibold`}>{data.pricingValue}</span>
                <span className="text-xs opacity-60"> / {data.pricingPeriod}</span>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 text-sm">
              {data.pricingFeatures.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="opacity-80">{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                triggerRendererAlert('Thank you! This is a mock checkout event representing the integration checkout action.');
              }}
              className={`w-full py-3 rounded-lg font-medium text-white shadow transition-all ${themeVars.btnBg} ${themeVars.btnHover}`}
            >
              Complete Safe Order
            </button>
          </div>
        </section>

        {/* Social Testimonial quote */}
        <section className={`py-12 px-6 text-center border-t border-dashed ${themeVars.borderColor}`}>
          <div className="max-w-2xl mx-auto italic opacity-85 text-base md:text-lg mb-4">
            " {data.testimonials[0].quote} "
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-slate-500">
            — {data.testimonials[0].author}, {data.testimonials[0].role}
          </div>
        </section>
      </div>
    );
  };

  // RENDER SEAMLESS LINKS (LINK-IN-BIO) TEMPLATE
  const renderLinks = () => {
    const data = content.links;
    return (
      <div className={`min-h-full py-16 px-4 flex items-center justify-center ${themeVars.bg} transition-colors duration-200`}>
        <div className={`w-full max-w-sm rounded-[2.5rem] p-6 pb-10 flex flex-col items-center select-none ${themeVars.cardBg} shadow-lg border relative`}>
          {/* Avatar frame */}
          <div 
            onClick={(e) => handleFieldClick(e, 'links-avatarUrl')}
            className={`w-20 h-20 rounded-full border-2 border-${palette.primary} p-1 mb-4 overflow-hidden shadow-inner cursor-pointer hover:scale-105 transition-transform`}
          >
            <img 
              src={data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} 
              alt="Avatar profile" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h1 
            onClick={(e) => handleFieldClick(e, 'links-name')}
            className={`text-xl mb-1 cursor-pointer p-0.5 rounded hover:bg-slate-100/30 ${getTitleFontClass()} text-center`}
          >
            {data.name}
          </h1>

          <p 
            onClick={(e) => handleFieldClick(e, 'links-bio')}
            className={`text-center text-xs opacity-75 max-w-[280px] mb-6 cursor-pointer p-0.5 rounded hover:bg-slate-100/30 font-medium`}
          >
            {data.bio}
          </p>

          {/* Links cluster stack */}
          <div className="w-full space-y-3.5 mb-8">
            {data.links.map((link, idx) => (
              <a 
                key={link.id || idx}
                href={link.url}
                onClick={(e) => handleFieldClick(e, `links-list-${idx}`)}
                className={`w-full py-3.5 px-5 cursor-pointer rounded-xl border border-slate-200/50 flex justify-between items-center bg-slate-50/50 text-xs font-medium hover:bg-slate-200/20 active:scale-98 transition-all hover:translate-x-[2px]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${themeVars.metaText}`}>
                    {renderIcon(link.icon, 'w-4 h-4')}
                  </div>
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </a>
            ))}
          </div>

          {/* Social icons bottom row */}
          <div className="flex gap-4 p-1">
            {data.socials.instagram && (
              <a href={data.socials.instagram} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {data.socials.youtube && (
              <a href={data.socials.youtube} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {data.socials.tiktok && (
              <a href={data.socials.tiktok} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                <div className="font-mono text-[10px] tracking-tight border px-1 rounded hover:opacity-10 w-6 h-4 text-center">TT</div>
              </a>
            )}
            {data.socials.spotify && (
              <a href={data.socials.spotify} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                <Music className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // RENDER EVENT INVITATION TEMPLATE
  const renderEvent = () => {
    const data = content.event;
    return (
      <div className={`min-h-full py-12 px-6 flex items-center justify-center ${themeVars.bg} transition-colors duration-200`}>
        <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 ${themeVars.cardBg} border relative shadow-lg overflow-hidden`}>
          {/* Header Visual */}
          <div className={`absolute top-0 inset-x-0 h-2 bg-${palette.primary}`}></div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${themeVars.accentBg}`}>
                Web Art RSVP
              </span>
              <span className="text-xs font-mono opacity-50">Private Invitation</span>
            </div>

            <div className="space-y-2">
              <h1 
                onClick={(e) => handleFieldClick(e, 'event-title')}
                className={`text-3xl md:text-4xl cursor-pointer p-0.5 rounded hover:bg-slate-100/20 leading-tight ${getTitleFontClass()}`}
              >
                {data.title}
              </h1>
              <p 
                onClick={(e) => handleFieldClick(e, 'event-hosts')}
                className="text-xs opacity-60 font-mono"
              >
                {data.hosts}
              </p>
            </div>

            <p 
              onClick={(e) => handleFieldClick(e, 'event-description')}
              className="text-sm opacity-85 leading-relaxed cursor-pointer p-0.5 rounded hover:bg-slate-100/20"
            >
              {data.description}
            </p>

            {/* Essential meta details strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-dashed border-slate-200/50">
              <div 
                onClick={(e) => handleFieldClick(e, 'event-dateTime')}
                className="flex items-start gap-3 cursor-pointer p-1 rounded hover:bg-slate-100/20"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-2xs font-mono uppercase tracking-wide opacity-50">Schedule</h4>
                  <p className="text-xs font-medium">{data.dateTime}</p>
                </div>
              </div>

              <div 
                onClick={(e) => handleFieldClick(e, 'event-location')}
                className="flex items-start gap-3 cursor-pointer p-1 rounded hover:bg-slate-100/20"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-2xs font-mono uppercase tracking-wide opacity-50">Venue</h4>
                  <p className="text-xs font-medium">{data.locationName}</p>
                  <p className="text-[10px] opacity-60">{data.locationAddress}</p>
                </div>
              </div>
            </div>

            {/* Additional info section */}
            <div>
              <h3 className={`text-sm font-semibold mb-1 cursor-pointer`} onClick={(e) => handleFieldClick(e, 'event-aboutText')}>
                Key Information
              </h3>
              <p className="text-xs opacity-75">{data.aboutText}</p>
            </div>

            {/* Simulated interactive form */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} border ${themeVars.borderColor}`}>
              {rsvpSubmitted ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-9 h-9 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <h4 className="font-semibold text-sm">RSVP Registered Successful!</h4>
                  <p className="text-xs opacity-70">A notification has been simulated for {rsvpEmail}. See you there!</p>
                  <button 
                    onClick={() => {
                      setRsvpSubmitted(false);
                      setRsvpName('');
                      setRsvpEmail('');
                    }}
                    className="text-2xs underline opacity-60 hover:opacity-100"
                  >
                    Register another attendee
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (rsvpName && rsvpEmail) {
                      setRsvpSubmitted(true);
                    } else {
                      triggerRendererAlert('Please provide a simulated name and email to RSVP.');
                    }
                  }}
                  className="space-y-3"
                >
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Attendee RSVP Portal</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="My Name" 
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      required
                      className="text-xs px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-9ml0 outline-none focus:border-slate-400"
                    />
                    <input 
                      type="email" 
                      placeholder="My Email" 
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      required
                      className="text-xs px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-900 outline-none focus:border-slate-400"
                    />
                  </div>
                  <button 
                    type="submit"
                    className={`w-full py-1.5 rounded text-xs font-semibold text-white ${themeVars.btnBg} ${themeVars.btnHover} shadow-2xs`}
                  >
                    {data.rsvpCta}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveTemplate = () => {
    switch (template) {
      case 'portfolio': return renderPortfolio();
      case 'product': return renderProduct();
      case 'links': return renderLinks();
      case 'event': return renderEvent();
      default: return renderPortfolio();
    }
  };

  return (
    <div className="relative h-full w-full">
      {rendererAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4.5 py-2.5 rounded-full shadow-lg border border-slate-700 font-sans flex items-center gap-2 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{rendererAlert}</span>
        </div>
      )}
      {renderActiveTemplate()}
    </div>
  );
}
