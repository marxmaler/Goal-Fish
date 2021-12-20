import mongoose, { Schema } from "mongoose";

const dailySchema = new mongoose.Schema({
    date: Date,
    subs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailySub"
    }],
});

const Daily = mongoose.model("Daily", dailySchema);
export default Daily;