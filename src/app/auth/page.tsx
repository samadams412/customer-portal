'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import PasswordStrengthBar from '@/components/app-ui/PasswordStrengthBar';
import { toast } from 'sonner';
import { z } from 'zod';

// Zod schema (used for both login and register, but stronger validation on register)
const baseSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});
const registerSchema = baseSchema.extend({
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[0-9]/, "Must include number")
    .regex(/[^A-Za-z0-9]/, "Must include special character"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = isLogin
      ? baseSchema.safeParse({ email, password })
      : registerSchema.safeParse({ email, password });

    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          const error = await res.json();
          setError(error.error || 'Registration failed.');
          return;
        }

        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.ok) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setError("Login after registration failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError("Unexpected error during registration.");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          {isLogin ? 'Login to Your Account' : 'Register for an Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Show password strength bar on register */}
          {!isLogin && <PasswordStrengthBar password={password} />}

          {error && <p className="text-destructive text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full" variant="secondary">
            {isLogin ? 'Sign In' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </p>
      </div>
    </main>
  );
}
