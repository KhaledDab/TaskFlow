const express = require("express");
const Habit = require("../models/Habit");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get my habits
router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Create habit
router.post("/", protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Habit name is required" });

    const habit = await Habit.create({
      name: name.trim(),
      user: req.user._id,
      daysDone: [],
    });

    res.status(201).json(habit);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Toggle day done/undone
router.patch("/:habitId/toggle", protect, async (req, res) => {
  try {
    const { habitId } = req.params;
    const { date } = req.body; // "YYYY-MM-DD"
    if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });

    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const set = new Set(habit.daysDone);
    if (set.has(date)) set.delete(date);
    else set.add(date);

    habit.daysDone = Array.from(set).sort(); // keep stable
    await habit.save();

    res.json(habit);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete habit
router.delete("/:habitId", protect, async (req, res) => {
  try {
    const { habitId } = req.params;
    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    await habit.deleteOne();
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
