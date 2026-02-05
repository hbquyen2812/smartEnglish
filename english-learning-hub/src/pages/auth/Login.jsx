import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { BookOpen } from 'lucide-react';
import { authAPI } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const username = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);
    try {
      const response = await authAPI.login(username, password);
      if (response.data.access) {
          localStorage.setItem('accessToken', response.data.access);
          localStorage.setItem('refreshToken', response.data.refresh);
          navigate('/dashboard');
      } else {
          setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6">
            <BookOpen size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-sm mb-8">Sign in to continue your learning journey</p>
        
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="text-left space-y-4">
          <Input label="Username / Email" type="text" placeholder="Enter username" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          
          <div className="flex justify-between items-center text-sm">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Remember me</span>
             </label>
             <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
          </div>

          <Button className="w-full py-3" type="submit" disabled={loading}>
             {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}