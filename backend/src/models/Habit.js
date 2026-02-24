const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // store days as strings like "2026-01-14"
    daysDone: { type: [String], default: [] },

    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
