require('dotenv').config();


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
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
        id: nextId++,
        title,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    res.status(201).json(task);
});

// GET /tasks/:id - Get a single task
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.title = req.body.title || task.title;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    res.json(task);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(index, 1);
    res.json(deletedTask[0]);
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});