import dbConnect from "@/lib/mongoose";
import Board from "@/models/Board";
import Column from "@/models/Column";
import Task from "@/models/Task";
import { getAuthUserId, errorResponse, isValidObjectId } from "@/lib/api-helpers";

/**
 * POST /api/boards/[boardId]/tasks
 * Create a new task in a specific column.
 * Body: { content: string, columnId: string }
 */
export async function POST(request, { params }) {
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
    const { content, columnId } = body;

    if (!content?.trim()) return errorResponse("Task content is required");
    if (content.trim().length > 2000) {
      return errorResponse("Task content cannot exceed 2000 characters");
    }
    if (!columnId) return errorResponse("Column ID is required");
    if (!isValidObjectId(columnId)) {
      return errorResponse("Invalid column ID", 400);
    }

    // Verify the column belongs to this board
    const column = await Column.findOne({ _id: columnId, boardId });
    if (!column) return errorResponse("Column not found", 404);

    // Create the task
    const task = await Task.create({
      content: content.trim(),
      columnId,
    });

    // Append task ID to the column's taskIds array
    column.taskIds.push(task._id);
    await column.save();

    return Response.json({ task: task.toObject() }, { status: 201 });
  } catch (error) {
    console.error("POST /api/boards/[boardId]/tasks error:", error);
    return errorResponse("Internal server error", 500);
  }
}
