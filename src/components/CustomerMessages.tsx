import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  User, 
  Clock, 
  HelpCircle, 
  ExternalLink,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface CustomerMessagesProps {
  profile: BusinessProfile;
}

interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  en: string;
  sw: string;
  sheng: string;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'payment_reminder',
    category: 'Malipo (Payments)',
    title: 'Kukumbusha Malipo ya Invoice (Polite Payment Reminder)',
    en: 'Hello [Customer Name]! Hope you are having a productive day. This is a gentle reminder regarding the pending balance of KSh [Amount] for [Product/Order]. Kindly settle via Lipa na M-Pesa [M-Pesa Details] at your earliest convenience so we can update our books. Thank you for your continued partnership!',
    sw: 'Habari [Customer Name]! Tunatumai siku yako inaenda vizuri. Hii ni kumbukumbu fupi kuhusu salio la KSh [Amount] la [Product/Order]. Tafadhali kamilisha malipo kupitia Lipa na M-Pesa [M-Pesa Details] ili tusasishe rekodi zetu. Tunashukuru sana kwa ushirikiano wako!',
    sheng: 'Niaje [Customer Name]! Niaje siku inaenda? Nakukumbusha tu ile balance ndogo ya KSh [Amount] ya [Product/Order]. Unaweza kuirusha kupitia [M-Pesa Details] ndio tu-clear book zetu chap chap. Shukran sana msee wangu!',
  },
  {
    id: 'order_dispatched',
    category: 'Usafirishaji (Delivery)',
    title: 'Mzigo Umetumwa kwa Boda / Parcel (Order Dispatched)',
    en: 'Great news [Customer Name]! Your order for [Product/Order] is packed and on the way via our rider/courier. Rider Contact: 07XXXXXXXX. Please ensure someone is available to receive it. Thank you for shopping with [Business Name]!',
    sw: 'Habari njema [Customer Name]! Mzigo wako wa [Product/Order] umefungwa vizuri na umekabidhiwa kwa msafirishaji/boda. Namba ya rider: 07XXXXXXXX. Tafadhali hakikisha kuna mtu wa kupokea. Asante sana kwa kununua kutoka [Business Name]!',
    sheng: 'Mzigo umetoka [Customer Name]! [Product/Order] yako ishafanyiwa packaging safi na iko kwa nduthi inakuja chap chap. Namba ya rider ni 07XXXXXXXX. Kuwa ready kupokea. Shukran kwa ku-support [Business Name]!',
  },
  {
    id: 'delivery_delay',
    category: 'Huduma kwa Wateja (Support)',
    title: 'Kuomba Msamaha kwa Ucheleweshaji (Delay Apology)',
    en: 'Dear [Customer Name], we sincerely apologize that your delivery for [Product/Order] has experienced a slight delay due to unexpected traffic/weather. Our team is actively prioritizing it and your package will arrive shortly. We truly appreciate your patience!',
    sw: 'Hujambo [Customer Name], tunaomba radhi kwa dhati kwamba uwasilishaji wa [Product/Order] yako umechelewa kidogo kutokana na hali ya hewa/foleni. Tunafanya juu chini kuhakikisha unakufikia hivi punde. Asante sana kwa subira yako!',
    sheng: 'Pole sana [Customer Name], delivery ya [Product/Order] imechelewa kidogo juu ya jam na mvua ya leo Nairobi. Rider wetu yuko on the move na anafika hivi punde. Asante sana kwa kutuelewa!',
  },
  {
    id: 'referral_request',
    category: 'Kukuza Biashara (Growth)',
    title: 'Kuomba Maoni na Referral (Review & Referrals)',
    en: 'Hi [Customer Name]! How are you enjoying your [Product/Order]? Your feedback means the world to us at [Business Name]. If you loved our service, kindly recommend us to a friend or post a quick photo! As a thank you, get 10% off your next purchase.',
    sw: 'Habari [Customer Name]! Unaendeleaje na [Product/Order] yako? Maoni yako ni muhimu sana kwa [Business Name]. Kama ulipendezwa na huduma yetu, tafadhali tupendekeze kwa rafiki. Kama shukrani, utapata punguzo la 10% kwa oda ijayo!',
    sheng: 'Vipi [Customer Name]! Umeonaje ile [Product/Order]? Kama kitu imekubamba na huduma ilikuwa fiti, tu-plug kwa marafiki zako au utupigie tag kwa WhatsApp/Insta! Kwa oda yako next tutakupea discount ya nguvu!',
  },
  {
    id: 'bei_ya_jioni',
    category: 'Mauzo ya Haraka (Flash Sales)',
    title: 'Ofa Maalum ya Jioni (Flash Sale Offer)',
    en: 'Exclusive VIP Offer! For today only, get [Product/Order] at a special price of KSh [Amount]. Limited pieces remaining! Reply to this message now to claim yours before it sells out.',
    sw: 'Ofa ya Kipekee kwa Wateja Wetu! Leo pekee, pata [Product/Order] kwa bei maalum ya KSh [Amount]. Zimebaki chache sana! Jibu ujumbe huu sasa kabla mzigo haujaisha.',
    sheng: 'Offer ya Kijanja Leo Pekee! [Customer Name], leo tuna clearance ya [Product/Order] kwa bei ya kuokota KSh [Amount] pekee! Zimebaki pisi chache sana. Nicheki chap kwa WhatsApp nikuwekee kabla hazijaisha!',
  },
];

export const CustomerMessages: React.FC<CustomerMessagesProps> = ({ profile }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>(TEMPLATES[0]);
  const [lang, setLang] = useState<'sheng' | 'sw' | 'en'>('sheng');
  const [customerName, setCustomerName] = useState('Kevin');
  const [customerPhone, setCustomerPhone] = useState('254712345678');
  const [productOrder, setProductOrder] = useState('Sneakers na socks');
  const [amount, setAmount] = useState('2,500');
  const [copied, setCopied] = useState(false);

  // Compute final message with variables replaced
  const getProcessedMessage = () => {
    let raw = selectedTemplate[lang];
    const mpesaInfo = profile.paymentType === 'till' 
      ? `Till ${profile.mpesaNumber || '894212'}` 
      : profile.paymentType === 'paybill' 
      ? `Paybill ${profile.mpesaNumber || '247247'} (Acc: ${customerName})` 
      : `07XXXXXXXX`;

    return raw
      .replace(/\[Customer Name\]/g, customerName || 'Mteja')
      .replace(/\[Product\/Order\]/g, productOrder || 'oda yako')
      .replace(/\[Amount\]/g, amount || '0')
      .replace(/\[M-Pesa Details\]/g, mpesaInfo)
      .replace(/\[Business Name\]/g, profile.businessName || 'Biashara Yetu');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getProcessedMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(getProcessedMessage());
    const phone = customerPhone.replace(/\D/g, '');
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-white">Customer Messages & Debt Recovery Hub</h2>
        </div>
        <p className="text-xs text-stone-400">
          Professional communication templates in English, Kiswahili & Sheng for payment follow-ups, delivery dispatches, apologies and customer loyalty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Template List Selector */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Chagua Ujumbe (Select Scenario):
          </h3>
          <div className="space-y-2">
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                      : 'bg-stone-850 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-0.5">
                    {tmpl.category}
                  </span>
                  <span className="text-xs font-semibold block">{tmpl.title}</span>
                </button>
              );
            })}
          </div>

          {/* Variable Inputs */}
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 space-y-3 mt-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Rekebisha Taarifa (Customize Variables)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-400 block mb-1">Jina la Mteja</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 block mb-1">Namba ya WhatsApp</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="2547XXXXXXXX"
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-400 block mb-1">Bidhaa / Huduma</label>
                <input
                  type="text"
                  value={productOrder}
                  onChange={(e) => setProductOrder(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 block mb-1">Kiasi cha KSh (Amount)</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Preview & Action Box */}
        <div className="lg:col-span-7 bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
                {selectedTemplate.category}
              </span>
              <h3 className="text-sm font-bold text-white">{selectedTemplate.title}</h3>
            </div>

            {/* Language Switch */}
            <div className="flex items-center bg-stone-900 rounded-lg p-0.5 border border-stone-700 text-xs">
              <button
                onClick={() => setLang('sheng')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  lang === 'sheng' ? 'bg-emerald-500 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Sheng
              </button>
              <button
                onClick={() => setLang('sw')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  lang === 'sw' ? 'bg-emerald-500 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Kiswahili
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  lang === 'en' ? 'bg-emerald-500 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Preview Bubble */}
          <div className="bg-[#0b141a] p-4 sm:p-5 rounded-2xl border border-stone-800 relative shadow-inner">
            <div className="max-w-[85%] bg-[#005c4b] text-stone-100 p-3.5 rounded-2xl rounded-tl-sm text-xs leading-relaxed shadow-md">
              <p className="whitespace-pre-wrap">{getProcessedMessage()}</p>
              <div className="text-[10px] text-emerald-200/70 text-right mt-1.5 flex items-center justify-end gap-1">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>✓✓</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className={`flex-1 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-800 hover:bg-stone-750 text-white border border-stone-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Imenakiliwa kwa Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-400" /> Nakili Ujumbe (Copy)
                </>
              )}
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="flex-1 w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Fungua WhatsApp Moja kwa Moja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
