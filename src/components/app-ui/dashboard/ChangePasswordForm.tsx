// src/components/app-ui/dashboard/ChangePasswordForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import PasswordStrengthBar from '@/components/app-ui/PasswordStrengthBar'; // ✅ Add import

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a symbol'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(''); // ✅ Track password input locally

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to change password');
        return;
      }

      toast.success('Password changed successfully');
      reset();
      setPassword(''); // Clear strength bar
    } catch (error) {
      console.error(error);
      toast.error('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6 border border-border bg-card">
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              type="password"
              id="currentPassword"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              {...register('newPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // ✅ Track for strength bar
            />
            <PasswordStrengthBar password={password} /> {/* ✅ Show bar below input */}
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              type="password"
              id="confirmNewPassword"
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
