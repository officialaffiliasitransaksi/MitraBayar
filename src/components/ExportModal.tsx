import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, CheckCircle2, Globe } from 'lucide-react';
import { WebsiteSettings, WebsiteContent, ColorPalette, FontPairing } from '../types';
import { generateStaticHtml } from '../utils/htmlGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  content: WebsiteContent;
  palette: ColorPalette;
  font: FontPairing;
}

export default function ExportModal({
  isOpen,
  onClose,
  settings,
  content,
  palette,
  font
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadActive, setDownloadActive] = useState(false);

  if (!isOpen) return null;

  // Compile static responsive code
  const codeString = generateStaticHtml(settings, content, palette, font);

  // Clipboard copy handle
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Fail to copy code. Please select and copy manually.');
    }
  };

  // Modern direct browser file download trigger
  const handleDownload = () => {
    setDownloadActive(true);
    const blob = new Blob([codeString], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Derive a clean filename based on the selected layout
    const getDownloadName = () => {
      const activeTemplate = settings.template;
      if (activeTemplate === 'event') {
        return content.event.title;
      }
      return (content[activeTemplate] as any).name || 'index';
    };
    const formattedTitle = getDownloadName();
    
    link.setAttribute('download', `${formattedTitle.replace(/\s+/g, '_').toLowerCase()}_site.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setDownloadActive(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100">
        
        {/* Header bar */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Export Prepared Website</h2>
              <p className="text-2xs text-slate-500 font-mono">STAND-ALONE CODE GENERATOR FINISHED</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/40 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info advice box */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100/50 flex gap-3 text-emerald-800 text-xs leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Production Ready!</span> This single-file bundle loads the Google Fonts and Tailwind CDN automatically. It requires zero static assets, build pipelines, or servers. Drag it into any browser to test, or host it publicly on any static web server instantly.
          </div>
        </div>

        {/* Code editor viewpane */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-950 p-4 relative">
          <div className="flex justify-between items-center mb-2 text-2xs text-slate-400 font-mono">
            <span>index.html • Standard UTF-8 document</span>
            <span>{codeString.length.toLocaleString()} characters</span>
          </div>

          <div className="flex-1 overflow-auto rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <pre className="text-2xs text-slate-350 font-mono text-left leading-relaxed whitespace-pre select-all">
              {codeString}
            </pre>
          </div>
        </div>

        {/* Actions bar */}
        <div className="p-4 border-t border-slate-150 flex flex-wrap gap-2 justify-between items-center bg-slate-50">
          <div className="flex items-center gap-1.5 text-2xs text-slate-500 font-mono">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            W3C Standard Compliant HTML5
          </div>

          <div className="flex gap-2">
            {/* Copy button */}
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border font-medium text-xs transition-all cursor-pointer ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-250 active:scale-98'}`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied HTML!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Code
                </>
              )}
            </button>

            {/* Direct download */}
            <button 
              onClick={handleDownload}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl font-medium text-xs text-white transition-all cursor-pointer shadow-2xs ${downloadActive ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'}`}
            >
              <Download className="w-3.5 h-3.5" />
              {downloadActive ? 'Downloading...' : 'Download index.html'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
