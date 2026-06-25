import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Task content is required"],
      trim: true,
      maxlength: [2000, "Task content cannot exceed 2000 characters"],
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
