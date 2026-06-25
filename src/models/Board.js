import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Board title is required"],
      trim: true,
      maxlength: [100, "Board title cannot exceed 100 characters"],
      default: "My Board",
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index: one user may have many boards, query by userId
BoardSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Board || mongoose.model("Board", BoardSchema);
