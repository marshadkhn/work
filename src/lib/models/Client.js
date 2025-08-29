import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the client."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  company: {
    type: String,
    required: [true, "Please provide the company name."],
    maxlength: [60, "Company cannot be more than 60 characters"],
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "On Hold", "Completed", "Past Client"],
    default: "Active",
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
