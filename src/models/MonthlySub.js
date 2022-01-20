import mongoose, { Schema } from "mongoose";

const monthlySubSchema = new mongoose.Schema({
  monthly: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monthly",
    required: true,
  },
  importance: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  useMeasure: {
    // 단위를 사용할 것인가
    type: Boolean,
    required: true,
    default: false,
  },
  measureName: {
    // 단위명
    type: String,
    default: "",
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  targetValue: {
    type: Number,
    default: 9999,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const MonthlySub = mongoose.model("MonthlySub", monthlySubSchema);
export default MonthlySub;
