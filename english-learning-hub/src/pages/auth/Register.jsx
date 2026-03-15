import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { BookOpen } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const inputValue = e.target[0].value;
    const username = inputValue;
    const email = inputValue.includes('@') ? inputValue : '';
    const password = e.target[1].value;
    const confirmPassword = e.target[2].value;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({ username, email, password });
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setError(messages || "Registration failed. Please try again.");
      } else {
        setError("Cannot connect to server. Please try again.");
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('auth.register')}</h2>
        <p className="text-slate-500 text-sm mb-8">Join us and start learning today</p>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="text-left space-y-4">
          <Input label={`${t('auth.email')} / ${t('auth.username')}`} type="text" placeholder="username" required />
          <Input label={t('auth.password')} type="password" placeholder="Minimum 8 characters" required />
          <Input label={t('auth.confirmPassword')} type="password" placeholder="Confirm your password" required />

          <Button className="w-full py-3" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : t('auth.signUp')}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
            {t('auth.hasAccount')} <Link to="/login" className="text-primary font-bold hover:underline">{t('auth.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
