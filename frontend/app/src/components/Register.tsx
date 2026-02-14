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
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email-register" className="sr-only">Email</label>
          <input
            id="email-register"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="password-register" className="sr-only">Password</label>
          <input
            id="password-register"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
            required
            minLength={8}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        {authError && <p className="mt-4 text-center text-red-600 text-sm">{authError}</p>}
      </form>
    </div>
  );
}
