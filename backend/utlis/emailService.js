const nodemailer = require('nodemailer');
require('dotenv').config();

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Generate 6-digit OTP ──────────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── OTP Email HTML ────────────────────────────────────────────────────────────
const getOTPEmailHTML = (otp, purpose) => {
  const titles = {
    signup: { heading: 'Verify Your Email', sub: 'Use the OTP below to complete your TechiGuru registration.' },
    forgot: { heading: 'Reset Your Password', sub: 'Use the OTP below to reset your TechiGuru account password.' },
    verify: { heading: 'Verify Your Account', sub: 'Use the OTP below to verify your TechiGuru account.' },
  };
  const t = titles[purpose] || titles.signup;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#05070f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#05070f;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#0c0e24;border-radius:20px;border:1px solid rgba(99,102,241,0.2);overflow:hidden;max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:40px;height:40px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-weight:900;font-size:18px;">T</span>
              </div>
              <span style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">TechiGuru</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#f0f0f8;">${t.heading}</h1>
            <p style="margin:0 0 32px;color:#8892aa;font-size:14px;line-height:1.6;">${t.sub}</p>

            <!-- OTP Box -->
            <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#818cf8;">Your One-Time Password</p>
              <div style="font-size:42px;font-weight:900;letter-spacing:12px;color:#c7d2fe;font-family:'Courier New',monospace;">${otp}</div>
              <p style="margin:12px 0 0;font-size:12px;color:#64748b;">Valid for <strong style="color:#a5b4fc;">10 minutes</strong>. Do not share this with anyone.</p>
            </div>

            <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
              If you didn't request this, you can safely ignore this email. Your account will not be affected.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
            <p style="margin:0;font-size:11px;color:#374151;">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

// ── Send OTP email ─────────────────────────────────────────────────────────────
const sendOTPEmail = async (email, otp, purpose = 'signup') => {
  const subjects = {
    signup: '🔐 Your TechiGuru Verification Code',
    forgot: '🔑 Your TechiGuru Password Reset Code',
    verify: '🔐 Your TechiGuru Account Verification Code',
  };

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjects[purpose] || subjects.signup,
    html: getOTPEmailHTML(otp, purpose),
  });
};

// ── Send Verification Link email (admin-triggered, token-based, 24h) ──────────
const sendVerificationLinkEmail = async (email, name, verifyUrl) => {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#05070f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#05070f;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#0c0e24;border-radius:20px;border:1px solid rgba(99,102,241,0.2);overflow:hidden;max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:40px;height:40px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-weight:900;font-size:18px;">T</span>
              </div>
              <span style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">TechiGuru</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#f0f0f8;">Verify Your Account</h1>
            <p style="margin:0 0 28px;color:#8892aa;font-size:14px;line-height:1.6;">
              Hi ${name || 'there'}, click the button below to verify your TechiGuru account.
              This link is valid for <strong style="color:#a5b4fc;">24 hours</strong>.
            </p>

            <!-- CTA Button -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${verifyUrl}" target="_blank"
                style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;
                       font-weight:700;font-size:15px;padding:16px 40px;border-radius:14px;
                       letter-spacing:0.3px;box-shadow:0 8px 24px rgba(99,102,241,0.35);">
                ✓ Verify My Account
              </a>
            </div>

            <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
              <p style="margin:0;font-size:11px;color:#64748b;text-align:center;">
                Or copy this link into your browser:<br/>
                <span style="color:#818cf8;word-break:break-all;font-size:11px;">${verifyUrl}</span>
              </p>
            </div>

            <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
            <p style="margin:0;font-size:11px;color:#374151;">&copy; ${new Date().getFullYear()} TechiGuru. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔗 Verify Your TechiGuru Account',
    html,
  });
};

// ── Contact Ticket Email (to user) ───────────────────────────────────────────
const sendContactTicketEmail = async (email, name, subject, ticketId) => {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 36px;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-weight:900;font-size:16px;">T</span>
              </div>
              <span style="color:#fff;font-size:18px;font-weight:900;">TechiGuru</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">We received your message!</h1>
            <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">Hi <strong>${name || 'there'}</strong>, thank you for reaching out. Our team will get back to you within 24–48 hours.</p>
            <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;">Your Ticket Details</p>
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Ticket ID:</strong> #${ticketId}</p>
            </div>
            <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0;">You can also reach us at <a href="mailto:info@techhubtechnology.com" style="color:#7c3aed;">info@techhubtechnology.com</a> or call <strong>+91 9368465315</strong>.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ We received your message — Ticket #${ticketId}`,
    html,
  });
};

// ── Contact Admin Notification Email ─────────────────────────────────────────
const sendContactAdminNotifyEmail = async (senderName, senderEmail, subject, message) => {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#dc2626,#9333ea);padding:28px 36px;">
            <span style="color:#fff;font-size:18px;font-weight:900;">🎫 New Support Ticket — TechiGuru</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px;">
            <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">A new contact message was submitted</h2>
            <div style="background:#fef9ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px;margin-bottom:20px;">
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>From:</strong> ${senderName} (${senderEmail})</p>
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin:12px 0 4px;font-size:13px;color:#374151;"><strong>Message:</strong></p>
              <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">${message}</p>
            </div>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" target="_blank"
              style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">View in Admin Panel</a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} TechiGuru Admin</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🎫 New Contact Ticket: ${subject}`,
    html,
  });
};

// ── Status Change Notification (approve/reject for courses & instructor) ───────
const sendStatusChangeEmail = async (email, name, type, status, itemTitle, reason = '') => {
  const approved = status === 'approved';

  const typeLabels = {
    course: { noun: 'Course', action: approved ? 'approved and published' : 'rejected' },
    instructor: { noun: 'Instructor Application', action: approved ? 'approved' : 'rejected' },
  };
  const t = typeLabels[type] || typeLabels.course;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:16px;border:1px solid ${approved ? '#d1fae5' : '#fee2e2'};overflow:hidden;max-width:100%;">
        <tr>
          <td style="background:${approved ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#dc2626,#ef4444)'};padding:28px 36px;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <span style="color:#fff;font-size:20px;">${approved ? '✅' : '❌'}</span>
              <span style="color:#fff;font-size:18px;font-weight:900;">TechiGuru</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">
              Your ${t.noun} has been ${t.action}!
            </h1>
            <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">Hi <strong>${name || 'there'}</strong>, here's an update on your submission.</p>
            <div style="background:${approved ? '#f0fdf4' : '#fef2f2'};border:1px solid ${approved ? '#a7f3d0' : '#fecaca'};border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>${t.noun}:</strong> ${itemTitle}</p>
              <p style="margin:4px 0;font-size:13px;color:${approved ? '#065f46' : '#991b1b'};font-weight:700;">Status: ${approved ? 'Approved ✅' : 'Rejected ❌'}</p>
              ${!approved && reason ? `<p style="margin:12px 0 0;font-size:13px;color:#6b7280;"><strong>Reason:</strong> ${reason}</p>` : ''}
              ${approved ? `<p style="margin:12px 0 0;font-size:13px;color:#065f46;">You can now access all ${type === 'course' ? 'course features' : 'instructor tools'} on the platform.</p>` : ''}
            </div>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" target="_blank"
              style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">Go to Dashboard</a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${approved ? '✅' : '❌'} Your ${t.noun} has been ${t.action} — TechiGuru`,
    html,
  });
};

module.exports = { generateOTP, sendOTPEmail, sendVerificationLinkEmail, sendContactTicketEmail, sendContactAdminNotifyEmail, sendStatusChangeEmail };
