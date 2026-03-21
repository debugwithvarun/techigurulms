import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Video,
  Plus,
  Search,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Ticket,
  BarChart3,
  Send,
  Loader2,
  AlertCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Calendar,
  ChevronDown,
  Briefcase,
  Edit2,
  Trash2,
} from "lucide-react";

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const PROGRESS_OPTIONS = [
  {
    value: "below_avg",
    label: "Below Average",
    icon: ArrowDown,
    color: "text-red-600 bg-red-50 border-red-200",
  },
  {
    value: "avg",
    label: "Average",
    icon: Minus,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    value: "above_avg",
    label: "Above Average",
    icon: ArrowUp,
    color: "text-green-600 bg-green-50 border-green-200",
  },
];

// ── Task Assignment Modal ──────────────────────────────────────────────────────
const TaskModal = ({ intern, initialData, onClose, onAssigned }) => {
  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title || "",
          description: initialData.description || "",
          dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
          priority: initialData.priority || "medium",
        }
      : { title: "", description: "", dueDate: "", priority: "medium" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (initialData?._id) {
        await api.put(`/internship/tasks/${initialData._id}`, form);
      } else {
        await api.post("/internship/tasks", {
          applicationId: intern._id,
          ...form,
        });
      }
      onAssigned();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">
            Assign Task to {intern.fullName}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Task Title *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
              placeholder="e.g. Build REST API for user auth"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Task details, requirements, resources..."
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dueDate: e.target.value }))
                }
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((p) => ({ ...p, priority: e.target.value }))
                }
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : initialData ? (
                <Edit2 size={14} />
              ) : (
                <Plus size={14} />
              )}{" "}
              {initialData ? "Update Task" : "Assign Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Meet Modal ─────────────────────────────────────────────────────────────────
const MeetModal = ({ interns, onClose }) => {
  const [meetLink, setMeetLink] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleIntern = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const selectAll = () => setSelected(interns.map((i) => i._id));
  const clearAll = () => setSelected([]);

  const handleSend = async () => {
    if (!meetLink || !title || selected.length === 0) return;
    setLoading(true);
    try {
      await api.post("/internship/send-meet", {
        meetLink,
        title,
        scheduledAt,
        internIds: selected,
      });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 flex items-center gap-2">
            <Video size={18} className="text-blue-600" /> Send Meet Link
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>
        {sent ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <p className="font-bold text-gray-900 mb-1">
              Meet link sent to {selected.length} intern(s)!
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Meeting Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Standup, Project Review..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Meet Link *
              </label>
              <input
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Scheduled At
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Recipients
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    All
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs font-bold text-gray-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 border border-gray-200 rounded-xl p-3">
                {interns.map((i) => (
                  <label
                    key={i._id}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(i._id)}
                      onChange={() => toggleIntern(i._id)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{i.fullName}</span>
                    <span className="text-xs text-gray-400">{i.email}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !meetLink || !title || selected.length === 0}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Send to {selected.length} intern(s)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ── Intern Detail Panel ────────────────────────────────────────────────────────
const InternPanel = ({
  intern,
  tasks,
  tickets,
  onClose,
  onTaskAssigned,
  onMarkProgress,
  onReviewTask,
  onResolveTicket,
}) => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [progressRating, setProgressRating] = useState("avg");
  const [progressRemarks, setProgressRemarks] = useState("");
  const [progressWeek, setProgressWeek] = useState(1);
  const [taskToReview, setTaskToReview] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [resolutionMap, setResolutionMap] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/internship/tasks/${taskId}`);
      onTaskAssigned(); // Refresh dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  if (!intern) return null;

  const SECTIONS = [
    { id: "tasks", label: `Tasks (${tasks.length})` },
    { id: "progress", label: "Mark Progress" },
    { id: "tickets", label: `Tickets (${tickets.length})` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 26 }}
        className="w-full max-w-xl bg-white h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div>
            <h2 className="text-lg font-black text-white">{intern.fullName}</h2>
            <p className="text-purple-200 text-xs mt-0.5">
              {intern.role} · {intern.college}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus size={12} /> Task
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30"
            >
              <X size={15} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-100 bg-gray-50 px-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-3 text-xs font-bold border-b-2 -mb-px transition-colors
                                ${
                                  activeSection === s.id
                                    ? "border-purple-600 text-purple-700"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Tasks */}
          {activeSection === "tasks" && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No tasks assigned yet</p>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="mt-4 px-5 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl"
                  >
                    Assign First Task
                  </button>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm group"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-sm truncate">
                            {task.title}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              PRIORITY_COLORS[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setShowTaskModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                                                ${
                                                  task.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : task.status ===
                                                      "submitted"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : task.status ===
                                                      "revision_needed"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(task.dueDate).toLocaleDateString("en-IN")}
                          </span>
                        )}
                      </div>
                      {task.status === "submitted" && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() =>
                              onReviewTask(task._id, "approved", "")
                            }
                            className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setTaskToReview(task._id);
                            }}
                            className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-lg hover:bg-orange-200"
                          >
                            Revision
                          </button>
                        </div>
                      )}
                    </div>
                    {task.submissionUrl && (
                      <a
                        href={task.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 font-semibold hover:underline mt-1 block"
                      >
                        View Submission →
                      </a>
                    )}
                    {taskToReview === task._id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Feedback for revision..."
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                        />
                        <button
                          onClick={() => {
                            onReviewTask(task._id, "revision_needed", feedback);
                            setTaskToReview(null);
                            setFeedback("");
                          }}
                          className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Progress */}
          {activeSection === "progress" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Mark weekly performance for <strong>{intern.fullName}</strong>.
              </p>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Week Number
                </label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={progressWeek}
                  onChange={(e) => setProgressWeek(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Performance Rating
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PROGRESS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setProgressRating(opt.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-xs font-bold
                                                ${
                                                  progressRating === opt.value
                                                    ? opt.color +
                                                      " border-current"
                                                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                                                }`}
                    >
                      <opt.icon size={16} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  value={progressRemarks}
                  onChange={(e) => setProgressRemarks(e.target.value)}
                  placeholder="Detailed feedback about this week's performance..."
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <button
                onClick={() =>
                  onMarkProgress(
                    intern._id,
                    progressRating,
                    progressRemarks,
                    progressWeek
                  )
                }
                className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <TrendingUp size={15} /> Save Progress Report
              </button>
            </div>
          )}

          {/* Tickets */}
          {activeSection === "tickets" && (
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Ticket size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No tickets raised</p>
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t._id}
                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-gray-900 text-sm">
                        {t.subject}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-2 shrink-0
                                            ${
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
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {t.description}
                    </p>
                    {t.status === "open" && (
                      <div className="flex gap-2">
                        <input
                          value={resolutionMap[t._id] || ""}
                          onChange={(e) =>
                            setResolutionMap((p) => ({
                              ...p,
                              [t._id]: e.target.value,
                            }))
                          }
                          placeholder="Resolution note..."
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                        />
                        <button
                          onClick={() =>
                            onResolveTicket(t._id, resolutionMap[t._id] || "")
                          }
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                    {t.resolution && (
                      <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                        ✓ {t.resolution}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal
            intern={intern}
            initialData={editingTask}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
            onAssigned={onTaskAssigned}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Sub HR Dashboard ──────────────────────────────────────────────────────
const SubHRDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [interns, setInterns] = useState([]);
  const [allTasks, setAllTasks] = useState({}); // { applicationId: tasks[] }
  const [allTickets, setAllTickets] = useState({}); // { applicationId: tickets[] }
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("interns");

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data: internData } = await api.get("/internship/my-interns");
      setInterns(internData);

      // Load tasks & tickets for each intern
      const tasksMap = {},
        ticketsMap = {};
      await Promise.all(
        internData.map(async (intern) => {
          const [tasksRes, ticketsRes] = await Promise.all([
            api
              .get(`/internship/tasks/intern/${intern._id}`)
              .catch(() => ({ data: [] })),
            api.get("/internship/tickets/subhr").catch(() => ({ data: [] })),
          ]);
          tasksMap[intern._id] = tasksRes.data || [];
          ticketsMap[intern._id] = (ticketsRes.data || []).filter(
            (t) =>
              t.application?.toString() === intern._id?.toString() ||
              t.raisedBy?._id === intern.applicant?._id
          );
        })
      );
      setAllTasks(tasksMap);
      setAllTickets(ticketsMap);
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
    if (!["subhr", "headhr", "admin"].includes(user.role)) {
      navigate("/");
      return;
    }
    loadAll();
  }, [user, navigate, loadAll]);

  const handleMarkProgress = async (applicationId, rating, remarks, week) => {
    try {
      await api.post("/internship/progress", {
        applicationId,
        rating,
        remarks,
        week,
      });
      alert("Progress saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleReviewTask = async (taskId, status, feedbackNote) => {
    try {
      await api.put(`/internship/tasks/${taskId}/review`, {
        status,
        feedbackNote,
      });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleResolveTicket = async (ticketId, resolution) => {
    try {
      await api.put(`/internship/tickets/${ticketId}/resolve`, { resolution });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const TABS = [
    { id: "interns", label: "My Interns", icon: Users },
    { id: "tickets", label: "Tickets", icon: Ticket },
  ];

  const sidebarContent = (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#1c1d1f" }}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-600">
          <Users size={17} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm">Sub HR</p>
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
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm bg-blue-600">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user?.name}
            </p>
            <p className="text-gray-400 text-xs">Sub HR Coordinator</p>
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
                background: active ? "rgba(37,99,235,0.15)" : "transparent",
                color: active ? "#93c5fd" : "#9ca3af",
                borderLeft: active
                  ? "3px solid #2563eb"
                  : "3px solid transparent",
              }}
            >
              <tab.icon size={17} className="shrink-0" />
              <span>{tab.label}</span>
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
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading Sub HR Dashboard...</p>
        </div>
      </div>
    );

  // All tickets across all interns
  const allTicketsList = Object.values(allTickets).flat();
  const openTickets = allTicketsList.filter((t) => t.status === "open");

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <div className="hidden lg:block w-[220px] min-h-screen fixed left-0 top-0 z-40">
        {sidebarContent}
      </div>
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

      <div className="flex-1 lg:pl-[220px] flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-gray-900">Sub HR Dashboard</span>
          <button onClick={loadAll} className="p-2 text-gray-400">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {activeTab === "interns"
                  ? `My Interns (${interns.length})`
                  : "Support Tickets"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage and track your assigned interns
              </p>
            </div>
            <div className="flex items-center gap-3">
              {interns.length > 0 && (
                <button
                  onClick={() => setShowMeetModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm"
                >
                  <Video size={15} /> Send Meet Link
                </button>
              )}
              <button
                onClick={loadAll}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {/* ── MY INTERNS ── */}
          {activeTab === "interns" && (
            <>
              {interns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center shadow-sm">
                  <Users size={40} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-bold text-gray-600">
                    No interns assigned yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Head HR will assign interns to you
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {interns.map((intern) => {
                    const tasks = allTasks[intern._id] || [];
                    const tickets = allTickets[intern._id] || [];
                    const pendingTasks = tasks.filter(
                      (t) => t.status === "submitted"
                    ).length;
                    const openTickets = tickets.filter(
                      (t) => t.status === "open"
                    ).length;

                    return (
                      <motion.div
                        key={intern._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-base shrink-0">
                            {intern.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">
                              {intern.fullName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {intern.role}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {intern.college}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center bg-gray-50 rounded-xl p-2">
                            <p className="text-lg font-black text-gray-900">
                              {tasks.length}
                            </p>
                            <p className="text-[10px] text-gray-400">Tasks</p>
                          </div>
                          <div
                            className={`text-center rounded-xl p-2 ${
                              pendingTasks > 0 ? "bg-blue-50" : "bg-gray-50"
                            }`}
                          >
                            <p
                              className={`text-lg font-black ${
                                pendingTasks > 0
                                  ? "text-blue-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {pendingTasks}
                            </p>
                            <p className="text-[10px] text-gray-400">Review</p>
                          </div>
                          <div
                            className={`text-center rounded-xl p-2 ${
                              openTickets > 0 ? "bg-amber-50" : "bg-gray-50"
                            }`}
                          >
                            <p
                              className={`text-lg font-black ${
                                openTickets > 0
                                  ? "text-amber-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {openTickets}
                            </p>
                            <p className="text-[10px] text-gray-400">Tickets</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedIntern(intern)}
                          className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Eye size={14} /> View Intern
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── TICKETS ── */}
          {activeTab === "tickets" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">
                  Support Tickets{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    ({allTicketsList.length})
                  </span>
                </h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  {openTickets.length} open
                </span>
              </div>
              {allTicketsList.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Ticket size={36} className="mx-auto mb-3 opacity-20" />
                  <p className="font-semibold">No tickets raised</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {allTicketsList.map((t) => (
                    <div key={t._id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 text-sm">
                          {t.raisedBy?.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            PRIORITY_COLORS[t.priority]
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
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        {t.subject}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {t.description}
                      </p>
                      {t.status === "open" && (
                        <div className="flex gap-2">
                          <input
                            placeholder="Resolution..."
                            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleResolveTicket(t._id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const inp = e.target.previousSibling;
                              handleResolveTicket(t._id, inp.value);
                              inp.value = "";
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Intern Detail Panel */}
      <AnimatePresence>
        {selectedIntern && (
          <InternPanel
            intern={selectedIntern}
            tasks={allTasks[selectedIntern._id] || []}
            tickets={allTickets[selectedIntern._id] || []}
            onClose={() => setSelectedIntern(null)}
            onTaskAssigned={loadAll}
            onMarkProgress={handleMarkProgress}
            onReviewTask={handleReviewTask}
            onResolveTicket={handleResolveTicket}
          />
        )}
      </AnimatePresence>

      {/* Meet Modal */}
      <AnimatePresence>
        {showMeetModal && (
          <MeetModal
            interns={interns}
            onClose={() => setShowMeetModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubHRDashboard;
