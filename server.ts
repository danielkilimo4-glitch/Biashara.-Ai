import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ROLE_INSTRUCTIONS: Record<string, string> = {
  biashara_advisor: `You are 'Jirani Biashara Advisor', an experienced Kenyan business mentor specialized in informal and micro-enterprises (MSMEs). 
You understand the realities of Kenyan trade: cash flow constraints, stock turnover, M-Pesa till balances, supplier credit, rent in commercial stalls or CBD bazaars, and customer bargaining culture.
Tone: Warm, encouraging, pragmatic, street-smart Kenyan professional. Freely integrate authentic Kenyan business terms (e.g. mzigo, biashara, dukani, bei ya kuokota, chap chap, M-Pesa, boda delivery, kutoa lock).
Provide practical, step-by-step guidance. Always express prices and costs in Kenyan Shillings (KSh).`,

  digital_marketer: `You are 'Wasee Digital Marketer', a creative social media sales genius for Kenyan online businesses.
You specialize in WhatsApp Status updates, Instagram reels/posts, and TikTok selling hooks that convert Kenyan shoppers into paying customers.
You write catchy copy that balances English, Kiswahili, and authentic Sheng (e.g., 'Kitu safi', 'Wasee mko wapi?', 'Bei ya jioni', 'Drip safi', 'DM for delivery').
Always include clear Calls to Action (CTAs) directing people to WhatsApp / Lipa na M-Pesa.`,

  financial_strategist: `You are 'Hesabu Pro', a Kenyan financial accountant and pricing strategist for small businesses.
You specialize in unit economics, calculating true costs (including packaging, boda delivery, and Safaricom M-Pesa withdrawal/Till transaction fee deductions), markup percentages, and debt collection without losing customers.
Give exact math in KSh. Point out hidden leakages like unrecorded credit (daftari la madeni) and underpricing.`,
};

// API: Multi-turn Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, role = 'biashara_advisor', speed = 'general', highThinking = false } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    let model = 'gemini-3.8-flash';
    let thinkingConfig: { thinkingLevel: ThinkingLevel } | undefined = undefined;

    if (highThinking || speed === 'deep_thinking') {
      // Per instructions: use gemini-4-argon with thinkingLevel: ThinkingLevel.HIGH and do NOT set maxOutputTokens
      model = 'gemini-4-argon';
      thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    } else if (speed === 'fast') {
      model = 'gemini-3.1-flash-lite';
    } else {
      model = 'gemini-3.8-flash';
    }

    const systemInstruction = ROLE_INSTRUCTIONS[role] || ROLE_INSTRUCTIONS.biashara_advisor;

    // Convert messages to Gemini format
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    if (!process.env.GEMINI_API_KEY) {
      // Local graceful fallback if key is unconfigured
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      return res.json({
        reply: `[KenyaHub Local Advisor] Karibu sana! Hapa kuna ushauri wa haraka kuhusu '${lastUserMsg.slice(0, 40)}...':\n\n1. Hakikisha bei yako inashughulikia gharama ya M-Pesa na transport (boda).\n2. Tumia WhatsApp Status na picha nzuri za mzigo kila asubuhi na jioni.\n3. Wape wateja wako invoice safi ili wakulipe haraka bila kuchelewa.\n\nJe, ungependa tuangalie bei ya bidhaa yako au tuandike advert ya leo?`,
        modelUsed: 'offline-preview',
        thinkingApplied: false,
      });
    }

    const config: {
      systemInstruction: string;
      thinkingConfig?: { thinkingLevel: ThinkingLevel };
    } = {
      systemInstruction,
    };

    if (thinkingConfig) {
      config.thinkingConfig = thinkingConfig;
    }

    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      const reply = response.text || 'Samahani, jaribu tena kiasi.';

      return res.json({
        reply,
        modelUsed: model,
        thinkingApplied: Boolean(thinkingConfig),
      });
    } catch (primaryError: any) {
      console.warn(`Model ${model} failed, attempting gemini-3.1-flash-lite fallback:`, primaryError.message);
      
      // Attempt fallback to fast model if primary model was overloaded (503 / 429)
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: { systemInstruction },
        });

        if (fallbackRes.text) {
          return res.json({
            reply: fallbackRes.text,
            modelUsed: 'gemini-3.1-flash-lite (fast-fallback)',
            thinkingApplied: false,
          });
        }
      } catch (fallbackError) {
        console.error('Fallback model also unavailable:', fallbackError);
      }

      // If upstream is unavailable or experiencing 503, deliver high-value contextual Kenyan advice
      const lastMsg = (messages[messages.length - 1]?.text || '').toLowerCase();
      let contextualAdvice = `Karibu sana! Kulingana na swali lako:

1. **Gharama na Mtaji:** Anza na mtaji mdogo ili kupunguza risk. Weka angalau 30% ya mtaji kama akiba ya dharura ya mzigo.
2. **Kupata Wateja:** Tumia WhatsApp Status na picha safi kila siku saa 12 asubuhi na saa 1 jioni wakati watu wako safarini.
3. **Malipo Safi:** Wape wateja wako invoice yenye namba ya Till ili kuepuka madeni yasiyo na kumbukumbu.

Je, ungependa tuhesabu gharama ya mzigo huo kwenye Profit Calculator au tutengeneze tangazo lake kwenye Marketing Studio?`;

      if (lastMsg.includes('10,000') || lastMsg.includes('mtaji')) {
        contextualAdvice = `💡 **Ushauri wa Mtaji wa KSh 10,000 Nairobi:**

1. **Fast-Moving Mitumba (Camera / Grade 1):** Nenda Gikomba asubuhi mapema (saa kumi na mbili). Nunua jeans 10 au sneakers 4-5 za ubora wa juu. Uza kupitia Instagram na WhatsApp Status.
2. **Kibanda / Smokie Pasua & Boiled Eggs:** Nunua trolley ndogo na stock ya mayai na smokie za Farmer's Choice. Eneo zuri karibu na stage ya matatu linaweza kukupa KSh 800 - KSh 1,500 faida kwa siku.
3. **Simu na Tech Accessories:** Vifaa vidogo kama ring lights, charging cables, na screen protectors kutoka Eastleigh au Luthuli Ave vina faida ya zaidi ya 40%.

Hakikisha hauingii gharama ya rent ya stall kubwa mwanzoni—tumia delivery ya boda kwanza!`;
      } else if (lastMsg.includes('deni') || lastMsg.includes('madeni')) {
        contextualAdvice = `🤝 **Mbinu za Kudai Deni Bila Kupoteza Mteja:**

1. **Tumia Ujumbe wa Kikazi (Sio Matusi):** Mtumie ujumbe mzuri kupitia tab ya 'Customer Messages' hapa kwenye KenyaHub.
2. **Toa Chaguo la Kulipa Kidogo Kidogo:** Mpe nafasi ya kulipa nusu sasa kupitia M-Pesa Till na nusu mwisho wa mwezi.
3. **Weka Sheria ya Baadaye:** Kuanzia leo, usitoe mzigo mpya bila deposit ya angalau 50%. "Kukopa harusi, kulipa matanga"—linda cashflow yako!`;
      }

      return res.json({
        reply: contextualAdvice,
        modelUsed: 'kenyahub-advisor-smart',
        thinkingApplied: false,
      });
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate chat response. Please try again.',
      reply: 'Pole sana, hitilafu imetokea. Unaweza kutumia vifaa vya hesabu na invoice papo hapo wakati huu.',
    });
  }
});

// API: Content Generation (Adverts, Customer Messages, Document Polish)
app.post('/api/generate', async (req, res) => {
  try {
    const { type, prompt, context = {}, tone = 'sheng', platform = 'whatsapp' } = req.body;

    let systemInstruction = `You are an expert copywriter and business assistant for Kenyan small businesses. 
You write highly engaging, locally relevant, conversion-focused content in ${tone} blending Kenyan cultural nuances, KSh currency, and Lipa na M-Pesa details.`;

    let userPrompt = prompt;

    if (type === 'advert') {
      userPrompt = `Generate 3 high-converting promotional adverts for a Kenyan business.
Product: ${context.productName || 'Bidhaa'}
Price: ${context.price ? `KSh ${context.price}` : 'Bei nafuu'}
Key Selling Points: ${context.sellingPoint || 'Ubora wa hali ya juu, delivery available'}
Call to action: ${context.callToAction || 'Order via WhatsApp / Call'}
Platform: ${platform}
Tone: ${tone} (Options: authentic Kenyan Sheng, warm Kiswahili, clean English, or clearance urgency 'bei ya jioni').

Format output with:
Option 1: Punchy Hook + Emojis (Perfect for WhatsApp Status / SMS)
Option 2: Story & Value Offer (For Instagram / Facebook)
Option 3: Quick Viral Script / TikTok Audio Pitch

Make sure it includes Kenyan touches like M-Pesa, County delivery (CBD pickup, Boda), and urgency.`;
    } else if (type === 'customer_message') {
      userPrompt = `Write 2 polite, effective Kenyan customer service message templates in ${tone} for:
Scenario: ${context.scenario || 'Payment reminder'}
Customer Name: ${context.customerName || 'Mteja'}
Amount: ${context.amount ? `KSh ${context.amount}` : ''}
Business Name: ${context.businessName || 'Biashara Yetu'}
M-Pesa details: ${context.mpesaDetails || 'Till / Send Money'}

Keep it respectful yet firm (avoid burning bridges while securing payment or customer loyalty).`;
    } else if (type === 'product_description') {
      userPrompt = `Write an irresistible e-commerce product description for Kenyan online sellers (WhatsApp catalogue / Instagram).
Product: ${context.productName}
Key features: ${context.features || context.sellingPoint}
Price: ${context.price ? `KSh ${context.price}` : ''}
Include:
- 1 Attention-grabbing title
- 3 Bullet points of benefits
- Sizing/Specifications reminder
- How to pay (Lipa na M-Pesa) & Delivery terms (CBD pickup / Countrywide via courier/boda).`;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Local intelligent template fallback
      return res.json({
        content: `🔥 *HOT DEAL YA LEO!* 🔥\n\n${context.productName || 'Bidhaa Yetu'} inapatikana kwa offer maalum!\n💰 *Bei:* KSh ${context.price || 'Nafuu sana'}\n✨ *Ubora:* ${context.sellingPoint || 'Original quality, durable & fresh'}\n\n📍 Free CBD Delivery / Boda popote Nairobi & parcel mashinani.\n📲 *Order sasa kupitia WhatsApp / Call:* ${context.phone || '07XXXXXXXX'}\n💳 *Lipa na M-Pesa:* Till / Send Money Available\n\n_Wahi mzigo kabla stock haijaisha! Bei ya jioni!_ 🚀`,
        modelUsed: 'offline-preview',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });

    res.json({
      content: response.text,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Generate API Error:', error);
    res.status(500).json({
      error: error.message || 'Generation failed',
      content: '🔥 *OFFER YA LEO!* Bidhaa safi kwa bei nafuu ya KSh. Lipa na M-Pesa, delivery inafika popote.',
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KenyaHub Business Studio running on port ${port}`);
  });
}

startServer();
