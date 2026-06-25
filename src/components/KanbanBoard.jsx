"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import { Loader2, AlertCircle, RefreshCw, Plus } from "lucide-react";

// ─── API helper ───────────────────────────────────────────────────────────────
async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export default function KanbanBoard() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const boardRef = useRef(board);
  boardRef.current = board;
  const originalColumnIdRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchBoard(); }, []);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api("/api/boards");
      if (data.boards?.length > 0) setBoard(data.boards[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const findColumnByTaskId = useCallback(
    (taskId) => board?.columns.find((col) => col.tasks.some((t) => t._id === taskId)) ?? null,
    [board]
  );

  const findTask = useCallback(
    (taskId) => {
      if (!board) return null;
      for (const col of board.columns) {
        const t = col.tasks.find((t) => t._id === taskId);
        if (t) return t;
      }
      return null;
    },
    [board]
  );

  const findContainerId = useCallback(
    (id) => {
      if (!board) return null;
      if (board.columns.some((col) => col._id === id)) return id;
      return findColumnByTaskId(id)?._id ?? null;
    },
    [board, findColumnByTaskId]
  );

  // ─── DnD handlers ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (event) => {
      setActiveTask(findTask(event.active.id));
      originalColumnIdRef.current = findContainerId(event.active.id);
    },
    [findTask, findContainerId]
  );

  const handleDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;
      const activeCol = findContainerId(active.id);
      const overCol = findContainerId(over.id);
      if (!activeCol || !overCol || activeCol === overCol) return;

      setBoard((prev) => {
        if (!prev) return prev;
        const src = prev.columns.find((c) => c._id === activeCol);
        const dest = prev.columns.find((c) => c._id === overCol);
        if (!src || !dest) return prev;

        const srcIdx = src.tasks.findIndex((t) => t._id === active.id);
        if (srcIdx === -1) return prev;
        const moving = src.tasks[srcIdx];

        const overIdx = dest.tasks.findIndex((t) => t._id === over.id);
        const destIdx = overIdx >= 0 ? overIdx : dest.tasks.length;

        return {
          ...prev,
          columns: prev.columns.map((col) => {
            if (col._id === activeCol) return { ...col, tasks: col.tasks.filter((t) => t._id !== active.id) };
            if (col._id === overCol) { const ts = [...col.tasks]; ts.splice(destIdx, 0, moving); return { ...col, tasks: ts }; }
            return col;
          }),
        };
      });
    },
    [findContainerId]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over || !boardRef.current) return;

      const overColId = findContainerId(over.id);
      const originalColId = originalColumnIdRef.current;
      if (!originalColId || !overColId) return;
      const boardId = boardRef.current._id;

      setBoard((prev) => {
        if (!prev) return prev;
        const col = prev.columns.find((c) => c._id === overColId);
        if (!col) return prev;

        const oldIdx = col.tasks.findIndex((t) => t._id === active.id);
        const newIdx = col.tasks.findIndex((t) => t._id === over.id);
        const reordered = (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx)
          ? arrayMove(col.tasks, oldIdx, newIdx)
          : col.tasks;

        const newColumns = prev.columns.map((c) =>
          c._id === overColId ? { ...c, tasks: reordered } : c
        );

        if (originalColId === overColId) {
          if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
            api(`/api/boards/${boardId}/reorder`, {
              method: "PATCH",
              body: JSON.stringify({ columnId: overColId, taskIds: reordered.map((t) => t._id) }),
            }).catch(console.error);
          }
        } else {
          const srcCol = newColumns.find((c) => c._id === originalColId);
          const destCol = newColumns.find((c) => c._id === overColId);
          if (srcCol && destCol) {
            api(`/api/boards/${boardId}/reorder`, {
              method: "PATCH",
              body: JSON.stringify({
                sourceColumnId: originalColId,
                destinationColumnId: overColId,
                sourceTaskIds: srcCol.tasks.map((t) => t._id),
                destinationTaskIds: destCol.tasks.map((t) => t._id),
                taskId: active.id,
              }),
            }).catch(console.error);
          }
        }

        return { ...prev, columns: newColumns };
      });

      originalColumnIdRef.current = null;
    },
    [findContainerId]
  );

  // ─── Task CRUD ─────────────────────────────────────────────────────────────
  const handleAddTask = useCallback(async (columnId, content) => {
    if (!board) return;
    const tempId = `temp-${Date.now()}`;
    const tempTask = { _id: tempId, content, createdAt: new Date().toISOString() };

    setBoard((prev) => prev
      ? {
        ...prev, columns: prev.columns.map((col) =>
          col._id === columnId ? { ...col, tasks: [...col.tasks, tempTask] } : col)
      }
      : prev
    );

    try {
      const data = await api(`/api/boards/${board._id}/tasks`, {
        method: "POST",
        body: JSON.stringify({ content, columnId }),
      });
      setBoard((prev) => prev
        ? {
          ...prev, columns: prev.columns.map((col) => ({
            ...col, tasks: col.tasks.map((t) => t._id === tempId ? data.task : t),
          }))
        }
        : prev
      );
    } catch (err) {
      console.error("Failed to create task:", err);
      setBoard((prev) => prev
        ? {
          ...prev, columns: prev.columns.map((col) => ({
            ...col, tasks: col.tasks.filter((t) => t._id !== tempId),
          }))
        }
        : prev
      );
    }
  }, [board]);

  const handleEditTask = useCallback((taskId, newContent) => {
    if (!board) return;
    let oldContent = "";
    setBoard((prev) => prev
      ? {
        ...prev, columns: prev.columns.map((col) => ({
          ...col, tasks: col.tasks.map((task) => {
            if (task._id === taskId) { oldContent = task.content; return { ...task, content: newContent }; }
            return task;
          }),
        }))
      }
      : prev
    );
    api(`/api/boards/${board._id}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ content: newContent }),
    }).catch((err) => {
      console.error("Failed to edit task:", err);
      setBoard((prev) => prev
        ? {
          ...prev, columns: prev.columns.map((col) => ({
            ...col, tasks: col.tasks.map((task) =>
              task._id === taskId ? { ...task, content: oldContent } : task),
          }))
        }
        : prev
      );
    });
  }, [board]);

  const handleDeleteTask = useCallback((taskId) => {
    if (!board) return;
    let deletedTask = null;
    let deletedFromColId = null;

    setBoard((prev) => prev
      ? {
        ...prev, columns: prev.columns.map((col) => {
          const task = col.tasks.find((t) => t._id === taskId);
          if (task) { deletedTask = task; deletedFromColId = col._id; }
          return { ...col, tasks: col.tasks.filter((t) => t._id !== taskId) };
        })
      }
      : prev
    );

    api(`/api/boards/${board._id}/tasks/${taskId}`, { method: "DELETE" })
      .catch((err) => {
        console.error("Failed to delete task:", err);
        if (deletedTask && deletedFromColId) {
          setBoard((prev) => prev
            ? {
              ...prev, columns: prev.columns.map((col) =>
                col._id === deletedFromColId
                  ? { ...col, tasks: [...col.tasks, deletedTask] }
                  : col)
            }
            : prev
          );
        }
      });
  }, [board]);

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
          <p className="text-sm text-foreground-muted">Loading your board…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-danger" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Failed to load board</p>
            <p className="text-xs text-foreground-muted">{error}</p>
          </div>
          <button
            onClick={fetchBoard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border
                       text-sm text-foreground hover:border-border-hover transition-all duration-150 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!board) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto bg-[#1c1c1f]">
        <div className="flex gap-6 px-8 pt-8 pb-8 min-h-full h-full">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column._id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}

          {/* "+ Add another list" placeholder to match image */}
          <div className="flex flex-col w-71.25 min-w-71.25">
            <button className="flex items-center justify-center gap-2 w-full h-15 rounded-xl border-2 border-dashed border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-all">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add another list</span>
            </button>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}