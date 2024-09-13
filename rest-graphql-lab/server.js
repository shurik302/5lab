const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let tasks = [
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
];

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Get a single task by id
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        name: req.body.name
    };
    tasks.push(task);
    res.status(201).json(task);
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');

    task.name = req.body.name;
    res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).send('Task not found');

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
