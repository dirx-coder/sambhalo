import dbConnect from "@/lib/mongoose";
import Board from "@/models/Board";
import Column from "@/models/Column";
import Task from "@/models/Task";
import { getAuthUserId, errorResponse, isValidObjectId } from "@/lib/api-helpers";

/**
 * PATCH /api/boards/[boardId]/reorder
 *
 * Handles drag-and-drop reordering. Supports two scenarios:
 *
 * 1. Moving within the SAME column (reorder):
 *    Body: { columnId, taskIds: [...orderedIds] }
 *
 * 2. Moving ACROSS columns:
 *    Body: {
 *      sourceColumnId,
 *      destinationColumnId,
 *      sourceTaskIds: [...orderedIds],
 *      destinationTaskIds: [...orderedIds],
 *      taskId  // the task being moved
 *    }
 */
export async function PATCH(request, { params }) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { boardId } = await params;

    if (!isValidObjectId(boardId)) {
      return errorResponse("Invalid board ID", 400);
    }

    await dbConnect();

    // Verify board ownership
    const board = await Board.findOne({ _id: boardId, userId }).lean();
    if (!board) return errorResponse("Board not found", 404);

    const body = await request.json().catch(() => ({}));

    // --- Same-column reorder ---
    if (body.columnId && body.taskIds) {
      if (!isValidObjectId(body.columnId)) {
        return errorResponse("Invalid column ID", 400);
      }

      // Validate all task IDs are valid ObjectIds
      if (!Array.isArray(body.taskIds) || !body.taskIds.every(isValidObjectId)) {
        return errorResponse("Invalid task IDs", 400);
      }

      const column = await Column.findOne({
        _id: body.columnId,
        boardId,
      });
      if (!column) return errorResponse("Column not found", 404);

      // Security: Verify the provided taskIds are exactly the same set as
      // what the column currently has (just reordered, no additions/removals)
      const currentIds = column.taskIds.map((id) => id.toString()).sort();
      const providedIds = [...body.taskIds].sort();

      if (
        currentIds.length !== providedIds.length ||
        !currentIds.every((id, i) => id === providedIds[i])
      ) {
        return errorResponse(
          "Task IDs don't match the column's current tasks. Refresh and try again.",
          409
        );
      }

      column.taskIds = body.taskIds;
      await column.save();

      return Response.json({ success: true });
    }

    // --- Cross-column move ---
    if (
      body.sourceColumnId &&
      body.destinationColumnId &&
      body.sourceTaskIds &&
      body.destinationTaskIds &&
      body.taskId
    ) {
      // Validate all IDs
      if (
        !isValidObjectId(body.sourceColumnId) ||
        !isValidObjectId(body.destinationColumnId) ||
        !isValidObjectId(body.taskId)
      ) {
        return errorResponse("Invalid column or task ID", 400);
      }

      if (
        !Array.isArray(body.sourceTaskIds) ||
        !body.sourceTaskIds.every(isValidObjectId) ||
        !Array.isArray(body.destinationTaskIds) ||
        !body.destinationTaskIds.every(isValidObjectId)
      ) {
        return errorResponse("Invalid task IDs", 400);
      }

      const [sourceCol, destCol] = await Promise.all([
        Column.findOne({ _id: body.sourceColumnId, boardId }),
        Column.findOne({ _id: body.destinationColumnId, boardId }),
      ]);

      if (!sourceCol || !destCol)
        return errorResponse("Column not found", 404);

      // Security: Verify the moved task currently exists in the source column
      const movedTaskInSource = sourceCol.taskIds.some(
        (id) => id.toString() === body.taskId
      );
      if (!movedTaskInSource) {
        return errorResponse("Task does not belong to source column", 403);
      }

      // Security: Verify the new task ID sets are valid.
      // Source should have all original IDs minus the moved task.
      // Destination should have all original IDs plus the moved task.
      const originalSourceIds = sourceCol.taskIds
        .map((id) => id.toString())
        .filter((id) => id !== body.taskId)
        .sort();
      const providedSourceIds = [...body.sourceTaskIds].sort();

      const originalDestIds = [
        ...destCol.taskIds.map((id) => id.toString()),
        body.taskId,
      ].sort();
      const providedDestIds = [...body.destinationTaskIds].sort();

      if (
        originalSourceIds.length !== providedSourceIds.length ||
        !originalSourceIds.every((id, i) => id === providedSourceIds[i])
      ) {
        return errorResponse(
          "Source task IDs are inconsistent. Refresh and try again.",
          409
        );
      }

      if (
        originalDestIds.length !== providedDestIds.length ||
        !originalDestIds.every((id, i) => id === providedDestIds[i])
      ) {
        return errorResponse(
          "Destination task IDs are inconsistent. Refresh and try again.",
          409
        );
      }

      // Update both columns' taskIds and the task's columnId atomically
      sourceCol.taskIds = body.sourceTaskIds;
      destCol.taskIds = body.destinationTaskIds;

      await Promise.all([
        sourceCol.save(),
        destCol.save(),
        Task.findByIdAndUpdate(body.taskId, {
          columnId: body.destinationColumnId,
        }),
      ]);

      return Response.json({ success: true });
    }

    return errorResponse("Invalid reorder payload");
  } catch (error) {
    console.error("PATCH /api/boards/[boardId]/reorder error:", error);
    return errorResponse("Internal server error", 500);
  }
}
