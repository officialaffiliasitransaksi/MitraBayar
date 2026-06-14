export type TemplateId = 'portfolio' | 'product' | 'links' | 'event';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface FontPairing {
  id: string;
  name: string;
  titleFont: string; // Tailwind class or inline font-family
  bodyFont: string;
  importUrl: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  primary: string; // e.g., 'indigo-600'
  primaryBg: string; // e.g., 'bg-indigo-600'
  primaryText: string; // e.g., 'text-indigo-600'
  primaryBorder: string; // e.g., 'border-indigo-600'
  primaryHover: string; // e.g., 'hover:bg-indigo-700'
  accent: string; // e.g., 'violet-500'
  neutralBg: string; // e.g., 'bg-slate-50'
  cardBg: string; // e.g., 'bg-white'
  textPrimary: string; // e.g., 'text-slate-900'
  textSecondary: string; // e.g., 'text-slate-600'
}

// Portfolio Template content schema
export interface PortfolioData {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    link: string;
  }>;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
}

// Product Landing Template content schema
export interface ProductData {
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  pricingValue: string;
  pricingPeriod: string;
  pricingFeatures: string[];
  features: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    id: string;
    quote: string;
    author: string;
    role: string;
  }>;
}

// Link-in-Bio Template content schema
export interface LinksData {
  avatarUrl: string;
  name: string;
  bio: string;
  links: Array<{
    id: string;
    label: string;
    url: string;
    icon: string;
  }>;
  socials: {
    instagram: string;
    youtube: string;
    tiktok: string;
    spotify: string;
  };
}

// Event Invite Template content schema
export interface EventData {
  title: string;
  hosts: string;
  dateTime: string;
  locationName: string;
  locationAddress: string;
  description: string;
  rsvpCta: string;
  aboutText: string;
}

// Complete global state for the active website template content
export interface WebsiteContent {
  portfolio: PortfolioData;
  product: ProductData;
  links: LinksData;
  event: EventData;
}

export interface WebsiteSettings {
  template: TemplateId;
  colorPaletteId: string;
  fontPairingId: string;
  isDarkMode: boolean;
  sectionsVisibility: Record<string, boolean>;
}
