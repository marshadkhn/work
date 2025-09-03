import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please provide an amount."],
    },
    category: {
      type: String,
      required: [true, "Please select a category."],
      enum: [
        "Software",
        "Travel",
        "Food",
        "Office Supplies",
        "Subcontractor",
        "Other",
      ],
    },
    // --- YEH NAYI FIELD ADD KAREIN ---
    otherCategoryDescription: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
