"use client";

import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { Plus, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

// ─── Column visual config ──────────────────────────────────────────────────────
const COLUMN_CONFIG = {
  "To Do": { dot: "#fafafa", text: "#fafafa" },
  "In Progress": { dot: "#f59e0b", text: "#fafafa" },
  "Done": { dot: "#22c55e", text: "#fafafa" },
};

function getConfig(title) {
  return (
    COLUMN_CONFIG[title] || {
      dot: "#6366f1",
      text: "#fafafa",
    }
  );
}

export default function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) {
  const config = getConfig(column.title);
  const tasks = column.tasks || [];
  const taskIds = tasks.map((t) => t._id);

  const [addOpen, setAddOpen] = useState(false);
  const addFormRef = useRef(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: { type: "column", column },
  });

  useEffect(() => {
    if (addOpen && addFormRef.current) {
      addFormRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [addOpen]);

  return (
    <div className="flex flex-col w-71.25 min-w-71.25 bg-[#18181b] rounded-2xl overflow-hidden border border-[#27272a]/50 shadow-lg relative">

      {/* Top Border Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ background: config.dot }}
      />

      {/* ── Column header ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-[#27272a]/30">
        <h2 className="text-[14px] font-semibold text-white tracking-wide">
          {column.title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
          <button className="text-[#52525b] hover:text-[#fafafa] transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Tasks droppable area ── */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 transition-colors duration-200 flex flex-col gap-3 min-h-37.5
                    ${isOver ? "bg-[#6366f1]/5" : "bg-transparent"}`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div
              className={`flex items-center justify-center min-h-25 rounded-xl
                          border-2 border-dashed transition-colors duration-200
                          ${isOver
                  ? "border-[#6366f1]/50 bg-[#6366f1]/10"
                  : "border-[#3f3f46]/50"
                }`}
            >
              <p className="text-[12px] text-[#52525b]">
                {isOver ? "Drop task here" : "No tasks yet"}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </SortableContext>

        {/* ── Add task button/form ── */}
        <div ref={addFormRef} className="mt-1">
          {!addOpen ? (
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/50 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add task
            </button>
          ) : (
            <div className="bg-[#27272a] p-3 rounded-xl">
              <AddTaskForm
                isOpenByDefault={addOpen}
                onOpen={() => setAddOpen(true)}
                onClose={() => setAddOpen(false)}
                onAdd={(content) => {
                  onAddTask?.(column._id, content);
                  setAddOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}