const InternshipApplication = require('../models/InternshipApplication');
const InternTask = require('../models/InternTask');
const InternTicket = require('../models/InternTicket');
const InternProgress = require('../models/InternProgress');
const User = require('../models/User');
const mongoose = require('mongoose');
const {
  sendApplicationReceivedEmail,
  sendApplicationRejectedEmail,
  sendInterviewScheduledEmail,
  sendPostInterviewRejectedEmail,
  sendSelectedEmail,
  sendOfferLetterEmail,
  sendSubHRAssignedEmail,
  sendCertificateApprovedEmail,
  sendMeetLinkEmail,
} = require('../utlis/internshipEmailService');

// ── Helper: reject non-ObjectId values before querying MongoDB ─────────────────
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;



// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Apply for internship  POST /api/internship/apply
// ─────────────────────────────────────────────────────────────────────────────
const applyForInternship = async (req, res) => {
  try {
    const { fullName, email, phone, college, branch, year, role, experience, skills, whyUs } = req.body;

    if (!fullName || !email || !phone || !college || !branch || !year || !role) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // One active application per user per role (pending / shortlisted)
    const existing = await InternshipApplication.findOne({
      applicant: req.user._id,
      role,
      status: { $in: ['pending', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'enrolled'] },
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have an active application for this role.' });
    }

    const resumeUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    const resumeName = req.file.originalname;

    const app = await InternshipApplication.create({
      applicant: req.user._id,
      fullName, email, phone, college, branch, year, role,
      experience: experience || '',
      skills: skills || '',
      whyUs: whyUs || '',
      resumeUrl,
      resumeName,
    });

    // Confirmation email (non-blocking)
    sendApplicationReceivedEmail(email, fullName, role).catch(console.error);

    res.status(201).json({ message: 'Application submitted successfully!', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/my  — applicant views their own application(s)
const getMyApplications = async (req, res) => {
  try {
    const apps = await InternshipApplication.find({ applicant: req.user._id })
      .populate('subHR', 'name email')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HEAD HR — All applications
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/internship/all
const getAllApplications = async (req, res) => {
  try {
    const { status, role, search } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (role) query.role = { $regex: role, $options: 'i' };
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }
    const apps = await InternshipApplication.find(query)
      .populate('applicant', 'name email avatar')
      .populate('subHR', 'name email')
      .populate('headHR', 'name email')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/:id — single application detail
const getApplicationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const app = await InternshipApplication.findById(req.params.id)
      .populate('applicant', 'name email avatar profilePoints')
      .populate('subHR', 'name email')
      .populate('headHR', 'name email');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/shortlist
const shortlistApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'shortlisted', headHR: req.user._id },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application shortlisted', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/schedule-interview
const scheduleInterview = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const { meetLink, scheduledAt } = req.body;
    if (!meetLink) return res.status(400).json({ message: 'Meet link is required' });

    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'interview_scheduled',
        interviewLink: meetLink,
        interviewScheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        headHR: req.user._id,
      },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    sendInterviewScheduledEmail(app.email, app.fullName, app.role, meetLink, scheduledAt).catch(console.error);

    res.json({ message: 'Interview scheduled and email sent', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/reject
const rejectApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const { reason, stage } = req.body; // stage: 'application' | 'post_interview'
    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || '', headHR: req.user._id },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (stage === 'post_interview') {
      sendPostInterviewRejectedEmail(app.email, app.fullName, app.role).catch(console.error);
    } else {
      sendApplicationRejectedEmail(app.email, app.fullName, app.role, reason).catch(console.error);
    }

    res.json({ message: 'Application rejected and email sent', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/mark-interviewed
const markInterviewed = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'interviewed', headHR: req.user._id },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application marked as interviewed', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/select
const selectCandidate = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const { startDate, durationMonths, endDate } = req.body;
    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'selected',
        headHR: req.user._id,
        internshipStartDate: startDate ? new Date(startDate) : undefined,
        internshipEndDate: endDate ? new Date(endDate) : undefined,
        durationMonths: durationMonths || 0,
      },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    sendSelectedEmail(app.email, app.fullName, app.role, startDate).catch(console.error);

    res.json({ message: 'Candidate selected and email sent', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/assign-subhr
const assignSubHR = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Application not found' });
    const { subHRId } = req.body;
    if (!subHRId) return res.status(400).json({ message: 'subHRId is required' });

    const subHR = await User.findById(subHRId);
    if (!subHR || subHR.role !== 'subhr') {
      return res.status(400).json({ message: 'Invalid Sub HR user' });
    }

    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { subHR: subHRId, status: 'enrolled' },
      { new: true }
    ).populate('subHR', 'name email');
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // Also update the User role to 'intern' if they're a student
    await User.findByIdAndUpdate(app.applicant, { role: 'intern' });

    sendSubHRAssignedEmail(subHR.email, subHR.name, app.fullName, app.email, app.role).catch(console.error);

    res.json({ message: 'Sub HR assigned and email sent', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/offer-letter
const sendOfferLetter = async (req, res) => {
  try {
    const { offerLetterUrl } = req.body;  // URL to uploaded or generated PDF
    if (!offerLetterUrl) return res.status(400).json({ message: 'Offer letter URL is required' });

    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { offerLetterUrl, offerLetterSentAt: new Date(), status: 'offer_sent' },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const fullUrl = offerLetterUrl.startsWith('http')
      ? offerLetterUrl
      : `${process.env.BACKEND_URL}${offerLetterUrl}`;

    sendOfferLetterEmail(app.email, app.fullName, app.role, fullUrl).catch(console.error);

    res.json({ message: 'Offer letter sent', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/approve-certificate
const approveCertificate = async (req, res) => {
  try {
    const { certificateUrl } = req.body;
    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      {
        certificateUrl: certificateUrl || '',
        certificateApproved: true,
        certificateApprovedAt: new Date(),
        certificateApprovedBy: req.user._id,
        status: 'certificate_issued',
      },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const fullUrl = certificateUrl.startsWith('http')
      ? certificateUrl
      : `${process.env.BACKEND_URL}${certificateUrl}`;

    sendCertificateApprovedEmail(app.email, app.fullName, app.role, fullUrl).catch(console.error);

    res.json({ message: 'Certificate approved and email sent', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/:id/complete
const markCompleted = async (req, res) => {
  try {
    const app = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Internship marked as completed', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB HR — Interns under this SubHR
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/internship/my-interns  (SubHR only)
const getMyInterns = async (req, res) => {
  try {
    const apps = await InternshipApplication.find({
      subHR: req.user._id,
      status: { $in: ['enrolled', 'completed', 'certificate_issued', 'offer_sent'] },
    })
      .populate('applicant', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/internship/:id/send-meet  (SubHR)
const sendMeetLink = async (req, res) => {
  try {
    const { meetLink, title, scheduledAt, internIds } = req.body;
    // internIds: array of application IDs (for group) or single
    if (!meetLink || !title) return res.status(400).json({ message: 'meetLink and title are required' });

    const ids = internIds && internIds.length ? internIds : [req.params.id];
    const apps = await InternshipApplication.find({ _id: { $in: ids } });

    for (const app of apps) {
      sendMeetLinkEmail(app.email, app.fullName, meetLink, title, scheduledAt).catch(console.error);
    }

    res.json({ message: `Meet link sent to ${apps.length} intern(s)` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/internship/tasks  (SubHR assigns task)
const assignTask = async (req, res) => {
  try {
    const { applicationId, title, description, dueDate, priority } = req.body;
    if (!applicationId || !title) return res.status(400).json({ message: 'applicationId and title are required' });

    const app = await InternshipApplication.findById(applicationId);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const task = await InternTask.create({
      intern: app.applicant,
      application: applicationId,
      assignedBy: req.user._id,
      title,
      description: description || '',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'medium',
    });

    res.status(201).json({ message: 'Task assigned', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/tasks/my  (intern views own tasks)
const getMyTasks = async (req, res) => {
  try {
    const tasks = await InternTask.find({ intern: req.user._id })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/tasks/intern/:applicationId  (SubHR views tasks for one intern)
const getTasksForIntern = async (req, res) => {
  try {
    const app = await InternshipApplication.findById(req.params.applicationId);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    const tasks = await InternTask.find({ application: req.params.applicationId })
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/tasks/:id/submit  (intern submits task)
const submitTask = async (req, res) => {
  try {
    const { submissionUrl, submissionNote } = req.body;
    const task = await InternTask.findOneAndUpdate(
      { _id: req.params.id, intern: req.user._id },
      { status: 'submitted', submissionUrl: submissionUrl || '', submissionNote: submissionNote || '' },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task submitted', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/tasks/:id/review  (SubHR reviews task)
const reviewTask = async (req, res) => {
  try {
    const { status, feedbackNote } = req.body; // status: approved | revision_needed
    const task = await InternTask.findByIdAndUpdate(
      req.params.id,
      { status, feedbackNote: feedbackNote || '' },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task reviewed', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/tasks/:id  (SubHR edits task)
const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const task = await InternTask.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description: description || '',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || 'medium',
      },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/internship/tasks/:id  (SubHR deletes task)
const deleteTask = async (req, res) => {
  try {
    const task = await InternTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// TICKETS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/internship/tickets  (intern raises ticket)
const raiseTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    if (!subject || !description) return res.status(400).json({ message: 'Subject and description required' });

    // Find intern's active application
    const app = await InternshipApplication.findOne({
      applicant: req.user._id,
      status: { $in: ['enrolled', 'completed', 'offer_sent'] },
    });
    if (!app) return res.status(400).json({ message: 'No active internship found' });

    const ticket = await InternTicket.create({
      raisedBy: req.user._id,
      application: app._id,
      assignedSubHR: app.subHR,
      subject,
      description,
      priority: priority || 'medium',
    });

    res.status(201).json({ message: 'Ticket raised successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/tickets/my  (intern's own tickets)
const getMyTickets = async (req, res) => {
  try {
    const tickets = await InternTicket.find({ raisedBy: req.user._id })
      .populate('assignedSubHR', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/tickets/subhr  (SubHR sees tickets for their interns)
const getTicketsForSubHR = async (req, res) => {
  try {
    const tickets = await InternTicket.find({ assignedSubHR: req.user._id })
      .populate('raisedBy', 'name email avatar')
      .populate('application', 'role fullName')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/tickets/all  (Head HR sees all tickets)
const getAllTickets = async (req, res) => {
  try {
    const tickets = await InternTicket.find({})
      .populate('raisedBy', 'name email avatar')
      .populate('assignedSubHR', 'name email')
      .populate('application', 'role fullName')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/tickets/:id/resolve  (SubHR resolves)
const resolveTicket = async (req, res) => {
  try {
    const { resolution } = req.body;
    const ticket = await InternTicket.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolution: resolution || '', resolvedAt: new Date(), resolvedBy: req.user._id },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket resolved', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/tickets/:id/close  (Head HR closes)
const closeTicket = async (req, res) => {
  try {
    const ticket = await InternTicket.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket closed', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/internship/progress  (SubHR marks)
const markProgress = async (req, res) => {
  try {
    const { applicationId, rating, remarks, week } = req.body;
    if (!applicationId || !rating) return res.status(400).json({ message: 'applicationId and rating required' });

    const app = await InternshipApplication.findById(applicationId);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const progress = await InternProgress.create({
      intern: app.applicant,
      application: applicationId,
      markedBy: req.user._id,
      rating,
      remarks: remarks || '',
      week: week || 1,
    });

    res.status(201).json({ message: 'Progress marked', progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internship/progress/:applicationId
const getProgressForIntern = async (req, res) => {
  try {
    const progress = await InternProgress.find({ application: req.params.applicationId })
      .populate('markedBy', 'name')
      .sort({ week: 1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/internship/progress/:id/request-removal  (SubHR requests)
const requestRemoval = async (req, res) => {
  try {
    const { reason } = req.body;
    const progress = await InternProgress.findByIdAndUpdate(
      req.params.id,
      { removalRequested: true, removalRequestReason: reason || '', removalRequestedBy: req.user._id },
      { new: true }
    );
    if (!progress) return res.status(404).json({ message: 'Progress record not found' });
    res.json({ message: 'Removal request submitted', progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/internship/progress/:id/approve-removal  (Head HR approves)
const approveRemoval = async (req, res) => {
  try {
    const progress = await InternProgress.findByIdAndUpdate(
      req.params.id,
      { removalApproved: true },
      { new: true }
    ).populate('application');

    if (!progress) return res.status(404).json({ message: 'Progress record not found' });

    // Update application status
    await InternshipApplication.findByIdAndUpdate(progress.application._id, { status: 'rejected' });

    res.json({ message: 'Removal approved, intern removed from program', progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Full internship overview
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/internship/admin/all  (admin sees everything)
const getAdminInternshipOverview = async (req, res) => {
  try {
    const apps = await InternshipApplication.find({})
      .populate('applicant', 'name email avatar profilePoints enrolledCourses earnedCertificates badges')
      .populate('subHR', 'name email')
      .populate('headHR', 'name email')
      .sort({ createdAt: -1 });

    // Attach tasks + progress + tickets for each
    const enriched = await Promise.all(apps.map(async (app) => {
      const [tasks, progress, tickets] = await Promise.all([
        InternTask.find({ application: app._id }).lean(),
        InternProgress.find({ application: app._id }).lean(),
        InternTicket.find({ application: app._id }).lean(),
      ]);
      return { ...app.toObject(), tasks, progress, tickets };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HR MANAGEMENT (Admin creates Head HR / Sub HR)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/internship/hr-users  (admin lists all HR users)
const getHRUsers = async (req, res) => {
  try {
    const hrUsers = await User.find({ role: { $in: ['headhr', 'subhr'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(hrUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/internship/hr-users  (admin creates HR user)
const createHRUser = async (req, res) => {
  try {
    const { name, email, password, hrRole } = req.body; // hrRole: headhr | subhr
    if (!name || !email || !password || !hrRole) {
      return res.status(400).json({ message: 'name, email, password, and hrRole are required' });
    }
    if (!['headhr', 'subhr'].includes(hrRole)) {
      return res.status(400).json({ message: 'hrRole must be headhr or subhr' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'User with this email already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: hrRole,
      isEmailVerified: true,
      instructorStatus: 'approved',
    });

    res.status(201).json({
      message: `${hrRole === 'headhr' ? 'Head HR' : 'Sub HR'} account created`,
      user: user.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/internship/hr-users/:id  (admin removes HR user)
const deleteHRUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'HR user removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  applyForInternship,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  shortlistApplication,
  scheduleInterview,
  rejectApplication,
  selectCandidate,
  markInterviewed,
  assignSubHR,
  sendOfferLetter,
  approveCertificate,
  markCompleted,
  getMyInterns,
  sendMeetLink,
  assignTask,
  getMyTasks,
  getTasksForIntern,
  submitTask,
  reviewTask,
  updateTask,
  deleteTask,
  raiseTicket,
  getMyTickets,
  getTicketsForSubHR,
  getAllTickets,
  resolveTicket,
  closeTicket,
  markProgress,
  getProgressForIntern,
  requestRemoval,
  approveRemoval,
  getAdminInternshipOverview,
  getHRUsers,
  createHRUser,
  deleteHRUser,
};