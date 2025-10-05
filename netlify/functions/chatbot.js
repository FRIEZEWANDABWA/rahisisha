exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Security: Check origin (allow both domains during setup)
    const origin = event.headers.origin || event.headers.referer;
    console.log('Request origin:', origin);
    if (origin && !origin.includes('rahisisha.tech') && !origin.includes('rahisisha.netlify.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      console.log('Blocked origin:', origin);
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Forbidden' })
      };
    }

    const { message, user_id } = JSON.parse(event.body);
    
    // Enhanced input validation
    if (!message || typeof message !== 'string' || message.length > 500 || message.length < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid message' })
      };
    }

    // Sanitize message (basic)
    const cleanMessage = message.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
    
    // Basic client info
    const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
    
    // Get webhook URL from environment
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    
    console.log('N8N_WEBHOOK_URL configured:', !!N8N_WEBHOOK_URL);
    
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL not configured');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ response: 'Hi! I\'m Rahisisha AI. How can I help you today?' })
      };
    }

    console.log('Calling webhook:', N8N_WEBHOOK_URL ? 'URL configured' : 'URL missing');
    console.log('Message payload:', { message: cleanMessage, user_id: user_id || 'anonymous' });

    // Call n8n webhook (optimized for speed)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: cleanMessage,
        sessionId: user_id || `session_${Date.now()}`,
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('N8N Response:', JSON.stringify(data, null, 2));
    
    // Direct response extraction - N8N sends {"output": "message"}
    const botResponse = data.output || 'Hi! How can I help you?';
    
    console.log('Sending response:', botResponse);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        response: botResponse
      })
    };

  } catch (error) {
    console.error('Chatbot error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return N8N response even if there's an error in processing
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        response: 'Hi there! 👋 Thanks for reaching out. How can I help you today?'
      })
    };
  }
};