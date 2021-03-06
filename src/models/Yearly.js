import mongoose from "mongoose";

const yearlySchema = new mongoose.Schema({
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
      ref: "YearlySub",
    },
  ],
  total: { type: Number, default: 0, required: true },
});

const Yearly = mongoose.model("Yearly", yearlySchema);
export default Yearly;
