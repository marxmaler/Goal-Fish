import mongoose from "mongoose";

const monthlySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  termStart: Date,
  termEnd: Date,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlySub",
    },
  ],
  total: { type: Number, default: 0, required: true },
});

const Monthly = mongoose.model("Monthly", monthlySchema);
export default Monthly;
