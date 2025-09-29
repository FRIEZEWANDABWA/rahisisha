// Netlify Function for Quote Submissions
exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const quoteData = JSON.parse(event.body);
        
        // Validate required fields
        const requiredName = quoteData.name || quoteData.fullName;
        if (!quoteData.email || !requiredName) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Missing required fields: name and email' 
                })
            };
        }

        // Log quote data for processing
        console.log('Quote submission received:', {
            type: quoteData.type,
            name: requiredName,
            email: quoteData.email,
            service: quoteData.service || quoteData.serviceType,
            budget: quoteData.budget || quoteData.budgetRange,
            timestamp: quoteData.timestamp,
            details: quoteData.details || quoteData.projectDescription
        });

        // Send webhook to external service (like Zapier, Make.com, etc.)
        await sendWebhookNotification(quoteData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                success: true,
                message: 'Quote request submitted successfully',
                quoteId: `QUOTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            })
        };

    } catch (error) {
        console.error('Quote submission error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                message: 'Internal server error'
            })
        };
    }
};

// Send webhook notification to external service
async function sendWebhookNotification(quoteData) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL;
    
    if (!webhookUrl) {
        console.log('No webhook URL configured, skipping external notification');
        return;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...quoteData,
                source: 'rahisisha_website',
                processed_at: new Date().toISOString()
            })
        });

        if (response.ok) {
            console.log('Webhook notification sent successfully');
        } else {
            console.error('Webhook notification failed:', response.status);
        }
    } catch (error) {
        console.error('Webhook notification error:', error);
        // Don't throw error - quote submission should still succeed
    }
}