const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try{
        const { projectId, title, description, status } = req.body;

        const project = await Project.findOne({
            _id: projectId,
            user: req.user._id
        });

        if(!project){
            return res.status(404).json({ message: 'Project not found'});
        }

        const task = await Task.create({
            title,
            description,
            status,
            project: projectId,
            user: req.user._id
        });

        res.status(201).json(task);
    } catch (error){
        return res.status(500).json({ message : error.message });
    }
});

// Get Tasks
router.get('/:projectId', protect, async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            user: req.user._id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }

        const tasks = await Task.find({
            project: projectId,
            user: req.user._id
        });

        res.status(200).json(tasks);
    } catch (error){
        return res.status(500).json({ message: error.message});
    }
});

// Update Task

router.patch('/:taskId', protect, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;
        const task = await Task.findOne({
            _id: taskId,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not yours' });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;

        await task.save();

        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete('/:taskId', protect, async (req, res) => {
    try{
        const { taskId } = req.params;
        
        const task = await Task.findOne({
            _id : taskId,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not yours' });
        }

        await task.deleteOne();
        res.status(204).json({ message: 'No Content'});
    } catch (error){
        return res.status(500).json({ message: error.message });
    }
});

// Task Summary (for dashboard)
router.get("/summary/me", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Task.countDocuments({ user: userId });
    const pending = await Task.countDocuments({ user: userId, status: "pending" });
    const inProgress = await Task.countDocuments({ user: userId, status: "in-progress" });
    const done = await Task.countDocuments({ user: userId, status: "done" });

    return res.json({ total, pending, inProgress, done });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


module.exports = router;