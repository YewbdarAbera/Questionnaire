import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: {
      type: String,
      enum: ["Elementary", "Middle", "High"],
      required: true,
    },
    subjects: {
      type: [String],
      enum: ["Math", "Reading/Writing", "Science", "Other"],
      default: [],
    },
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    contact: {
      guardian: { type: String, required: true },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      preferred: {
        type: String,
        enum: ["email", "phone", "text"],
        required: true,
      },
    },
    count: { type: Number, min: 0, default: 0 },
    children: { type: [ChildSchema], default: [] },
    format: {
      type: String,
      enum: ["in-person", "online", "either"],
      default: "",
    },
    schedule: { type: String, enum: ["weekday", "weekend"], default: "" },
    days: { type: Number, enum: [1, 2, 3], default: 0 },
    hours: { type: Number, enum: [1, 2, 3], default: 0 },
    goals: {
      type: [String],
      enum: ["improve", "confidence", "test"],
      default: [],
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
