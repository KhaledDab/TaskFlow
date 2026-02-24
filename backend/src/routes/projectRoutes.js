const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');
const Task = require("../models/Task");

const router = express.Router();

// Create Project
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body; // ✅ include description

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : "", // ✅ safe
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      user: req.user._id
    });

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get My Projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update Project (title/description/dates)
router.patch("/:projectId", protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const project = await Project.findOne({ _id: projectId, user: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (startDate !== undefined) project.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined) project.endDate = endDate ? new Date(endDate) : undefined;

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete Project + delete its tasks
router.delete("/:projectId", protect, async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({ _id: projectId, user: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.deleteMany({ project: projectId, user: req.user._id }); // ✅ cascade delete tasks
    await project.deleteOne();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


module.exports = router;
