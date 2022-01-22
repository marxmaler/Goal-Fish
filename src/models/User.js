import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
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
});

userSchema.pre("save", async function () {
  console.log(this.password);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
    console.log(this.password);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
