import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import Button from '../../components/UI/Button';
import { profileAPI, authAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Profile form
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [dailyGoal, setDailyGoal] = useState(3);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    profileAPI.get()
      .then(res => {
        setProfile(res.data);
        setEmail(res.data.email || '');
        setLevel(res.data.level || 'Beginner');
        setDailyGoal(res.data.daily_goal || 3);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await profileAPI.update({ level, daily_goal: dailyGoal });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPasswordSaving(true);
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordChanged(true);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully! Please login again.' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">{t('common.loading')}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      {/* Overlay after password change */}
      {passwordChanged && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Password Changed!</h3>
            <p className="text-slate-500 text-sm mb-6">Your password has been updated. Please login again with your new password.</p>
            <Button onClick={() => navigate('/login')} className="w-full py-3">
              <LogOut size={16} className="mr-2" /> Go to Login
            </Button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-slate-900">Settings</h2>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <User size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Profile</h3>
            <p className="text-xs text-slate-400">Update your profile information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('auth.username')}</label>
            <input value={profile?.username || ''} disabled
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('auth.email')}</label>
            <input value={email} disabled
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="Beginner">{t('course.beginner')}</option>
                <option value="Intermediate">{t('course.intermediate')}</option>
                <option value="Advanced">{t('course.advanced')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('dashboard.dailyGoal')}</label>
              <input type="number" min="1" max="20" value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
          </div>

          {profileMsg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {profileMsg.text}
            </div>
          )}

          <Button onClick={handleProfileSave} disabled={profileSaving}>
            {profileSaving ? 'Saving...' : t('common.save')}
          </Button>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Lock size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Change Password</h3>
            <p className="text-xs text-slate-400">Update your account password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
            <input type="password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
            <input type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>

          {passwordMsg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {passwordMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {passwordMsg.text}
            </div>
          )}

          <Button onClick={handlePasswordChange} disabled={passwordSaving}>
            {passwordSaving ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}
