# 📚 Lexify Backend (NestJS)

Lexify is a word learning application that makes language learning fun. This repository contains the **NestJS-based backend API** that serves the mobile application.

---

## 🚀 Purpose

To develop a secure and scalable backend that provides users with:

- Registration and login
- Word addition and management
- Word translation updates
- Word list viewing
- Word search and filtering
- English to Turkish translation
- Text extraction from PDF files
- Book creation from PDFs

---

## 🛠 Technology Stack

| Technology        | Description                   |
| ----------------- | ----------------------------- |
| NestJS            | Backend application framework |
| PostgreSQL        | Main database                 |
| TypeORM           | ORM (Database interaction)    |
| JWT               | Authentication                |
| Docker            | Development environment       |
| Swagger           | API documentation             |
| Class Validator   | Data validation               |
| Class Transformer | DTO transformations           |
| LibreTranslate    | Translation service           |
| Cache Manager     | Cache management              |
| PDF-Parse         | PDF processing                |
| Multer            | File upload                   |

---

## 📁 Project Structure

```
lexify-backend/
├── src/
│   ├── auth/           # Authentication operations
│   ├── user/           # User management
│   ├── word/           # Word operations
│   ├── translation/    # Translation operations
│   ├── book/           # Book operations
│   │   ├── dto/        # Book DTOs
│   │   └── entities/   # Book entities
│   ├── file/           # File operations
│   ├── common/         # Shared code
│   │   ├── enum/       # Enum definitions
│   │   ├── filters/    # Exception filters
│   │   ├── guards/     # Auth guards
│   │   ├── interceptors/# Interceptors
│   │   └── types/      # Type definitions
│   ├── app.module.ts   # Main module
│   └── main.ts         # Application entry point
├── test/               # Test files
├── uploads/           # Uploaded files
├── docker-compose.yml  # Docker configuration
├── .env               # Environment variables
└── README.md          # Project documentation
```

---

## 🔧 Installation

### 1. Requirements

- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional)
- LibreTranslate (optional)

### 2. Clone the repository

```bash
git clone https://github.com/your-username/lexify-backend.git
cd lexify-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create `.env` file and set the following variables:

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

### 5. Create database

```bash
# Create database in PostgreSQL
createdb lexify
```

### 6. Start the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 7. Run with Docker (optional)

```bash
docker-compose up -d
```

---

## 📚 API Documentation

Access Swagger documentation after starting the application:

```
http://localhost:3000/api
```

### API Endpoints

#### User Operations

- `POST /users` - Create new user (Admin)
- `GET /users` - List all users (Admin)
- `GET /users/:id` - View user details (User/Admin)
- `PUT /users/:id` - Update user information (User/Admin)
- `DELETE /users/:id` - Delete user (Admin)

#### Word Operations

- `POST /words` - Add new word
- `GET /words` - List user's words
- `PUT /words/:id` - Update word
- `DELETE /words/:id` - Delete word

#### Translation Operations

- `POST /translation/translate` - Translate text
- `POST /translation/save-word` - Save translated word

#### File Operations

- `POST /files/upload/pdf` - Upload PDF file and extract text

#### Book Operations

- `POST /books/upload/pdf` - Create book from PDF
- `POST /books` - Create new book
- `GET /books` - List user's books
- `GET /books/:id` - View book details
- `DELETE /books/:id` - Delete book

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🚀 Future Development Plans

### Mobile Application

- [ ] React Native mobile app development
- [ ] Offline mode support
- [ ] Push notifications
- [ ] Mobile-specific optimizations
- [ ] Deep linking support

### AI Integration

- [ ] OpenAI integration for advanced translations
- [ ] AI-powered word suggestions
- [ ] Smart review system
- [ ] Personalized learning paths
- [ ] Speech recognition for pronunciation

### Enhanced Features

- [ ] Spaced repetition system
- [ ] Gamification elements
- [ ] Social features (friends, leaderboards)
- [ ] Multiple language support
- [ ] Advanced statistics and progress tracking

### Performance & Security

- [ ] Rate limiting
- [ ] Advanced caching strategies
- [ ] WebSocket support for real-time features
- [ ] Enhanced security measures
- [ ] Performance optimizations

### Infrastructure

- [ ] CI/CD pipeline setup
- [ ] Automated testing
- [ ] Monitoring and logging
- [ ] Scalability improvements
- [ ] Cloud deployment

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
