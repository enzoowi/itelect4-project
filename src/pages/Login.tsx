import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [username, setUsername] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login('dummy-jwt-token');
      navigate('/marketplace');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please enter your username to login.</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="grid gap-1.5">
          <Label htmlFor="username" className="text-foreground">
            Username
          </Label>
          <Input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter any username..."
          />
        </div>
        <Button 
          type="submit" 
          disabled={username.trim() === ""}
          className="w-full"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
