import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Crud = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', is_completed: false });
  const [editTask, setEditTask] = useState({ id: null, title: '', is_completed: false });

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


const createTask = async (e) => {
  e.preventDefault(); 
  if (!newTask.title.trim()) {
    alert('Task title cannot be empty');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  
        'x-requested-with': 'XMLHttpRequest'
      },
      body: JSON.stringify({ title: newTask.title }) 
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Task created successfully:', data);
      setNewTask({ title: '', is_completed: false });  
      fetchTasks();   
    } else {
      console.error('Failed to create task:', data.message);
    }
    
  } catch (error) {
    console.error('Error creating task:', error);
  }
};





  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update a task
  const updateTask = async (id) => {
    try {
      await axios.put(`http://localhost:8000/update/${id}`, editTask);
      setEditTask({ id: null, title: '', is_completed: false });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Edit task handler
  const handleEdit = (task) => {
    setEditTask(task);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Task Manager</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add a New Task</h5>
          <form onSubmit={createTask}>
            <div className="mb-3">
              <label className="form-label">Task Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={newTask.is_completed}
                onChange={(e) => setNewTask({ ...newTask, is_completed: e.target.checked })}
              />
              <label className="form-check-label">Mark as Completed</label>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </div>
      </div>

      <h3>Tasks</h3>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            {task.id === editTask.id ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={editTask.is_completed}
                    onChange={(e) => setEditTask({ ...editTask, is_completed: e.target.checked })}
                  />
                  <label className="form-check-label">
                    {editTask.is_completed ? 'Completed' : 'Not Completed'}
                  </label>
                </div>
              </>
            ) : (
              <>
                <span>{task.title}</span>
                <span className="badge bg-primary mx-2">
                  {task.is_completed ? 'Completed' : 'Not Completed'}
                </span>
              </>
            )}

            <div>
              {task.id === editTask.id ? (
                <button className="btn btn-success btn-sm mx-2" onClick={() => updateTask(task.id)}>
                  Save
                </button>
              ) : (
                <button className="btn btn-warning btn-sm mx-2" onClick={() => handleEdit(task)}>
                  Edit
                </button>
              )}
              <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Crud;
