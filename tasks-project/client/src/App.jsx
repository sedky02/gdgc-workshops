import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setError('');

    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Could not reach the API. Is the server running?');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Could not create task');
        return;
      }

      setTitle('');
      await loadTasks();
    } catch (err) {
      setError('Could not reach the API. Is the server running?');
    }
  }

  async function toggleTask(task) {
    try {
      await fetch(`${API_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });

      await loadTasks();
    } catch (err) {
      setError('Could not reach the API. Is the server running?');
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      await loadTasks();
    } catch (err) {
      setError('Could not reach the API. Is the server running?');
    }
  }

  return (
    <div className="app">
      <h1>Tasks</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <p className="error">{error}</p>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />
            <span>{task.title}</span>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
