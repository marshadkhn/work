import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Agency", "Individual"],
    required: true,
  },
  // --- YEH DO FIELDS ADD KAREIN ---
  country: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Workspace ||
  mongoose.model("Workspace", WorkspaceSchema);
