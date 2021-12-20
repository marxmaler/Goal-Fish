import mongoose, { Schema } from "mongoose";

const dailySubSchema = new mongoose.Schema({
    daily: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Daily",
        required: true
    },
    importance: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
});

const DailySub = mongoose.model("DailySub", dailySubSchema);
export default DailySub;