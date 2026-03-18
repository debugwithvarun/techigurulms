const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const BASE_STYLE = `
  <style>
    body{margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;}
    .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
    .hdr{padding:32px 36px;text-align:center;}
    .logo{font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;}
    .body{padding:36px;}
    .title{font-size:22px;font-weight:800;color:#111827;margin:0 0 8px;}
    .sub{font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 28px;}
    .box{border-radius:12px;padding:20px;margin-bottom:24px;}
    .btn{display:inline-block;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;color:#fff;}
    .footer{padding:16px 36px;border-top:1px solid #f3f4f6;text-align:center;font-size:11px;color:#9ca3af;}
  </style>`;

// ── 1. Application received ────────────────────────────────────────────────────
const sendApplicationReceivedEmail = async (email, name, role) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">
      <div class="logo">🎓 TechiGuru Internship</div>
    </div>
    <div class="body">
      <h1 class="title">Application Received! 🎉</h1>
      <p class="sub">Hi <strong>${name}</strong>, we've successfully received your internship application for <strong>${role}</strong>.</p>
      <div class="box" style="background:#f5f3ff;border:1px solid #ddd6fe;">
        <p style="margin:0;font-size:13px;color:#374151;">Our HR team will review your application and get back to you within <strong style="color:#7c3aed;">3–5 business days</strong>. We'll notify you at this email address.</p>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">In the meantime, you can continue exploring our courses and certificates at <a href="https://techiguru.in" style="color:#7c3aed;">techiguru.in</a>.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Internship Application Received — ${role} | TechiGuru`,
    html,
  });
};

// ── 2. Application rejected ────────────────────────────────────────────────────
const sendApplicationRejectedEmail = async (email, name, role, reason = '') => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#6b7280,#374151);">
      <div class="logo">TechiGuru Internship</div>
    </div>
    <div class="body">
      <h1 class="title">Application Update</h1>
      <p class="sub">Hi <strong>${name}</strong>, thank you for applying for the <strong>${role}</strong> internship at TechiGuru.</p>
      <div class="box" style="background:#fef2f2;border:1px solid #fecaca;">
        <p style="margin:0;font-size:14px;color:#991b1b;font-weight:700;">We regret to inform you that we are unable to move forward with your application at this time.</p>
        ${reason ? `<p style="margin:10px 0 0;font-size:13px;color:#6b7280;">${reason}</p>` : ''}
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">We appreciate the time you invested and encourage you to reapply in the future. We wish you all the best in your career journey.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Application Update — ${role} Internship | TechiGuru`,
    html,
  });
};

// ── 3. Interview scheduled ─────────────────────────────────────────────────────
const sendInterviewScheduledEmail = async (email, name, role, meetLink, scheduledAt) => {
  const dateStr = scheduledAt
    ? new Date(scheduledAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
    : 'To be confirmed';

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#0ea5e9,#6366f1);">
      <div class="logo">🗓️ Interview Scheduled</div>
    </div>
    <div class="body">
      <h1 class="title">Congratulations, ${name}! 🎊</h1>
      <p class="sub">You have been shortlisted for the <strong>${role}</strong> internship interview at TechiGuru.</p>
      <div class="box" style="background:#eff6ff;border:1px solid #bfdbfe;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563eb;">Interview Details</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Date & Time:</strong> ${dateStr}</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Format:</strong> Google Meet (Video Interview)</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Role:</strong> ${role}</p>
      </div>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${meetLink}" class="btn" style="background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:0 4px 16px rgba(99,102,241,0.35);">
          🎥 Join Interview
        </a>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">Please be ready 5 minutes before the scheduled time. Make sure your camera and microphone are working. We look forward to speaking with you!</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🗓️ Interview Scheduled — ${role} Internship | TechiGuru`,
    html,
  });
};

// ── 4. Post-interview rejection ────────────────────────────────────────────────
const sendPostInterviewRejectedEmail = async (email, name, role) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#6b7280,#374151);">
      <div class="logo">TechiGuru Internship</div>
    </div>
    <div class="body">
      <h1 class="title">Interview Outcome</h1>
      <p class="sub">Hi <strong>${name}</strong>, thank you for taking the time to interview for the <strong>${role}</strong> internship at TechiGuru.</p>
      <div class="box" style="background:#fef2f2;border:1px solid #fecaca;">
        <p style="margin:0;font-size:14px;color:#991b1b;font-weight:700;">We regret to inform you that we will not be moving forward with your application at this time.</p>
        <p style="margin:10px 0 0;font-size:13px;color:#6b7280;">It was a pleasure meeting you, and we appreciate the effort you put into the interview process.</p>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">We encourage you to continue developing your skills and reapply in a future intake. Best of luck in your journey!</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Interview Outcome — ${role} Internship | TechiGuru`,
    html,
  });
};

// ── 5. Selected for internship ─────────────────────────────────────────────────
const sendSelectedEmail = async (email, name, role, startDate) => {
  const dateStr = startDate
    ? new Date(startDate).toLocaleDateString('en-IN', { dateStyle: 'long' })
    : 'To be communicated';

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#059669,#10b981);">
      <div class="logo">🎉 Congratulations!</div>
    </div>
    <div class="body">
      <h1 class="title">You're Selected! 🚀</h1>
      <p class="sub">Hi <strong>${name}</strong>, we are thrilled to inform you that you have been selected for the <strong>${role}</strong> internship at TechiGuru!</p>
      <div class="box" style="background:#f0fdf4;border:1px solid #a7f3d0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#065f46;">Next Steps</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;">✅ Your offer letter will be sent to you shortly.</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;">✅ An HR coordinator will be assigned to guide you.</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;">✅ Expected start date: <strong>${dateStr}</strong></p>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">We will be in touch soon with further details. Welcome to the TechiGuru family! 🎓</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 You're Selected — ${role} Internship | TechiGuru`,
    html,
  });
};

// ── 6. Offer letter sent ───────────────────────────────────────────────────────
const sendOfferLetterEmail = async (email, name, role, offerUrl) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">
      <div class="logo">📄 Offer Letter</div>
    </div>
    <div class="body">
      <h1 class="title">Your Offer Letter is Ready!</h1>
      <p class="sub">Hi <strong>${name}</strong>, your official offer letter for the <strong>${role}</strong> internship at TechiGuru is now available.</p>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${offerUrl}" class="btn" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">📄 View Offer Letter</a>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">Please review the offer letter and confirm your acceptance through the intern portal. If you have any questions, contact your assigned HR coordinator.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `📄 Offer Letter — ${role} Internship | TechiGuru`,
    html,
  });
};

// ── 7. SubHR assignment notification ──────────────────────────────────────────
const sendSubHRAssignedEmail = async (subHREmail, subHRName, internName, internEmail, role) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#0ea5e9,#7c3aed);">
      <div class="logo">👤 New Intern Assigned</div>
    </div>
    <div class="body">
      <h1 class="title">Intern Assigned to You</h1>
      <p class="sub">Hi <strong>${subHRName}</strong>, a new intern has been assigned to you for mentorship and coordination.</p>
      <div class="box" style="background:#eff6ff;border:1px solid #bfdbfe;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563eb;">Intern Details</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Name:</strong> ${internName}</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Email:</strong> ${internEmail}</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Role:</strong> ${role}</p>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">Please log in to your Sub HR dashboard to assign tasks, schedule meetings, and track their progress.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: subHREmail,
    subject: `👤 New Intern Assigned — ${internName} | TechiGuru HR`,
    html,
  });
};

// ── 8. Certificate approved ────────────────────────────────────────────────────
const sendCertificateApprovedEmail = async (email, name, role, certUrl) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#f59e0b,#d97706);">
      <div class="logo">🏆 Certificate Ready</div>
    </div>
    <div class="body">
      <h1 class="title">Your Certificate is Approved! 🎓</h1>
      <p class="sub">Hi <strong>${name}</strong>, your internship completion certificate for <strong>${role}</strong> has been approved by Head HR.</p>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${certUrl}" class="btn" style="background:linear-gradient(135deg,#f59e0b,#d97706);">🏆 Download Certificate</a>
      </div>
      <p style="font-size:13px;color:#6b7280;line-height:1.6;">Congratulations on successfully completing your internship at TechiGuru! We wish you a bright future ahead. 🚀</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🏆 Internship Certificate Approved | TechiGuru`,
    html,
  });
};

// ── 9. Meet link sent to intern group ─────────────────────────────────────────
const sendMeetLinkEmail = async (email, name, meetLink, title, scheduledAt) => {
  const dateStr = scheduledAt
    ? new Date(scheduledAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
    : 'Check with your HR';

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>${BASE_STYLE}</head>
  <body><div class="wrap">
    <div class="hdr" style="background:linear-gradient(135deg,#0ea5e9,#06b6d4);">
      <div class="logo">📹 Meeting Scheduled</div>
    </div>
    <div class="body">
      <h1 class="title">${title}</h1>
      <p class="sub">Hi <strong>${name}</strong>, your HR coordinator has scheduled a meeting for you.</p>
      <div class="box" style="background:#eff6ff;border:1px solid #bfdbfe;">
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Time:</strong> ${dateStr}</p>
      </div>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${meetLink}" class="btn" style="background:linear-gradient(135deg,#0ea5e9,#06b6d4);">📹 Join Meeting</a>
      </div>
    </div>
    <div class="footer">© ${new Date().getFullYear()} TechiGuru. All rights reserved.</div>
  </div></body></html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `TechiGuru <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `📹 Meeting Scheduled — ${title} | TechiGuru`,
    html,
  });
};

module.exports = {
  sendApplicationReceivedEmail,
  sendApplicationRejectedEmail,
  sendInterviewScheduledEmail,
  sendPostInterviewRejectedEmail,
  sendSelectedEmail,
  sendOfferLetterEmail,
  sendSubHRAssignedEmail,
  sendCertificateApprovedEmail,
  sendMeetLinkEmail,
};