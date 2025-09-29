// Netlify Function for Quote Submissions
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const quoteData = JSON.parse(event.body);
        
        // Validate required fields
        if (!quoteData.email || !quoteData.name || !quoteData.fullName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Missing required fields' 
                })
            };
        }

        // Create email content based on quote type
        const emailContent = createEmailContent(quoteData);
        
        // Send email notification
        await sendEmailNotification(quoteData, emailContent);
        
        // Log quote data (in production, save to database)
        console.log('Quote submission received:', {
            type: quoteData.type,
            email: quoteData.email,
            service: quoteData.service || quoteData.serviceType,
            timestamp: quoteData.timestamp
        });

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
            body: JSON.stringify({
                success: false,
                message: 'Internal server error'
            })
        };
    }
};

function createEmailContent(quoteData) {
    const isSimple = quoteData.type === 'simple_quote';
    const customerName = quoteData.name || quoteData.fullName;
    
    if (isSimple) {
        return {
            subject: `New Quote Request from ${customerName}`,
            html: `
                <h2>New Quote Request - Simple Form</h2>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Contact Information</h3>
                    <p><strong>Name:</strong> ${quoteData.name}</p>
                    <p><strong>Email:</strong> ${quoteData.email}</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Project Details</h3>
                    <p><strong>Service:</strong> ${quoteData.service}</p>
                    <p><strong>Budget:</strong> ${quoteData.budget}</p>
                    <p><strong>Details:</strong></p>
                    <p style="background: white; padding: 15px; border-radius: 4px;">${quoteData.details}</p>
                </div>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Submitted:</strong> ${new Date(quoteData.timestamp).toLocaleString()}</p>
                    <p><strong>Source:</strong> ${quoteData.source}</p>
                </div>
            `,
            customerEmail: createCustomerConfirmationEmail(quoteData, true)
        };
    } else {
        return {
            subject: `Comprehensive Quote Request from ${customerName}`,
            html: `
                <h2>New Quote Request - Comprehensive Form</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Contact Information</h3>
                    <p><strong>Name:</strong> ${quoteData.fullName}</p>
                    <p><strong>Email:</strong> ${quoteData.email}</p>
                    <p><strong>Phone:</strong> ${quoteData.countryCode} ${quoteData.phone}</p>
                    ${quoteData.companyName ? `<p><strong>Company:</strong> ${quoteData.companyName}</p>` : ''}
                    ${quoteData.location ? `<p><strong>Location:</strong> ${quoteData.location}</p>` : ''}
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Project Details</h3>
                    <p><strong>Service Type:</strong> ${quoteData.serviceType}</p>
                    <p><strong>Budget Range:</strong> ${quoteData.budgetRange}</p>
                    <p><strong>Timeline:</strong> ${quoteData.timeline}</p>
                    <p><strong>Urgency:</strong> ${quoteData.urgency}</p>
                    <p><strong>Experience Level:</strong> ${quoteData.experience || 'Not specified'}</p>
                    
                    <p><strong>Project Description:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 4px;">
                        ${quoteData.projectDescription}
                    </div>
                    
                    ${quoteData.additionalNotes ? `
                        <p><strong>Additional Notes:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 4px;">
                            ${quoteData.additionalNotes}
                        </div>
                    ` : ''}
                </div>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3>Additional Information</h3>
                    <p><strong>Newsletter Subscription:</strong> ${quoteData.newsletter ? 'Yes' : 'No'}</p>
                    ${quoteData.hasFiles ? `<p><strong>Files Attached:</strong> ${quoteData.fileCount} file(s)</p>` : ''}
                    <p><strong>Submitted:</strong> ${new Date(quoteData.timestamp).toLocaleString()}</p>
                    <p><strong>Source:</strong> ${quoteData.source}</p>
                </div>
            `,
            customerEmail: createCustomerConfirmationEmail(quoteData, false)
        };
    }
}

function createCustomerConfirmationEmail(quoteData, isSimple) {
    const customerName = quoteData.name || quoteData.fullName;
    
    return {
        subject: 'Quote Request Received - Rahisisha Tech',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #00BFFF 0%, #0080FF 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px;">Rahisisha Tech</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Quote Request Received</p>
                </div>
                
                <div style="padding: 30px; background: #ffffff;">
                    <h2 style="color: #333; margin-top: 0;">Hi ${customerName},</h2>
                    
                    <p>Thank you for your interest in our services! We've successfully received your quote request and our team is already reviewing the details.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00BFFF;">
                        <h3 style="margin-top: 0; color: #00BFFF;">What happens next?</h3>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li>Our team will review your requirements within 2-4 hours</li>
                            <li>We'll prepare a detailed quote tailored to your needs</li>
                            <li>You'll receive our proposal within 24 hours</li>
                            <li>We'll schedule a call to discuss the project details</li>
                        </ul>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1976d2;">Your Request Summary</h3>
                        <p><strong>Service:</strong> ${quoteData.service || quoteData.serviceType}</p>
                        <p><strong>Budget:</strong> ${quoteData.budget || quoteData.budgetRange}</p>
                        ${quoteData.timeline ? `<p><strong>Timeline:</strong> ${quoteData.timeline}</p>` : ''}
                        <p><strong>Submitted:</strong> ${new Date(quoteData.timestamp).toLocaleString()}</p>
                    </div>
                    
                    <p>If you have any urgent questions or need to add more information to your request, please don't hesitate to contact us:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="mailto:hello@rahisishatech.com" style="background: #00BFFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">Email Us</a>
                        <a href="https://wa.me/254111546120" style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">WhatsApp</a>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>The Rahisisha Tech Team</strong></p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
                    <p>Rahisisha Tech - Revolutionizing Business Through AI Innovation</p>
                    <p>Visit us at <a href="https://rahisishatech.com" style="color: #00BFFF;">rahisishatech.com</a></p>
                </div>
            </div>
        `
    };
}

async function sendEmailNotification(quoteData, emailContent) {
    // Configure email transporter (you'll need to set these environment variables)
    const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER, // Your email
            pass: process.env.SMTP_PASS  // Your email password or app password
        }
    });

    const customerEmail = quoteData.email;
    const businessEmail = process.env.BUSINESS_EMAIL || 'hello@rahisishatech.com';

    try {
        // Send notification to business
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: businessEmail,
            subject: emailContent.subject,
            html: emailContent.html
        });

        // Send confirmation to customer
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: emailContent.customerEmail.subject,
            html: emailContent.customerEmail.html
        });

        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't throw error - quote submission should still succeed
    }
}