"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Login() { // Removed onLoginSuccess prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Error handling is now primarily managed by AuthContext, but local error state can still be used for immediate feedback.
  const { login, isLoading, error: authError } = useAuth(); // Destructure login, isLoading, and authError from useAuth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Use the login function from AuthContext
      // If login is successful, AuthContext will handle state updates and redirection
    } catch (err) {
      // AuthContext.login already sets an error, but local state can be used if needed
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mb-2 w-full text-black"
          required
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mb-2 w-full text-black"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {authError && <p className="text-red-500 mt-2">Error: {authError}</p>}
      </form>
    </div>
  );
}
