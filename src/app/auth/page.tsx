// src/app/auth/page.tsx
'use client'; // This is a Client Component

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn function from NextAuth.js
import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation
import Link from 'next/link'; // For linking to other pages (e.g., if you had a separate register page)

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to display authentication errors
  const router = useRouter(); // Initialize router for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors

    // Use NextAuth.js's signIn function with the 'credentials' provider
    // The 'authorize' callback in src/auth.ts will handle whether to log in an existing user
    // or register a new one based on email existence.
    const result = await signIn('credentials', {
      redirect: false, // Prevent NextAuth.js from redirecting automatically after sign-in
      email,
      password,
      // You can add a 'callbackUrl' here if you want to redirect to a specific page after successful login
      // Otherwise, we'll manually redirect using Next.js router
    });

    if (result?.error) {
      // Handle errors returned by the 'authorize' callback in src/auth.ts
      // For security, NextAuth.js provides generic errors like "CredentialsSignin".
      // You can map these to user-friendly messages or keep them generic.
      if (result.error === "CredentialsSignin") {
        setError("Invalid email or password.");
      } else {
        setError(result.error); // Display generic NextAuth.js error
      }
    } else if (result?.ok) {
      // If sign-in was successful, redirect to the dashboard or home page
      router.push('/dashboard'); // Redirect to dashboard
      router.refresh(); // Force a refresh to update session state across the app
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          {isLogin ? 'Login to Your Account' : 'Register for an Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
          <button
            type="button" // Use type="button" to prevent form submission on click
            onClick={() => {
              setIsLogin(!isLogin);
              setError(''); // Clear errors when switching form type
            }}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </p>
      </div>
    </main>
  );
}
