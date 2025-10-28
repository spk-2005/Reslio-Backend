# API Testing Guide - Reslio Backend

This guide provides examples for testing all API endpoints using cURL, Postman, or any HTTP client.

## Base URL

```
Local: http://localhost:5000/api
Production: https://your-backend-url.railway.app/api
```

---

## 🔐 Authentication

Most endpoints require authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

---

## 📍 API Endpoints

### 1. Authentication Endpoints

#### POST /auth/login
Register or login a user with Firebase token.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "FIREBASE_ID_TOKEN",
    "userData": {
      "displayName": "John Doe",
      "email": "john@example.com",
      "photoURL": "https://example.com/photo.jpg"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firebaseUid": "firebase_uid",
    "email": "john@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "isPremium": false,
    "premiumExpiresAt": null
  }
}
```

#### GET /auth/profile
Get authenticated user's profile.

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "displayName": "John Doe",
    "createdResumes": [],
    "createdPortfolios": [],
    "isPremium": false
  }
}
```

#### PUT /auth/premium
Update premium subscription status.

```bash
curl -X PUT http://localhost:5000/api/auth/premium \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isPremium": true,
    "expiresAt": "2025-12-31T23:59:59.000Z"
  }'
```

---

### 2. Template Endpoints

#### GET /templates
Get all templates (optionally filter by type).

```bash
# Get all templates
curl -X GET http://localhost:5000/api/templates

# Get only resume templates
curl -X GET http://localhost:5000/api/templates?type=resume

# Get only portfolio templates
curl -X GET http://localhost:5000/api/templates?type=portfolio
```

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "_id": "template_id",
      "name": "Professional",
      "type": "resume",
      "description": "Clean and modern professional resume",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "isPremium": false,
      "structure": {},
      "isActive": true
    }
  ]
}
```

#### GET /templates/:id
Get a specific template by ID.

```bash
curl -X GET http://localhost:5000/api/templates/TEMPLATE_ID
```

#### POST /templates
Create a new template (requires authentication).

```bash
curl -X POST http://localhost:5000/api/templates \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Template",
    "type": "resume",
    "description": "My custom resume template",
    "thumbnail": "https://example.com/thumb.jpg",
    "isPremium": false,
    "structure": {
      "sections": ["personalInfo", "experience", "education"],
      "layout": "single-column"
    }
  }'
```

---

### 3. Resume Endpoints

#### POST /resumes
Create a new resume.

```bash
curl -X POST http://localhost:5000/api/resumes \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "TEMPLATE_ID",
    "title": "My Resume",
    "data": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "New York, NY"
      },
      "summary": "Experienced software developer...",
      "experience": [
        {
          "company": "Tech Corp",
          "position": "Senior Developer",
          "startDate": "2020-01",
          "endDate": "Present",
          "current": true,
          "description": "Led development of key features"
        }
      ],
      "education": [
        {
          "institution": "University of Technology",
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "startDate": "2016",
          "endDate": "2020"
        }
      ],
      "skills": [
        {
          "category": "Programming",
          "items": ["JavaScript", "Python", "React"]
        }
      ]
    }
  }'
```

#### GET /resumes
Get all resumes for authenticated user.

```bash
curl -X GET http://localhost:5000/api/resumes \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

#### GET /resumes/:id
Get a specific resume.

```bash
curl -X GET http://localhost:5000/api/resumes/RESUME_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

#### PUT /resumes/:id
Update a resume (Premium only).

```bash
curl -X PUT http://localhost:5000/api/resumes/RESUME_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Resume Title",
    "data": {
      "personalInfo": {
        "fullName": "John Doe Updated"
      }
    }
  }'
```

#### DELETE /resumes/:id
Delete a resume.

```bash
curl -X DELETE http://localhost:5000/api/resumes/RESUME_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

---

### 4. Portfolio Endpoints

#### POST /portfolios
Create a new portfolio.

```bash
curl -X POST http://localhost:5000/api/portfolios \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "TEMPLATE_ID",
    "title": "My Portfolio",
    "data": {
      "personalInfo": {
        "fullName": "John Doe",
        "tagline": "Full Stack Developer",
        "email": "john@example.com"
      },
      "about": "I am a passionate developer...",
      "projects": [
        {
          "title": "E-commerce Platform",
          "description": "Built a full-stack e-commerce solution",
          "technologies": ["React", "Node.js", "MongoDB"],
          "liveUrl": "https://example.com",
          "featured": true
        }
      ],
      "skills": [
        {
          "category": "Frontend",
          "items": ["React", "Vue", "TypeScript"]
        }
      ]
    }
  }'
```

#### GET /portfolios
Get all portfolios for authenticated user.

```bash
curl -X GET http://localhost:5000/api/portfolios \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

#### GET /portfolios/:id
Get a specific portfolio.

```bash
curl -X GET http://localhost:5000/api/portfolios/PORTFOLIO_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

#### PUT /portfolios/:id
Update a portfolio (Premium only).

```bash
curl -X PUT http://localhost:5000/api/portfolios/PORTFOLIO_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Portfolio",
    "data": {}
  }'
```

#### DELETE /portfolios/:id
Delete a portfolio.

```bash
curl -X DELETE http://localhost:5000/api/portfolios/PORTFOLIO_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

---

### 5. Export Endpoints

#### POST /export/resume/pdf
Export resume as PDF.

```bash
curl -X POST http://localhost:5000/api/export/resume/pdf \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "fullName": "John Doe"
      }
    },
    "templateHTML": "<html><body><h1>John Doe</h1></body></html>"
  }' \
  --output resume.pdf
```

#### POST /export/resume/docx
Export resume as Word document.

```bash
curl -X POST http://localhost:5000/api/export/resume/docx \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "summary": "Professional summary here",
      "experience": [],
      "education": [],
      "skills": []
    }
  }' \
  --output resume.docx
```

#### POST /export/resume/image
Export resume as image (PNG).

```bash
curl -X POST http://localhost:5000/api/export/resume/image \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateHTML": "<html><body><h1>Resume</h1></body></html>"
  }' \
  --output resume.png
```

#### POST /export/portfolio/zip
Export portfolio as ZIP file.

```bash
curl -X POST http://localhost:5000/api/export/portfolio/zip \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "portfolioHTML": "<html><body><h1>Portfolio</h1></body></html>",
    "portfolioCSS": "body { font-family: Arial; }",
    "portfolioJS": "console.log(\"Portfolio loaded\");"
  }' \
  --output portfolio.zip
```

---

## 🧪 Testing with Postman

### Import Collection

1. Create a new collection in Postman
2. Add base URL as a variable
3. Create requests for each endpoint
4. Use collection variables for tokens

### Environment Variables

```json
{
  "baseUrl": "http://localhost:5000/api",
  "firebaseToken": "YOUR_TOKEN_HERE"
}
```

### Authorization Setup

1. In Collection settings → Authorization
2. Type: Bearer Token
3. Token: {{firebaseToken}}

---

## ✅ Response Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden (Premium required)
- **404** - Not Found
- **500** - Server Error

---

## 🔍 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## 💡 Testing Tips

1. **Get Firebase Token**: Use the frontend app to sign in, then extract the token from AsyncStorage
2. **Use Postman Collections**: Save all requests in a collection for easy testing
3. **Environment Variables**: Use variables for baseUrl and token
4. **Test Order**: Login → Create Template → Create Resume → Export
5. **Premium Testing**: Update user to premium before testing premium endpoints

---

## 🚀 Automated Testing

Create a test script:

```bash
#!/bin/bash

TOKEN="YOUR_FIREBASE_TOKEN"
BASE_URL="http://localhost:5000/api"

# Test health check
curl $BASE_URL/../

# Test templates
curl $BASE_URL/templates

# Test create resume
curl -X POST $BASE_URL/resumes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"templateId":"123","title":"Test","data":{}}'
```

---

## 📊 Database Seeding

Before testing, seed templates:

```bash
cd backend
npm run seed
```

This creates initial resume and portfolio templates in your database.

---

That's it! You now have all the information needed to test every endpoint in the Reslio API.
