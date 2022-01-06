import mongoose, { Schema } from "mongoose";

const dailySubSchema = new mongoose.Schema({
  daily: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Daily",
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
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  targetValue: {
    type: Number,
  },

  linked: {
    // 연결된 주간 목표
    type: mongoose.Schema.Types.ObjectId,
    ref: "Weekly",
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const DailySub = mongoose.model("DailySub", dailySubSchema);
export default DailySub;
