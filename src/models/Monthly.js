import mongoose from "mongoose";

const monthlySchema = new mongoose.Schema({
  termStart: Date,
  termEnd: Date,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlySub",
    },
  ],
});

const Monthly = mongoose.model("Monthly", monthlySchema);
export default Monthly;
