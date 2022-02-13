import mongoose from "mongoose";

const weeklySchema = new mongoose.Schema({
  termStart: Date,
  termEnd: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklySub",
    },
  ],
  total: { type: Number, default: 0, required: true },
});

const Weekly = mongoose.model("Weekly", weeklySchema);
export default Weekly;
