import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Flame, 
  ShoppingBag, 
  Send,
  MessageCircle,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface MarketingStudioProps {
  profile: BusinessProfile;
}

const KENYAN_PROMPTS = [
  {
    title: '👟 Nike Dunks / Mitumba Shoes',
    product: 'Nike Dunk Low Retro Panda & Air Force 1 Grade A',
    price: '2800',
    sellingPoint: 'Durable leather, size 38-44 available, original soles, free extra laces',
    cta: 'WhatsApp 0722123456 to order or visit stall B4',
  },
  {
    title: '💇‍♀️ Braids & Knotless Salon Deal',
    product: 'Mid-Back Knotless Braids + Free Wash & Blowdry',
    price: '1500',
    sellingPoint: 'Painless braiding, neat parting, lasts 2 months, tea & free WiFi while you get styled',
    cta: 'Book appointment now via WhatsApp / Call',
  },
  {
    title: '🌭 Smokie Pasua & Lunch Combo',
    product: 'Smokie Pasua + Boiled Egg + Fresh Kachumbari & Soda',
    price: '150',
    sellingPoint: 'Hot smokie, spicy pili pili kachumbari, clean hygienic prep, fast office delivery',
    cta: 'Call for bulk office orders at 12 PM',
  },
  {
    title: '💡 Ring Light & TikTok Vlogging Kit',
    product: '12-inch LED Ring Light with 2.1m Tripod & Phone Mount',
    price: '2200',
    sellingPoint: '3 light modes (warm/white/cool), USB powered, perfect for TikTok creators & makeup artists',
    cta: 'DM or WhatsApp for countrywide courier delivery',
  },
];

export const MarketingStudio: React.FC<MarketingStudioProps> = ({ profile }) => {
  const [productName, setProductName] = useState('Air Force 1 Grade A Leather Sneakers');
  const [price, setPrice] = useState('2800');
  const [sellingPoint, setSellingPoint] = useState('Clean finish, original soles, sizes 40-44, free extra laces');
  const [callToAction, setCallToAction] = useState(`WhatsApp / Call ${profile.phone || '0712 345 678'} or Lipa na Till ${profile.mpesaNumber || '894212'}`);
  const [platform, setPlatform] = useState<'whatsapp' | 'instagram' | 'tiktok' | 'sms'>('whatsapp');
  const [tone, setTone] = useState<'sheng' | 'swahili' | 'english' | 'urgent_clearance'>('sheng');
  const [isGenerating, setIsGenerating] = useState(false);

  // Stored outputs
  const [generatedResults, setGeneratedResults] = useState<{
    whatsappStatus: string;
    instagramPost: string;
    tiktokScript: string;
  }>({
    whatsappStatus: `🔥 *SNEAKERS ZIKO IN STOCK WASEE!* 🔥\n\nAir Force 1 Grade A Leather Sneakers zimetua! Kitu safi kabisa.\n💰 *Bei:* KSh 2,800 pekee!\n👟 Clean finish, original soles, size 40-44 ziko tayari.\n\n📍 Free CBD Delivery / Boda popote Nairobi.\n📲 *DM au WhatsApp:* ${profile.phone || '0712 345 678'}\n💳 *Lipa na M-Pesa:* Till ${profile.mpesaNumber || '894212'}\n\n_Wahi mzigo kabla saizi yako haijaenda! Bei ya jioni!_ 🚀`,
    instagramPost: `Stepping out in effortless confidence. 👟✨\n\nUpgrade your drip with our Premium Air Force 1 Grade A Sneakers. Crafted with durable leather, sleek silhouette, and maximum comfort for everyday hustle.\n\n✔️ Sizes: 40 - 44 in stock\n✔️ Free extra laces\n✔️ Price: KSh 2,800 only\n\n📦 Same-day delivery across Nairobi & countrywide parcel.\n👉 Tap the link in bio or WhatsApp us at ${profile.phone || '0712 345 678'} to secure your pair now!\n\n#KenyanFashion #NairobiSneakers #DripNairobi #KenyaHustle #BiasharaKenya #LipaNaMpesa`,
    tiktokScript: `[HOOK - 0 to 3 secs]\n"Wasee, acha kubuy viatu za fake zinavunjika baada ya wiki mbili! Check hizi..."\n\n[BODY - 3 to 15 secs]\n"Hizi ni Air Force 1 Grade A safi kabisa. Tuliweka stock mpya ya White & Black na zote zina original heavy sole na clean stitching. Saizi 40 hadi 44 ziko tayari."\n\n[OFFER & CTA - 15 to 25 secs]\n"Bei ya leo ni KSh 2,800 pekee na tunakuletea CBD bure au kwa boda popote Nairobi. Tap namba kwa bio yangu upige order chap chap kabla mzigo haujaisha!"`,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'advert',
          platform,
          tone,
          context: {
            productName,
            price,
            sellingPoint,
            callToAction,
            phone: profile.phone,
            businessName: profile.businessName,
          },
        }),
      });
      const data = await res.json();
      if (data.content) {
        // Parse or assign smart blocks
        const fullContent = data.content;
        setGeneratedResults({
          whatsappStatus: fullContent.includes('Option 1') 
            ? fullContent.split('Option 2')[0].replace('Option 1:', '').trim() 
            : fullContent,
          instagramPost: fullContent.includes('Option 2')
            ? fullContent.split('Option 2:')[1].split('Option 3')[0].trim()
            : fullContent,
          tiktokScript: fullContent.includes('Option 3')
            ? fullContent.split('Option 3:')[1].trim()
            : `[Hook]: "Wateja wangu wa nguvu!"\n[Offer]: ${productName} inapatikana kwa KSh ${price}.\n[CTA]: Piga simu sasa kupitia ${profile.phone || 'WhatsApp'}!`,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPrompt = (p: typeof KENYAN_PROMPTS[0]) => {
    setProductName(p.product);
    setPrice(p.price);
    setSellingPoint(p.sellingPoint);
    setCallToAction(p.cta);
  };

  return (
    <div className="space-y-6">
      {/* Top Description */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Megaphone className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-white">Marketing Content & Advert Generator</h2>
        </div>
        <p className="text-xs text-stone-400">
          Turn a simple product note into ready-to-post WhatsApp statuses, Instagram captions and viral TikTok hooks in authentic Kenyan Sheng, Kiswahili or English.
        </p>

        {/* Quick Sample Chips */}
        <div className="mt-4 pt-3 border-t border-stone-800">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
            Pakia Mfano wa Biashara Yako (One-Click Prompts):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {KENYAN_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPrompt(item)}
                className="whitespace-nowrap px-3 py-1.5 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-emerald-400 rounded-lg text-xs font-medium transition-colors shrink-0"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generator Form & Output Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Controls */}
        <div className="lg:col-span-5 bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Maelezo ya Tangazo (Ad Brief)
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Jina la Bidhaa au Huduma
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Matte Lipstick, Boda Courier, Dreadlock Retwist"
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Bei ya KSh (Price)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2500"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Lugha na Mtindo (Tone)
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="sheng">Authentic Sheng (Wasee)</option>
                <option value="swahili">Kiswahili Kawaida</option>
                <option value="english">Professional English</option>
                <option value="urgent_clearance">Bei ya Jioni (Urgent Offer)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Ubora au Faida Kuu (Selling Points)
            </label>
            <textarea
              rows={2}
              value={sellingPoint}
              onChange={(e) => setSellingPoint(e.target.value)}
              placeholder="Nini kinafanya hii bidhaa iwe bora? Free delivery, long lasting, original..."
              className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Wasiliana Nasi / Call to Action (CTA)
            </label>
            <input
              type="text"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="WhatsApp 07XX... au Lipa na Till..."
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !productName.trim()}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Inatengeneza Tangazo...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Tengeneza Matangazo ya Leo (Generate)
              </>
            )}
          </button>
        </div>

        {/* Generated Output Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Card 1: WhatsApp Status / SMS */}
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-green-500/10 text-green-400 rounded-lg">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    WhatsApp Status / SMS Blast
                  </h4>
                  <span className="text-[10px] text-stone-400">Punchy with emojis & quick Lipa na M-Pesa details</span>
                </div>
              </div>

              <button
                onClick={() => handleCopy('whatsappStatus', generatedResults.whatsappStatus)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-700 transition-colors"
              >
                {copiedKey === 'whatsappStatus' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Imenakiliwa
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" /> Nakili
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 p-3.5 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-stone-200 whitespace-pre-wrap leading-relaxed">
              {generatedResults.whatsappStatus}
            </div>
          </div>

          {/* Output Card 2: Instagram / Facebook Caption */}
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Instagram & Facebook Caption
                  </h4>
                  <span className="text-[10px] text-stone-400">Engaging storytelling + Kenyan high-reach hashtags</span>
                </div>
              </div>

              <button
                onClick={() => handleCopy('instagramPost', generatedResults.instagramPost)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-700 transition-colors"
              >
                {copiedKey === 'instagramPost' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Imenakiliwa
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" /> Nakili
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 p-3.5 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-wrap leading-relaxed">
              {generatedResults.instagramPost}
            </div>
          </div>

          {/* Output Card 3: TikTok Hook & Pitch Script */}
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    TikTok & Reels Script (Hook + Body + CTA)
                  </h4>
                  <span className="text-[10px] text-stone-400">Street-smart dialogue for video creators</span>
                </div>
              </div>

              <button
                onClick={() => handleCopy('tiktokScript', generatedResults.tiktokScript)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-700 transition-colors"
              >
                {copiedKey === 'tiktokScript' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Imenakiliwa
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" /> Nakili
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 p-3.5 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 whitespace-pre-wrap leading-relaxed">
              {generatedResults.tiktokScript}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
