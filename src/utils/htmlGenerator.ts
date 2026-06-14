import { WebsiteContent, WebsiteSettings, FontPairing, ColorPalette } from '../types';

export function generateStaticHtml(
  settings: WebsiteSettings,
  content: WebsiteContent,
  palette: ColorPalette,
  font: FontPairing
): string {
  const { template, isDarkMode } = settings;
  const isCyber = palette.id === 'cyber';

  // Map theme variables for static HTML rendering
  const theme = {
    bg: isDarkMode ? (isCyber ? '#030712' : '#090d16') : (palette.id === 'warmth' ? '#fdfbf7' : (palette.id === 'emerald' ? '#fafaf9' : '#f8fafc')),
    textMain: isDarkMode ? '#f1f5f9' : (palette.id === 'warmth' ? '#1c1917' : '#0f172a'),
    textMuted: isDarkMode ? '#94a3b8' : '#475569',
    primaryHex: palette.id === 'cosmic' ? '#4f46e5' : 
                 palette.id === 'emerald' ? '#059669' : 
                 palette.id === 'velvet' ? '#7c3aed' : 
                 palette.id === 'warmth' ? '#d97706' : 
                 palette.id === 'crimson' ? '#e11d48' : '#a3e635',
    cardBg: isDarkMode ? (isCyber ? '#171717' : '#111827') : '#ffffff',
    borderColor: isDarkMode ? '#1f2937' : '#f1f5f9'
  };

  const titleFontFamily = font.id === 'modern' ? "'Space Grotesk', sans-serif" :
                         font.id === 'editorial' ? "'Playfair Display', serif" :
                         font.id === 'mono' ? "'JetBrains Mono', monospace" :
                         font.id === 'caps' ? "'Outfit', sans-serif" : "'Lora', serif";

  const bodyFontFamily = font.id === 'mono' ? "'JetBrains Mono', monospace" :
                        font.id === 'classic' ? "'Lora', serif" : "'Inter', sans-serif";

  // SVG Paths for embedded icons to avoid issues on static hosting
  const svgIcons = {
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
    camera: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    music: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    shoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>`
  };

  let pageTitle = '';
  let templateBody = '';

  // PORTFOLIO STATIC COMPILER
  if (template === 'portfolio') {
    const data = content.portfolio;
    pageTitle = `${data.name} | ${data.role}`;

    const projectsHtml = data.projects.map((proj, idx) => `
      <div class="p-6 rounded-2xl bg-opacity-40 transition-all duration-300 hover:-translate-y-1 shadow-sm border border-[${theme.borderColor}]" style="background-color: ${theme.cardBg}; border-color: ${theme.borderColor}">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs font-mono uppercase opacity-50">Project 0${idx + 1}</span>
          <span style="color: ${theme.primaryHex}">${svgIcons.arrowUpRight}</span>
        </div>
        <h3 class="text-lg font-bold mb-2" style="font-family: ${titleFontFamily}">${proj.title}</h3>
        <p class="text-sm opacity-80 mb-4 h-16 overflow-hidden">${proj.description}</p>
        <div class="flex flex-wrap gap-1.5 mt-auto">
          ${proj.tags.map(tag => `<span class="text-[10px] px-2 py-0.5 rounded-full font-mono" style="background-color: ${theme.primaryHex}15; color: ${theme.primaryHex}">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');

    const experienceHtml = data.experience.map((job, idx) => `
      <div class="p-5 rounded-xl border-l-2 relative pl-6" style="border-color: ${theme.primaryHex}a0">
        <div class="absolute w-2.5 h-2.5 rounded-full -left-[6px] top-[26px]" style="background-color: ${theme.primaryHex}"></div>
        <div class="flex flex-wrap justify-between items-baseline gap-2 mb-1.5">
          <h3 class="font-bold">${job.role}</h3>
          <span class="text-xs font-mono opacity-60 bg-slate-250 px-2 py-0.5 rounded">${job.duration}</span>
        </div>
        <p class="text-xs font-mono uppercase tracking-wider mb-2 font-semibold" style="color: ${theme.primaryHex}">${job.company}</p>
        <p class="text-sm opacity-75">${job.description}</p>
      </div>
    `).join('');

    templateBody = `
      <!-- Navigation -->
      <header class="py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 backdrop-blur-md z-10 border-b border-[${theme.borderColor}]" style="background-color: ${theme.bg}e1; border-color: ${theme.borderColor}">
        <div class="font-bold text-xl uppercase tracking-tighter" style="font-family: ${titleFontFamily}; color: ${theme.primaryHex}">
          ${data.name.split(' ').map(n => n[0]).join('') || 'AR'}.
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <a href="mailto:${data.email}" class="flex items-center gap-1.5 font-semibold border px-3 py-1.5 rounded-full" style="border-color: ${theme.borderColor}">
            ${svgIcons.mail}
            Inquire
          </a>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="py-16 md:py-28 px-6 md:px-12 max-w-4xl mx-auto flex flex-col gap-6">
        <div class="inline-flex self-start gap-1.5 items-center px-3 py-1 rounded-full text-xs font-mono uppercase" style="background-color: ${theme.primaryHex}1a; color: ${theme.primaryHex}">
          ${svgIcons.sparkles}
          Available Now
        </div>
        <h1 class="text-4xl sm:text-6xl uppercase tracking-tighter" style="font-family: ${titleFontFamily}">${data.name}</h1>
        <p class="text-xl sm:text-2xl font-semibold opacity-90" style="color: ${theme.primaryHex}">${data.role}</p>
        <p class="text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl">${data.bio}</p>
        
        <div class="flex gap-4 mt-2">
          ${data.github ? `<a href="${data.github}" class="opacity-75 hover:opacity-100 transition-opacity">${svgIcons.github}</a>` : ''}
          ${data.linkedin ? `<a href="${data.linkedin}" class="opacity-75 hover:opacity-100 transition-opacity">${svgIcons.linkedin}</a>` : ''}
          ${data.twitter ? `<a href="${data.twitter}" class="opacity-75 hover:opacity-100 transition-opacity">${svgIcons.twitter}</a>` : ''}
        </div>
      </section>

      <!-- Selected Portfolio -->
      <section class="py-16 border-y" style="background-color: ${theme.bg}; border-color: ${theme.borderColor}">
        <div class="px-6 md:px-12 max-w-4xl mx-auto">
          <h2 class="text-2xl mb-8 font-bold" style="font-family: ${titleFontFamily}">Selected Crafts</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${projectsHtml}
          </div>
        </div>
      </section>

      <!-- Timeline Experience -->
      <section class="py-16 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 class="text-xl mb-8 font-bold uppercase tracking-wider opacity-90" style="font-family: ${titleFontFamily}">Core Milestones</h2>
        <div class="space-y-8">
          ${experienceHtml}
        </div>
      </section>

      <!-- Contact Footer -->
      <footer class="py-16 px-6 text-center border-t border-[${theme.borderColor}]" style="border-color: ${theme.borderColor}">
        <div class="max-w-md mx-auto space-y-4">
          <h3 class="text-2xl font-bold" style="font-family: ${titleFontFamily}">Inquire on Partnerships</h3>
          <p class="text-sm opacity-70">Have a design layout challenge or server-side architecture needs? Let's discuss today.</p>
          <div class="pt-2">
            <a href="mailto:${data.email}" class="inline-block px-7 py-3 rounded-full text-sm font-semibold text-white shadow-md transition-shadow" style="background-color: ${theme.primaryHex}">
              Send Direct Email
            </a>
          </div>
        </div>
      </footer>
    `;
  }

  // PRODUCT LANDING STATIC COMPILER
  else if (template === 'product') {
    const data = content.product;
    pageTitle = `${data.name} | ${data.tagline}`;

    const featuresHtml = data.features.map(feat => `
      <div class="p-6 rounded-xl border border-[${theme.borderColor}]" style="background-color: ${theme.cardBg}; border-color: ${theme.borderColor}">
        <div class="w-10 h-10 flex items-center justify-center rounded-lg mb-4" style="background-color: ${theme.primaryHex}15; color: ${theme.primaryHex}">
          ${feat.icon === 'Feather' ? svgIcons.sparkles : feat.icon === 'Zap' ? svgIcons.sparkles : svgIcons.sparkles}
        </div>
        <h3 class="font-bold text-base mb-2">${feat.title}</h3>
        <p class="text-xs opacity-75">${feat.description}</p>
      </div>
    `).join('');

    templateBody = `
      <!-- Toolbar -->
      <header class="py-4 px-6 md:px-12 flex justify-between items-center bg-opacity-95 backdrop-blur-sm border-b sticky top-0 z-10 border-[${theme.borderColor}]" style="background-color: ${theme.bg}; border-color: ${theme.borderColor}">
        <div class="font-bold text-xl flex items-center gap-1.5" style="font-family: ${titleFontFamily}">
          <span style="color: ${theme.primaryHex}">${svgIcons.sparkles}</span>
          ${data.name}
        </div>
        <a href="#order" class="px-4 py-1.5 rounded text-xs font-semibold text-white shadow-sm" style="background-color: ${theme.primaryHex}">
          Get Starter Kit
        </a>
      </header>

      <!-- Hero Banner -->
      <section class="py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div class="md:col-span-7 flex flex-col gap-6">
          <span class="inline-flex self-start px-2.5 py-0.5 rounded text-xs font-mono uppercase" style="background-color: ${theme.primaryHex}15; color: ${theme.primaryHex}">
            Product Launch • In Stock
          </span>
          <h1 class="text-4xl md:text-5xl uppercase tracking-tighter leading-tight" style="font-family: ${titleFontFamily}">
            ${data.tagline}
          </h1>
          <p class="text-base sm:text-lg opacity-80 leading-relaxed">${data.description}</p>
          <div>
            <a href="#order" class="inline-block px-7 py-3 rounded-lg font-bold text-white shadow-md transition-shadow" style="background-color: ${theme.primaryHex}">
              ${data.ctaText}
            </a>
          </div>
        </div>
        
        <div class="md:col-span-5 relative">
          <img src="${data.imageUrl}" alt="Device preview" class="w-full h-80 object-cover rounded-2xl shadow-md border" style="border-color: ${theme.borderColor}" />
        </div>
      </section>

      <!-- Key Features -->
      <section class="py-16 border-y" style="background-color: ${theme.bg}; border-color: ${theme.borderColor}">
        <div class="px-6 md:px-12 max-w-5xl mx-auto">
          <h2 class="text-2xl text-center mb-12 font-bold" style="font-family: ${titleFontFamily}">Designed for Focus</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${featuresHtml}
          </div>
        </div>
      </section>

      <!-- Order Form Block -->
      <section id="order" class="py-16 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl mb-3 font-bold" style="font-family: ${titleFontFamily}">Order Your Companion</h2>
        <p class="text-sm opacity-70 mb-10 max-w-md mx-auto">Simple pricing model. Free priority international shipping included.</p>
        
        <div class="p-8 md:p-10 rounded-2xl shadow-md text-left border-2" style="background-color: ${theme.cardBg}; border-color: ${theme.primaryHex}">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b" style="border-color: ${theme.borderColor}">
            <div>
              <h3 class="text-xl font-bold" style="font-family: ${titleFontFamily}">${data.name} Pro</h3>
              <p class="text-xs opacity-75">No subscription fees required</p>
            </div>
            <div class="text-right">
              <span class="text-3xl font-bold" style="color: ${theme.primaryHex}">${data.pricingValue}</span>
              <span class="text-xs opacity-60"> / ${data.pricingPeriod}</span>
            </div>
          </div>

          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 text-sm opacity-85">
            ${data.pricingFeatures.map(feat => `<li class="flex items-center gap-2">✓ <span class="opacity-90">${feat}</span></li>`).join('')}
          </ul>

          <button onclick="alert('Checkout process initiated!')" class="w-full py-3.5 rounded-lg font-bold text-white shadow-md transition-shadow" style="background-color: ${theme.primaryHex}">
            Complete Safe Order
          </button>
        </div>
      </section>

      <!-- Testimonial Quote -->
      <section class="py-12 px-6 text-center border-t border-dashed" style="border-color: ${theme.borderColor}">
        <div class="max-w-2xl mx-auto italic opacity-85 text-base md:text-lg mb-4">
          " ${data.testimonials[0].quote} "
        </div>
        <div class="font-mono text-xs uppercase tracking-wider opacity-60">
          — ${data.testimonials[0].author}, ${data.testimonials[0].role}
        </div>
      </section>
    `;
  }

  // SEAMLESS LINKS STATIC COMPILER
  else if (template === 'links') {
    const data = content.links;
    pageTitle = `${data.name} | Social Links`;

    const linksHtml = data.links.map(link => `
      <a href="${link.url}" class="w-full py-4 px-5 rounded-xl border flex justify-between items-center text-xs font-semibold hover:translate-x-[2px] transition-transform" style="background-color: ${theme.cardBg}08; border-color: ${theme.borderColor}">
        <div class="flex items-center gap-3">
          <span style="color: ${theme.primaryHex}">${svgIcons.sparkles}</span>
          <span>${link.label}</span>
        </div>
        ${svgIcons.chevronRight}
      </a>
    `).join('');

    templateBody = `
      <div class="min-h-screen py-16 px-4 flex items-center justify-center">
        <div class="w-full max-w-sm rounded-[2.5rem] p-6 pb-10 flex flex-col items-center border shadow-xl" style="background-color: ${theme.cardBg}; border-color: ${theme.borderColor}">
          <!-- Photo Frame -->
          <div class="w-20 h-20 rounded-full border-2 p-1 mb-4 overflow-hidden" style="border-color: ${theme.primaryHex}">
            <img src="${data.avatarUrl}" alt="Avatar" class="w-full h-full object-cover rounded-full" />
          </div>

          <h1 class="text-xl mb-1 text-center font-bold" style="font-family: ${titleFontFamily}">${data.name}</h1>
          <p class="text-center text-xs opacity-75 max-w-[280px] mb-6">${data.bio}</p>

          <!-- Action Stack -->
          <div class="w-full space-y-3.5 mb-8">
            ${linksHtml}
          </div>

          <!-- Bottom Social icons grid -->
          <div class="flex gap-4 p-1">
            ${data.socials.instagram ? `<a href="${data.socials.instagram}" class="opacity-75 hover:opacity-100">${svgIcons.instagram}</a>` : ''}
            ${data.socials.youtube ? `<a href="${data.socials.youtube}" class="opacity-75 hover:opacity-100">${svgIcons.youtube}</a>` : ''}
            ${data.socials.spotify ? `<a href="${data.socials.spotify}" class="opacity-75 hover:opacity-100">${svgIcons.music}</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // EVENT STATIC COMPILER
  else {
    const data = content.event;
    pageTitle = data.title;

    templateBody = `
      <div class="min-h-screen py-12 px-6 flex items-center justify-center">
        <div class="w-full max-w-xl rounded-3xl p-6 md:p-8 border shadow-lg relative overflow-hidden" style="background-color: ${theme.cardBg}; border-color: ${theme.borderColor}">
          <div class="absolute top-0 inset-x-0 h-2" style="background-color: ${theme.primaryHex}"></div>

          <div class="flex flex-col gap-6">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full" style="background-color: ${theme.primaryHex}1a; color: ${theme.primaryHex}">
                Event Reservation
              </span>
              <span class="text-xs font-mono opacity-50">VIP Invitation</span>
            </div>

            <div class="space-y-1">
              <h1 class="text-3xl md:text-4xl leading-tight font-bold" style="font-family: ${titleFontFamily}">${data.title}</h1>
              <p class="text-xs opacity-60 font-mono">${data.hosts}</p>
            </div>

            <p class="text-sm opacity-85 leading-relaxed">${data.description}</p>

            <!-- Key metadata list -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-dashed" style="border-color: ${theme.borderColor}">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-150">${svgIcons.calendar}</div>
                <div>
                  <h4 class="text-[9px] font-mono uppercase opacity-50">Date & Time</h4>
                  <p class="text-xs font-semibold">${data.dateTime}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-150">${svgIcons.mapPin}</div>
                <div>
                  <h4 class="text-[9px] font-mono uppercase opacity-50">Location</h4>
                  <p class="text-xs font-semibold">${data.locationName}</p>
                  <p class="text-[10px] opacity-65">${data.locationAddress}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold mb-1">Key Context</h3>
              <p class="text-xs opacity-75">${data.aboutText}</p>
            </div>

            <!-- RSVP Form block -->
            <div class="p-4 rounded-xl border" style="background-color: ${theme.bg}; border-color: ${theme.borderColor}">
              <form onsubmit="event.preventDefault(); alert('RSVP Request Confirmed! Thank you.')" class="space-y-3">
                <h4 class="text-xs font-semibold uppercase tracking-wider opacity-6 w-full">Reserve Seat</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" placeholder="My Full Name" required class="text-xs px-3 py-2 rounded border focus:outline-none focus:border-slate-400" style="background: white; color: black; border-color: ${theme.borderColor}" />
                  <input type="email" placeholder="My Contact Email" required class="text-xs px-3 py-2 rounded border focus:outline-none focus:border-slate-400" style="background: white; color: black; border-color: ${theme.borderColor}" />
                </div>
                <button type="submit" class="w-full py-2.5 rounded text-xs font-bold text-white shadow-sm" style="background-color: ${theme.primaryHex}">
                  ${data.rsvpCta}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Construct complete, standard single index.html template file
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>

  <!-- Google Typography injection -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${font.importUrl}" rel="stylesheet">

  <!-- Tailwind CDN script -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Lora', 'serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>

  <style>
    /* Prevent raw uncompiled text rendering glitches */
    body {
      font-family: ${bodyFontFamily};
      background-color: ${theme.bg};
      color: ${theme.textMain};
      margin: 0;
      padding: 0;
      transition: background-color 0.2sease, color 0.2s ease;
    }
    h1, h2, h3, h4, .brand-font {
      font-family: ${titleFontFamily};
    }
    
    /* Elegant smooth scroll anchors browser support */
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body>
  ${templateBody}
</body>
</html>`;
}
