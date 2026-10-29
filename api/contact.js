import { Resend } from "resend";
import dotenv from "dotenv";

// Load environment variables if not already in process.env
dotenv.config();

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Clean up stale rate-limit entries every 15 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000).unref?.();

/**
 * Escape HTML special characters for email body rendering
 */
function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Helper to safely extract JSON body across Vercel, Express, and raw Node.js
 */
async function getRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }
  if (typeof req.body === "string" && req.body.length > 0) {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new Error("Invalid JSON body");
    }
  }
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 100) {
        // 100KB safeguard against payload flooding
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error("Malformed JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Universal JSON response sender (supports Vercel serverless and Node HTTP)
 */
function sendResponse(res, status, data) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

/**
 * Main Contact API Handler for Resend
 */
export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return sendResponse(res, 405, {
      success: false,
      error: `Method ${req.method} not allowed. Please send a POST request.`
    });
  }

  // 2. Client IP & Rate Limiting Check
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  const now = Date.now();
  const clientLimit = rateLimitMap.get(clientIp);

  if (clientLimit) {
    if (now < clientLimit.resetTime) {
      if (clientLimit.count >= MAX_REQUESTS_PER_WINDOW) {
        const remainingSec = Math.ceil((clientLimit.resetTime - now) / 1000);
        return sendResponse(res, 429, {
          success: false,
          error: `Too many messages sent. Please wait ${remainingSec} seconds before trying again.`
        });
      }
      clientLimit.count += 1;
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }
  } else {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  }

  // 3. Parse JSON Request Body
  let body;
  try {
    body = await getRequestBody(req);
  } catch (err) {
    return sendResponse(res, 400, {
      success: false,
      error: "Invalid request payload. Expected valid JSON."
    });
  }

  const { name, email, subject, message, _gotcha } = body;

  // 4. Honeypot Spam Protection
  // If the hidden '_gotcha' input is filled out, silently discard bot submission
  if (_gotcha && String(_gotcha).trim().length > 0) {
    return sendResponse(res, 200, {
      success: true,
      message: "Message processed successfully."
    });
  }

  // 5. Server-Side Validation
  // Validate Name
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return sendResponse(res, 400, {
      success: false,
      error: "Please enter your name (minimum 2 characters)."
    });
  }
  if (name.length > 100) {
    return sendResponse(res, 400, {
      success: false,
      error: "Name is too long (maximum 100 characters)."
    });
  }

  // Validate Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return sendResponse(res, 400, {
      success: false,
      error: "Please provide a valid email address."
    });
  }
  if (email.length > 254) {
    return sendResponse(res, 400, {
      success: false,
      error: "Email address is too long."
    });
  }

  // Validate Subject
  if (!subject || typeof subject !== "string" || subject.trim().length < 2) {
    return sendResponse(res, 400, {
      success: false,
      error: "Please enter a subject (minimum 2 characters)."
    });
  }
  if (subject.length > 200) {
    return sendResponse(res, 400, {
      success: false,
      error: "Subject is too long (maximum 200 characters)."
    });
  }

  // Validate Message
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return sendResponse(res, 400, {
      success: false,
      error: "Please enter a message of at least 10 characters."
    });
  }
  if (message.length > 5000) {
    return sendResponse(res, 400, {
      success: false,
      error: "Message is too long (maximum 5000 characters)."
    });
  }

  // 6. Header Injection & CRLF Prevention
  // Ensure no newline characters exist in name, email, or subject
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email) || /[\r\n]/.test(subject)) {
    return sendResponse(res, 400, {
      success: false,
      error: "Invalid characters detected in header fields."
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  // 7. Verify Server-Side Resend Configuration
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.CONTACT_EMAIL || "pardhinilesh0591@gmail.com";
  // Default to onboarding@resend.dev for testing if RESEND_FROM_EMAIL is not yet set
  const senderEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey || apiKey.trim().length === 0 || apiKey.startsWith("re_placeholder")) {
    return sendResponse(res, 503, {
      success: false,
      error: "Resend API key is not configured on the server. Please define RESEND_API_KEY in your environment variables.",
      missingConfig: true
    });
  }

  // 8. Initialize Resend Client
  const resend = new Resend(apiKey);
  const submissionTimestamp = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium"
  });

  // 9. Send Email via Resend SDK
  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      replyTo: cleanEmail,
      subject: `[Portfolio Inquiry] ${cleanSubject}`,
      text: `New contact message from portfolio website:\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${submissionTimestamp}\n\nMessage:\n${cleanMessage}\n`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Portfolio Message</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 600px; background-color: #0A0A0A; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; overflow: hidden; padding: 32px;">
                  <!-- Header -->
                  <tr>
                    <td style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px;">
                      <div style="display: inline-block; padding: 4px 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #CCBEB1; margin-bottom: 12px;">
                        Portfolio Contact Submission
                      </div>
                      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF; line-height: 1.3;">
                        ${escapeHtml(cleanSubject)}
                      </h1>
                      <p style="margin: 6px 0 0; font-size: 13px; color: #A3A3A3;">
                        Received on ${escapeHtml(submissionTimestamp)}
                      </p>
                    </td>
                  </tr>

                  <!-- Sender Information -->
                  <tr>
                    <td style="padding: 24px 0 16px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px;">
                        <tr>
                          <td style="font-size: 13px; color: #A3A3A3; padding: 4px 0; width: 110px;"><strong>Sender Name:</strong></td>
                          <td style="font-size: 14px; color: #FFFFFF; padding: 4px 0; font-weight: 600;">${escapeHtml(cleanName)}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 13px; color: #A3A3A3; padding: 4px 0;"><strong>Sender Email:</strong></td>
                          <td style="font-size: 14px; color: #CCBEB1; padding: 4px 0;">
                            <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #CCBEB1; text-decoration: underline;">${escapeHtml(cleanEmail)}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 13px; color: #A3A3A3; padding: 4px 0;"><strong>Subject:</strong></td>
                          <td style="font-size: 14px; color: #FFFFFF; padding: 4px 0;">${escapeHtml(cleanSubject)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Message Body -->
                  <tr>
                    <td style="padding: 12px 0 24px;">
                      <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #A3A3A3; margin: 0 0 10px;">
                        Message:
                      </h2>
                      <div style="background: rgba(255, 255, 255, 0.02); border-left: 3px solid #CCBEB1; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #E5E5E5; white-space: pre-wrap;">
                        ${escapeHtml(cleanMessage)}
                      </div>
                    </td>
                  </tr>

                  <!-- Quick Reply CTA -->
                  <tr>
                    <td style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px; text-align: center;">
                      <a href="mailto:${escapeHtml(cleanEmail)}?subject=Re:%20${encodeURIComponent(cleanSubject)}" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                        Reply to ${escapeHtml(cleanName)}
                      </a>
                      <p style="margin: 16px 0 0; font-size: 11px; color: #666666;">
                        Direct reply configured via <code>replyTo</code>. Submitted from your portfolio contact form.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    if (error) {
      console.error("[Resend Error]:", error.message || error);
      return sendResponse(res, 400, {
        success: false,
        error: error.message || "Resend service failed to accept the email request."
      });
    }

    return sendResponse(res, 200, {
      success: true,
      id: data?.id,
      message: "Your message has been delivered to Nilesh Pardhi's inbox!"
    });
  } catch (err) {
    console.error("[Resend Exception]:", err?.message || err);
    return sendResponse(res, 500, {
      success: false,
      error: "An unexpected server error occurred while sending your message. Please try again or send a direct email."
    });
  }
}
