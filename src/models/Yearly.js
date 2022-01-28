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
});

const Yearly = mongoose.model("Yearly", yearlySchema);
export default Yearly;
