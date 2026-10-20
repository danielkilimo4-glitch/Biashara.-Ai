import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  Calendar,
  User,
  Phone,
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BusinessProfile, InvoiceData, InvoiceItem } from '../types';
import { calculateInvoiceTotals, formatKSh } from '../utils/calculations';

interface InvoiceMakerProps {
  profile: BusinessProfile;
}

const PRESET_TEMPLATES: Array<{
  name: string;
  type: 'invoice' | 'quotation' | 'receipt';
  customerName: string;
  customerPhone: string;
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
  notes: string;
}> = [
  {
    name: '👟 Sneaker & Drip Order',
    type: 'invoice',
    customerName: 'Brian Otieno',
    customerPhone: '0722123456',
    items: [
      { description: 'Nike Dunk Low Retro (Black & White - Panda) Sz 43', quantity: 1, unitPrice: 3800 },
      { description: 'Premium Sneaker Crease Protectors (Pair)', quantity: 2, unitPrice: 450 },
      { description: 'Rider Boda Delivery (Nairobi Westlands to Kilimani)', quantity: 1, unitPrice: 250 },
    ],
    notes: 'Mzigo utakabidhiwa mteja akishathibitisha malipo kupitia Till. Asante kwa kununua nasi!',
  },
  {
    name: '💈 Executive Salon & Barber',
    type: 'receipt',
    customerName: 'Sarah Mwangi',
    customerPhone: '0711987654',
    items: [
      { description: 'Sisterlocks Retwist & Deep Moisture Steam Treatment', quantity: 1, unitPrice: 3500 },
      { description: 'Gel Polish Manicure & Hand Massage', quantity: 1, unitPrice: 1200 },
      { description: 'Organic Tea Tree Hair Growth Oil (100ml)', quantity: 1, unitPrice: 850 },
    ],
    notes: 'Asante kwa kutembelea salon yetu. Karibu tena kwa huduma safi!',
  },
  {
    name: '🍲 Kibanda / Event Catering Quotation',
    type: 'quotation',
    customerName: 'Office Tech Hub (Dennis)',
    customerPhone: '0733555777',
    items: [
      { description: 'Buffet Lunch: Beef Pilau, Chapati & Steamed Cabbage (Per Pax)', quantity: 35, unitPrice: 350 },
      { description: 'Freshly Squeezed Passion Juice Dispenser (20 Litres)', quantity: 1, unitPrice: 3000 },
      { description: 'Disposable Plates, Spoons & Servietes Pack', quantity: 1, unitPrice: 800 },
    ],
    notes: '50% deposit inahitajika kabla ya siku ya tukio ili kuanza matayarisho. Salio litalipwa baada ya chakula kufika.',
  },
  {
    name: '🏪 Duka Wholesale & Household Goods',
    type: 'receipt',
    customerName: 'Mama Brayo',
    customerPhone: '0799112233',
    items: [
      { description: 'Unga wa Dola Pembe 2kg (Bundle ya marobota 12)', quantity: 2, unitPrice: 1950 },
      { description: 'Salit Cooking Oil 5 Litre Jerrican', quantity: 2, unitPrice: 1280 },
      { description: 'Menengai Soap Bar 800g Carton', quantity: 1, unitPrice: 850 },
    ],
    notes: 'Bidhaa zikishatoka dukani hazirudishwi isipokuwa zikiwa na hitilafu siku hiyo hiyo.',
  },
];

export const InvoiceMaker: React.FC<InvoiceMakerProps> = ({ profile }) => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'invoice',
    customerName: 'Grace Muthoni',
    customerPhone: '0720 000 111',
    items: [
      { id: '1', description: 'Designer Cotton Hoodie (Grade A)', quantity: 2, unitPrice: 1800 },
      { id: '2', description: 'Boda Delivery within Nairobi CBD', quantity: 1, unitPrice: 200 },
    ],
    discountType: 'fixed',
    discountValue: 0,
    vatRate: 0,
    notes: 'Malipo yote yafanyike kupitia Till namba yetu kabla ya delivery. Asante kwa ushirikiano.',
  });

  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const totals = calculateInvoiceTotals(
    invoice.items,
    invoice.discountType,
    invoice.discountValue,
    invoice.vatRate
  );

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    });
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    setInvoice({
      ...invoice,
      items: invoice.items.filter((item) => item.id !== id),
    });
  };

  const applyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setInvoice({
      ...invoice,
      type: preset.type,
      customerName: preset.customerName,
      customerPhone: preset.customerPhone,
      items: preset.items.map((it, idx) => ({
        id: `${Date.now()}-${idx}`,
        ...it,
      })),
      notes: preset.notes,
    });
  };

  // Generate WhatsApp-friendly text format
  const getWhatsAppSummary = () => {
    const title = invoice.type === 'quotation' ? 'QUOTATION / MAKADIRIO' : invoice.type === 'receipt' ? 'RECEIPT / RISITI' : 'INVOICE / ANKARA';
    let text = `🧾 *${title}: ${profile.businessName || 'KenyaHub Merchant'}*\n`;
    text += `📅 *Tarehe:* ${invoice.date}\n`;
    text += `🔢 *No:* #${invoice.invoiceNumber}\n`;
    text += `👤 *Mteja:* ${invoice.customerName} (${invoice.customerPhone})\n`;
    text += `--------------------------------\n`;
    invoice.items.forEach((item, index) => {
      text += `${index + 1}. *${item.description || 'Bidhaa'}*\n`;
      text += `   ${item.quantity} x ${formatKSh(item.unitPrice)} = *${formatKSh(item.quantity * item.unitPrice)}*\n`;
    });
    text += `--------------------------------\n`;
    text += `💰 *Subtotal:* ${formatKSh(totals.subtotal)}\n`;
    if (totals.discountAmount > 0) {
      text += `🏷️ *Punguzo (Discount):* -${formatKSh(totals.discountAmount)}\n`;
    }
    if (totals.taxAmount > 0) {
      text += `🏛️ *VAT (16%):* +${formatKSh(totals.taxAmount)}\n`;
    }
    text += `✅ *JUMLA KUU (TOTAL):* *${formatKSh(totals.grandTotal)}*\n\n`;

    text += `💳 *JINSI YA KULIPA (M-PESA):*\n`;
    if (profile.paymentType === 'till') {
      text += `👉 *Lipa na M-Pesa -> Buy Goods & Services*\n`;
      text += `📌 *Till Number:* *${profile.mpesaNumber || 'Haikuwekwa'}*\n`;
      text += `📌 *Jina la Till:* ${profile.businessName}\n`;
    } else if (profile.paymentType === 'paybill') {
      text += `👉 *Lipa na M-Pesa -> Paybill*\n`;
      text += `📌 *Business Number:* *${profile.mpesaNumber || 'Haikuwekwa'}*\n`;
      text += `📌 *Account No:* *${profile.accountNumber || invoice.customerName}*\n`;
    } else {
      text += `👉 *Send Money M-Pesa:*\n`;
      text += `📌 *Namba:* *${profile.mpesaNumber || profile.phone || '07XXXXXXXX'}*\n`;
    }

    if (invoice.notes) {
      text += `\n📝 *Maelezo:* ${invoice.notes}\n`;
    }
    text += `\n_Asante sana kwa kufanya biashara nasi!_ 🙏🇰🇪`;

    return text;
  };

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(getWhatsAppSummary());
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePolishTermsWithAi = async () => {
    setIsAiPolishing(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'customer_message',
          tone: 'swahili',
          context: {
            scenario: 'Polite invoice payment terms and conditions for Kenyan clients',
            businessName: profile.businessName,
            customerName: invoice.customerName,
            amount: totals.grandTotal.toString(),
            mpesaDetails: profile.mpesaNumber,
          },
        }),
      });
      const data = await res.json();
      if (data.content) {
        // Extract a clean 2-sentence summary
        const lines = data.content.split('\n').filter((l: string) => l.trim().length > 10);
        if (lines.length > 0) {
          setInvoice(prev => ({
            ...prev,
            notes: lines[0].replace(/[*_#]/g, ''),
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiPolishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Presets */}
      <div className="no-print bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">Smart Invoice & Quotation Maker</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Create professional, M-Pesa ready invoices or quotations and copy straight to WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* View Toggle */}
            <div className="flex bg-stone-900 rounded-xl p-1 border border-stone-700 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'editor' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                Hariri (Editor)
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'preview' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                Hakiki (Preview)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets for Kenyan Hustles */}
        <div className="pt-3">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
            Mifano ya Haraka (Load Kenyan Samples):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_TEMPLATES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="whitespace-nowrap px-3 py-1.5 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-emerald-300 rounded-lg text-xs font-medium transition-colors shrink-0"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (hidden when preview on small screen if toggled) */}
        <div className={`no-print lg:col-span-6 space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
            {/* Document Type Selector */}
            <div className="flex items-center justify-between gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
              {(['invoice', 'quotation', 'receipt'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInvoice({ ...invoice, type })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                    invoice.type === type
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {type === 'invoice' ? 'Invoice' : type === 'quotation' ? 'Quotation' : 'Receipt'}
                </button>
              ))}
            </div>

            {/* Doc Meta */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Doc Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Date</label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Jina la Mteja (Customer)</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={invoice.customerName}
                    onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
                    placeholder="Mteja Name"
                    className="w-full bg-stone-900 border border-stone-750 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Simu ya Mteja (Phone)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={invoice.customerPhone}
                    onChange={(e) => setInvoice({ ...invoice, customerPhone: e.target.value })}
                    placeholder="07XX XXX XXX"
                    className="w-full bg-stone-900 border border-stone-750 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                  Bidhaa / Huduma (Items)
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Weka Item
                </button>
              </div>

              <div className="space-y-2">
                {invoice.items.map((item, index) => (
                  <div key={item.id} className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-stone-500 font-bold">#{index + 1}</span>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Maelezo ya bidhaa au huduma"
                        className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={invoice.items.length <= 1}
                        className="text-stone-500 hover:text-red-400 p-1.5 disabled:opacity-30"
                        aria-label={`Ondoa item ${index + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <label className="text-[10px] text-stone-400 block">Idadi (Qty)</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="text-[10px] text-stone-400 block">Bei (KSh)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white text-right"
                        />
                      </div>
                      <div className="col-span-4 text-right">
                        <label className="text-[10px] text-stone-400 block">Jumla</label>
                        <span className="text-xs font-bold text-emerald-400">
                          {formatKSh(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount & Tax Section */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                <label className="text-[10px] text-stone-400 block mb-1">Punguzo (Discount KSh)</label>
                <input
                  type="number"
                  min="0"
                  value={invoice.discountValue}
                  onChange={(e) => setInvoice({ ...invoice, discountValue: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-white"
                />
              </div>

              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                <label className="text-[10px] text-stone-400 block mb-1">VAT Tax (Optional)</label>
                <select
                  value={invoice.vatRate}
                  onChange={(e) => setInvoice({ ...invoice, vatRate: parseInt(e.target.value) || 0 })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value={0}>0% (Bila VAT)</option>
                  <option value={16}>16% Standard VAT</option>
                </select>
              </div>
            </div>

            {/* Payment & Terms Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-stone-300">
                  Sheria na Masharti ya Malipo (Terms)
                </label>
                <button
                  type="button"
                  onClick={handlePolishTermsWithAi}
                  disabled={isAiPolishing}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  {isAiPolishing ? 'Inarekebisha...' : 'AI Polish Terms'}
                </button>
              </div>
              <textarea
                rows={2}
                value={invoice.notes}
                onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                className="w-full bg-stone-900 border border-stone-750 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Fidelity Printable / WhatsApp Document Card */}
        <div className={`lg:col-span-6 space-y-4 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          {/* Quick Action Buttons */}
          <div className="no-print flex items-center justify-between gap-2 bg-stone-850 p-3 rounded-2xl border border-stone-800 shadow-md">
            <button
              onClick={handleCopyWhatsApp}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                copiedWhatsApp
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              }`}
            >
              {copiedWhatsApp ? (
                <>
                  <Check className="w-4 h-4" /> Imenakiliwa kwa WhatsApp!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Nakili kwa WhatsApp
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2 px-4 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white rounded-xl text-xs font-bold border border-stone-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print / PDF</span>
            </button>
          </div>

          {/* Actual Rendered Document (A4/Receipt Style) */}
          <div className="print-card bg-white text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-sm">
            {/* Header: Business & Document Badge */}
            <div className="flex justify-between items-start border-b border-stone-200 pb-5">
              <div>
                <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
                  {profile.businessName || 'KenyaHub Merchant'}
                </h3>
                {profile.tagline && (
                  <p className="text-xs text-stone-500 italic mt-0.5">{profile.tagline}</p>
                )}
                <div className="mt-2 text-xs text-stone-600 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold">Location:</span> {profile.location || 'Nairobi, Kenya'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold">Phone:</span> {profile.phone || '0712 345 678'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase px-3 py-1 rounded-md tracking-wider border border-emerald-300">
                  {invoice.type === 'quotation' ? 'Makadirio (Quotation)' : invoice.type === 'receipt' ? 'Risiti Rasmi (Receipt)' : 'Ankara (Invoice)'}
                </span>
                <p className="text-sm font-mono font-bold text-stone-800 mt-2">
                  #{invoice.invoiceNumber}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Tarehe: <span className="font-medium text-stone-700">{invoice.date}</span>
                </p>
                {invoice.type === 'invoice' && (
                  <p className="text-xs text-stone-500">
                    Mwisho wa kulipa: <span className="font-medium text-stone-700">{invoice.dueDate}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bill To */}
            <div className="py-4 border-b border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Mteja (Billed To):
              </span>
              <p className="font-bold text-stone-900 text-sm">{invoice.customerName || 'Mteja Wetu'}</p>
              {invoice.customerPhone && (
                <p className="text-xs text-stone-600">Simu: {invoice.customerPhone}</p>
              )}
            </div>

            {/* Table of items */}
            <div className="py-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-stone-800 text-stone-700 font-bold uppercase tracking-wider">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center w-12">Qty</th>
                    <th className="py-2 text-right w-24">Bei</th>
                    <th className="py-2 text-right w-24">Jumla</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-2.5 font-medium text-stone-800">
                        {item.description || 'Huduma / Bidhaa'}
                      </td>
                      <td className="py-2.5 text-center text-stone-600">{item.quantity}</td>
                      <td className="py-2.5 text-right text-stone-600">{formatKSh(item.unitPrice)}</td>
                      <td className="py-2.5 text-right font-bold text-stone-900">
                        {formatKSh(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary calculation breakdown */}
            <div className="border-t-2 border-stone-200 pt-3 flex justify-end">
              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-800">{formatKSh(totals.subtotal)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount (Punguzo):</span>
                    <span className="font-semibold">-{formatKSh(totals.discountAmount)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>VAT (16%):</span>
                    <span className="font-semibold text-stone-800">+{formatKSh(totals.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-stone-300 pt-2 text-sm font-extrabold text-stone-900">
                  <span>JUMLA KUU:</span>
                  <span className="text-emerald-700 text-base">{formatKSh(totals.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions (M-Pesa Box) */}
            <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                Maelekezo ya Malipo (Lipa na M-Pesa)
              </h4>
              <div className="text-xs text-emerald-950 space-y-1">
                {profile.paymentType === 'till' && (
                  <>
                    <p className="font-semibold">
                      Lipa na M-Pesa ➔ Buy Goods and Services:
                    </p>
                    <p className="font-mono text-sm font-bold text-emerald-800">
                      Till Number: {profile.mpesaNumber || 'Haikuwekwa'}
                    </p>
                    <p className="text-[11px] text-emerald-800">Jina: {profile.businessName}</p>
                  </>
                )}
                {profile.paymentType === 'paybill' && (
                  <>
                    <p className="font-semibold">Lipa na M-Pesa ➔ Paybill:</p>
                    <p className="font-mono text-sm font-bold text-emerald-800">
                      Business No: {profile.mpesaNumber || 'Haikuwekwa'}
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      Account No: {profile.accountNumber || invoice.customerName}
                    </p>
                  </>
                )}
                {profile.paymentType === 'send_money' && (
                  <>
                    <p className="font-semibold">M-Pesa Send Money:</p>
                    <p className="font-mono text-sm font-bold text-emerald-800">
                      Namba: {profile.mpesaNumber || profile.phone || '07XXXXXXXX'}
                    </p>
                    <p className="text-[11px] text-emerald-800">Jina: {profile.businessName}</p>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Ilani: </span>
                {invoice.notes}
              </div>
            )}

            <div className="mt-6 text-center text-[11px] text-stone-400">
              Powered by KenyaHub Business Studio 🇰🇪 • Thank you for your business!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
