"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Login from '../components/Login';
import Register from '../components/Register';
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const router = useRouter(); // Initialize useRouter
  const { isAuthenticated, user, logout, token, isLoading: authLoading, error: authError } = useAuth(); // Use useAuth hook
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Local loading state for tasks
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 'all', 'pending', 'completed'
  const [sortField, setSortField] = useState<string>('created_at'); // 'created_at', 'title'
  const [error, setError] = useState<string | null>(null); // Local error state for tasks
  const [showLogin, setShowLogin] = useState(true); // State to toggle between Login/Register forms

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Use environment variable

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    } else if (!isAuthenticated && !authLoading) {
      setLoading(false); // If not authenticated and auth check is done, stop local loading
    }
  }, [isAuthenticated, token, authLoading, filterStatus, sortField]); // Re-run when auth state changes or filter/sort changes

  const fetchTasks = async () => {
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (sortField) {
        params.append('sort', sortField);
      }
      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/tasks${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout(); // Token might be expired or invalid
          router.push('/'); // Redirect to home/login
        }
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      setNewTaskTitle('');
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateTask = async (id: number, newTitle: string, newDescription: string | null) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      setEditingTaskId(null); // Exit editing mode
      setEditedTaskTitle('');
      setEditedTaskDescription(null);
      fetchTasks(); // Refresh the task list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTask = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // No longer need handleLoginSuccess, handleRegisterSuccess, handleLogout here as AuthContext handles it.

  if (authLoading) {
    return <div className="container mx-auto p-4 text-center">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        {authError && <p className="text-red-500 text-center mb-4">Authentication Error: {authError}</p>}
        {showLogin ? (
          <>
            <Login /> {/* No props needed */}
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <button onClick={() => setShowLogin(false)} className="text-blue-500">
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <Register /> {/* No props needed */}
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <button onClick={() => setShowLogin(true)} className="text-blue-500">
                Login
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Render dashboard/tasks for authenticated users
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo App {user ? `for ${user.email}` : ''}</h1>
        <button onClick={logout} className="bg-gray-500 text-white p-2 rounded">
          Logout
        </button>
      </div>

      <form onSubmit={createTask} className="mb-4 flex">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className="border p-2 flex-grow mr-2 text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Task</button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label htmlFor="filter" className="mr-2 text-black">Filter by Status:</label>
          <select
            id="filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded text-black"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-black">Sort by:</label>
          <select
            id="sort"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border p-2 rounded text-black"
          >
            <option value="created_at">Created At</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && tasks.length === 0 && <p>No tasks yet. Add one above!</p>}

      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded text-black">
            {editingTaskId === task.id ? (
              // Editing mode
              <div className="flex-grow">
                <input
                  type="text"
                  value={editedTaskTitle}
                  onChange={(e) => setEditedTaskTitle(e.target.value)}
                  className="border p-1 w-full mb-1 text-black"
                />
                <textarea
                  value={editedTaskDescription || ''}
                  onChange={(e) => setEditedTaskDescription(e.target.value)}
                  className="border p-1 w-full text-black"
                  rows={2}
                />
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => updateTask(task.id, editedTaskTitle, editedTaskDescription)}
                    className="bg-green-500 text-white p-1 rounded text-sm mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTaskId(null);
                      setEditedTaskTitle('');
                      setEditedTaskDescription(null);
                    }}
                    className="bg-gray-500 text-white p-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display mode
              <div className="flex-grow flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className={`${task.completed ? 'line-through text-gray-500' : ''} flex-grow`}>
                  <p className="font-semibold">{task.title}</p>
                  {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
                </span>

                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditedTaskTitle(task.title);
                      setEditedTaskDescription(task.description);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded ml-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white p-1 rounded ml-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
