import mongoose from "mongoose";

// --- YEH NAYA PAYMENT SCHEMA ADD KAREIN ---
const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: {
    type: String,
    enum: ["Bank Transfer", "UPI", "Cash", "Other"],
    required: true,
  },
  note: { type: String, trim: true },
  type: {
    type: String,
    enum: ["Advance", "Milestone", "Final"],
    required: true,
  },
});

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Full Stack",
        "Frontend",
        "Wordpress",
        "Webflow",
        "Framer",
        "Other",
      ],
      required: true,
    },
    totalAmount: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    priority: {
      type: String,
      enum: ["High", "Medium", "Easy"],
      default: "Medium",
    },
    // --- YAHAN PAYMENTS ARRAY ADD HUA HAI ---
    payments: [PaymentSchema],
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Ongoing",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
