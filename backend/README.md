# 📚 LexiSlate Backend (NestJS)

LexiSlate, dil öğrenmeyi eğlenceli hale getiren bir e-kitap uygulamasıdır. Bu repo, mobil uygulamaya hizmet eden **NestJS tabanlı backend API**'sini içerir.

---

## 🚀 Amaç

Kullanıcılara:

- Kayıt ve giriş
- Kitap listeleme ve içeriğe erişim
- Kelime çevirisi ve telaffuz
- Kelime kaydetme
- Ses dosyaları yönetimi
- Arama ve filtreleme
  gibi işlemleri sunan güvenli ve ölçeklenebilir bir backend geliştirmek.

---

## 🛠 Teknoloji Yığını

| Teknoloji         | Açıklama                    |
| ----------------- | --------------------------- |
| NestJS            | Backend uygulama çatısı     |
| PostgreSQL        | Ana veritabanı              |
| TypeORM           | ORM (Veritabanı etkileşimi) |
| Redis             | Çeviri ve içerik cacheleme  |
| JWT               | Kimlik doğrulama            |
| Docker            | Geliştirme ortamı           |
| Swagger           | API dokümantasyonu          |
| Class Validator   | Veri doğrulama              |
| Class Transformer | DTO dönüşümleri             |

---

## 📁 Proje Yapısı

```
lexislate-backend/
├── src/
│   ├── auth/           # Kimlik doğrulama işlemleri
│   ├── user/           # Kullanıcı yönetimi
│   ├── book/           # Kitap işlemleri
│   ├── word/           # Kelime işlemleri
│   ├── audio/          # Ses dosyası işlemleri
│   ├── search/         # Arama işlemleri
│   ├── file/           # Dosya yönetimi
│   ├── common/         # Ortak kullanılan kodlar
│   ├── app.module.ts   # Ana modül
│   └── main.ts         # Uygulama giriş noktası
├── test/               # Test dosyaları
├── docker-compose.yml  # Docker yapılandırması
├── .env               # Ortam değişkenleri
└── README.md          # Proje dokümantasyonu
```

---

## 🔧 Kurulum

### 1. Gereksinimler

- Node.js (v16 veya üzeri)
- PostgreSQL
- Redis
- Docker (opsiyonel)

### 2. Repoyu klonla

```bash
git clone https://github.com/your-username/lexislate-backend.git
cd lexislate-backend
```

### 3. Bağımlılıkları yükle

```bash
npm install
```

### 4. Ortam değişkenlerini ayarla

`.env` dosyasını oluştur ve aşağıdaki değişkenleri ayarla:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=lexify

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
PORT=3000
NODE_ENV=development
```

### 5. Veritabanını oluştur

```bash
# PostgreSQL'de veritabanını oluştur
createdb lexiify
```

### 6. Uygulamayı başlat

```bash
# Geliştirme modu
npm run start:dev

# Prodüksiyon modu
npm run build
npm run start:prod
```

### 7. Docker ile çalıştırma (opsiyonel)

```bash
docker-compose up -d
```

---

## 📚 API Dokümantasyonu

Uygulama başlatıldıktan sonra Swagger dokümantasyonuna erişmek için:

```
http://localhost:3000/api
```

---

## 🧪 Test

```bash
# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
