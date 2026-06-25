import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Column title is required"],
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    taskIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Column ||
  mongoose.model("Column", ColumnSchema);
