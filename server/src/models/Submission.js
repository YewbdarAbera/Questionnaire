import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: false },
    grade: { type: String, required: true },
    subjects: { type: [String], default: [] }, // ✅ array
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    parent: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: false },
      studyPlan: { type: String, required: false },
    },
    children: { type: [ChildSchema], default: [] },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
