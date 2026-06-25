import dbConnect from "@/lib/mongoose";
import Board from "@/models/Board";
import Column from "@/models/Column";
import Task from "@/models/Task";
import { getAuthUserId, errorResponse, isValidObjectId } from "@/lib/api-helpers";

/**
 * PATCH /api/boards/[boardId]/tasks/[taskId]
 * Update a task's content.
 * Body: { content: string }
 */
export async function PATCH(request, { params }) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { boardId, taskId } = await params;

    if (!isValidObjectId(boardId)) return errorResponse("Invalid board ID", 400);
    if (!isValidObjectId(taskId)) return errorResponse("Invalid task ID", 400);

    await dbConnect();

    // Verify board ownership
    const board = await Board.findOne({ _id: boardId, userId }).lean();
    if (!board) return errorResponse("Board not found", 404);

    const body = await request.json().catch(() => ({}));
    const { content } = body;

    if (!content?.trim()) return errorResponse("Task content is required");
    if (content.trim().length > 2000) {
      return errorResponse("Task content cannot exceed 2000 characters");
    }

    // Verify the task exists and belongs to a column in this board
    const task = await Task.findById(taskId);
    if (!task) return errorResponse("Task not found", 404);

    const column = await Column.findOne({
      _id: task.columnId,
      boardId,
    }).lean();
    if (!column) return errorResponse("Task does not belong to this board", 403);

    task.content = content.trim();
    await task.save();

    return Response.json({ task: task.toObject() });
  } catch (error) {
    console.error("PATCH /api/boards/[boardId]/tasks/[taskId] error:", error);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * DELETE /api/boards/[boardId]/tasks/[taskId]
 * Delete a task and remove its reference from the column.
 */
export async function DELETE(request, { params }) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { boardId, taskId } = await params;

    if (!isValidObjectId(boardId)) return errorResponse("Invalid board ID", 400);
    if (!isValidObjectId(taskId)) return errorResponse("Invalid task ID", 400);

    await dbConnect();

    // Verify board ownership
    const board = await Board.findOne({ _id: boardId, userId }).lean();
    if (!board) return errorResponse("Board not found", 404);

    const task = await Task.findById(taskId);
    if (!task) return errorResponse("Task not found", 404);

    const column = await Column.findOne({
      _id: task.columnId,
      boardId,
    }).lean();
    if (!column) return errorResponse("Task does not belong to this board", 403);

    // Remove task ID from the column's taskIds array and delete the task atomically
    await Promise.all([
      Column.findByIdAndUpdate(task.columnId, {
        $pull: { taskIds: task._id },
      }),
      Task.findByIdAndDelete(taskId),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/boards/[boardId]/tasks/[taskId] error:", error);
    return errorResponse("Internal server error", 500);
  }
}
