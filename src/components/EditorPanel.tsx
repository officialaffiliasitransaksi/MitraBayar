import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Plus, 
  Trash2, 
  FolderGit2, 
  Briefcase, 
  Type, 
  Palette, 
  Layout, 
  MousePointer, 
  Moon, 
  Sun,
  Eye
} from 'lucide-react';
import { 
  WebsiteSettings, 
  WebsiteContent, 
  TemplateId, 
  ColorPalette, 
  FontPairing 
} from '../types';
import { FONT_PAIRINGS, COLOR_PALETTES } from '../data/templates';

interface EditorPanelProps {
  settings: WebsiteSettings;
  content: WebsiteContent;
  onUpdateSettings: (settings: Partial<WebsiteSettings>) => void;
  onUpdateContent: (updated: WebsiteContent) => void;
  palette: ColorPalette;
  font: FontPairing;
  focusedField: string | null;
  onClearFocus: () => void;
  device: 'desktop' | 'tablet' | 'mobile';
  onChangeDevice: (dev: 'desktop' | 'tablet' | 'mobile') => void;
  onOpenExport: () => void;
}

export default function EditorPanel({
  settings,
  content,
  onUpdateSettings,
  onUpdateContent,
  palette,
  font,
  focusedField,
  onClearFocus,
  device,
  onChangeDevice,
  onOpenExport
}: EditorPanelProps) {
  const { template, isDarkMode, colorPaletteId, fontPairingId } = settings;

  // Active sub-sections index for grouping
  const [activeTab, setActiveTab] = React.useState<'design' | 'content'>('content');

  // Trigger content updates safekeeping
  const updatePortfolio = (fields: Partial<typeof content.portfolio>) => {
    onUpdateContent({
      ...content,
      portfolio: { ...content.portfolio, ...fields }
    });
  };

  const updateProduct = (fields: Partial<typeof content.product>) => {
    onUpdateContent({
      ...content,
      product: { ...content.product, ...fields }
    });
  };

  const updateLinks = (fields: Partial<typeof content.links>) => {
    onUpdateContent({
      ...content,
      links: { ...content.links, ...fields }
    });
  };

  const updateEvent = (fields: Partial<typeof content.event>) => {
    onUpdateContent({
      ...content,
      event: { ...content.event, ...fields }
    });
  };

  // Portfolio list managers
  const addProject = () => {
    const list = [...content.portfolio.projects];
    if (list.length >= 6) return; // Prevent infinite sprawl
    list.push({
      id: String(Date.now()),
      title: 'New Creative Piece',
      description: 'Describe the design approach, client engagement goals, and technologies used.',
      tags: ['Svelte', 'Web Audio', 'GLSL'],
      link: '#'
    });
    updatePortfolio({ projects: list });
  };

  const removeProject = (index: number) => {
    const list = [...content.portfolio.projects];
    list.splice(index, 1);
    updatePortfolio({ projects: list });
  };

  const updateProjectField = (index: number, key: 'title' | 'description' | 'link' | 'tags', value: any) => {
    const list = [...content.portfolio.projects];
    if (key === 'tags') {
      list[index] = { ...list[index], tags: String(value).split(',').map(s => s.trim()) };
    } else {
      list[index] = { ...list[index], [key]: value };
    }
    updatePortfolio({ projects: list });
  };

  // Portfolio job milestones managers
  const addExperience = () => {
    const list = [...content.portfolio.experience];
    if (list.length >= 5) return;
    list.push({
      id: String(Date.now()),
      role: 'Creative Resident',
      company: 'New Studio Lab',
      duration: 'Summer 2026',
      description: 'Developed and compiled spatial grid prototypes.'
    });
    updatePortfolio({ experience: list });
  };

  const removeExperience = (index: number) => {
    const list = [...content.portfolio.experience];
    list.splice(index, 1);
    updatePortfolio({ experience: list });
  };

  const updateExperienceField = (index: number, key: 'role' | 'company' | 'duration' | 'description', value: string) => {
    const list = [...content.portfolio.experience];
    list[index] = { ...list[index], [key]: value };
    updatePortfolio({ experience: list });
  };

  // Product features manager
  const updateFeatureField = (index: number, key: 'title' | 'description', value: string) => {
    const list = [...content.product.features];
    list[index] = { ...list[index], [key]: value };
    updateProduct({ features: list });
  };

  // Links List manager
  const updateLinkItem = (index: number, key: 'label' | 'url' | 'icon', value: string) => {
    const list = [...content.links.links];
    list[index] = { ...list[index], [key]: value };
    updateLinks({ links: list });
  };

  const addLinkItem = () => {
    const list = [...content.links.links];
    if (list.length >= 6) return;
    list.push({
      id: String(Date.now()),
      label: 'Read My Substack Journal',
      url: '#',
      icon: 'BookOpen'
    });
    updateLinks({ links: list });
  };

  const removeLinkItem = (index: number) => {
    const list = [...content.links.links];
    list.splice(index, 1);
    updateLinks({ links: list });
  };

  // Helper focus styling
  const isFocused = (fieldKey: string) => {
    if (!focusedField) return false;
    return focusedField.startsWith(fieldKey);
  };

  // Render content input forms based on active template
  const renderTemplateForms = () => {
    switch (template) {
      case 'portfolio': {
        const p = content.portfolio;
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${isFocused('portfolio-name') || isFocused('portfolio-role') || isFocused('portfolio-bio') ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-100 bg-slate-50/50'} transition-all`}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Hero Presentation
              </h3>
              
              <div className="space-y-3.5">
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">My Professional Name</label>
                  <input 
                    type="text" 
                    value={p.name}
                    onChange={(e) => updatePortfolio({ name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-white"
                  />
                </div>
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">Subtitle / Role Description</label>
                  <input 
                    type="text" 
                    value={p.role}
                    onChange={(e) => updatePortfolio({ role: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-white"
                  />
                </div>
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">Short Bio Statement</label>
                  <textarea 
                    value={p.bio}
                    rows={3}
                    onChange={(e) => updatePortfolio({ bio: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-white leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isFocused('portfolio-email') ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-100 bg-slate-50/50'} transition-all`}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Communications</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">Contact Email Override</label>
                  <input 
                    type="email" 
                    value={p.email}
                    onChange={(e) => updatePortfolio({ email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-slate-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-2xs font-mono text-slate-500 uppercase">GitHub</label>
                    <input 
                      type="text" 
                      value={p.github} 
                      onChange={(e) => updatePortfolio({ github: e.target.value })}
                      className="w-full text-2xs px-2 py-1.5 rounded border border-slate-200 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-mono text-slate-500 uppercase">LinkedIn</label>
                    <input 
                      type="text" 
                      value={p.linkedin} 
                      onChange={(e) => updatePortfolio({ linkedin: e.target.value })}
                      className="w-full text-2xs px-2 py-1.5 rounded border border-slate-200 bg-white" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-1">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Selected Work Case Studies ({p.projects.length})</h3>
                <button 
                  onClick={addProject}
                  disabled={p.projects.length >= 6}
                  className="flex items-center gap-1 text-2xs bg-slate-150 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  <Plus className="w-3.5 h-3.5" /> Project
                </button>
              </div>

              {p.projects.map((proj, idx) => (
                <div 
                  key={proj.id || idx}
                  className={`p-3.5 rounded-lg border ${isFocused(`portfolio-project-${idx}`) ? 'border-indigo-500 bg-indigo-500/5 shadow-2xs' : 'border-slate-100 bg-white'} relative space-y-2.5`}
                >
                  <button 
                    onClick={() => removeProject(idx)}
                    className="absolute top-3.5 right-3 px-1.5 py-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="font-semibold text-xs text-slate-500">Case Study 0{idx + 1}</div>
                  
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => updateProjectField(idx, 'title', e.target.value)}
                      className="w-11/12 text-xs font-medium border-b border-transparent outline-none focus:border-slate-400 bg-transparent"
                    />
                    <textarea 
                      placeholder="Brief core value contribution description"
                      value={proj.description}
                      rows={2}
                      onChange={(e) => updateProjectField(idx, 'description', e.target.value)}
                      className="w-full text-xs border border-transparent hover:border-slate-100 rounded p-1.5 resize-none leading-normal outline-none focus:border-slate-300"
                    />
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        value={proj.tags.join(', ')}
                        onChange={(e) => updateProjectField(idx, 'tags', e.target.value)}
                        className="w-full text-2xs px-2 py-1 bg-slate-50 rounded border border-transparent focus:border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Career Milestone Experience timeline</h3>
                <button 
                  onClick={addExperience}
                  disabled={p.experience.length >= 5}
                  className="flex items-center gap-1 text-2xs bg-slate-150 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  <Plus className="w-3.5 h-3.5" /> Milestone
                </button>
              </div>

              {p.experience.map((job, idx) => (
                <div 
                  key={job.id || idx}
                  className={`p-3.5 rounded-lg border ${isFocused(`portfolio-experience-${idx}`) ? 'border-indigo-500 bg-indigo-500/5 text-slate-900' : 'border-slate-100 bg-white'} relative space-y-2`}
                >
                  <button 
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3.5 right-3 px-1.5 py-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">ROLE</label>
                      <input 
                        type="text" 
                        value={job.role}
                        onChange={(e) => updateExperienceField(idx, 'role', e.target.value)}
                        className="w-full text-2xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">Duration</label>
                      <input 
                        type="text" 
                        value={job.duration}
                        onChange={(e) => updateExperienceField(idx, 'duration', e.target.value)}
                        className="w-full text-2xs text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400">ORGANIZATION / COMPANY</label>
                    <input 
                      type="text" 
                      value={job.company}
                      onChange={(e) => updateExperienceField(idx, 'company', e.target.value)}
                      className="w-full text-2xs font-mono text-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400">CORE RESPONSIBILITIES</label>
                    <textarea 
                      value={job.description}
                      onChange={(e) => updateExperienceField(idx, 'description', e.target.value)}
                      rows={2}
                      className="w-full text-2xs leading-relaxed border border-transparent focus:border-slate-200 rounded p-1 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'product': {
        const prod = content.product;
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${isFocused('product-name') || isFocused('product-tagline') || isFocused('product-description') ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 bg-slate-50/50'}`}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Product Description</h3>
              <div className="space-y-3.5">
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">Product Brand Name</label>
                  <input 
                    type="text" 
                    value={prod.name}
                    onChange={(e) => updateProduct({ name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">Headline slogan / tagline</label>
                  <input 
                    type="text" 
                    value={prod.tagline}
                    onChange={(e) => updateProduct({ tagline: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-2xs font-mono text-slate-500 uppercase">Interactive Narrative</label>
                  <textarea 
                    value={prod.description}
                    rows={3}
                    onChange={(e) => updateProduct({ description: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Visual Artwork Assets</h3>
              <div>
                <label className="text-2xs font-mono text-slate-500 uppercase">Illustration / Image URL</label>
                <input 
                  type="text" 
                  value={prod.imageUrl}
                  onChange={(e) => updateProduct({ imageUrl: e.target.value })}
                  className="w-full text-2xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-500">CTA LABEL</label>
                  <input 
                    type="text" 
                    value={prod.ctaText}
                    onChange={(e) => updateProduct({ ctaText: e.target.value })}
                    className="w-full text-2xs px-2.5 py-1 rounded border bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500">PRICING AMT</label>
                  <input 
                    type="text" 
                    value={prod.pricingValue}
                    onChange={(e) => updateProduct({ pricingValue: e.target.value })}
                    className="w-full text-2xs px-2.5 py-1 rounded border bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Individual Features array */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Highlight Features Matrix</h3>
              {prod.features.map((feat, idx) => (
                <div 
                  key={feat.id || idx}
                  className={`p-3.5 rounded-lg border ${isFocused(`product-feature-${idx}`) ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 bg-white'} space-y-2`}
                >
                  <div className="text-[10px] font-mono uppercase text-indigo-600 font-semibold">Value Prop Core 0{idx + 1}</div>
                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      value={feat.title}
                      onChange={(e) => updateFeatureField(idx, 'title', e.target.value)}
                      className="w-full text-xs font-semibold outline-none border-b border-transparent focus:border-slate-300 bg-transparent"
                      placeholder="Feature title"
                    />
                    <textarea 
                      value={feat.description}
                      rows={2}
                      onChange={(e) => updateFeatureField(idx, 'description', e.target.value)}
                      className="w-full text-xs leading-normal resize-none outline-none border border-transparent focus:border-slate-200 rounded p-1"
                      placeholder="Sleek, focused description..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'links': {
        const l = content.links;
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Aesthetic Bio Frame</h3>
              <div>
                <label className="text-2xs font-mono text-slate-500">PROFILE PHOTO URL</label>
                <input 
                  type="text" 
                  value={l.avatarUrl}
                  onChange={(e) => updateLinks({ avatarUrl: e.target.value })}
                  className="w-full text-2xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-2xs font-mono text-slate-500">AESTHETIC NAME</label>
                <input 
                  type="text" 
                  value={l.name}
                  onChange={(e) => updateLinks({ name: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-2xs font-mono text-slate-500">SHORT BIO</label>
                <textarea 
                  value={l.bio}
                  onChange={(e) => updateLinks({ bio: e.target.value })}
                  rows={2}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Profile Links Stack ({l.links.length})</h3>
                <button 
                  onClick={addLinkItem}
                  disabled={l.links.length >= 6}
                  className="flex items-center gap-1 text-2xs bg-slate-150 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
                >
                  <Plus className="w-3.5 h-3.5" /> Action
                </button>
              </div>

              {l.links.map((link, idx) => (
                <div 
                  key={link.id || idx}
                  className={`p-3.5 rounded-lg border ${isFocused(`links-list-${idx}`) ? 'border-purple-500 bg-purple-500/5' : 'border-slate-100 bg-white'} relative space-y-2`}
                >
                  <button 
                    onClick={() => removeLinkItem(idx)}
                    className="absolute top-3.5 right-3 px-1.5 py-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="font-mono text-[10px] text-slate-400">Link Row 0{idx + 1}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">LABEL</label>
                      <input 
                        type="text" 
                        value={link.label}
                        onChange={(e) => updateLinkItem(idx, 'label', e.target.value)}
                        className="w-full text-2xs px-2.5 py-1 rounded border"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">TARGET URL</label>
                      <input 
                        type="text" 
                        value={link.url}
                        onChange={(e) => updateLinkItem(idx, 'url', e.target.value)}
                        className="w-full text-2xs px-2.5 py-1 rounded border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400">CHOOSE ICON CATEGORY</label>
                    <select 
                      value={link.icon} 
                      onChange={(e) => updateLinkItem(idx, 'icon', e.target.value)}
                      className="w-full text-[11px] font-mono py-1 rounded border bg-slate-50 outline-none"
                    >
                      <option value="Camera">Camera / Frame</option>
                      <option value="Music">Music / Sound</option>
                      <option value="BookOpen">BookOpen / Press</option>
                      <option value="ShoppingBag">ShoppingBag / Cart</option>
                      <option value="Feather">Feather / Write</option>
                      <option value="Zap">Zap / Code</option>
                      <option value="Moon">Moon / Night</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'event': {
        const ev = content.event;
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${isFocused('event-title') || isFocused('event-hosts') || isFocused('event-description') ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-100 bg-slate-50/50'} space-y-3`}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Core Invitation</h3>
              <div>
                <label className="text-2xs font-mono text-slate-500">EVENT DISPLAY TITLE</label>
                <input 
                  type="text" 
                  value={ev.title}
                  onChange={(e) => updateEvent({ title: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border bg-white"
                />
              </div>
              <div>
                <label className="text-2xs font-mono text-slate-500">CO-HOSTS OR KEYWORDS</label>
                <input 
                  type="text" 
                  value={ev.hosts}
                  onChange={(e) => updateEvent({ hosts: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border bg-white"
                />
              </div>
              <div>
                <label className="text-2xs font-mono text-slate-500">ABOUT / INTRODUCTORY BRIEF</label>
                <textarea 
                  value={ev.description}
                  onChange={(e) => updateEvent({ description: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2 rounded-lg border bg-white resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Location & Schedule Cards</h3>
              <div>
                <label className="text-2xs font-mono text-slate-500">DATE & TIME BADGE</label>
                <input 
                  type="text" 
                  value={ev.dateTime}
                  onChange={(e) => updateEvent({ dateTime: e.target.value })}
                  className="w-full text-2xs px-3 py-1.5 rounded-lg border bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-500">VENUE NAME</label>
                  <input 
                    type="text" 
                    value={ev.locationName}
                    onChange={(e) => updateEvent({ locationName: e.target.value })}
                    className="w-full text-2xs px-2.5 py-1 rounded border bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500">COORDINATE ADDRESS</label>
                  <input 
                    type="text" 
                    value={ev.locationAddress}
                    onChange={(e) => updateEvent({ locationAddress: e.target.value })}
                    className="w-full text-2xs px-2.5 py-1 rounded border bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">RSVP Portal Override</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-500">CTA REGISTER TEXT</label>
                  <input 
                    type="text" 
                    value={ev.rsvpCta}
                    onChange={(e) => updateEvent({ rsvpCta: e.target.value })}
                    className="w-full text-2xs px-2.5 py-1 rounded border bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500">KEY MEMORANDUM</label>
                  <input 
                    type="text" 
                    value={ev.aboutText}
                    onChange={(e) => updateEvent({ aboutText: e.target.value })}
                    className="w-full text-2xs px-2.5 py-1 rounded border bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }

      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Visual Platform Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-2xs font-bold font-mono text-sm">
            W
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">Instant Creator</h1>
            <p className="text-[10px] text-slate-400 font-mono">WORKSPACE LIVE ACTIVE</p>
          </div>
        </div>
        
        {/* Real Code Export Action */}
        <button 
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 shadow-2xs active:scale-98 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          Export HTML
        </button>
      </div>

      {/* Editor Main Switch Tabs: Content vs Design */}
      <div className="flex border-b border-slate-100 text-xs font-mono">
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-center border-b-2 font-medium ${activeTab === 'content' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          📝 Content Editor
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-center border-b-2 font-medium ${activeTab === 'design' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          🎨 Theme Design
        </button>
      </div>

      {/* Responsive Viewport Sizer Tool */}
      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/20 text-xs">
        <span className="font-mono text-slate-500 text-[10px] uppercase">Preview Stage Device</span>
        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button 
            type="button"
            onClick={() => onChangeDevice('desktop')}
            title="Desktop Mode"
            className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button"
            onClick={() => onChangeDevice('tablet')}
            title="Tablet Mode"
            className={`p-1.5 rounded-md transition-colors ${device === 'tablet' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button"
            onClick={() => onChangeDevice('mobile')}
            title="Mobile Mode"
            className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Subpanel Forms */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {focusedField && (
          <div className="p-2 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-xs rounded-lg flex justify-between items-center font-serif animate-fade-in">
            <span>Focused on template component field.</span>
            <button onClick={onClearFocus} className="text-2xs underline hover:text-yellow-900 font-sans cursor-pointer">
              Clear Highlight
            </button>
          </div>
        )}

        {activeTab === 'design' ? (
          <div className="space-y-6">
            {/* Color Palette Choice list */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Accent Color Swatches
              </h3>
              <div className="space-y-2">
                {COLOR_PALETTES.map((pal) => (
                  <button 
                    key={pal.id}
                    onClick={() => onUpdateSettings({ colorPaletteId: pal.id })}
                    className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${colorPaletteId === pal.id ? 'border-slate-800 bg-slate-50 font-bold' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full ${pal.id === 'cyber' ? 'bg-lime-400' : `bg-${pal.primary}`}`}></div>
                      <span className="text-2xs font-sans text-slate-700">{pal.name}</span>
                    </div>
                    {colorPaletteId === pal.id && <span className="text-xs text-slate-800 font-mono">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Pairings Choice list */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Google Typography Pairings
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {FONT_PAIRINGS.map((pFont) => (
                  <button 
                    key={pFont.id}
                    onClick={() => onUpdateSettings({ fontPairingId: pFont.id })}
                    className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${fontPairingId === pFont.id ? 'border-slate-800 bg-slate-50 font-bold' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs font-sans text-slate-800">{pFont.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">Headings & Paragraphs</span>
                    </div>
                    {fontPairingId === pFont.id && <span className="text-xs font-mono text-slate-800">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Switcher */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Aesthetic Canvas Tint</h3>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xs text-slate-600 font-medium">Render preview in Dark Mode</span>
                <button 
                  onClick={() => onUpdateSettings({ isDarkMode: !isDarkMode })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Layout Template Switch cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" /> Project Target Layout
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'portfolio', label: 'Portfolio', desc: 'Craft professional' },
                  { id: 'product', label: 'Product Launch', desc: 'Feature list & price' },
                  { id: 'links', label: 'Link Tree', desc: 'Social profile links' },
                  { id: 'event', label: 'Event RSVP', desc: 'Elegant invitation' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => onUpdateSettings({ template: item.id as TemplateId })}
                    className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] ${template === item.id ? 'border-indigo-600 bg-indigo-50/10 shadow-2xs font-bold text-indigo-700' : 'border-slate-100 hover:border-slate-200 bg-white text-slate-700'}`}
                  >
                    <div className="text-xs mb-0.5">{item.label}</div>
                    <div className="text-[9px] text-slate-400 font-mono font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-form inputs */}
            <div className="pt-2 border-t border-slate-100">
              {renderTemplateForms()}
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding line */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400 font-mono">
        <span>Google AI Studio Build</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Powered Page
        </span>
      </div>
    </div>
  );
}
