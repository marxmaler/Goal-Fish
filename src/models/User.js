import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  joinedWithSocial: { type: Boolean, default: false },
  dailies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Daily",
    },
  ],
  weeklies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weekly",
    },
  ],
  monthlies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monthly",
    },
  ],
  yearlies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Yearly",
    },
  ],
  quote: { type: String },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
