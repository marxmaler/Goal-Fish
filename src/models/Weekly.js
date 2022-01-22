import mongoose from "mongoose";

const weeklySchema = new mongoose.Schema({
  termStart: Date,
  termEnd: Date,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklySub",
    },
  ],
});

const Weekly = mongoose.model("Weekly", weeklySchema);
export default Weekly;
