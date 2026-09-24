require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in the environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
}

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);


const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// In-memory tasks storage
let tasks = [];
let nextId = 1;

// GET / - Welcome message
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Tasks API' });
});

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
   try {
    const tasks = await Task.find();
    res.json(tasks);
   } catch (error) {
    console.log('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
   }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = await Task.create({ title });
        await task.save()
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /tasks/:id - Get a single task
app.get('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
        
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    const task = tasks.find(t => t.id === parseInt(req.params.id));

    
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { title, completed } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            { title, completed }, { new: true });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
})