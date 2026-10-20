import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  Send, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles,
  Award,
  DollarSign
} from 'lucide-react';
import { PilotRecord } from '../types';
import { formatKSh } from '../utils/calculations';

const INITIAL_PILOTS: PilotRecord[] = [
  {
    id: '1',
    businessName: 'Brian Kicks Nairobi',
    businessType: 'Online Sneaker Seller (Instagram)',
    contactPerson: 'Brian',
    phone: '0712 111 222',
    sampleGiven: 'Sneaker WhatsApp Status Advert & KSh Invoice',
    feedback: 'Loved the formatted WhatsApp invoice with Till details! Made his page look more professional.',
    willingToPayKsh: 350,
    status: 'paid_customer',
    dateAdded: '2026-10-10',
  },
  {
    id: '2',
    businessName: 'Wanja Beauty & Salon',
    businessType: 'Salon & Kinyozi (Rongai)',
    contactPerson: 'Wanja',
    phone: '0722 333 444',
    sampleGiven: 'Weekend Dreadlocks & Braids Promo Post',
    feedback: 'Tested the ad on WhatsApp status; got 4 new inquiries for Saturday retwists.',
    willingToPayKsh: 500,
    status: 'tried_tool',
    dateAdded: '2026-10-12',
  },
  {
    id: '3',
    businessName: 'Mama Brayo Retail Duka',
    businessType: 'Duka & Grocery (Umoja)',
    contactPerson: 'Mama Brayo',
    phone: '0733 444 555',
    sampleGiven: 'M-Pesa Fee & Stock Profit Calculation',
    feedback: 'Realized she was losing money on boda deliveries for bundle flour orders.',
    willingToPayKsh: 250,
    status: 'tried_tool',
    dateAdded: '2026-10-15',
  },
  {
    id: '4',
    businessName: 'Kev Nduthi Express',
    businessType: 'Boda Parcel & Errand Runner',
    contactPerson: 'Kevin',
    phone: '0799 555 666',
    sampleGiven: 'Customer Order Dispatched WhatsApp Message',
    feedback: 'Saves him time typing the same delivery text to 10 clients each morning.',
    willingToPayKsh: 200,
    status: 'sample_sent',
    dateAdded: '2026-10-17',
  },
  {
    id: '5',
    businessName: 'Chapo Smokie Hub',
    businessType: 'Street Food & Smokie Pasua',
    contactPerson: 'Dennis',
    phone: '0700 888 999',
    sampleGiven: 'Office Lunch Delivery Combo Flyer',
    feedback: 'Wants to use it for office lunch orders in Upperhill next Monday.',
    willingToPayKsh: 300,
    status: 'contacted',
    dateAdded: '2026-10-18',
  },
];

export const ValidationPlaybook: React.FC = () => {
  const [pilots, setPilots] = useState<PilotRecord[]>(INITIAL_PILOTS);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessType, setNewBusinessType] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const pitchMessage = `Hey! 👋 I'm building KenyaHub Business Studio, a simple tool designed to help small businesses create adverts, product descriptions, invoices and calculate profits more easily.\n\nI'm looking for a few businesses to test the first version and share honest feedback. I'd be happy to create a sample advert for your business so you can see how it works.\n\nWould you be interested?`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchMessage);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleAddPilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessName.trim()) return;

    const newRecord: PilotRecord = {
      id: Date.now().toString(),
      businessName: newBusinessName,
      businessType: newBusinessType || 'Small Business',
      contactPerson: newContactPerson || 'Owner',
      phone: newPhone || '07XX XXX XXX',
      sampleGiven: 'Sample Advert & Invoice created',
      feedback: 'Awaiting first test',
      willingToPayKsh: 0,
      status: 'contacted',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setPilots([newRecord, ...pilots]);
    setNewBusinessName('');
    setNewBusinessType('');
    setNewContactPerson('');
    setNewPhone('');
  };

  const handleUpdateStatus = (id: string, status: PilotRecord['status']) => {
    setPilots(pilots.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleUpdateWillingness = (id: string, amount: number) => {
    setPilots(pilots.map((p) => (p.id === id ? { ...p, willingToPayKsh: amount } : p)));
  };

  const handleDeletePilot = (id: string) => {
    setPilots(pilots.filter((p) => p.id !== id));
  };

  // Metrics
  const totalPilots = pilots.length;
  const triedToolsCount = pilots.filter((p) => p.status === 'tried_tool' || p.status === 'paid_customer').length;
  const payingCustomersCount = pilots.filter((p) => p.status === 'paid_customer').length;
  const averageWillingness = pilots.filter((p) => p.willingToPayKsh > 0);
  const avgKsh = averageWillingness.length > 0
    ? Math.round(averageWillingness.reduce((acc, curr) => acc + curr.willingToPayKsh, 0) / averageWillingness.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* 30-Day Measurable Goal Card */}
      <div className="bg-gradient-to-br from-emerald-950/50 via-stone-850 to-stone-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                30-Day Customer Validation Plan
              </h2>
              <p className="text-xs text-stone-300">
                Focus on one measurable result: <strong className="text-emerald-400">Get 3 real businesses to use KenyaHub and at least 1 to pay for it</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800 text-xs text-stone-300">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Target: 3 Pilots + 1 Paying User</span>
          </div>
        </div>

        {/* Milestone Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
              1. Biashara Zilizojaribu (Tested)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-white">{triedToolsCount} / 3</span>
              <span className="text-xs text-emerald-400 font-bold">
                {Math.min(100, Math.round((triedToolsCount / 3) * 100))}% Imefikiwa
              </span>
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (triedToolsCount / 3) * 100)}%` }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>

          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
              2. Wateja Waliolipa (Paid)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-white">{payingCustomersCount} / 1</span>
              <span className="text-xs text-emerald-400 font-bold">
                {payingCustomersCount >= 1 ? 'Lengo Limekamilika! 🎯' : 'Lengo: 1 Mteja'}
              </span>
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (payingCustomersCount / 1) * 100)}%` }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>

          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
              3. Bei Wastani Waliyo Tayari Kulipa
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-emerald-400">{formatKSh(avgKsh)}</span>
              <span className="text-xs text-stone-400">kwa mwezi</span>
            </div>
            <span className="text-[10px] text-stone-500 block mt-1">Kulingana na maoni ya field</span>
          </div>
        </div>
      </div>

      {/* Customer Outreach Script */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Send className="w-4 h-4" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Ujumbe wa Kuongea na Wateja (Outreach Script)
            </h3>
          </div>
          <button
            onClick={handleCopyPitch}
            className="flex items-center gap-1.5 bg-stone-850 hover:bg-stone-750 text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-700 transition-colors"
          >
            {copiedPitch ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Imenakiliwa
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" /> Nakili Pitch
              </>
            )}
          </button>
        </div>

        <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 font-mono whitespace-pre-wrap leading-relaxed">
          {pitchMessage}
        </div>
      </div>

      {/* 5-Pilot Customer Tracker Table */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Pilot Tracker: Biashara 5 za Kwanza (First 5 Pilots)
            </h3>
            <p className="text-xs text-stone-400">
              Gawa sample adverts na invoices, fatilia maoni yao na kiwango wanachoweza kulipia.
            </p>
          </div>
        </div>

        {/* Form to Add New Pilot */}
        <form onSubmit={handleAddPilot} className="bg-stone-900 p-3 rounded-xl border border-stone-800 grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Jina la Biashara (Shop)"
            value={newBusinessName}
            onChange={(e) => setNewBusinessName(e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Aina (e.g. Salon, Shoes, Kibanda)"
            value={newBusinessType}
            onChange={(e) => setNewBusinessType(e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Mhusika & Simu"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg px-3 py-1.5 text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Ongeza Biashara
          </button>
        </form>

        {/* Pilots List */}
        <div className="space-y-3">
          {pilots.map((pilot) => (
            <div
              key={pilot.id}
              className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3 transition-colors hover:border-stone-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{pilot.businessName}</span>
                    <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full border border-stone-700">
                      {pilot.businessType}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    Mawasiliano: {pilot.contactPerson} ({pilot.phone}) • Tarehe: {pilot.dateAdded}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={pilot.status}
                    onChange={(e) => handleUpdateStatus(pilot.id, e.target.value as any)}
                    className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border ${
                      pilot.status === 'paid_customer'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : pilot.status === 'tried_tool'
                        ? 'bg-blue-950 text-blue-300 border-blue-500'
                        : pilot.status === 'sample_sent'
                        ? 'bg-amber-950 text-amber-300 border-amber-500'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    <option value="contacted">1. Contacted (Amejulishwa)</option>
                    <option value="sample_sent">2. Sample Sent (Ametumiwa)</option>
                    <option value="tried_tool">3. Tried Tool (Amejaribu)</option>
                    <option value="paid_customer">4. Paid Customer (Amelipia! 💰)</option>
                    <option value="rejected">5. Not Interested</option>
                  </select>

                  <button
                    onClick={() => handleDeletePilot(pilot.id)}
                    className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                    aria-label="Delete pilot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-950/40 p-2.5 rounded-lg border border-stone-800/80">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block mb-0.5">
                    Mfano Aliopewa (Sample Given):
                  </span>
                  <p className="text-stone-300">{pilot.sampleGiven}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block mb-0.5">
                    Maoni & Uzoefu (Feedback):
                  </span>
                  <p className="text-stone-300 italic">{pilot.feedback || 'Bado hajatoa maoni'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-[11px]">Kiasi anachoweza kulipia:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-400 font-bold">KSh</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={pilot.willingToPayKsh}
                      onChange={(e) => handleUpdateWillingness(pilot.id, parseInt(e.target.value) || 0)}
                      className="w-20 bg-stone-800 border border-stone-700 rounded px-2 py-0.5 text-xs text-white text-right font-bold"
                    />
                    <span className="text-stone-500 text-[11px]">/mwezi</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Advice Box */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Kanuni 3 za Kulinda Biashara na Kuthibitisha Soko (Founder Rules)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
            <span className="font-bold text-white block mb-1">1. Usijenge Kabla ya Kuuza</span>
            <p className="text-stone-400 leading-relaxed">
              Thibitisha kama wafanyabiashara wanatumia matangazo na invoice kabla ya kuingiza mambo magumu ya code.
            </p>
          </div>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
            <span className="font-bold text-white block mb-1">2. Linda Imani ya Mteja</span>
            <p className="text-stone-400 leading-relaxed">
              Usiwahi kutoa madai ya uongo kuhusu mapato. Eleza wazi jinsi data zao za wateja na bei zinavyolindwa.
            </p>
          </div>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
            <span className="font-bold text-white block mb-1">3. M-Pesa Bila Haraka</span>
            <p className="text-stone-400 leading-relaxed">
              Anza na malipo ya kawaida ya Till/Send Money kabla ya kujihusisha na API rasmi za Safaricom Daraja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
