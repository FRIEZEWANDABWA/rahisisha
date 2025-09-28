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
    if (origin && !origin.includes('rahisisha.tech') && !origin.includes('rahisisha.netlify.app') && !origin.includes('localhost')) {
      console.log('Blocked origin:', origin);
      return {
        statusCode: 403,
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
    
    // Rate limiting
    const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
    
    // Get webhook URL from environment (NEVER in code)
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL not configured');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ response: 'Service temporarily unavailable - webhook not configured' })
      };
    }

    // Security: Validate webhook URL domain
    if (!N8N_WEBHOOK_URL.includes('n8n.rahisisha.tech')) {
      console.error('Invalid webhook URL domain');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ response: 'Service configuration error' })
      };
    }

    console.log('Calling webhook:', N8N_WEBHOOK_URL ? 'URL configured' : 'URL missing');
    console.log('Message payload:', { message: cleanMessage, user_id: user_id || 'anonymous' });

    // Call your n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Rahisisha-Chatbot/1.0',
        'X-Source': 'rahisisha-website',
        'X-Client-IP': clientIP
      },
      body: JSON.stringify({
        message: cleanMessage,
        sessionId: user_id || 'anonymous',
        user_id: user_id || 'anonymous',
        timestamp: new Date().toISOString(),
        source: 'website_chat'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    const data = await response.json();
    
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
        response: data.reply || data.response || data.message || 'I\'m here to help! What can I do for you?',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chatbot error:', error.message);
    
    return {
      statusCode: 200, // Don't expose errors to client
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        response: 'I\'m having a brief moment of confusion. Please try again!'
      })
    };
  }
};