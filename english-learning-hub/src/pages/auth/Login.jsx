import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { BookOpen } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (!err.response) {
        setError("Cannot connect to server. Is the backend running?");
      } else {
        setError("Login failed. Please try again.");
      }
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('auth.login')}</h2>
        <p className="text-slate-500 text-sm mb-8">Sign in to continue your learning journey</p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="text-left space-y-4">
          <Input label={t('auth.username')} type="text" placeholder="Enter username" required />
          <Input label={t('auth.password')} type="password" placeholder="••••••••" required />

          <div className="flex justify-between items-center text-sm">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Remember me</span>
             </label>
             <Link to="/forgot-password" className="text-primary font-medium hover:underline">Forgot password?</Link>
          </div>

          <Button className="w-full py-3" type="submit" disabled={loading}>
             {loading ? 'Signing In...' : t('auth.signIn')}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
            {t('auth.noAccount')} <Link to="/register" className="text-primary font-bold hover:underline">{t('auth.signUp')}</Link>
        </p>
      </div>
    </div>
  );
}
