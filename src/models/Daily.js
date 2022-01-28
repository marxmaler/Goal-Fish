import mongoose from "mongoose";

const dailySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: Date,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailySub",
    },
  ],
});

const Daily = mongoose.model("Daily", dailySchema);
export default Daily;
