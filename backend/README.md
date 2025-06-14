# 📚 Lexify Backend (NestJS)

Lexify, dil öğrenmeyi eğlenceli hale getiren bir kelime öğrenme uygulamasıdır. Bu repo, mobil uygulamaya hizmet eden **NestJS tabanlı backend API**'sini içerir.

---

## 🚀 Amaç

Kullanıcılara:

- Kayıt ve giriş
- Kelime ekleme ve yönetme
- Kelime çevirilerini güncelleme
- Kelime listelerini görüntüleme
- Kelime arama ve filtreleme
- İngilizce'den Türkçe'ye çeviri yapma
- PDF dosyalarından metin çıkarma
- PDF'lerden kitap oluşturma
  gibi işlemleri sunan güvenli ve ölçeklenebilir bir backend geliştirmek.

---

## 🛠 Teknoloji Yığını

| Teknoloji         | Açıklama                    |
| ----------------- | --------------------------- |
| NestJS            | Backend uygulama çatısı     |
| PostgreSQL        | Ana veritabanı              |
| TypeORM           | ORM (Veritabanı etkileşimi) |
| JWT               | Kimlik doğrulama            |
| Docker            | Geliştirme ortamı           |
| Swagger           | API dokümantasyonu          |
| Class Validator   | Veri doğrulama              |
| Class Transformer | DTO dönüşümleri             |
| LibreTranslate    | Çeviri servisi              |
| Cache Manager     | Önbellek yönetimi           |
| PDF-Parse         | PDF işleme                  |
| Multer            | Dosya yükleme               |

---

## 📁 Proje Yapısı

```
lexify-backend/
├── src/
│   ├── auth/           # Kimlik doğrulama işlemleri
│   ├── user/           # Kullanıcı yönetimi
│   ├── word/           # Kelime işlemleri
│   ├── translation/    # Çeviri işlemleri
│   ├── book/           # Kitap işlemleri
│   │   ├── dto/        # Kitap DTO'ları
│   │   └── entities/   # Kitap entity'leri
│   ├── file/           # Dosya işlemleri
│   ├── common/         # Ortak kullanılan kodlar
│   │   ├── enum/       # Enum tanımlamaları
│   │   ├── filters/    # Exception filtreleri
│   │   ├── guards/     # Auth guard'ları
│   │   ├── interceptors/# Interceptor'lar
│   │   └── types/      # Tip tanımlamaları
│   ├── app.module.ts   # Ana modül
│   └── main.ts         # Uygulama giriş noktası
├── test/               # Test dosyaları
├── uploads/           # Yüklenen dosyalar
├── docker-compose.yml  # Docker yapılandırması
├── .env               # Ortam değişkenleri
└── README.md          # Proje dokümantasyonu
```

---

## 🔧 Kurulum

### 1. Gereksinimler

- Node.js (v16 veya üzeri)
- PostgreSQL
- Docker (opsiyonel)
- LibreTranslate (opsiyonel)

### 2. Repoyu klonla

```bash
git clone https://github.com/your-username/lexify-backend.git
cd lexify-backend
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

# LibreTranslate
LIBRETRANSLATE_API_URL=http://localhost:5000

# App
PORT=3000
NODE_ENV=development
```

### 5. Veritabanını oluştur

```bash
# PostgreSQL'de veritabanını oluştur
createdb lexify
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

### API Endpoints

#### Kullanıcı İşlemleri

- `POST /users` - Yeni kullanıcı oluşturma (Admin)
- `GET /users` - Tüm kullanıcıları listeleme (Admin)
- `GET /users/:id` - Kullanıcı detaylarını görüntüleme (Kullanıcı/Admin)
- `PUT /users/:id` - Kullanıcı bilgilerini güncelleme (Kullanıcı/Admin)
- `DELETE /users/:id` - Kullanıcı silme (Admin)

#### Kelime İşlemleri

- `POST /words` - Yeni kelime ekleme
- `GET /words` - Kullanıcının kelimelerini listeleme
- `PUT /words/:id` - Kelime güncelleme
- `DELETE /words/:id` - Kelime silme

#### Çeviri İşlemleri

- `POST /translation/translate` - Metin çevirisi yapma
- `POST /translation/save-word` - Çevirilen kelimeyi kaydetme

#### Dosya İşlemleri

- `POST /files/upload/pdf` - PDF dosyası yükleme ve metin çıkarma

#### Kitap İşlemleri

- `POST /books/upload/pdf` - PDF'den kitap oluşturma
- `POST /books` - Yeni kitap oluşturma
- `GET /books` - Kullanıcının kitaplarını listeleme
- `GET /books/:id` - Kitap detaylarını görüntüleme
- `DELETE /books/:id` - Kitap silme

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
