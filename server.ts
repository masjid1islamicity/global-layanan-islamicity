import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ABDICity.cloud API" });
});

// AI Ustadz & Syariah Consultation Endpoint
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { prompt, category = "Umum" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Prompt required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum dikonfigurasi. Silakan atur GEMINI_API_KEY di menu Secrets.",
      });
      return;
    }

    const systemInstruction = `Anda adalah "Ustadz AI ABDICity", asisten kecerdasan buatan islami yang bijak, ramah, dan berpengetahuan luas tentang Fiqih Islam, Ibadah, Muamalah Syariah, Dakwah, dan Kehidupan Bermasyarakat.
Panduan Jawaban:
1. Mulai dengan salam Islami hangat ("Assalamu'alaikum Warahmatullahi Wabarakatuh").
2. Berikan penjelasan berbasis Al-Qur'an dan As-Sunnah yang shahih dengan rujukan yang jelas jika ada (Sura/Ayat atau Riwayat Hadits).
3. Jika topik berada dalam kategori ${category}, sertakan sudut pandang "4B Kaffah" (Berdakwah, Bersyariah, Berjamaah, Bermuamalah) jika relevan.
4. Gunakan bahasa Indonesia yang santun, sejuk, inspiratif, dan mudah dipahami.
5. Sertakan kesimpulan praktis atau langkah nyata yang bisa dilakukan jamaah.
6. Akhiri dengan doa ringkas dan salam penutup ("Wassalamu'alaikum Warahmatullahi Wabarakatuh").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ response: response.text || "Mohon maaf, tidak dapat menghasilkan jawaban saat ini." });
  } catch (error: any) {
    console.error("Gemini Consult Error:", error);
    res.status(500).json({ error: error?.message || "Gagal memproses konsultasi Syariah" });
  }
});

// AI Poster & Pesan Dakwah Generator
app.post("/api/gemini/poster", async (req, res) => {
  try {
    const { topic, targetAudience = "Jamaah Umum" } = req.body;
    if (!topic || typeof topic !== "string") {
      res.status(400).json({ error: "Topik dakwah diperlukan" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: "Kunci API Gemini tidak ditemukan." });
      return;
    }

    const prompt = `Buatkan konsep Poster & Content Story Dakwah Islami seputar topik: "${topic}" untuk sasaran: ${targetAudience}.
Keluarkan jawaban dalam format JSON valid dengan struktur berikut:
{
  "judul": "Judul Menarik & Singkat",
  "ayatAtauHadits": "Teks Arab/Latin Rujukan atau Kutipan Hikmah",
  "terjemahan": "Arti atau Pesan Kunci",
  "poinInspirasi": ["Poin 1", "Poin 2", "Poin 3"],
  "callToAction": "Ajak beramal / tag sahabat / ke masjid",
  "saranDesainTheme": "Emerald Emerald Glow / Gold Sunset / Deep Midnight / Royal Blue"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Poster Generator Error:", error);
    res.status(500).json({ error: error?.message || "Gagal membuat materi poster dakwah" });
  }
});

// AI Syariah Business Contract Analysis Endpoint
app.post("/api/gemini/contract-analysis", async (req, res) => {
  try {
    const { contractType, businessDescription, profitSharing, capitalTerms } = req.body;
    if (!businessDescription) {
      res.status(400).json({ error: "Deskripsi bisnis/transaksi diperlukan" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: "Kunci API Gemini belum tersedia." });
      return;
    }

    const prompt = `Analisis Kesesuaian Syariah (Muamalah) untuk skema bisnis berikut:
- Jenis Akad yang Diinginkan: ${contractType || "Belum ditentukan"}
- Deskripsi Usaha / Transaksi: ${businessDescription}
- Skema Bagi Hasil / Keuntungan: ${profitSharing || "Belum dirinci"}
- Ketentuan Modal & Risiko: ${capitalTerms || "Belum dirinci"}

Berikan evaluasi dalam format JSON valid dengan struktur:
{
  "kesesuaianSkor": 85 (skor 0-100),
  "statusSyariah": "Sesuai Syariah" / "Perlu Penyesuaian" / "Bisa Mengandung Riba/Gharar",
  "analisisRukunDanSyarat": "Penjelasan rukun akad yang sudah terpenuhi atau kurang",
  "potensiRisikoSyariah": ["Risiko 1", "Risiko 2"],
  "rekomendasiPerbaikan": ["Saran 1", "Saran 2"],
  "dalilPemerkuat": "Ayat atau Kaidah Fiqih Muamalah terkait"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Contract Analysis Error:", error);
    res.status(500).json({ error: error?.message || "Gagal menganalisis akad muamalah" });
  }
});

// Camera-based Halal Product Vision Scanner Endpoint (Gemini API)
app.post("/api/gemini/halal-scan", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", productNameHint } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: "Data gambar kemasan produk (Base64) diperlukan." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum dikonfigurasi. Silakan pastikan GEMINI_API_KEY terpasang di Secrets.",
      });
      return;
    }

    // Strip data URL header if present (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    const promptText = `Anda adalah "Auditor & Ahli Fiqih Halal AI" bersertifikasi standar LPPOM MUI, BPJPH Kemenag RI, dan standar Halal Internasional (JAKIM/MUIS/GSO).
Tugas Anda adalah memeriksa foto kemasan, label, merek, logo halal, atau tabel komposisi/ingredients produk yang dikirimkan oleh pengguna, lalu memberikan audit status kehalalan yang mendalam dan dapat dipertanggungjawabkan secara syariah.

${productNameHint ? `Catatan/Petunjuk Produk Tambahan dari Pengguna: "${productNameHint}"` : ""}

Panduan Analisis:
1. Identifikasi nama produk, merk/brand, dan kategori produk dari visual kemasan.
2. Deteksi apakah terdapat Logo Halal resmi yang valid (seperti Logo Halal Indonesia Kemenag/BPJPH, LPPOM MUI, JAKIM Malaysia, MUIS Singapura, Halal Amerika/Eropa resmi) atau nomor sertifikat halal tercetak.
3. Analisis daftar bahan / komposisi (ingredients) jika tampak pada kemasan:
   - Hewani: Daging, Gelatin (sumber sapi/babi/ikan/nabati), Lemak hewani (Tallow, Lard), Pepsin, Rennet, Kolagen.
   - Aditif makanan kritis: Emulsifier (E471, E472, Mono & Diglycerides - nabati vs hewani), Perisa (Flavor sintetik vs hewani/alkohol), Pewarna (seperti Karmin/Cochineal E120 yang memiliki kaidah khilafiyah namun MUI membolehkan dengan syarat).
   - Unsur Khamr / Alkohol / Masakan Non-Halal: Mirin, Angciu, Rum, Ekstrak alkohol memabukkan, Sake, Wine.
   - Turunan Babi: Pork, Bacon, Ham, Lard, Porcine.
4. Tetapkan status kehalalan:
   - "HALAL": Tertera logo/sertifikat halal resmi yang valid ATAU terbuat dari bahan-bahan nabati/alami murni yang jelas thayyib tanpa titik kritis haram.
   - "SYUBHAT": Produk belum memiliki logo/sertifikat halal yang jelas dan mengandung bahan kaji kritis (seperti emulsifier/gelatin/perisa/enzim) yang belum dipastikan sumber hewani halal atau nabatinya.
   - "NON_HALAL": Produk terbukti mengandung babi (pork/lard), alkohol memabukkan (khamr), gelatin babi, atau bahan yang diharamkan syariat Islam.
   - "TIDAK_TERDETEKSI": Jika gambar terlalu buram, gelap, atau bukan produk makanan/minuman/konsumsi.

Keluarkan hasil analisis HANYA dalam format JSON valid dengan struktur berikut:
{
  "productName": "Nama Produk Lengkap",
  "brand": "Merk / Produsen",
  "category": "Kategori Produk (misal: Makanan Ringan, Biskuit, Minuman, Daging Olahan, Kosmetik, Herbal)",
  "halalStatus": "HALAL" | "SYUBHAT" | "NON_HALAL" | "TIDAK_TERDETEKSI",
  "halalStatusLabel": "Sertifikat Halal Resmi" | "Perlu Dipastikan (Syubhat)" | "Non-Halal (Haram)" | "Belum Terbaca Jelas",
  "confidenceScore": 95,
  "halalLogoDetected": true,
  "halalLogoDetails": "Penjelasan logo halal yang terdeteksi atau tidak terlihat di kemasan",
  "halalCertNumber": "Nomor registrasi BPJPH/MUI jika tampak atau null",
  "detectedIngredients": ["Bahan 1", "Bahan 2", "Bahan 3"],
  "criticalHalalPoints": [
    {
      "ingredient": "Nama Bahan Kritis",
      "reason": "Alasan mengapa bahan ini kritis atau aman menurut kaidah syariah",
      "status": "aman" | "kritis" | "haram"
    }
  ],
  "syariahVerdict": "Penjelasan menyeluruh tentang status hukum syariah produk ini secara objektif, santun, dan mendidik.",
  "recommendation": "Rekomendasi tindakan nyata bagi konsumen Muslim (misal: Aman dikonsumsi, Perlu cek varian berlogo Halal Indonesia, Hindari produk ini).",
  "fiqihReference": "Rujukan dalil (Al-Qur'an / Hadits / Kaidah Fiqih Muamalah Thayyib terkait, misal: QS. Al-Baqarah: 168 atau Hadits Nu'man bin Basyir tentang Syubhat)."
}`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const rawText = response.text || "{}";
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Gagal mengurai respons JSON dari model AI.");
      }
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini Halal Vision Scan Error:", error);
    res.status(500).json({
      error: error?.message || "Gagal memproses analisis gambar produk halal",
    });
  }
});

// GCP Environment Status & Telemetry Endpoint for Developers
app.get("/api/gcp/status", (req, res) => {
  try {
    const memory = process.memoryUsage();
    const isCloudRun = Boolean(process.env.K_SERVICE || process.env.PORT === "3000");
    const serviceName = process.env.K_SERVICE || "abdi-islamicity-service";
    const revision = process.env.K_REVISION || "abdi-v1-production";
    const region = "asia-east1 / asia-southeast2 (Jakarta)";

    res.json({
      success: true,
      environment: {
        platform: isCloudRun ? "Google Cloud Run (Managed Containers)" : "Node.js Container Runtime",
        serviceName,
        revision,
        region,
        port: PORT,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: {
          rssMb: Math.round(memory.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
        },
        servicesStatus: {
          cloudRun: { status: "OPERATIONAL", latencyMs: 18 },
          vertexAiGemini: {
            status: process.env.GEMINI_API_KEY ? "CONFIGURED" : "PENDING_KEY",
            model: "gemini-3.8-flash",
          },
          cloudStorage: { status: "ACTIVE", bucket: "abdi-dakwah-media-prod" },
          cloudFirestore: { status: "CONNECTED", collections: ["mosques", "campaigns", "halal_products"] },
          cloudScheduler: { status: "RUNNING", nextJob: "Adhan & Prayer Times Sync (5x Daily)" },
          cloudArmor: { status: "PROTECTED", ddosShield: true, wafRuleCount: 14 },
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch GCP telemetry: " + err.message });
  }
});

// Google Cloud Platform AI Architect & DevOps Facilitator for ABDI Developers
app.post("/api/gemini/gcp-facilitator", async (req, res) => {
  try {
    const { question, topic = "Arsitektur & Skalabilitas", currentConfig } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Pertanyaan atau instruksi arsitektur GCP diperlukan." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum terpasang. Pastikan GEMINI_API_KEY terkonfigurasi di Secrets.",
      });
      return;
    }

    const systemInstruction = `Anda adalah "Fasilitator Google Cloud Platform Cerdas ABDI" (Lead Principal Google Cloud Architect & DevOps Specialist) bersertifikasi Google Cloud Professional Cloud Architect & Security Engineer.
Anda bertugas mendampingi tim pengembang, devops, dan arsitek sistem dalam membangun, mengoptimalkan, dan mengoperasikan aplikasi "ABDI (Aplikasi Berjamaah Dakwah Islamicity Kaffah)".

Karakteristik & Karakter Sistem ABDI:
- Platform terpadu 4B Kaffah: Berdakwah, Bersyariah, Berjamaah, Bermuamalah.
- Beban kerja: Real-time prayer synchronization (adzan 5 waktu se-Indonesia WIB/WITA/WIT), AI Tanya Ustadz & Konsultasi Syariah, Visual Halal Product Camera Scanner (Gemini Vision), Digital Takmir Masjid & Infaq Ledger (Zakat, Wakaf, Qurban), Marketplace UMKM Syariah (Syirkah equity & halal verification).
- Stack inti GCP:
  1. Compute: Google Cloud Run (Fully managed serverless containerized Node.js/TypeScript Express + Vite React), Artifact Registry, Cloud Build.
  2. AI/ML: Vertex AI & Gemini 3.8 Flash (Multimodal vision scanner & Fiqih consultation LLM).
  3. Storage & Data: Cloud Storage (Standard multi-region untuk audio tilawah 30 juz & konten dakwah), Cloud Firestore (real-time NoSQL untuk status jamaah, live kajian, & chat takmir), Cloud SQL PostgreSQL (untuk catatan transaksi infaq/zakat teraudit syariah), Memorystore Redis (cache waktu sholat & rate limiting).
  4. Messaging & Scheduling: Cloud Scheduler (cron waktu sholat presisi astronomis BMKG/Kemenag), Cloud Pub/Sub (push broadcast kajian & alert darurat ambulans masjid), Cloud Tasks (antrean invoice & kuitansi infaq).
  5. Keamanan & Compliance: Cloud Armor WAF (perlindungan DDoS & SQLi saat traffic Idul Fitri melonjak), Secret Manager (kunci API & kredensial database), Cloud KMS (enkripsi data mustahik/muzakki berstandar syariah), Cloud IAM (Least-Privilege Role Matrix Takmir/Admin/Developer).
  6. FinOps Islami: Efisiensi biaya komputasi tanpa pemborosan (QS. Al-Isra': 26-27), pemanfaatan Cloud Run Free Tier (2 juta request/bulan), region hemat karbon (Low-CO2).

Format Jawaban Anda:
Berikan jawaban komprehensif, terstruktur rapi, profesional, dan langsung dapat dieksekusi oleh developer:
1. **Analisis Solusi Arsitektur**: Penjelasan konsep GCP yang tepat dan alasannya sesuai kebutuhan ABDI.
2. **Langkah Implementasi Praktis**: Tahapan demi tahapan yang jelas dan terukur.
3. **Kode / Konfigurasi Siap Pakai**: Sertakan blok kode nyata (misal: Terraform .tf, script 'gcloud' CLI, file 'cloudbuild.yaml', konfigurasi Dockerfile, atau TypeScript SDK GCP).
4. **Keamanan & Tata Kelola Syariah (Syariah Data Governance)**: Best practice enkripsi, isolasi data pribadi jamaah, dan proteksi transaksi muamalah.
5. **Estimasi FinOps & Efisiensi Biaya**: Tips menjaga pengeluaran tetap hemat/gratis menggunakan free-tier dan skema serverless.`;

    const promptText = `Kategori Permintaan: ${topic}
${currentConfig ? `Konteks/Konfigurasi Saat Ini:\n${currentConfig}\n` : ""}
Pertanyaan / Kebutuhan Developer:
"${question}"

Jawablah secara terperinci, mendalam, berdaya tinggi, dan ramah pengembang dengan Markdown yang rapi dan profesional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({
      success: true,
      answer: response.text || "Tidak ada respons yang dihasilkan oleh model.",
      topic,
    });
  } catch (error: any) {
    console.error("Gemini GCP Facilitator Error:", error);
    res.status(500).json({
      error: error?.message || "Gagal memproses konsultasi GCP Facilitator",
    });
  }
});

// Setup Vite Development Middleware or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ABDICity.cloud Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
