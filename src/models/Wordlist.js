import mongoose, { Schema } from "mongoose";

const wordSchema = new mongoose.Schema({
    spelling: { type: String, required: true },
    meaning: String,
    example: [String],
    quiz: [String],
    review: { type: Number, default: 0 },
})

const wordlistSchema = new mongoose.Schema({
    date: Date,
    words: [wordSchema],
});

export const Word = mongoose.model("Word", wordSchema);
export const Wordlist = mongoose.model("Wordlist", wordlistSchema); 