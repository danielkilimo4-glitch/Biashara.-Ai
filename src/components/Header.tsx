import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Sparkles, 
  CreditCard, 
  Store,
  Scissors,
  UtensilsCrossed,
  ShoppingBag,
  Laptop,
  Bike
} from 'lucide-react';
import { BusinessProfile, BusinessType, LanguageMode } from '../types';

interface HeaderProps {
  profile: BusinessProfile;
  onUpdateProfile: (profile: BusinessProfile) => void;
  lang: LanguageMode;
  onSelectLang: (lang: LanguageMode) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
}

const BUSINESS_TYPE_OPTIONS: Array<{ id: BusinessType; label: string; icon: any }> = [
  { id: 'online_seller', label: 'Online Seller / Mitumba', icon: ShoppingBag },
  { id: 'salon_barbershop', label: 'Salon / Kinyozi', icon: Scissors },
  { id: 'food_kibanda', label: 'Food / Kibanda / Smokie', icon: UtensilsCrossed },
  { id: 'retail_duka', label: 'Retail Shop / Duka', icon: Store },
  { id: 'freelance_services', label: 'Freelancer / Services', icon: Laptop },
  { id: 'boda_delivery', label: 'Boda / Logistics', icon: Bike },
];

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  lang,
  onSelectLang,
  isProfileOpen,
  setIsProfileOpen,
}) => {
  return (
    <header className="no-print bg-stone-900 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            KH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                KenyaHub <span className="text-emerald-400 font-extrabold">Studio</span>
              </h1>
              <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                🇰🇪 Biashara Kit
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Simple documents, ads & M-Pesa profit tools for Kenyan hustles
            </p>
          </div>
        </div>

        {/* Right side controls: Language switcher + Business profile trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language pill selector */}
          <div className="flex items-center bg-stone-800/90 rounded-lg p-0.5 border border-stone-700 text-xs">
            <button
              onClick={() => onSelectLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                lang === 'en' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
              aria-label="Switch language to English"
            >
              EN
            </button>
            <button
              onClick={() => onSelectLang('sw')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                lang === 'sw' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
              aria-label="Switch language to Kiswahili"
            >
              SWA
            </button>
            <button
              onClick={() => onSelectLang('sheng')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                lang === 'sheng' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
              aria-label="Switch language to Sheng"
            >
              SHENG
            </button>
          </div>

          {/* Quick Business Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white px-3 py-1.5 rounded-lg border border-stone-700 text-xs font-medium transition-colors"
            aria-label="Edit business profile and M-Pesa settings"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[120px] truncate hidden xs:inline">{profile.businessName || 'Setup Shop'}</span>
            <span className="text-[10px] bg-stone-700 text-stone-300 px-1.5 py-0.2 rounded font-mono">
              {profile.paymentType === 'till' ? 'Till' : profile.paymentType === 'paybill' ? 'Paybill' : 'M-Pesa'}
            </span>
          </button>
        </div>
      </div>

      {/* Business Profile Modal / Drawer */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-850">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Mipangilio ya Biashara Yako</h3>
                  <p className="text-xs text-stone-400">Haya maelezo yataonekana kwenye invoices na adverts zako.</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 text-sm font-semibold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Jina la Biashara (Shop / Brand Name)
                </label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => onUpdateProfile({ ...profile, businessName: e.target.value })}
                  placeholder="mfano: Nairobi Drip Vault, Mama Njeri Delights"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Location / Town
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => onUpdateProfile({ ...profile, location: e.target.value })}
                      placeholder="Nairobi CBD, Stall B12"
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => onUpdateProfile({ ...profile, phone: e.target.value })}
                      placeholder="0712 345 678"
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Aina ya Biashara (Niche)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUSINESS_TYPE_OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = profile.businessType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onUpdateProfile({ ...profile, businessType: item.id })}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-stone-800/70 border-stone-700/80 text-stone-400 hover:text-stone-200 hover:border-stone-600'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="truncate w-full">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* M-Pesa Settings */}
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>Maelezo ya Malipo (Lipa na M-Pesa)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['till', 'paybill', 'send_money'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onUpdateProfile({ ...profile, paymentType: type })}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        profile.paymentType === type
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-600'
                      }`}
                    >
                      {type === 'till' ? 'Buy Goods Till' : type === 'paybill' ? 'Paybill' : 'Send Money'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-stone-300 font-medium mb-1">
                      {profile.paymentType === 'till' ? 'Till Number' : profile.paymentType === 'paybill' ? 'Business Number' : 'M-Pesa Phone'}
                    </label>
                    <input
                      type="text"
                      value={profile.mpesaNumber}
                      onChange={(e) => onUpdateProfile({ ...profile, mpesaNumber: e.target.value })}
                      placeholder={profile.paymentType === 'till' ? '894212' : profile.paymentType === 'paybill' ? '247247' : '0722000000'}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {profile.paymentType === 'paybill' && (
                    <div>
                      <label className="block text-[11px] text-stone-300 font-medium mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={profile.accountNumber || ''}
                        onChange={(e) => onUpdateProfile({ ...profile, accountNumber: e.target.value })}
                        placeholder="Jina la Mteja au Order No"
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-850 flex justify-end">
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors shadow-md shadow-emerald-950/50"
              >
                Hifadhi Maelezo (Save)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
