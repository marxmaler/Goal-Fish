import mongoose, { Schema } from "mongoose";

const yearlySchema = new mongoose.Schema({
  term: {
    type: [Date],
    validate: [arrayLimit, "A month cannot be over 365 days"],
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

function arrayLimit(val) {
  return val.length <= 365;
}
