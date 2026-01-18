import mongoose from "mongoose";


const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: String,
    priority: String,
    deadline: Date,

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


export default mongoose.model("Project", projectSchema);
