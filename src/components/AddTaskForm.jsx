"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

/**
 * AddTaskForm
 *
 * Props:
 *   onAdd(content)      – called when the form is submitted
 *   isOpenByDefault     – controlled: parent can force the form open (e.g. via header + button)
 *   onOpen / onClose    – callbacks so parent stays in sync
 */
export default function AddTaskForm({
  onAdd,
  isOpenByDefault = false,
  onOpen,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const [content, setContent] = useState("");

  // Keep in sync if parent flips isOpenByDefault
  useEffect(() => {
    if (isOpenByDefault && !isOpen) setIsOpen(true);
  }, [isOpenByDefault]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const close = () => {
    setContent("");
    setIsOpen(false);
    onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onAdd?.(trimmed);
    close();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") close();
  };

  // ── Collapsed button ──
  if (!isOpen) {
    return (
      <button
        onClick={open}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                   text-foreground-dim text-[12.5px] font-medium
                   hover:text-foreground-muted hover:bg-surface-elevated/70
                   transition-all duration-150 cursor-pointer group"
      >
        <Plus
          className="w-3.5 h-3.5 group-hover:text-accent transition-colors duration-150"
        />
        <span>Add task</span>
      </button>
    );
  }

  // ── Expanded form ──
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-3 space-y-2.5">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        rows={2}
        placeholder="What needs to be done?"
        className="w-full bg-background border border-border rounded-lg px-3 py-2
                   text-[13px] text-foreground placeholder:text-foreground-dim resize-none
                   focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40
                   transition-all duration-150"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!content.trim()}
          className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold
                     hover:bg-accent-hover active:scale-[0.98]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-150 cursor-pointer"
        >
          Add task
        </button>
        <button
          type="button"
          onClick={close}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground-muted
                     hover:text-foreground hover:bg-surface-elevated border border-border
                     transition-all duration-150 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}