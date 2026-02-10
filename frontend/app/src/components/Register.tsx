"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Register() { // Removed onRegisterSuccess prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Error handling is now primarily managed by AuthContext, but local error state can still be used for immediate feedback.
  const { register, isLoading, error: authError } = useAuth(); // Destructure register, isLoading, and authError from useAuth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password); // Use the register function from AuthContext
      // If registration is successful, AuthContext will handle state updates and redirection
    } catch (err) {
      // AuthContext.register already sets an error, but local state can be used if needed
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          className="border p-2 mb-2 w-full text-black"
          required
          minLength={8}
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        {authError && <p className="text-red-500 mt-2">Error: {authError}</p>}
      </form>
    </div>
  );
}
