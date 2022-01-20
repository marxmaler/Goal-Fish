import mongoose, { Schema } from "mongoose";

const monthlySchema = new mongoose.Schema({
  term: {
    type: [Date],
    validate: [arrayLimit, "A month cannot be over 31 days"],
  },
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlySub",
    },
  ],
});

const Monthly = mongoose.model("Monthly", monthlySchema);
export default Monthly;

function arrayLimit(val) {
  return val.length <= 31;
}
