import { GCPServiceTopology, GCPIaCTemplate } from '../types';

export const GCP_ABDI_SERVICES: GCPServiceTopology[] = [
  {
    id: 'cloud-run',
    name: 'Google Cloud Run',
    category: 'Compute & Serverless',
    status: 'OPERATIONAL',
    description: 'Serverless container platform otomatis untuk backend Node.js Express + frontend Vite React ABDI dengan auto-scale 0-1000 kontainer.',
    gcpResourceName: 'projects/abdi-cloud/locations/asia-east1/services/abdi-islamicity-service',
    islamicityFunction: 'Menjalankan seluruh aplikasi web 4B Kaffah, API endpoint, kalkulator zakat, dan proxy aman Gemini AI.',
    specSummary: '2 vCPU, 2GiB RAM, Concurrency: 80 req/instance, Min-instances: 1 (zero cold-start saat adzan)',
    latencyOrMetric: '18 ms avg response time',
    recommendedRegion: 'asia-southeast2 (Jakarta) / asia-east1 (Taiwan)',
    finOpsSavingTip: 'Manfaatkan 2 juta request gratis/bulan dari Cloud Run Free Tier; scale to zero saat larut malam.'
  },
  {
    id: 'vertex-gemini',
    name: 'Vertex AI & Gemini 3.8 Flash',
    category: 'AI & Intelligence',
    status: 'CONFIGURED',
    description: 'Model multimodal canggih generasi terbaru dari Google DeepMind untuk inferensi berkecepatan tinggi dan pemahaman syariah mendalam.',
    gcpResourceName: 'publishers/google/models/gemini-3.8-flash',
    islamicityFunction: 'Kecerdasan buatan untuk Tanya Ustadz AI, Audit Kontrak Syariah, dan Pemindai Kamera Produk Halal (Vision AI).',
    specSummary: 'Multimodal (Text, Image, Video, Audio), 1M Context Window, Output token speed ~150 tps',
    latencyOrMetric: '0.8s time-to-first-token',
    recommendedRegion: 'asia-east1 / us-central1',
    finOpsSavingTip: 'Gunakan temperature rendah (0.2-0.3) dan format JSON responseMimeType untuk mengurangi token tak perlu.'
  },
  {
    id: 'cloud-firestore',
    name: 'Google Cloud Firestore',
    category: 'Storage & Database',
    status: 'CONNECTED',
    description: 'Database NoSQL serverless dengan kemampuan sinkronisasi real-time instan dan dukungan offline-first.',
    gcpResourceName: 'projects/abdi-cloud/databases/(default)',
    islamicityFunction: 'Menyimpan papan informasi masjid digital, log jadwal sholat, agenda kajian live, dan riwayat infaq jamaah.',
    specSummary: 'Multi-Region High Availability, Sub-10ms latency, ACID transactions, Realtime listeners',
    latencyOrMetric: '99.999% SLA Uptime',
    recommendedRegion: 'asia-southeast2 (Jakarta)',
    finOpsSavingTip: 'Gunakan indexing komposit yang tepat dan batasi query limit untuk menghemat biaya read/write.'
  },
  {
    id: 'cloud-sql-postgres',
    name: 'Cloud SQL for PostgreSQL',
    category: 'Storage & Database',
    status: 'OPTIMAL',
    description: 'Managed relational database dengan jaminan kepatuhan ACID penuh untuk pencatatan buku besar keuangan syariah terpercaya.',
    gcpResourceName: 'projects/abdi-cloud/instances/abdi-syariah-ledger',
    islamicityFunction: 'Buku kas digital masjid, audit penyaluran Zakat, dana Wakaf produktif, dan portofolio Syirkah modal UMKM.',
    specSummary: 'PostgreSQL 16, High Availability (Dual-zone failover), Automated Daily Backups, CMEK Encryption',
    latencyOrMetric: '4.2 ms query latency',
    recommendedRegion: 'asia-southeast2 (Jakarta)',
    finOpsSavingTip: 'Gunakan instance db-f1-micro untuk tahap pengembangan awal dan aktifkan auto-storage increase.'
  },
  {
    id: 'cloud-storage',
    name: 'Google Cloud Storage (GCS)',
    category: 'Storage & Database',
    status: 'ACTIVE',
    description: 'Penyimpanan objek awan dengan durabilitas 99.999999999% (11 nines) untuk aset media dakwah berskala nasional.',
    gcpResourceName: 'gs://abdi-dakwah-media-prod',
    islamicityFunction: 'Hosting audio murottal 30 Juz Al-Qur\'an, rekaman kajian video ulama, berkas sertifikat halal UMKM, dan e-book syariah.',
    specSummary: 'Standard Multi-Region Bucket, CDN Cache-Control enabled, Object Lifecycle Management',
    latencyOrMetric: '12ms TTFB via Google Global Cache',
    recommendedRegion: 'asia (Multi-region Asia)',
    finOpsSavingTip: 'Terapkan Lifecycle Rule: arsipkan audio kajian lama ke Nearline/Coldline setelah 90 hari untuk hemat 50% biaya.'
  },
  {
    id: 'cloud-scheduler',
    name: 'Google Cloud Scheduler',
    category: 'Events & Messaging',
    status: 'ACTIVE',
    description: 'Layanan cron job terkelola enterprise untuk penjadwalan presisi waktu sholat dan sinkronisasi astronomi falak.',
    gcpResourceName: 'projects/abdi-cloud/locations/asia-southeast2/jobs/abdi-adhan-cron-job',
    islamicityFunction: 'Memicu notifikasi adzan 5 waktu harian (Subuh, Dzuhur, Ashar, Maghrib, Isya), pengingat Imsak, dan tahajjud jamaah.',
    specSummary: 'Cron expression: */1 * * * * (Evaluasi presisi tiap menit dengan toleransi jitter milidetik)',
    latencyOrMetric: '100% On-time execution',
    recommendedRegion: 'asia-southeast2 (Jakarta)',
    finOpsSavingTip: '3 cron jobs pertama per akun Google Cloud gratis selamanya.'
  },
  {
    id: 'cloud-pubsub',
    name: 'Google Cloud Pub/Sub',
    category: 'Events & Messaging',
    status: 'OPERATIONAL',
    description: 'Sistem pengiriman pesan terdistribusi global yang sangat cepat untuk event-driven architecture ABDI.',
    gcpResourceName: 'projects/abdi-cloud/topics/abdi-prayer-events',
    islamicityFunction: 'Mendistribusikan broadcast adzan serentak ke ribuan perangkat masjid, notifikasi siaga ambulans, dan siaran langsung kajian.',
    specSummary: 'At-least-once delivery, Push/Pull subscriptions, Encrypted in transit & at rest',
    latencyOrMetric: '< 25 ms publish-to-subscriber latency',
    recommendedRegion: 'Global Multi-Region',
    finOpsSavingTip: '10 GB data message per bulan gratis di GCP Free Tier.'
  },
  {
    id: 'cloud-armor',
    name: 'Google Cloud Armor & CDN',
    category: 'Security & IAM',
    status: 'OPERATIONAL',
    description: 'Web Application Firewall (WAF) dan pertahanan DDoS berbasis infrastruktur global Google untuk proteksi portal ibadah.',
    gcpResourceName: 'projects/abdi-cloud/global/securityPolicies/abdi-waf-security-policy',
    islamicityFunction: 'Mencegah serangan DDoS, SQL Injection, dan bot spam saat lonjakan donasi infaq di malam Lailatul Qadar & Hari Raya.',
    specSummary: 'L3/L4/L7 DDoS Defense, OWASP Top 10 Core Rule Set, Geolocation IP Filtering, Rate Limiting',
    latencyOrMetric: '0 overhead latency',
    recommendedRegion: 'Global Edge Anycast',
    finOpsSavingTip: 'Gunakan aturan rate-limiting per IP (contoh: maks 100 req/menit) untuk menepis bot liar tanpa biaya komputasi server.'
  },
  {
    id: 'secret-manager',
    name: 'Google Secret Manager',
    category: 'Security & IAM',
    status: 'CONFIGURED',
    description: 'Penyimpanan terpusat terenkripsi untuk kunci rahasia (API Keys, Token OAuth, Kredensial Database) dengan audit trail audit Syariah.',
    gcpResourceName: 'projects/abdi-cloud/secrets/abdi-gemini-api-key',
    islamicityFunction: 'Menyimpan kunci GEMINI_API_KEY, salt hashing password takmir, dan kredensial gerbang pembayaran zakat.',
    specSummary: 'AES-256 Automatic Encryption, Cloud IAM Access Control, Versioning & Audit Logging',
    latencyOrMetric: '< 10 ms secret retrieval',
    recommendedRegion: 'Global Automatic Replication',
    finOpsSavingTip: '6 secret versions aktif gratis per bulan di Google Cloud.'
  },
  {
    id: 'cloud-build',
    name: 'Google Cloud Build & Artifact Registry',
    category: 'DevOps & Monitoring',
    status: 'OPERATIONAL',
    description: 'Pipeline CI/CD serverless otomatis untuk kompilasi kode, linting, unit testing, pembentukan kontainer Docker, dan deployment ke Cloud Run.',
    gcpResourceName: 'projects/abdi-cloud/triggers/abdi-auto-deploy-trigger',
    islamicityFunction: 'Memastikan setiap pembaruan fitur dakwah, perbaikan fiqih, atau pembaruan direktori UMKM teruji dan terdeploy otomatis tanpa henti.',
    specSummary: 'Zero-downtime rolling deployment, Kaniko layer caching, Vulnerability scan, Signed provenance',
    latencyOrMetric: '1.5 menit total pipeline build & deploy time',
    recommendedRegion: 'asia-east1 / asia-southeast2',
    finOpsSavingTip: '120 menit waktu build gratis setiap hari per tagihan akun GCP.'
  }
];

export const GCP_IAC_TEMPLATES: GCPIaCTemplate[] = [
  {
    id: 'terraform-main',
    title: 'Terraform Blueprint ABDI Kaffah (main.tf)',
    category: 'terraform',
    filename: 'main.tf',
    description: 'Deklarasi infrastruktur lengkap: Cloud Run service, Secret Manager, Cloud Storage bucket media dakwah, dan Firestore database.',
    code: `# ==============================================================================
# ABDI (Aplikasi Berjamaah Dakwah Islamicity Kaffah) - Google Cloud Platform IaC
# Arsitektur Serverless Islami Berkelanjutan & Berdaya Tinggi
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region # asia-southeast2 (Jakarta) atau asia-east1
}

# 1. Cloud Run Service untuk ABDI Kaffah Web & Backend API
resource "google_cloud_run_v2_service" "abdi_service" {
  name     = "abdi-islamicity-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 1 # Menghilangkan cold-start saat waktu adzan
      max_instance_count = 100 # Skalabilitas elastis saat sholat jumat / idul fitri
    }

    containers {
      image = "asia-docker.pkg.dev/\${var.project_id}/abdi-repo/app:latest"
      
      resources {
        limits = {
          cpu    = "2000m"
          memory = "2048Mi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_key.secret_id
            version = "latest"
          }
        }
      }

      ports {
        container_port = 3000
      }

      startup_probe {
        http_get {
          path = "/api/health"
          port = 3000
        }
        period_seconds   = 10
        failure_threshold = 3
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Memberikan akses publik aman ke aplikasi ABDI
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = google_cloud_run_v2_service.abdi_service.project
  location = google_cloud_run_v2_service.abdi_service.location
  name     = google_cloud_run_v2_service.abdi_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# 2. Secret Manager untuk Kunci Gemini AI
resource "google_secret_manager_secret" "gemini_key" {
  secret_id = "abdi-gemini-api-key"
  replication {
    auto {}
  }
}

# 3. Cloud Storage Bucket untuk Media Dakwah & Audio Murottal 30 Juz
resource "google_storage_bucket" "abdi_media_bucket" {
  name          = "\${var.project_id}-dakwah-media"
  location      = "ASIA"
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
    condition {
      age = 90
    }
  }
}

# 4. Cloud Pub/Sub Topic untuk Event Siaran Adzan & Notifikasi Masjid
resource "google_pubsub_topic" "prayer_events" {
  name = "abdi-prayer-events"
  message_storage_policy {
    allowed_persistence_regions = [var.region]
  }
}
`
  },
  {
    id: 'cloudbuild-pipeline',
    title: 'Cloud Build CI/CD Pipeline (cloudbuild.yaml)',
    category: 'cloudbuild',
    filename: 'cloudbuild.yaml',
    description: 'Pipeline build otomatis: instalasi dependency, type-checking linting, build image kontainer, dan deploy ke Cloud Run.',
    code: `# ==============================================================================
# Google Cloud Build Pipeline - ABDI Islamicity Kaffah
# Standar Zero-Downtime Rolling Deployment & Keamanan Syariah
# ==============================================================================

steps:
  # Langkah 1: Install dependency & Validasi TypeScript Linter
  - name: 'node:20-alpine'
    entrypoint: 'npm'
    args: ['ci']
    id: 'install-deps'

  - name: 'node:20-alpine'
    entrypoint: 'npm'
    args: ['run', 'lint']
    id: 'lint-and-typecheck'
    waitFor: ['install-deps']

  # Langkah 2: Build Aplikasi Web & Backend Bundler
  - name: 'node:20-alpine'
    entrypoint: 'npm'
    args: ['run', 'build']
    id: 'build-production-bundle'
    waitFor: ['lint-and-typecheck']

  # Langkah 3: Build Kontainer Docker dengan Google Kaniko (Fast Layer Cache)
  - name: 'gcr.io/kaniko-project/executor:latest'
    args:
      - '--destination=asia-docker.pkg.dev/$PROJECT_ID/abdi-repo/app:$COMMIT_SHA'
      - '--destination=asia-docker.pkg.dev/$PROJECT_ID/abdi-repo/app:latest'
      - '--cache=true'
      - '--cache-ttl=168h'
    id: 'kaniko-build-push'
    waitFor: ['build-production-bundle']

  # Langkah 4: Deploy Otomatis ke Google Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'abdi-islamicity-service'
      - '--image=asia-docker.pkg.dev/$PROJECT_ID/abdi-repo/app:$COMMIT_SHA'
      - '--region=asia-southeast2'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--set-env-vars=NODE_ENV=production'
      - '--set-secrets=GEMINI_API_KEY=abdi-gemini-api-key:latest'
    id: 'deploy-to-cloud-run'
    waitFor: ['kaniko-build-push']

images:
  - 'asia-docker.pkg.dev/$PROJECT_ID/abdi-repo/app:$COMMIT_SHA'
  - 'asia-docker.pkg.dev/$PROJECT_ID/abdi-repo/app:latest'

timeout: '900s'
options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_4'
`
  },
  {
    id: 'dockerfile-multistage',
    title: 'Multi-Stage Production Dockerfile (Dockerfile)',
    category: 'docker',
    filename: 'Dockerfile',
    description: 'Dockerfile multi-stage ultra-ringan dengan Alpine Linux, non-root user keamanan syariah, dan healthcheck Cloud Run.',
    code: `# ==============================================================================
# Dockerfile Multi-Stage Teroptimasi untuk Google Cloud Run
# Efisien, Cepat, Bebas Vulnerability, & Hemat Emisi Karbon
# ==============================================================================

# STAGE 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# STAGE 2: Runner Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Menjalankan aplikasi dengan user non-root demi keamanan
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 abdiuser

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.ts ./server.ts

USER abdiuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
`
  },
  {
    id: 'gcloud-runbook',
    title: 'gcloud CLI One-Click Deploy Runbook (deploy.sh)',
    category: 'gcloud',
    filename: 'deploy.sh',
    description: 'Skrip terminal Bash satu langkah untuk inisialisasi GCP, mengaktifkan API, menyimpan secret Gemini, dan deploy instan.',
    code: `#!/usr/bin/env bash
# ==============================================================================
# One-Click Deployment Script ke Google Cloud Run untuk ABDI Kaffah
# ==============================================================================
set -e

PROJECT_ID="abdi-islamicity-kaffah"
REGION="asia-southeast2" # Jakarta Region (Low-latency & Low-Carbon)
SERVICE_NAME="abdi-islamicity-service"

echo "🌟 Menginisialisasi Google Cloud Platform untuk ABDI Kaffah..."
gcloud config set project $PROJECT_ID

echo "📦 Mengaktifkan API Google Cloud yang Diperlukan..."
gcloud services enable \\
  run.googleapis.com \\
  artifactregistry.googleapis.com \\
  cloudbuild.googleapis.com \\
  secretmanager.googleapis.com \\
  firestore.googleapis.com \\
  aiplatform.googleapis.com \\
  storage.googleapis.com

echo "🔑 Memastikan Secret Gemini API Key Terdaftar di Secret Manager..."
if ! gcloud secrets describe abdi-gemini-api-key &>/dev/null; then
  echo -n "$GEMINI_API_KEY" | gcloud secrets create abdi-gemini-api-key --data-file=-
  echo "✅ Secret abdi-gemini-api-key berhasil dibuat."
fi

echo "🚀 Melakukan Build & Deploy ke Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \\
  --source . \\
  --region $REGION \\
  --platform managed \\
  --allow-unauthenticated \\
  --port 3000 \\
  --memory 2Gi \\
  --cpu 2 \\
  --min-instances 1 \\
  --max-instances 50 \\
  --set-env-vars NODE_ENV=production \\
  --set-secrets GEMINI_API_KEY=abdi-gemini-api-key:latest

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')
echo "🎉 ABDI Kaffah Berhasil Mengudara di Google Cloud Platform!"
echo "🌐 URL Layanan: $SERVICE_URL"
`
  },
  {
    id: 'iam-matrix',
    title: 'Matriks Hak Akses Syariah IAM (iam-policy.json)',
    category: 'iam',
    filename: 'iam-policy.json',
    description: 'Kebijakan IAM Least-Privilege untuk memisahkan wewenang Takmir Masjid, Tim Pengembang, dan Layanan Cloud Run.',
    code: `{
  "bindings": [
    {
      "role": "roles/run.admin",
      "members": [
        "serviceAccount:abdi-deployer@abdi-cloud.iam.gserviceaccount.com"
      ]
    },
    {
      "role": "roles/secretmanager.secretAccessor",
      "members": [
        "serviceAccount:abdi-cloudrun-sa@abdi-cloud.iam.gserviceaccount.com"
      ]
    },
    {
      "role": "roles/datastore.user",
      "members": [
        "serviceAccount:abdi-cloudrun-sa@abdi-cloud.iam.gserviceaccount.com"
      ]
    },
    {
      "role": "roles/storage.objectViewer",
      "members": [
        "allUsers"
      ]
    }
  ]
}
`
  }
];

export const GCP_FINOPS_ESTIMATES = [
  {
    scaleTier: 'Komunitas / 10 Masjid Pertama',
    monthlyJamaah: '5,000 - 25,000 Jamaah',
    estimatedCost: 'GRATIS (Rp 0 / bln)',
    description: '100% tercakup dalam GCP Free Tier (Cloud Run 2M requests, Firestore 1GB, Cloud Storage 5GB free).',
    recommendation: 'Sangat cocok untuk pilot project masjid percontohan dan pengurus DKM setempat.',
    carbonRating: '100% Zero-Net (Zero Carbon)',
    activeServices: ['Cloud Run (Scale to Zero)', 'Firestore Spark Tier', 'Gemini Flash API (Tier Gratis)']
  },
  {
    scaleTier: 'Kota / 100 Masjid Terintegrasi',
    monthlyJamaah: '50,000 - 300,000 Jamaah',
    estimatedCost: 'Rp 150.000 - Rp 350.000 / bln',
    description: 'Sangat ekonomis. Biaya hanya untuk compute Cloud Run saat peak sholat jumat dan storage media kajian.',
    recommendation: 'Aktifkan min-instances=1 saat waktu sholat (04.00-05.30 dan 11.30-13.00) agar bebas jeda cold-start.',
    carbonRating: 'A+ Rendah Karbon (asia-southeast2)',
    activeServices: ['Cloud Run (Min-Instance 1)', 'Firestore Blaze', 'Cloud Storage 50GB', 'Cloud Pub/Sub']
  },
  {
    scaleTier: 'Provinsi / 1.000 Masjid & UMKM',
    monthlyJamaah: '500,000 - 2,500,000 Jamaah',
    estimatedCost: 'Rp 1.200.000 - Rp 2.800.000 / bln',
    description: 'Menggunakan Cloud SQL PostgreSQL tereplikasi dan Cloud Armor WAF untuk proteksi ribuan transaksi infaq per detik.',
    recommendation: 'Gunakan 1-Year Committed Use Discount (CUD) untuk Cloud SQL dan Cloud Run guna hemat 37% biaya.',
    carbonRating: 'A+ Efisien (Google Match 100% Renewable)',
    activeServices: ['Cloud Run Autoscaling', 'Cloud SQL HA', 'Cloud Armor WAF', 'Cloud CDN', 'Cloud Tasks']
  },
  {
    scaleTier: 'Nasional / 50.000 Masjid Se-Indonesia',
    monthlyJamaah: '10,000,000+ Jamaah Aktif',
    estimatedCost: 'Rp 12.500.000 - Rp 24.000.000 / bln',
    description: 'Infrastruktur berskala nasional kaffah dengan multi-region redundancy (Jakarta & Taiwan) siap menampung lonjakan Idul Fitri.',
    recommendation: 'Terapkan Multi-Region Anycast Cloud Load Balancing dan Memorystore Redis Cluster untuk caching jadwal sholat global.',
    carbonRating: 'Enterprise Eco-Green Cloud',
    activeServices: ['Global Cloud Load Balancer', 'Cloud Spanner / Cloud SQL', 'Cloud Armor Premium', 'Vertex AI Dedicated']
  }
];

export const GCP_DEVELOPER_PROMPTS = [
  {
    title: 'Arsitektur Skalabilitas 10 Juta Jamaah saat Sholat Idul Fitri',
    topic: 'Arsitektur & Skalabilitas',
    question: 'Bagaimana arsitektur Cloud Run, Memorystore Redis, dan Cloud CDN terbaik untuk menahan lonjakan 10 juta jamaah serentak saat malam takbiran dan pagi sholat Idul Fitri tanpa downtime?'
  },
  {
    title: 'Enkripsi & Tata Kelola Syariah Buku Besar Infaq & Zakat (CMEK)',
    topic: 'Keamanan & Kepatuhan Syariah',
    question: 'Bagaimana cara mengamankan data transaksi zakat, infaq, dan data pribadi muzakki/mustahik di Cloud SQL menggunakan Cloud KMS (Customer-Managed Encryption Keys) berstandar syariah?'
  },
  {
    title: 'FinOps Islami: Menekan Biaya GCP hingga Mendekati Rp 0',
    topic: 'Optimasi Biaya (FinOps)',
    question: 'Berikan strategi FinOps Islami (anti-tabdzir) untuk mengoptimalkan resource GCP agar aplikasi ABDI tetap berjalan efisien dengan memanfaatkan GCP Free Tier dan serverless scaling.'
  },
  {
    title: 'Sinkronisasi Presisi Jadwal Sholat BMKG dengan Cloud Scheduler',
    topic: 'DevOps & Terraform CI/CD',
    question: 'Buatkan panduan dan arsitektur integrasi Cloud Scheduler, Cloud Pub/Sub, dan Cloud Run untuk sinkronisasi waktu adzan 5 waktu secara otomatis dan presisi di seluruh zona waktu Indonesia (WIB, WITA, WIT).'
  },
  {
    title: 'Optimasi Latensi Gemini 3.8 Flash untuk Scanner Kamera Halal',
    topic: 'AI & Intelligence',
    question: 'Bagaimana konfigurasi Cloud Run dan Vertex AI terbaik agar pemrosesan gambar kemasan produk di fitur Pemindai Kamera Halal memiliki latensi sub-detik (< 1 detik)?'
  },
  {
    title: 'Pencegahan DDoS & Bot Spam Infaq dengan Cloud Armor WAF',
    topic: 'Keamanan & Kepatuhan Syariah',
    question: 'Bagaimana cara menyusun Security Policy di Cloud Armor untuk mencegah carding, spamming pada form infaq, dan serangan Layer 7 DDoS pada portal masjid ABDI?'
  }
];
