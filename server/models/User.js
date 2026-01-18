import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["Admin", "Project Manager", "Team Member"],
      default: "Team Member",
    },

    isVerified: { type: Boolean, default: false },

    verificationToken: String,
    verificationTokenExpires: Date,

    forgotPasswordToken: String,
    forgotPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
