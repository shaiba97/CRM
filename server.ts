import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shared Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Automated Lead Scoring Endpoint
  app.post("/api/ai/lead-score", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const customerData = req.body;

      if (!ai) {
        // Fallback intelligent lead scoring logic if no API key
        const baseScore = Math.min(
          100,
          (customerData.totalSpent || 0) / 10 +
            (customerData.emailOpens || 0) * 12 +
            (customerData.orderCount || 0) * 20 +
            (customerData.measurementTaken ? 25 : 0)
        );
        const score = Math.round(baseScore);
        const intent = score >= 75 ? "HOT" : score >= 40 ? "WARM" : "COLD";
        return res.json({
          score,
          intent,
          conversionProbability: `${Math.min(98, score + 10)}%`,
          keyFactors: [
            customerData.measurementTaken ? "Body measurements on file" : "No measurements yet",
            `${customerData.emailOpens || 0} emails opened in last 30 days`,
            `Historical spend: ${customerData.totalSpent || 0} SDG`,
          ],
          recommendedAction:
            score >= 75
              ? "Send personalized fitting appointment invite via WhatsApp"
              : "Send seasonal Italian wool fabric collection showcase",
          summaryArabic:
            score >= 75
              ? "عميل محتمل عالي الأهمية - لديه قياسات مسجلة وتفاعل مرتفع مع البريد الإلكتروني"
              : "عميل محتمل متوسط - يحتاج لمتابعة بعروض الأقمشة الجديدة",
        });
      }

      const prompt = `Analyze this CRM customer lead for a high-end Tailoring & Fabric shop ("Moussa Tailoring & CRM").
Customer Details:
- Name: ${customerData.name || "N/A"}
- Total Spent: ${customerData.totalSpent || 0} SDG
- Orders Count: ${customerData.orderCount || 0}
- Email Opens: ${customerData.emailOpens || 0}
- Email Clicks: ${customerData.emailClicks || 0}
- Measurements Profile Recorded: ${customerData.measurementTaken ? "Yes" : "No"}
- Preferred Fabric Category: ${customerData.preferredFabric || "Italian Wool"}
- Last Interaction: ${customerData.lastInteraction || "Recently"}
- Days Since Last Response: ${customerData.daysInactive || 2}

Calculate an automated lead score (0 to 100), categorize as HOT / WARM / COLD, identify top 3 key factors, recommend actionable next steps for the sales/tailoring team, and provide a 1-sentence Arabic executive summary.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              intent: { type: Type.STRING, description: "HOT, WARM, or COLD" },
              conversionProbability: { type: Type.STRING },
              keyFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedAction: { type: Type.STRING },
              summaryArabic: { type: Type.STRING },
            },
            required: ["score", "intent", "conversionProbability", "keyFactors", "recommendedAction", "summaryArabic"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (err: any) {
      console.error("Lead scoring error:", err);
      res.status(500).json({ error: err?.message || "Failed to score lead" });
    }
  });

  // AI Personalized Email & WhatsApp Message Drafter Endpoint
  app.post("/api/ai/draft-message", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const { customerName, messageType, garmentType, orderStatus, fabricType, language } = req.body;

      if (!ai) {
        const lang = language === "en" ? "en" : "ar";
        if (messageType === "FITTING_REMINDER") {
          return res.json({
            subject: lang === "ar" ? `تذكير بموعد القياس/التجربة - الخياطة الرفيعة` : `Fitting Appointment Reminder - Tailoring`,
            body: lang === "ar"
              ? `عزيزنا ${customerName}، يسعدنا إعلامك بأن ثوبك (${garmentType || "التفصيل"}) جاهز لجلسة قياس وقص متقنة. ننتظر زيارتك في الفرع.`
              : `Dear ${customerName}, your custom ${garmentType || "garment"} is ready for your fitting session. We look forward to seeing you at our shop.`,
          });
        }
        return res.json({
          subject: lang === "ar" ? `عرض خاص لأحدث تشكيلة أقمشة إيطالية` : `Exclusive New Fabric Collection Showcase`,
          body: lang === "ar"
            ? `مرحباً ${customerName}، وصلت لدينا تشكيلة حصرية من أقمشة ${fabricType || "الصوف الإيطالي"}. يسعدنا استقبالك لاختيار نمطك المفضل.`
            : `Hello ${customerName}, a new premium batch of ${fabricType || "Italian Wool"} fabrics has arrived. Visit us to customize your next suit or thobe.`,
        });
      }

      const isArabic = language !== "en";
      const prompt = `You are an AI sales assistant for "Moussa Tailoring & Fabric Shop". Draft a professional, elegant ${messageType} message for customer "${customerName}".
Details:
- Garment: ${garmentType || "Thobe / Suit"}
- Order Status: ${orderStatus || "In Production"}
- Fabric: ${fabricType || "Premium Italian Silk/Wool"}
- Language: ${isArabic ? "Arabic (العربية)" : "English"}

Generate both subject line (for email) and body (suitable for both email and WhatsApp).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ["subject", "body"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (err: any) {
      console.error("Draft message error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate message" });
    }
  });

  // AI Fabric & Style Recommendation Endpoint
  app.post("/api/ai/fabric-recommendation", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const { customerRequirements, budget, occasion } = req.body;

      if (!ai) {
        return res.json({
          recommendations: [
            {
              fabricName: "Super 150s Italian Wool (صوف إيطالي فاخر)",
              reason: "مثالي للمناسبات الرسمية، ملمس ناعم ومقاوم للتجعد",
              suggestedGarment: "ثوب رسمي / بدلة فاخرة",
              matchingRollCode: "FAB-IT-102",
            },
            {
              fabricName: "Japanese Cotton Silk Blend (قطن ياباني حريري)",
              reason: "مريح ومناسب للاستخدام اليومي والطقس الحار",
              suggestedGarment: "ثوب يومي خفيف",
              matchingRollCode: "FAB-JP-405",
            },
          ],
        });
      }

      const prompt = `Recommend 2-3 tailored fabric rolls and design styles for a customer inquiring with:
- Requirements: ${customerRequirements || "Formal thobe/suit"}
- Budget Range: ${budget || "Medium to Premium"}
- Occasion: ${occasion || "Wedding / Business"}

Provide response in JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fabricName: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    suggestedGarment: { type: Type.STRING },
                    matchingRollCode: { type: Type.STRING },
                  },
                  required: ["fabricName", "reason", "suggestedGarment", "matchingRollCode"],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (err: any) {
      console.error("Fabric recommendation error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate recommendation" });
    }
  });

  // Vite middleware for dev or static server in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
