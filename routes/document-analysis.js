// backend/routes/document-analysis.js
// Document analysis using FREE Google Gemini API
// IMPROVED VERSION with better error handling

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key on startup
if (!process.env.GOOGLE_API_KEY) {
  console.error('⚠️  WARNING: GOOGLE_API_KEY is not set in environment variables!');
  console.error('📝 Add GOOGLE_API_KEY to your Render environment variables');
}

// Initialize Gemini with your API key
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
        error: 'Google API key is not configured. Please add GOOGLE_API_KEY to environment variables.',
      });
    }

    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: base64Data and mimeType',
      });
    }

    console.log('📄 Analyzing document with Gemini');
    console.log('📦 MIME type:', mimeType);
    console.log('📏 Base64 length:', base64Data.length);

    // Use Gemini 2.5 Flash - stable and fast model from your available models
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
      },
    });

    // Step 1: Extract text from document
    console.log('🔍 Step 1: Extracting text from document...');
    
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
      console.error('❌ Gemini API error during text extraction:', error);
      
      if (error.message?.includes('API_KEY_INVALID')) {
        return res.status(500).json({
          success: false,
          error: 'Invalid Google API key. Please check your GOOGLE_API_KEY environment variable.',
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
        error: 'Could not extract sufficient text from document. Please ensure the document contains readable text.',
      });
    }

    // Step 2: Analyze and structure the data
    console.log('🧠 Step 2: Analyzing and structuring data...');

    let analyzeResult;
    try {
      analyzeResult = await model.generateContent(`You are a professional resume parser. Analyze the following resume/CV text and extract structured information.

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
    } catch (error) {
      console.error('❌ Gemini API error during analysis:', error);
      throw error;
    }

    let jsonText = analyzeResult.response.text();
    console.log('📝 Raw AI response length:', jsonText.length);
    
    // Clean up response - remove markdown code blocks if present
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

    console.log('✅ Document analysis complete!');

    res.json({
      success: true,
      data: transformedData,
    });

  } catch (error) {
    console.error('❌ Document analysis error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific Gemini errors
    let errorMessage = 'Failed to analyze document';
    let statusCode = 500;
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      errorMessage = 'Invalid or missing Google API key';
      statusCode = 500;
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('parse')) {
      errorMessage = 'Failed to parse AI response. Please try again.';
      statusCode = 500;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timeout. Please try again.';
      statusCode = 504;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /test
 * Test endpoint to verify Gemini API is working
 */
router.get('/test', async (req, res) => {
  try {
    // Check if API key is set
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'dummy-key') {
      return res.status(500).json({
        success: false,
        error: 'GOOGLE_API_KEY is not set in environment variables',
        instructions: 'Add GOOGLE_API_KEY to your Render environment variables',
      });
    }

    console.log('🧪 Testing Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Say "API is working!" in JSON format');
    const response = result.response.text();
    
    console.log('✅ Gemini API test successful');
    
    res.json({
      success: true,
      message: 'Gemini API is configured correctly',
      response: response,
      apiKeySet: true,
    });
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    
    let errorDetails = error.message;
    let instructions = '';
    
    if (error.message?.includes('API_KEY_INVALID')) {
      errorDetails = 'Invalid API key';
      instructions = 'Please check your GOOGLE_API_KEY in Render environment variables';
    } else if (error.message?.includes('quota')) {
      errorDetails = 'API quota exceeded';
      instructions = 'Wait a few moments and try again';
    }
    
    res.status(500).json({
      success: false,
      error: 'Gemini API test failed',
      details: errorDetails,
      instructions: instructions || 'Check Render logs for more details',
    });
  }
});

/**
 * GET /health
 * Simple health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Document analysis service is running',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'dummy-key',
  });
});

/**
 * GET /list-models
 * List all available models for your API key
 */
router.get('/list-models', async (req, res) => {
  try {
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'dummy-key') {
      return res.status(500).json({
        success: false,
        error: 'GOOGLE_API_KEY is not set in environment variables',
      });
    }

    // Fetch available models directly from Google API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Failed to fetch models',
        details: data,
      });
    }

    // Filter for models that support generateContent
    const availableModels = data.models
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
      }));

    res.json({
      success: true,
      models: availableModels,
      count: availableModels.length,
    });
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list models',
      details: error.message,
    });
  }
});

module.exports = router;

// ============================================
// DEPLOYMENT CHECKLIST FOR RENDER
// ============================================

/*
✅ 1. Install required package:
   npm install @google/generative-ai

✅ 2. Get your FREE API key:
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

✅ 3. Add to Render Environment Variables:
   - Go to: Render Dashboard → Your Service → Environment
   - Add variable: GOOGLE_API_KEY = your_api_key_here
   - Save changes (this will trigger a redeploy)

✅ 4. Add to your main app.js or server.js:
   const documentAnalysisRoutes = require('./routes/document-analysis');
   app.use('/api/document', documentAnalysisRoutes);

✅ 5. Ensure package.json includes:
   "dependencies": {
     "@google/generative-ai": "^0.21.0"
   }

✅ 6. Test the API after deployment:
   GET https://your-app.onrender.com/api/document/health
   GET https://your-app.onrender.com/api/document/test

✅ 7. Check Render logs:
   - Look for: "✅ Gemini API is configured correctly"
   - Or: "⚠️  WARNING: GOOGLE_API_KEY is not set"

TROUBLESHOOTING:
- If you see API key warnings, check Render Environment Variables
- If 500 errors persist, check Render logs for detailed error messages
- Test the /test endpoint in your browser first before using the app
*/