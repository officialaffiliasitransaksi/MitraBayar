import { FontPairing, ColorPalette, WebsiteContent } from '../types';

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'modern',
    name: 'Modern (Space Grotesk & Inter)',
    titleFont: 'font-space-grotesk',
    bodyFont: 'font-inter',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap'
  },
  {
    id: 'editorial',
    name: 'Editorial (Playfair Display & Inter)',
    titleFont: 'font-playfair',
    bodyFont: 'font-inter',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap'
  },
  {
    id: 'mono',
    name: 'Technical Mono (JetBrains Mono)',
    titleFont: 'font-mono',
    bodyFont: 'font-mono',
    importUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
  },
  {
    id: 'caps',
    name: 'Clean Geometric (Outfit & Inter)',
    titleFont: 'font-outfit',
    bodyFont: 'font-inter',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap'
  },
  {
    id: 'classic',
    name: 'Serif Classic (Lora & Lora)',
    titleFont: 'font-lora',
    bodyFont: 'font-lora',
    importUrl: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap'
  }
];

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'cosmic',
    name: 'Cosmic Slate (Indigo & Ash)',
    primary: 'indigo-600',
    primaryBg: 'bg-indigo-600',
    primaryText: 'text-indigo-600',
    primaryBorder: 'border-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    accent: 'indigo-500',
    neutralBg: 'bg-slate-50',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600'
  },
  {
    id: 'emerald',
    name: 'Emerald Moss (Forest Green & Mint)',
    primary: 'emerald-600',
    primaryBg: 'bg-emerald-600',
    primaryText: 'text-emerald-600',
    primaryBorder: 'border-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    accent: 'emerald-500',
    neutralBg: 'bg-stone-50',
    cardBg: 'bg-white',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600'
  },
  {
    id: 'velvet',
    name: 'Royal Velvet (Plum & Orchid)',
    primary: 'violet-600',
    primaryBg: 'bg-violet-600',
    primaryText: 'text-violet-600',
    primaryBorder: 'border-violet-600',
    primaryHover: 'hover:bg-violet-700',
    accent: 'violet-500',
    neutralBg: 'bg-zinc-50',
    cardBg: 'bg-white',
    textPrimary: 'text-zinc-900',
    textSecondary: 'text-zinc-600'
  },
  {
    id: 'warmth',
    name: 'Sunset Warmth (Terracotta & Sand)',
    primary: 'amber-600',
    primaryBg: 'bg-amber-600',
    primaryText: 'text-amber-800',
    primaryBorder: 'border-amber-600',
    primaryHover: 'hover:bg-amber-700',
    accent: 'amber-500',
    neutralBg: 'bg-orange-50/40',
    cardBg: 'bg-white',
    textPrimary: 'text-yellow-950',
    textSecondary: 'text-amber-900/80'
  },
  {
    id: 'crimson',
    name: 'Crimson Rose (Ruby Red & Charcoal)',
    primary: 'rose-600',
    primaryBg: 'bg-rose-600',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-600',
    primaryHover: 'hover:bg-rose-700',
    accent: 'rose-500',
    neutralBg: 'bg-neutral-50',
    cardBg: 'bg-white',
    textPrimary: 'text-neutral-900',
    textSecondary: 'text-neutral-600'
  },
  {
    id: 'cyber',
    name: 'Cyber Mono (Dark & Acid Lime)',
    primary: 'lime-400',
    primaryBg: 'bg-lime-400',
    primaryText: 'text-lime-400',
    primaryBorder: 'border-lime-400',
    primaryHover: 'hover:bg-lime-500',
    accent: 'lime-300',
    neutralBg: 'bg-neutral-950',
    cardBg: 'bg-neutral-900',
    textPrimary: 'text-neutral-50',
    textSecondary: 'text-neutral-400'
  }
];

export const DEFAULT_CONTENT: WebsiteContent = {
  portfolio: {
    name: 'Alex Rivera',
    role: 'Creative Developer & Designer',
    bio: 'Crafting minimalist, highly interactive digital experiences at the intersection of graphic aesthetics and functional software architectures.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'alex.rivera@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    projects: [
      {
        id: '1',
        title: 'Nova Dashboard',
        description: 'An elegant high-performance financial analytics visualization framework using custom Canvas graphs and WebGL grids.',
        tags: ['React', 'TypeScript', 'D3.js', 'Vite'],
        link: '#'
      },
      {
        id: '2',
        title: 'Kinetic Web Player',
        description: 'Immersive atmospheric audio synthesizers responsive to cursor-based gravitational attraction and spatial noise mechanics.',
        tags: ['Web Audio API', 'framer-motion', 'Tailwind'],
        link: '#'
      },
      {
        id: '3',
        title: 'Verve Studio CMS',
        description: 'A headless real-time text-editor that converts structured markdown strings into highly responsive static layouts.',
        tags: ['Rust', 'Wasm', 'Next.js'],
        link: '#'
      }
    ],
    experience: [
      {
        id: 'exp1',
        role: 'Senior Digital Architect',
        company: 'Verve Systems Inc.',
        duration: '2024 - Present',
        description: 'Spearheaded modern Web design transformations, driving user interaction satisfaction up by 35% through tactile micro-animations and micro-interactions.'
      },
      {
        id: 'exp2',
        role: 'Interactive UI Developer',
        company: 'Apex Media Lab',
        duration: '2022 - 2024',
        description: 'Maintained and deployed fully optimized custom design library components utilizing advanced CSS grids and standard React hooks.'
      }
    ]
  },
  product: {
    name: 'SyncPad Pro',
    tagline: 'The distraction-free thinking workspace',
    description: 'SyncPad is a tactile physical-meets-digital writing tablet designed for cognitive clarity. Record concepts, store blueprints, and structure documents synchronously.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    ctaText: 'Preorder Device',
    pricingValue: '$249',
    pricingPeriod: 'one-time',
    pricingFeatures: [
      'Genuine e-ink visual grid',
      'Ultra-low 4ms writing latency',
      'Encrypted cloud synchronization',
      'Premium walnut framing',
      'Adaptive ambient backlight'
    ],
    features: [
      {
        id: 'feat1',
        icon: 'Feather',
        title: 'Tactile Paper Feedback',
        description: 'Micro-textured writing surface replicates the friction-coefficient and quiet response of traditional paper.'
      },
      {
        id: 'feat2',
        icon: 'Zap',
        title: 'Synchronized Core Backend',
        description: 'Local-first document databases sync in tiny encrypted chunks as soon as you touch an active WiFi node.'
      },
      {
        id: 'feat3',
        icon: 'Moon',
        title: 'True Anti-Glare Contrast',
        description: 'Designed purely to promote deep cognitive flow. Zero constant push notifications, blue emissions, or popups.'
      }
    ],
    testimonials: [
      {
        id: 'test1',
        quote: 'This is the first tablet that feels completely natural, non-additive, and supportive of actual structural thinking.',
        author: 'Julian Thorne',
        role: 'Author & Designer'
      }
    ]
  },
  links: {
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    name: 'Elena Rostova',
    bio: 'Photographer & Audio Curator / Capturing silent city narratives and structural geometry around Northern Europe.',
    links: [
      {
        id: 'link1',
        label: 'My Photography Portfolio',
        url: '#',
        icon: 'Camera'
      },
      {
        id: 'link2',
        label: 'Listen to CitySounds Podcast',
        url: '#',
        icon: 'Music'
      },
      {
        id: 'link3',
        label: 'Read My Journal on Substack',
        url: '#',
        icon: 'BookOpen'
      },
      {
        id: 'link4',
        label: 'Order High-Resolution Art Prints',
        url: '#',
        icon: 'ShoppingBag'
      }
    ],
    socials: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
      tiktok: 'https://tiktok.com',
      spotify: 'https://spotify.com'
    }
  },
  event: {
    title: 'Kinetic Web Workshop',
    hosts: 'Host: Creative Labs Institute',
    dateTime: 'Saturday, October 24, 2026 / 1:00 PM PST',
    locationName: 'Metropolis Design Lounge',
    locationAddress: '404 Grid Avenue, San Francisco, CA',
    description: 'An immersive afternoon exploring CSS physics, canvas fluid-simulation mechanics, interactive typography, and building responsive interfaces that breathe.',
    rsvpCta: 'Request Invitation',
    aboutText: 'This premium workshop is limited to 40 selected designers and developers to maintain deep creative coaching. Bring an open mind and a laptop running Node.js.'
  }
};
