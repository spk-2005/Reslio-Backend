// backend/routes/document-analysis.js
// Document analysis using Google Gemini API

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key on startup
if (!process.env.GOOGLE_API_KEY) {
  console.error('⚠️  WARNING: GOOGLE_API_KEY is not set in environment variables!');
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'dummy-key');

/**
 * POST /analyze
 * Analyzes a document and returns structured data using Gemini
 */
router.post('/analyze', async (req, res) => {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'dummy-key') {
      return res.status(500).json({
        success: false,
        error: 'Google API key is not configured.',
      });
    }

    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: base64Data and mimeType',
      });
    }

    console.log('📄 Analyzing document with Gemini 2.5 Flash');
    console.log('📦 MIME type:', mimeType);
    console.log('📏 Base64 length:', base64Data.length);

    // Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
      },
    });

    // Step 1: Extract text
    console.log('🔍 Step 1: Extracting text...');
    
    let extractResult;
    try {
      extractResult = await model.generateContent([
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
    } catch (error) {
      console.error('❌ Text extraction error:', error);
      
      if (error.message?.includes('leaked') || error.message?.includes('Forbidden')) {
        return res.status(403).json({
          success: false,
          error: 'API key has been compromised. Please create a new API key.',
        });
      }
      
      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        return res.status(429).json({
          success: false,
          error: 'API quota exceeded. Please try again in a few moments.',
        });
      }
      
      throw error;
    }

    const extractedText = extractResult.response.text();
    console.log('✅ Text extracted, length:', extractedText.length);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract sufficient text from document.',
      });
    }

    // Step 2: Analyze and structure
    console.log('🧠 Step 2: Analyzing and structuring data...');

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
- Extract only what is explicitly mentioned
- Use null for missing fields
- Use empty arrays [] for missing array fields
- Return valid JSON only, no explanation

Document text:
${extractedText}`);

    let jsonText = analyzeResult.response.text();
    
    // Clean up response
    jsonText = jsonText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse JSON
    let structuredData;
    try {
      structuredData = JSON.parse(jsonText);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('Raw response:', jsonText.substring(0, 500));
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response. Please try again.',
      });
    }

    // Transform to match backend schema
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

    console.log('✅ Document analysis complete!');

    res.json({
      success: true,
      data: transformedData,
    });

  } catch (error) {
    console.error('❌ Document analysis error:', error);
    
    let errorMessage = 'Failed to analyze document';
    let statusCode = 500;
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      errorMessage = 'Invalid or missing Google API key';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

/**
 * GET /test
 * Test endpoint
 */
router.get('/test', async (req, res) => {
  try {
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'dummy-key') {
      return res.status(500).json({
        success: false,
        error: 'GOOGLE_API_KEY is not set',
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

/**
 * GET /health
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Document analysis service is running',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.GOOGLE_API_KEY,
  });
});

// IMPORTANT: Must export the router
module.exports = router;