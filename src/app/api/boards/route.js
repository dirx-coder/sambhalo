import dbConnect from "@/lib/mongoose";
import Board from "@/models/Board";
import Column from "@/models/Column";
import Task from "@/models/Task";
import { getAuthUserId, errorResponse } from "@/lib/api-helpers";

/**
 * GET /api/boards
 * Fetch all boards for the authenticated user.
 * Returns boards with their columns and tasks fully populated.
 */
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return errorResponse("Unauthorized", 401);

    await dbConnect();

    const boards = await Board.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // If user has no boards yet, auto-create a default one
    if (boards.length === 0) {
      const board = await createDefaultBoard(userId);
      return Response.json({ boards: [board] });
    }

    // Populate columns and tasks for each board
    const populatedBoards = await Promise.all(
      boards.map(async (board) => {
        const columns = await Column.find({
          _id: { $in: board.columns },
        }).lean();

        const allTaskIds = columns.flatMap((col) => col.taskIds);
        const tasks = await Task.find({ _id: { $in: allTaskIds } }).lean();

        const taskMap = {};
        for (const task of tasks) {
          taskMap[task._id.toString()] = task;
        }

        // Maintain column order from the board's columns array
        const populatedColumns = board.columns
          .map((colId) => {
            const col = columns.find(
              (c) => c._id.toString() === colId.toString()
            );
            if (!col) return null;
            return {
              ...col,
              tasks: col.taskIds
                .map((tid) => taskMap[tid.toString()])
                .filter(Boolean),
            };
          })
          .filter(Boolean);

        return { ...board, columns: populatedColumns };
      })
    );

    return Response.json({ boards: populatedBoards });
  } catch (error) {
    console.error("GET /api/boards error:", error);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * POST /api/boards
 * Create a new board with default columns.
 * Body: { title?: string }
 */
export async function POST(request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return errorResponse("Unauthorized", 401);

    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const title = body.title?.trim() || "My Board";

    if (title.length > 100) {
      return errorResponse("Board title cannot exceed 100 characters");
    }

    const board = await createDefaultBoard(userId, title);
    return Response.json({ board }, { status: 201 });
  } catch (error) {
    console.error("POST /api/boards error:", error);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * Creates a board with the three default columns: To Do, In Progress, Done.
 */
async function createDefaultBoard(userId, title = "My Board") {
  const board = await Board.create({ title, userId, columns: [] });

  const defaultColumns = ["To Do", "In Progress", "Done"];
  const columns = await Column.insertMany(
    defaultColumns.map((colTitle) => ({
      title: colTitle,
      boardId: board._id,
      taskIds: [],
    }))
  );

  board.columns = columns.map((c) => c._id);
  await board.save();

  const populatedColumns = columns.map((col) => ({
    ...col.toObject(),
    tasks: [],
  }));

  return { ...board.toObject(), columns: populatedColumns };
}
