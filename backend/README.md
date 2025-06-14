# 📚 Lexify Backend (NestJS)

Lexify, dil öğrenmeyi eğlenceli hale getiren bir kelime öğrenme uygulamasıdır. Bu repo, mobil uygulamaya hizmet eden **NestJS tabanlı backend API**'sini içerir.

---

## 🚀 Amaç

Kullanıcılara:

- Kayıt ve giriş
- Kelime ekleme ve yönetme
- Kelime tanımlarını güncelleme
- Kelime listelerini görüntüleme
- Kelime arama ve filtreleme
- Çoklu kullanıcı kelime paylaşımı
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

---

## 📁 Proje Yapısı

```
lexify-backend/
├── src/
│   ├── auth/           # Kimlik doğrulama işlemleri
│   ├── user/           # Kullanıcı yönetimi
│   ├── word/           # Kelime işlemleri
│   ├── common/         # Ortak kullanılan kodlar
│   │   ├── enum/       # Enum tanımlamaları
│   │   ├── filters/    # Exception filtreleri
│   │   ├── guards/     # Auth guard'ları
│   │   ├── interceptors/# Interceptor'lar
│   │   ├── types/      # Tip tanımlamaları
│   │   └── dto/        # Ortak DTO'lar
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
- Docker (opsiyonel)

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

- `POST /words/:userId` - Kullanıcıya kelime ekleme
- `GET /words/:userId` - Kullanıcının kelimelerini listeleme
- `PUT /words/:wordId/definition` - Kelime tanımını güncelleme
- `DELETE /words/:userId/:wordId` - Kelimeyi kullanıcının listesinden çıkarma

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
