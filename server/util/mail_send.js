require("dotenv").config();

const send_mail = async function (email, title, body) {
    console.trace("Mail function called via Brevo API from:");
    
    try {
        // We use the native fetch API because it is faster and bypasses blocked ports
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY, // Loaded from your Render Environment
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { 
                    name: "Study Notion", 
                    email: process.env.MAIL_USER // Loaded from your Render Environment
                },
                to: [{ email: email }],
                subject: title,
                htmlContent: body // Brevo uses 'htmlContent' instead of 'html'
            })
        });

        const info = await response.json();

        if (response.ok) {
            console.log("✅ Mail sent successfully via Brevo API. ID:", info.messageId);
            return info;
        } else {
            // Logs the specific error from Brevo (e.g., "invalid api key" or "unauthorized sender")
            console.error("❌ Brevo API Error:", info.message);
            return null;
        }
    } catch (error) {
        console.error("❌ Network/Timeout Error:", error.message);
        return null;
    }
};

module.exports = send_mail;
