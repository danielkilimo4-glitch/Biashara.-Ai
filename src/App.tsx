import React, { useState } from 'react';
import { 
  FileText, 
  Megaphone, 
  Calculator, 
  MessageSquare, 
  Bot, 
  Target, 
  Store,
  Sparkles,
  Zap,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { BusinessProfile, LanguageMode } from './types';
import { Header } from './components/Header';
import { InvoiceMaker } from './components/InvoiceMaker';
import { MarketingStudio } from './components/MarketingStudio';
import { ProfitCalculator } from './components/ProfitCalculator';
import { CustomerMessages } from './components/CustomerMessages';
import { GeminiChatbot } from './components/GeminiChatbot';
import { ValidationPlaybook } from './components/ValidationPlaybook';

type TabType = 'invoices' | 'marketing' | 'profit' | 'messages' | 'chat' | 'validation';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [lang, setLang] = useState<LanguageMode>('sw');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [profile, setProfile] = useState<BusinessProfile>({
    businessName: 'Nairobi Drip Vault',
    tagline: 'Grade A Sneakers & Streetwear Plug',
    phone: '0722 123 456',
    location: 'Nairobi CBD, StarMall Stall B14',
    businessType: 'online_seller',
    paymentType: 'till',
    mpesaNumber: '894212',
    accountNumber: '',
  });

  const TABS: Array<{ id: TabType; label: string; sub: string; icon: any }> = [
    { id: 'invoices', label: 'Invoices & Receipts', sub: 'Ankara & M-Pesa', icon: FileText },
    { id: 'marketing', label: 'Marketing & Ads', sub: 'WhatsApp & TikTok', icon: Megaphone },
    { id: 'profit', label: 'Profit Calculator', sub: 'Ada za M-Pesa & Margins', icon: Calculator },
    { id: 'messages', label: 'Customer Messages', sub: 'Kukumbusha Madeni', icon: MessageSquare },
    { id: 'chat', label: 'Gemini Advisor', sub: 'Biashara AI Mentor', icon: Bot },
    { id: 'validation', label: '30-Day Pilots', sub: 'Mpango wa Wateja', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      {/* Header bar */}
      <Header
        profile={profile}
        onUpdateProfile={setProfile}
        lang={lang}
        onSelectLang={setLang}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-12">
        {/* Navigation Tabs (Horizontal on Tablet/Desktop, Scrollable on Mobile) */}
        <div className="no-print mb-6">
          <div className="bg-stone-850 p-1.5 rounded-2xl border border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-lg">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl flex items-center justify-center sm:justify-start gap-2.5 transition-all text-left ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                  aria-label={tab.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <div className="truncate">
                    <span className="block text-xs font-bold leading-tight">{tab.label}</span>
                    <span className={`block text-[10px] leading-tight truncate ${isActive ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {tab.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="transition-all duration-150">
          {activeTab === 'invoices' && <InvoiceMaker profile={profile} />}
          {activeTab === 'marketing' && <MarketingStudio profile={profile} />}
          {activeTab === 'profit' && <ProfitCalculator />}
          {activeTab === 'messages' && <CustomerMessages profile={profile} />}
          {activeTab === 'chat' && <GeminiChatbot profile={profile} />}
          {activeTab === 'validation' && <ValidationPlaybook />}
        </div>
      </main>

      {/* Mobile Sticky Bottom Dock for Fast Thumb Navigation */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 py-1.5 px-2 shadow-2xl">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-400' : 'text-stone-500 hover:text-stone-300'
                }`}
                aria-label={tab.label}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500/20' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold tracking-tight mt-0.5 truncate max-w-[55px]">
                  {tab.id === 'invoices' ? 'Invoice' : tab.id === 'marketing' ? 'Ads' : tab.id === 'profit' ? 'Faida' : tab.id === 'messages' ? 'Chat' : tab.id === 'chat' ? 'Advisor' : 'Pilots'}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Footer */}
      <footer className="no-print hidden md:block border-t border-stone-800/80 bg-stone-950 py-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-400">KenyaHub Business Studio 🇰🇪</span>
            <span>•</span>
            <span>Designed for Kenyan Hustles & Micro-Enterprises</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>M-Pesa Ready (Buy Goods Till & Paybill)</span>
            <span>•</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
