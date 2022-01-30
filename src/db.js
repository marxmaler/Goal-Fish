import mongoose from "mongoose";
import { config } from "./init";

mongoose.connect(config?.DB_URL ?? process.env.DB_URL);

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error", error));
db.once("open", () => console.log("✅ Connected to DB"));
