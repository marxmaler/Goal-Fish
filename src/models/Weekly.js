import mongoose, { Schema } from "mongoose";

const weeklySchema = new mongoose.Schema({
    term: { 
        type: [ Date ], 
        validate: [arrayLimit, "A week cannot be over 7 days"]
    },
    subs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklySub"
    }],
});

const Weekly = mongoose.model("Weekly", weeklySchema);
export default Weekly;

function arrayLimit(val) {
    return val.length <= 7;
  }