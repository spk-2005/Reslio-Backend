# Reslio Backend API

Node.js + Express + MongoDB backend for Reslio Resume & Portfolio Builder app.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket name

### 3. MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs in development)
5. Get your connection string and update `MONGODB_URI` in `.env`

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the values to your `.env` file

### 5. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Register or login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/premium` - Update premium status (protected)

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template (protected)

### Resumes
- `POST /api/resumes` - Create resume (protected)
- `GET /api/resumes` - Get user's resumes (protected)
- `GET /api/resumes/:id` - Get resume by ID (protected)
- `PUT /api/resumes/:id` - Update resume (protected, premium)
- `DELETE /api/resumes/:id` - Delete resume (protected)

### Portfolios
- `POST /api/portfolios` - Create portfolio (protected)
- `GET /api/portfolios` - Get user's portfolios (protected)
- `GET /api/portfolios/:id` - Get portfolio by ID (protected)
- `PUT /api/portfolios/:id` - Update portfolio (protected, premium)
- `DELETE /api/portfolios/:id` - Delete portfolio (protected)

### Export
- `POST /api/export/resume/pdf` - Export resume as PDF (protected)
- `POST /api/export/resume/docx` - Export resume as DOCX (protected)
- `POST /api/export/resume/image` - Export resume as image (protected)
- `POST /api/export/portfolio/zip` - Export portfolio as ZIP (protected)

## Deployment

### Heroku

```bash
heroku create reslio-backend
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set FIREBASE_PROJECT_ID="your_project_id"
# Set other environment variables
git push heroku main
```

### Railway

1. Connect your GitHub repo
2. Add environment variables in the dashboard
3. Deploy automatically on push

### Render

1. Create new Web Service
2. Connect your repo
3. Set environment variables
4. Deploy

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── firebase.js      # Firebase Admin setup
├── controllers/
│   ├── authController.js
│   ├── templateController.js
│   ├── resumeController.js
│   ├── portfolioController.js
│   └── exportController.js
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── User.js
│   ├── Template.js
│   ├── Resume.js
│   └── Portfolio.js
├── routes/
│   ├── auth.js
│   ├── templates.js
│   ├── resumes.js
│   ├── portfolios.js
│   └── export.js
├── .env
├── .env.example
├── package.json
└── server.js
```
