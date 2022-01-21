import mongoose, { Schema } from "mongoose";

const yearlySchema = new mongoose.Schema({
  termStart: Date,
  termEnd: Date,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "YearlySub",
    },
  ],
});

const Yearly = mongoose.model("Yearly", yearlySchema);
export default Yearly;
