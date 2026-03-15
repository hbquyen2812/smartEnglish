import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: enter username, 2: enter new password, 3: done
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Please enter your username.'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.forgotPassword(username, email);
      setToken(res.data.reset_token);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError(null);
    try {
      await authAPI.resetPassword(token, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
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

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password</h2>
            <p className="text-slate-500 text-sm mb-8">Enter your username to reset your password</p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleRequestReset} className="text-left space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.username')}</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username" required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')} (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for verification"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" />
              </div>
              <Button className="w-full py-3" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Continue'}
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Set New Password</h2>
            <p className="text-slate-500 text-sm mb-8">Create a new password for <strong>{username}</strong></p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleResetPassword} className="text-left space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters" required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password" required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" />
              </div>
              <Button className="w-full py-3" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm mb-8">Your password has been changed successfully.</p>
            <Link to="/login">
              <Button className="w-full py-3">Go to Login</Button>
            </Link>
          </>
        )}

        <p className="mt-6 text-sm text-slate-500">
          <Link to="/login" className="text-primary font-bold hover:underline flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
