import mongoose, { Schema } from "mongoose";

const weeklySubInterSchema = new mongoose.Schema({
    weeklySub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklySub",
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

const WeeklySubInter = mongoose.model("WeeklySubInter", weeklySubInterSchema);
export default WeeklySubInter;