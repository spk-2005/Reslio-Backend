// backend/routes/document-analysis.js
// Document analysis using FREE Google Gemini API

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * POST /api/document/analyze
 * Analyzes a document and returns structured data using Gemini
 */
router.post('/analyze', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: base64Data and mimeType',
      });
    }

    console.log('📄 Analyzing document with Gemini, type:', mimeType);

    // Use Gemini 1.5 Flash (fast and free)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent output
      },
    });

    // Step 1: Extract text from document
    console.log('🔍 Extracting text from document...');
    
    const extractResult = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      {
        text: 'Extract all text content from this document. Return only the raw text without any formatting, commentary, or markdown.',
      },
    ]);

    const extractedText = extractResult.response.text();
    console.log('✅ Text extracted, length:', extractedText.length);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract sufficient text from document',
      });
    }

    // Step 2: Analyze and structure the data
    console.log('🧠 Analyzing and structuring data...');

    const analyzeResult = await model.generateContent(`You are a professional resume parser. Analyze the following resume/CV text and extract structured information.

Return ONLY a valid JSON object (no markdown, no code blocks, no additional text) with this exact structure:

{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "summary": "string or null",
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "gpa": "string or null"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "skills": ["string"],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ],
  "languages": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ]
}

Rules:
- Extract only what is explicitly mentioned in the document
- Use null for missing fields
- Use empty arrays [] for missing array fields
- Ensure all strings are properly escaped
- Return valid JSON only, no explanation

Document text:
${extractedText}`);

    let jsonText = analyzeResult.response.text();
    
    // Clean up response - remove markdown code blocks if present
    jsonText = jsonText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse JSON
    const structuredData = JSON.parse(jsonText);
    console.log('✅ Data structured successfully');

    // Transform to match your backend schema
    const transformedData = {
      personalDetails: {
        name: structuredData.name || '',
        phone: structuredData.phone || '',
        location: structuredData.location || '',
        email: structuredData.email || '',
        summary: structuredData.summary || '',
      },
      education: (structuredData.education || []).map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || '',
        gpa: edu.gpa || '',
      })),
      experience: (structuredData.experience || []).map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        duration: exp.duration || '',
        description: exp.description || '',
      })),
      skills: structuredData.skills || [],
      certifications: (structuredData.certifications || []).map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        year: cert.year || '',
      })),
      languages: structuredData.languages || [],
      projects: (structuredData.projects || []).map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || [],
      })),
    };

    res.json({
      success: true,
      data: transformedData,
    });

  } catch (error) {
    console.error('❌ Document analysis error:', error);
    
    // Handle specific Gemini errors
    let errorMessage = 'Failed to analyze document';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid or missing Google API key';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error.message?.includes('parse')) {
      errorMessage = 'Failed to parse AI response. Please try again.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/document/test
 * Test endpoint to verify Gemini API is working
 */
router.get('/test', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say "API is working!" in JSON format');
    const response = result.response.text();
    
    res.json({
      success: true,
      message: 'Gemini API is configured correctly',
      response: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Gemini API test failed',
      details: error.message,
    });
  }
});

module.exports = router;

// ============================================
// SETUP INSTRUCTIONS
// ============================================

/*
1. Install required package:
   npm install @google/generative-ai

2. Get your FREE API key:
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

3. Add to your .env file:
   GOOGLE_API_KEY=your_api_key_here

4. Add to your main app.js or server.js:
   const documentAnalysisRoutes = require('./routes/document-analysis');
   app.use('/api/document', documentAnalysisRoutes);

5. Test the API:
   GET http://localhost:3000/api/document/test

6. Use in your app:
   POST http://localhost:3000/api/document/analyze
   Body: {
     "base64Data": "base64_encoded_pdf_or_image",
     "mimeType": "application/pdf" or "image/jpeg"
   }

SUPPORTED FILE TYPES:
- PDF: application/pdf
- Images: image/jpeg, image/png, image/webp
- Documents: application/vnd.openxmlformats-officedocument.wordprocessingml.document

FREE TIER LIMITS:
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
- No credit card required!
*/