"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Pencil, Trash2, Check, X,
  Hash, Users, CalendarDays, TrendingUp,
  MessageSquare, Clock, AlertOctagon,
} from "lucide-react";

// ─── Priority config ───────────────────────────────────────────────────────────
const PRIORITY = {
  urgent: { label: "Urgent", color: "#EF4444", bg: "rgba(239,68,68,0.13)" },
  high: { label: "High", color: "#F97316", bg: "rgba(249,115,22,0.13)" },
  medium: { label: "Medium", color: "#EAB308", bg: "rgba(234,179,8,0.13)" },
  low: { label: "Low", color: "#6366F1", bg: "rgba(99,102,241,0.13)" },
};

/** Deterministic priority so the same task always gets the same colour */
function resolvePriority(task) {
  if (task.priority && PRIORITY[task.priority.toLowerCase()]) {
    return PRIORITY[task.priority.toLowerCase()];
  }
  const keys = ["low", "medium", "high", "urgent"];
  const hash = (task._id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PRIORITY[keys[hash % keys.length]];
}

function formatDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function shortId(id) {
  return id ? `#${id.slice(-6).toUpperCase()}` : "#------";
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────
const TAG_PALETTE = [
  { bg: "rgba(34,197,94,0.15)", color: "#22c55e" }, // green   – Open
  { bg: "rgba(234,179,8,0.15)", color: "#ca8a04" }, // yellow  – TOFU
  { bg: "rgba(249,115,22,0.15)", color: "#f97316" }, // orange  – Important
  { bg: "rgba(168,85,247,0.15)", color: "#a855f7" }, // purple  – MOFU
  { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" }, // blue    – In-progress
  { bg: "rgba(239,68,68,0.15)", color: "#ef4444" }, // red     – Urgent
];

function tagColour(label) {
  const hash = label.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

// ─── Metadata row ─────────────────────────────────────────────────────────────
function MetaRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-2 min-h-5.5">
      <Icon className="w-3 h-3 text-foreground-dim shrink-0" />
      <span className="text-[11px] text-foreground-dim w-18 shrink-0">{label}</span>
      <div className="flex-1 text-[11px] text-foreground-muted">{children}</div>
    </div>
  );
}

// ─── Assignee avatars ─────────────────────────────────────────────────────────
function Avatars({ assignees }) {
  if (!assignees || assignees.length === 0) {
    return <span className="text-[11px] text-foreground-dim italic">Unassigned</span>;
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-1.5">
        {assignees.slice(0, 3).map((a, i) => (
          <div
            key={i}
            title={typeof a === "string" ? a : a.name}
            className="w-5 h-5 rounded-full bg-accent flex items-center justify-center
                       text-white text-[8px] font-bold ring-[1.5px] ring-surface"
          >
            {(typeof a === "string" ? a : a.name)?.[0]?.toUpperCase()}
          </div>
        ))}
      </div>
      {assignees.length > 3 && (
        <span className="text-[10px] text-foreground-dim">+{assignees.length - 3}</span>
      )}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: value >= 100
              ? "#22c55e"
              : value >= 50
                ? "var(--accent)"
                : "#f59e0b",
          }}
        />
      </div>
      <span className="text-[11px] text-foreground-muted tabular-nums w-7 text-right">
        {value}%
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TaskCard({ task, onEdit, onDelete, isDragOverlay = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const priority = resolvePriority(task);
  const tags = task.tags || [];
  const dueDate = formatDate(task.dueDate || task.createdAt);
  const comments = task.comments?.length ?? 0;
  const estimate = task.estimate ?? null;
  const assignees = task.assignees ?? null;
  const progress = task.progress !== undefined ? task.progress : null;

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "task", task },
    disabled: isEditing,
  });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  };

  const handleSave = () => {
    const trimmed = editContent.trim();
    if (trimmed && trimmed !== task.content) onEdit?.(task._id, trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => { setEditContent(task.content); setIsEditing(false); };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") handleCancel();
  };

  // ── Overlay (floating while dragging) ──
  if (isDragOverlay) {
    return (
      <div className="w-65 bg-[#27272a] rounded-xl border border-[#3f3f46]/50 shadow-2xl px-4 py-3 rotate-2 opacity-90 scale-105 transition-transform duration-200">
        <p className="text-sm font-semibold text-white leading-snug">{task.content}</p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`group relative bg-[#27272a] rounded-xl border overflow-hidden
                  transition-all duration-200 cursor-grab active:cursor-grabbing
                  ${isDragging
          ? "border-[#6366f1]/40 shadow-[0_0_20px_rgba(99,102,241,0.2)] z-10 scale-105"
          : "border-[#3f3f46]/30 hover:border-[#52525b] hover:shadow-lg hover:-translate-y-0.5"
        }`}
    >
      <div className="p-4" {...attributes} {...listeners}>

        {/* ── Top Row: Priority Tag & Drag Handle ── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.length > 0 ? (
              tags.map((tag) => {
                const { bg, color } = tagColour(tag);
                return (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: bg, color }}
                  >
                    {tag}
                  </span>
                );
              })
            ) : (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: priority.bg, color: priority.color }}
              >
                {priority.label}
              </span>
            )}
          </div>

          {/* Edit / Delete hover actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 -mt-1 -mr-1">
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#3f3f46] transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(task._id); }}
              className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Title / Edit ── */}
        {isEditing ? (
          <div className="space-y-2 mb-2" onPointerDown={(e) => e.stopPropagation()}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={3}
              className="w-full bg-[#18181b] border border-[#3f3f46] rounded-lg px-3 py-2
                         text-sm text-white placeholder:text-[#52525b] resize-none
                         focus:outline-none focus:ring-1 focus:ring-[#6366f1] focus:border-[#6366f1]
                         transition-all"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-2.5 py-1 rounded-md text-xs font-medium text-[#a1a1aa] hover:text-white hover:bg-[#3f3f46] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#6366f1] text-white hover:bg-[#818cf8] transition-colors shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-white leading-relaxed wrap-break-word mb-4 line-clamp-3">
            {task.content}
          </p>
        )}

        {/* ── Bottom bar: stats & avatars ── */}
        {!isEditing && (
          <div className="flex items-center justify-between mt-auto pt-2">
            {/* Stats */}
            <div className="flex items-center gap-3 text-[#a1a1aa]">
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{comments}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                <span className="text-xs font-medium">{Math.floor(Math.random() * 5)}</span>
              </div>
            </div>

            {/* Avatars */}
            <Avatars assignees={assignees} />
          </div>
        )}
      </div>
    </div>
  );
}