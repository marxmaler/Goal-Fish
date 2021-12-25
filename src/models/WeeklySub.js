import mongoose, { Schema } from "mongoose";

const weeklySubSchema = new mongoose.Schema({
    weekly: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weekly",
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
    intermediate: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "WeeklySubInter"
        }],
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
});

const WeeklySub = mongoose.model("WeeklySub", weeklySubSchema);
export default WeeklySub;