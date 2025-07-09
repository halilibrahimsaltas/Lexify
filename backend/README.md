# Lexify Backend (NestJS)

Lexify Backend is a modular, scalable RESTful API built with [NestJS](https://nestjs.com/) and PostgreSQL. It powers the Lexify mobile app, providing authentication, user/book/word management, translation, file uploads, and more.

---

## 📦 Features & Modules

- **Authentication:** JWT, local, and Google login; user roles (admin/user)
- **User Management:** Register, update, delete, profile, admin user listing
- **Book Management:** Upload (PDF/EPUB), metadata, per-user books, search, update, delete, content extraction, chapters/pages
- **Book Progress:** Track and update user's current page in each book
- **Word Favorites:** Save, list, and remove favorite words with translation and language info
- **Translation & Dictionary:** Fast word search, translation, and dictionary stats using a local dictionary file
- **File Uploads:** Handle PDF/image uploads and storage
- **Feedback:** Users can submit feedback; admins can list, update, or delete feedback
- **Global Validation & Exception Handling:** Consistent error responses and request validation
- **API Documentation:** Swagger UI at `/api`
- **CORS Enabled:** Secure frontend-backend communication

---

## 🗂️ Folder Structure

```
backend/
├── src/
│   ├── app.controller.ts      # Main controller
│   ├── app.module.ts          # Root module
│   ├── app.service.ts         # Main service
│   ├── main.ts                # Entry point
│   ├── auth/                  # Auth module (controllers, services, guards, strategies, decorators)
│   ├── user/                  # User module (controllers, services, entities, DTOs)
│   ├── book/                  # Book module (controllers, services, entities, DTOs)
│   ├── book-progress/         # Book progress tracking
│   ├── word/                  # Word/favorites module
│   ├── translation/           # Translation & dictionary
│   ├── dictionary/            # Dictionary endpoints
│   ├── file/                  # File upload module
│   ├── feedback/              # Feedback module
│   ├── common/                # Shared enums, filters, guards, interceptors, interfaces, types
│   ├── config/                # TypeORM and app config
│   └── uploads/               # Uploaded files (PDFs, images)
├── package.json
├── tsconfig.json
├── docker-compose.yml
├── Dockerfile
└── README.md (this file)
```

---

## ⚙️ Setup & Installation

### 1. Requirements

- Node.js (v16+ recommended)
- npm or yarn
- PostgreSQL (local or Docker)

### 2. Clone the Repository

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Variables

Create a `.env` file in the `backend/` directory. Example:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=lexify
JWT_SECRET=your_jwt_secret
```

You can also configure these in `src/config/typeorm.config.ts` or via Docker Compose.

### 5. Database Setup (PostgreSQL)

- Make sure PostgreSQL is running and a database named `lexify` exists.
- You can use Docker Compose for local development:

```bash
docker-compose up -d
```

This will start a PostgreSQL container and the backend service.

### 6. Run the Backend

#### Development

```bash
npm run start:dev
```

#### Production

```bash
npm run build
npm run start:prod
```

#### With Docker Compose

```bash
docker-compose up --build
```

---

## 📝 API Documentation

- After starting the backend, visit [http://localhost:3000/api](http://localhost:3000/api) for Swagger UI and full API docs.

---

## 🧩 Main Modules & Responsibilities

- **AuthModule:** Handles login, registration, JWT, Google auth, guards, and user roles
- **UserModule:** User CRUD, profile, admin listing
- **BookModule:** Book upload, metadata, content extraction, chapters/pages
- **BookProgressModule:** Tracks user's current page in each book
- **WordModule:** Favorite words, add/list/remove, translation info
- **TranslationModule:** Word translation and dictionary lookup
- **DictionaryModule:** Dictionary search and stats
- **FileModule:** File uploads (PDFs, images)
- **FeedbackModule:** User feedback management

---

## 🗄️ Entities & Data Model

- **User:** id, name, email, password, role, provider; relations: books, words, bookProgress
- **Book:** id, title, author, coverImage, filePath, category, userId; relations: user, pages, progress
- **Word:** id, originalText, translatedText, sourceLanguage, targetLanguage, type, category; relations: users
- **BookProgress:** Tracks current page per user per book

---

## 🔑 Example Endpoints

- `POST /auth/login` — User login
- `POST /auth/register` — Register new user
- `GET /users/:id` — Get user profile
- `POST /books/upload/pdf` — Upload a new book (PDF)
- `GET /books` — List user's books
- `GET /books/:id/content?page=1` — Get book content by page
- `POST /favorites` — Add a word to favorites
- `GET /dictionary/search?query=word` — Search dictionary
- `POST /feedback` — Submit feedback

---

## 🛠️ Useful Scripts

- `npm run start:dev` — Start in development mode (hot reload)
- `npm run build` — Build for production
- `npm run start:prod` — Start in production mode
- `npm run test` — Run tests

---

## 🐳 Docker & Docker Compose

- To run with Docker Compose (backend + PostgreSQL):

```bash
docker-compose up --build
```

- To stop:

```bash
docker-compose down
```

---

## 📖 API Docs & Swagger

- After running the backend, open [http://localhost:3000/api](http://localhost:3000/api) in your browser for interactive API documentation.

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

---

## 📝 License

MIT
