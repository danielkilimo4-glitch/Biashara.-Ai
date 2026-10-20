export type BusinessType = 
  | 'online_seller'
  | 'salon_barbershop'
  | 'food_kibanda'
  | 'retail_duka'
  | 'freelance_services'
  | 'boda_delivery';

export type LanguageMode = 'en' | 'sw' | 'sheng';

export interface BusinessProfile {
  businessName: string;
  tagline: string;
  phone: string;
  location: string;
  businessType: BusinessType;
  paymentType: 'till' | 'paybill' | 'send_money';
  mpesaNumber: string;
  accountNumber?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  type: 'invoice' | 'quotation' | 'receipt';
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  discountType: 'fixed' | 'percent';
  discountValue: number;
  vatRate: number;
  notes: string;
}

export interface AdGenerationInput {
  productName: string;
  price: string;
  sellingPoint: string;
  callToAction: string;
  platform: 'whatsapp' | 'instagram' | 'tiktok' | 'sms';
  tone: 'sheng' | 'swahili' | 'english' | 'urgent_clearance' | 'executive';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  thinkingMode?: boolean;
}

export type AdvisorRole = 'biashara_advisor' | 'digital_marketer' | 'financial_strategist';

export interface PilotRecord {
  id: string;
  businessName: string;
  businessType: string;
  contactPerson: string;
  phone: string;
  sampleGiven: string;
  feedback: string;
  willingToPayKsh: number;
  status: 'contacted' | 'sample_sent' | 'tried_tool' | 'paid_customer' | 'rejected';
  dateAdded: string;
}
