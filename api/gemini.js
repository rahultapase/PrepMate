// Vercel Serverless Function for Gemini API proxy
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  console.log('Received API request:', { 
    hasPrompt: !!req.body.prompt, 
    hasApiKey: !!req.body.userApiKey,
    origin: req.headers.origin 
  });
  
  try {
    const { prompt, model = 'gemini-2.5-pro', userApiKey } = req.body;
    
    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }
    
    if (prompt.length > 10000) {
      return res.status(400).json({ error: 'Prompt too long (max 10,000 characters)' });
    }

    // Only use user's API key - no server fallback
    if (!userApiKey) {
      console.error('No user API key provided');
      return res.status(400).json({ error: 'User API key is required. Please provide your Gemini API key in the frontend.' });
    }
    
    const apiKey = userApiKey;

    // Call Gemini API with retry logic
    console.log('Making request to Gemini API...');
    
    let response;
    let retries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }]
                }
              ]
            })
          }
        );

        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        const errorData = await response.json();
        lastError = errorData;
        
        // If it's a 503 (overloaded) and we have retries left, wait and try again
        if (response.status === 503 && attempt < retries) {
          console.log(`Attempt ${attempt} failed with 503, retrying in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        }
        
        // For other errors or no retries left, break
        break;
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed with network error:`, error);
        lastError = { error: { message: error.message } };
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        break;
      }
    }
    
    if (!response || !response.ok) {
      console.error('Gemini API error after retries:', lastError);
      return res.status(response?.status || 500).json({ 
        error: lastError?.error?.message || 'Failed to generate content after multiple attempts' 
      });
    }

    const data = await response.json();
    console.log('Gemini API success');
    res.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
