import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: {
    type: String,
    enum: ["GPay", "Bank Transfer", "Other"],
    required: true,
  },
  transactionId: { type: String },
  type: { type: String, enum: ["Advance", "Milestone"], required: true },
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
    deadline: { type: Date },
    payments: [PaymentSchema],
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Ongoing",
    },
  },
  {
    timestamps: true, // <-- YEH LINE ADD KAREIN
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
