import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Eye,
  Video,
  UserCheck,
  Award,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Upload,
  Ticket,
  AlertCircle,
  Briefcase,
  Mail,
  Phone,
  GraduationCap,
  Star,
  Send,
  Download,
  Shield,
  Bell,
  MoreVertical,
  Check,
  Loader2,
} from "lucide-react";

// ── Design tokens (matching site theme) ──────────────────────────────────────
const PURPLE = "#7c3aed";
const INDIGO = "#4f46e5";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  interviewed: {
    label: "Interviewed",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  selected: {
    label: "Selected",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  offer_sent: {
    label: "Offer Sent",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  enrolled: {
    label: "Enrolled",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
  certificate_issued: {
    label: "Certificate Issued",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    color: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}
      >
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-black text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </div>
);

// ── Application Detail Modal ───────────────────────────────────────────────────
const ApplicationModal = ({ app, onClose, onAction, subHRList, loading }) => {
  const [interviewLink, setInterviewLink] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedSubHR, setSelectedSubHR] = useState("");
  const [offerLetterUrl, setOfferLetterUrl] = useState("");
  const [certUrl, setCertUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeSection, setActiveSection] = useState("info");
  const [offerFile, setOfferFile] = useState(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://api.techiguru.in";

  const handleOfferUpload = async () => {
    if (!offerFile) return;
    const fd = new FormData();
    fd.append("file", offerFile);
    try {
      const { data } = await api.post("/internship/upload-doc", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOfferLetterUrl(data.url);
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (!app) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div>
            <h2 className="text-xl font-black text-white">{app.fullName}</h2>
            <p className="text-purple-200 text-sm mt-0.5">
              {app.role} · {app.college}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={app.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50">
          {[
            { id: "info", label: "Application" },
            { id: "resume", label: "Resume" },
            { id: "interview", label: "Interview" },
            { id: "offer", label: "Offer / Certificate" },
            { id: "hr", label: "HR Assignment" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-3.5 text-xs font-bold transition-colors border-b-2 -mb-px
                                ${
                                  activeSection === tab.id
                                    ? "border-purple-600 text-purple-700"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {/* ── Info Tab ── */}
          {activeSection === "info" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Email", value: app.email },
                  { label: "Phone", value: app.phone },
                  { label: "Branch", value: app.branch },
                  { label: "Year", value: app.year },
                  {
                    label: "Applied",
                    value: new Date(app.createdAt).toLocaleDateString("en-IN"),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              {app.skills && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-2">
                    Skills
                  </p>
                  <p className="text-sm text-gray-700">{app.skills}</p>
                </div>
              )}
              {app.experience && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Background / Experience
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {app.experience}
                  </p>
                </div>
              )}
              {app.whyUs && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2">
                    Why TechiGuru?
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {app.whyUs}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                {app.status === "pending" && (
                  <button
                    onClick={() => onAction("shortlist", app._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    ✓ Shortlist
                  </button>
                )}
                {/* Mark as Interviewed (after interview is scheduled) */}
                {app.status === "interview_scheduled" && (
                  <button
                    onClick={() => onAction("mark_interviewed", app._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    ✅ Mark as Interviewed
                  </button>
                )}
                {/* Reject — available for pending, shortlisted, interview_scheduled, interviewed */}
                {[
                  "pending",
                  "shortlisted",
                  "interview_scheduled",
                  "interviewed",
                ].includes(app.status) && (
                  <div className="flex gap-2 flex-1">
                    <input
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Rejection reason (optional)..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-red-400"
                    />
                    <button
                      onClick={() =>
                        onAction("reject", app._id, {
                          reason: rejectionReason,
                          stage: [
                            "interview_scheduled",
                            "interviewed",
                          ].includes(app.status)
                            ? "post_interview"
                            : "application",
                        })
                      }
                      disabled={loading}
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
                {/* Select / Approve — after interview or interview_scheduled */}
                {["interview_scheduled", "interviewed"].includes(
                  app.status
                ) && (
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    />
                    <button
                      onClick={() =>
                        onAction("select", app._id, { startDate, endDate })
                      }
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      🎉 Select Candidate
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Resume Tab ── */}
          {activeSection === "resume" && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              {app.resumeUrl ? (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <FileText size={18} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {app.resumeName || "Resume"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded by applicant
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${backendUrl}${app.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700"
                    >
                      <ExternalLink size={14} /> View Resume
                    </a>
                  </div>
                  {/* Inline PDF viewer */}
                  {app.resumeUrl.toLowerCase().endsWith(".pdf") && (
                    <div
                      className="w-full rounded-2xl overflow-hidden border border-gray-200"
                      style={{ height: "500px" }}
                    >
                      <iframe
                        src={`${backendUrl}${app.resumeUrl}`}
                        className="w-full h-full"
                        title="Resume Preview"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No resume uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* ── Interview Tab ── */}
          {activeSection === "interview" && (
            <div className="space-y-5">
              {app.interviewLink && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                      Scheduled Interview
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {app.interviewScheduledAt
                        ? new Date(app.interviewScheduledAt).toLocaleString(
                            "en-IN"
                          )
                        : "Time not set"}
                    </p>
                    <a
                      href={app.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 font-semibold hover:underline"
                    >
                      {app.interviewLink}
                    </a>
                  </div>
                  <Video size={24} className="text-indigo-400" />
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">
                  Schedule New Interview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Google Meet Link *
                    </label>
                    <input
                      value={interviewLink}
                      onChange={(e) => setInterviewLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() =>
                    onAction("schedule_interview", app._id, {
                      meetLink: interviewLink,
                      scheduledAt: interviewDate,
                    })
                  }
                  disabled={loading || !interviewLink}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Video size={14} />
                  )}
                  Send Interview Invite
                </button>
              </div>
            </div>
          )}

          {/* ── Offer / Certificate Tab ── */}
          {activeSection === "offer" && (
            <div className="space-y-6">
              {/* Offer Letter */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FileText size={15} className="text-purple-600" /> Offer
                  Letter
                </h3>
                {app.offerLetterUrl && (
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                    <FileText size={16} className="text-purple-600" />
                    <span className="text-sm text-gray-700 flex-1">
                      Offer letter sent
                    </span>
                    <a
                      href={
                        app.offerLetterUrl.startsWith("http")
                          ? app.offerLetterUrl
                          : `${backendUrl}${app.offerLetterUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-purple-600 hover:underline"
                    >
                      View
                    </a>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Offer Letter URL (or upload)
                  </label>
                  <input
                    value={offerLetterUrl}
                    onChange={(e) => setOfferLetterUrl(e.target.value)}
                    placeholder="https://... or paste generated PDF URL"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() =>
                    onAction("offer_letter", app._id, { offerLetterUrl })
                  }
                  disabled={loading || !offerLetterUrl}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Send Offer Letter
                </button>
              </div>

              {/* Certificate */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <Award size={15} className="text-yellow-500" /> Internship
                  Certificate
                </h3>
                {app.certificateApproved && (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700 font-semibold">
                    <CheckCircle size={14} /> Certificate approved & sent to
                    intern
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Certificate URL
                  </label>
                  <input
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
                    placeholder="https://... generated certificate URL"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() =>
                    onAction("approve_certificate", app._id, {
                      certificateUrl: certUrl,
                    })
                  }
                  disabled={loading || !certUrl || app.certificateApproved}
                  className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-white text-sm font-bold rounded-xl hover:bg-yellow-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Award size={14} />
                  )}
                  Approve & Send Certificate
                </button>
              </div>
            </div>
          )}

          {/* ── HR Assignment Tab ── */}
          {activeSection === "hr" && (
            <div className="space-y-5">
              {app.subHR && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-3">
                  <UserCheck size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-blue-500 uppercase">
                      Assigned Sub HR
                    </p>
                    <p className="font-semibold text-gray-800">
                      {app.subHR.name} · {app.subHR.email}
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">
                  Assign Sub HR Coordinator
                </h3>
                <select
                  value={selectedSubHR}
                  onChange={(e) => setSelectedSubHR(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
                >
                  <option value="">Select Sub HR</option>
                  {subHRList.map((hr) => (
                    <option key={hr._id} value={hr._id}>
                      {hr.name} — {hr.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    onAction("assign_subhr", app._id, {
                      subHRId: selectedSubHR,
                    })
                  }
                  disabled={loading || !selectedSubHR}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <UserCheck size={14} />
                  )}
                  Assign Sub HR
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const HeadHRDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [subHRList, setSubHRList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, ticketsRes, subHRRes] = await Promise.all([
        api.get("/internship/all"),
        api.get("/internship/tickets/all"),
        api.get("/internship/hr-users").catch(() => ({ data: [] })),
      ]);
      setApplications(appsRes.data || []);
      setTickets(ticketsRes.data || []);
      setSubHRList((subHRRes.data || []).filter((u) => u.role === "subhr"));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "headhr" && user.role !== "admin") {
      navigate("/");
      return;
    }
    loadAll();
  }, [user, navigate, loadAll]);

  const handleAction = useCallback(
    async (action, appId, payload = {}) => {
      setActionLoading(true);
      try {
        const endpoints = {
          shortlist: `/internship/${appId}/shortlist`,
          schedule_interview: `/internship/${appId}/schedule-interview`,
          mark_interviewed: `/internship/${appId}/mark-interviewed`,
          reject: `/internship/${appId}/reject`,
          select: `/internship/${appId}/select`,
          assign_subhr: `/internship/${appId}/assign-subhr`,
          offer_letter: `/internship/${appId}/offer-letter`,
          approve_certificate: `/internship/${appId}/approve-certificate`,
          complete: `/internship/${appId}/complete`,
        };
        const method =
          action === "shortlist"
            ? api.put
            : action === "reject"
            ? api.put
            : api.put;
        await method(endpoints[action], payload);
        await loadAll();
        if (selectedApp?._id === appId) {
          const { data } = await api.get(`/internship/${appId}`);
          setSelectedApp(data);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Action failed");
      }
      setActionLoading(false);
    },
    [loadAll, selectedApp]
  );

  const handleTicketClose = async (id) => {
    await api.put(`/internship/tickets/${id}/close`).catch(console.error);
    loadAll();
  };

  const filtered = applications.filter((a) => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchSearch =
      !search ||
      [a.fullName, a.email, a.role, a.college].some((f) =>
        f?.toLowerCase().includes(search.toLowerCase())
      );
    return matchStatus && matchSearch;
  });

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    selected: applications.filter((a) =>
      ["selected", "enrolled", "completed"].includes(a.status)
    ).length,
    enrolled: applications.filter((a) => a.status === "enrolled").length,
    openTickets: tickets.filter((t) => t.status === "open").length,
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    {
      id: "applications",
      label: "Applications",
      icon: FileText,
      badge: stats.pending,
    },
    {
      id: "enrolled",
      label: "Active Interns",
      icon: Users,
      badge: stats.enrolled,
    },
    { id: "tickets", label: "Tickets", icon: Ticket, badge: stats.openTickets },
  ];

  const sidebarContent = (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#1c1d1f" }}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: PURPLE }}
        >
          <Briefcase size={17} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm">Head HR</p>
          <p className="text-gray-400 text-[11px]">TechiGuru Internship</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden text-gray-400"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: PURPLE }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user?.name}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: active ? "rgba(124,58,237,0.15)" : "transparent",
                color: active ? "#c084fc" : "#9ca3af",
                borderLeft: active
                  ? `3px solid ${PURPLE}`
                  : "3px solid transparent",
              }}
            >
              <tab.icon size={17} className="shrink-0" />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="ml-auto w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading HR Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block w-[220px] min-h-screen fixed left-0 top-0 z-40">
        {sidebarContent}
      </div>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26 }}
              className="fixed inset-y-0 left-0 w-[220px] z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:pl-[220px] flex flex-col">
        {/* Topbar mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-gray-900">HR Dashboard</span>
          <button onClick={loadAll} className="p-2 text-gray-400">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900 capitalize">
                {activeTab === "overview"
                  ? "Dashboard"
                  : TABS.find((t) => t.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                TechiGuru Internship Management
              </p>
            </div>
            <button
              onClick={loadAll}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                  label="Total Applications"
                  value={stats.total}
                  icon={FileText}
                  color="#7c3aed"
                  bg="bg-purple-50"
                />
                <StatCard
                  label="Pending Review"
                  value={stats.pending}
                  icon={Clock}
                  color="#f59e0b"
                  bg="bg-amber-50"
                />
                <StatCard
                  label="Shortlisted"
                  value={stats.shortlisted}
                  icon={Star}
                  color="#3b82f6"
                  bg="bg-blue-50"
                />
                <StatCard
                  label="Selected"
                  value={stats.selected}
                  icon={CheckCircle}
                  color="#10b981"
                  bg="bg-green-50"
                />
                <StatCard
                  label="Active Interns"
                  value={stats.enrolled}
                  icon={Users}
                  color="#6366f1"
                  bg="bg-indigo-50"
                />
                <StatCard
                  label="Open Tickets"
                  value={stats.openTickets}
                  icon={Ticket}
                  color="#ef4444"
                  bg="bg-red-50"
                />
              </div>

              {/* Recent applications */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">
                    Recent Applications
                  </h3>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="text-sm font-semibold text-purple-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                        <th className="px-5 py-3 text-left">Applicant</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Applied</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.slice(0, 5).map((a) => (
                        <tr key={a._id} className="hover:bg-gray-50">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-sm">
                                {a.fullName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {a.fullName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {a.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-600 text-xs font-medium">
                            {a.role}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={a.status} />
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-400">
                            {new Date(a.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => setSelectedApp(a)}
                              className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100"
                            >
                              <Eye size={13} className="inline mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {activeTab === "applications" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, college, role..."
                    className="flex-1 text-sm outline-none text-gray-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "all",
                    "pending",
                    "shortlisted",
                    "interview_scheduled",
                    "interviewed",
                    "selected",
                    "rejected",
                    "enrolled",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize
                                                ${
                                                  statusFilter === s
                                                    ? "bg-purple-600 text-white border-purple-600"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                                }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-3.5 border-b border-gray-100">
                  <span className="font-semibold text-gray-900 text-sm">
                    {filtered.length} applications
                  </span>
                </div>
                {filtered.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <FileText size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                          <th className="px-5 py-3 text-left">Applicant</th>
                          <th className="px-5 py-3 text-left">Role</th>
                          <th className="px-5 py-3 text-left">College</th>
                          <th className="px-5 py-3 text-left">Status</th>
                          <th className="px-5 py-3 text-left">Applied</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filtered.map((a) => (
                          <tr key={a._id} className="hover:bg-gray-50">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-sm shrink-0">
                                  {a.fullName?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 truncate max-w-[130px]">
                                    {a.fullName}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate max-w-[130px]">
                                    {a.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-gray-600 text-xs max-w-[120px] truncate">
                              {a.role}
                            </td>
                            <td className="px-5 py-3 text-gray-500 text-xs max-w-[120px] truncate">
                              {a.college}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={a.status} />
                            </td>
                            <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                              {new Date(a.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => setSelectedApp(a)}
                                className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100"
                              >
                                <Eye size={13} className="inline mr-1" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ENROLLED / ACTIVE INTERNS ── */}
          {activeTab === "enrolled" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {applications
                  .filter((a) =>
                    ["enrolled", "completed", "offer_sent"].includes(a.status)
                  )
                  .map((a) => (
                    <div
                      key={a._id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                            {a.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {a.fullName}
                            </p>
                            <p className="text-xs text-gray-400">{a.role}</p>
                          </div>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="space-y-1.5 mb-4">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">College:</span>{" "}
                          {a.college}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Sub HR:</span>{" "}
                          {a.subHR?.name || "Not assigned"}
                        </p>
                        {a.internshipStartDate && (
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Start:</span>{" "}
                            {new Date(a.internshipStartDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedApp(a)}
                        className="w-full py-2 bg-purple-50 text-purple-700 text-sm font-bold rounded-xl hover:bg-purple-100"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                {applications.filter((a) =>
                  ["enrolled", "completed", "offer_sent"].includes(a.status)
                ).length === 0 && (
                  <div className="col-span-3 py-16 text-center text-gray-400">
                    <Users size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No active interns yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TICKETS ── */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">
                    All Support Tickets
                  </h3>
                </div>
                {tickets.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <Ticket size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No tickets raised yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {tickets.map((t) => (
                      <div
                        key={t._id}
                        className="px-6 py-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-start gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-sm">
                              {t.raisedBy?.name}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.priority === "urgent"
                                  ? "bg-red-100 text-red-700"
                                  : t.priority === "high"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {t.priority}
                            </span>
                            <span
                              className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === "open"
                                  ? "bg-amber-100 text-amber-700"
                                  : t.status === "resolved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {t.status}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-700 text-sm mb-1">
                            📌 {t.subject}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {t.description}
                          </p>
                          {t.assignedSubHR && (
                            <p className="text-xs text-gray-400 mt-1">
                              Sub HR: {t.assignedSubHR.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(t.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        {t.status !== "closed" && (
                          <button
                            onClick={() => handleTicketClose(t._id)}
                            className="shrink-0 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200"
                          >
                            Close Ticket
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <ApplicationModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onAction={handleAction}
            subHRList={subHRList}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeadHRDashboard;
