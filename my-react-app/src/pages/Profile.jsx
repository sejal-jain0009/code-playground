import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showSuccess, setShowSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/home');
  };

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const initialUser = { 
          name: parsed.name || '', 
          email: parsed.email || '',
          password: parsed.password || ''
        };
        setUser(initialUser);
        setEditValues({ name: initialUser.name, email: initialUser.email });
      } catch {
        setUser({ name: '', email: '', password: '' });
        setEditValues({ name: '', email: '' });
      }
    }
  }, []);

  const validateProfileForm = () => {
    const newErrors = {};

    if (!editValues.name.trim()) {
      newErrors.name = 'Name cannot be empty';
    } else if (editValues.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const email = editValues.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.current.trim()) {
      newErrors.current = 'Current password is required';
    } else if (passwordForm.current !== user.password) {
      newErrors.current = 'Current password is incorrect';
    }

    if (!passwordForm.new.trim()) {
      newErrors.new = 'New password is required';
    } else {
      if (passwordForm.new.length < 6) {
        newErrors.new = 'New password must be at least 6 characters';
      } else if (!/[0-9]/.test(passwordForm.new)) {
        newErrors.new = 'New password must contain at least 1 number';
      } else if (!/[A-Z]/.test(passwordForm.new)) {
        newErrors.new = 'New password must contain at least 1 uppercase letter';
      }
    }

    if (!passwordForm.confirm.trim()) {
      newErrors.confirm = 'Please confirm new password';
    } else if (passwordForm.confirm !== passwordForm.new) {
      newErrors.confirm = 'Passwords do not match';
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setShowSuccess('');
    setErrors({});
  };

  const handleSaveProfileChanges = async () => {
    if (validateProfileForm()) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        const updatedUser = { ...user, name: editValues.name.trim(), email: editValues.email.trim() };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
        setShowSuccess('Profile Updated Successfully!');
        setTimeout(() => setShowSuccess(''), 3000);
      } catch {
        setErrors({ general: 'Failed to update profile' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelProfile = () => {
    setEditValues({ name: user.name, email: user.email });
    setEditMode(false);
    setShowSuccess('');
    setErrors({});
  };

  const handleSavePassword = async () => {
    const isValid = validatePasswordForm();
    if (isValid) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const updatedUser = { ...user, password: passwordForm.new };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPasswordForm({ current: '', new: '', confirm: '' });
        setShowSuccess('Password Changed Successfully!');
        setTimeout(() => setShowSuccess(''), 3000);
        setActiveTab('profile');
      } catch {
        setErrors({ general: 'Failed to update password' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'name' || field === 'email') {
      setEditValues(prev => ({ ...prev, [field]: value }));
    } else {
      setPasswordForm(prev => ({ ...prev, [field]: value }));
    }
    // Clear specific field error on type
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getInitials = () => {
    const name = user.name || 'Guest';
    const names = name.split(' ').filter(n => n.length > 0);
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="card-glass rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl border border-slate-800/50">
          {/* Header */}
          <div className="text-center mb-8 pb-8 border-b border-slate-800/50">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-3 border-cyan-400/30 flex items-center justify-center shadow-xl">
              <span className="text-xl font-black text-cyan-300 drop-shadow-md">
                {getInitials()}
              </span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
              {user.name || 'Guest'}
            </h1>
            <p className="text-sm text-slate-400">{user.email || 'No email set'}</p>
          </div>

          {/* Success/Error Messages */}
          {showSuccess && (
            <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm border shadow-lg animate-in slide-in-from-top fade-in ${showSuccess.includes('Profile') ? 'bg-emerald-900/40 border-emerald-400/50 shadow-emerald-400/20' : 'bg-blue-900/40 border-blue-400/50 shadow-blue-400/20'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-ping ${showSuccess.includes('Profile') ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                <span className="font-semibold text-sm">{showSuccess}</span>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-900/40 border border-red-400/50 rounded-xl backdrop-blur-sm shadow-lg shadow-red-400/20 animate-pulse">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-semibold text-sm text-red-200">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-slate-900/50 rounded-2xl p-1 mb-6 backdrop-blur-sm border border-slate-700/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="profile-label block uppercase tracking-wider mb-2">Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={loading}
                        className={`profile-input w-full h-12 px-4 rounded-xl border-2 text-sm font-semibold backdrop-blur-sm transition-all shadow-inner focus:shadow-lg ${
                          errors.name 
                            ? 'ring-red-400/30 focus:ring-red-400/50' 
                            : loading 
                              ? '' 
                              : 'focus:ring-cyan-400/30 hover:border-cyan-400/70'
                        }`}
                        placeholder="Enter your full name"
                        autoFocus
                      />
                    ) : (
                      <div className="profile-display h-12 px-4 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm flex items-center text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                        {user.name || 'Guest'}
                      </div>
                    )}
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="profile-label block uppercase tracking-wider mb-2">Email</label>
                    {editMode ? (
                      <input
                        type="email"
                        value={editValues.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                        className={`w-full h-12 px-4 rounded-xl bg-slate-900/70 border-2 text-sm font-semibold backdrop-blur-sm transition-all shadow-inner focus:shadow-lg ${
                          errors.email 
                            ? 'border-red-400/60 ring-red-400/30 focus:border-red-400' 
                            : loading 
                              ? 'border-slate-600/50' 
                              : 'border-cyan-500/40 focus:border-cyan-400 focus:ring-cyan-400/30 hover:border-cyan-400/60'
                        }`}
                        placeholder="your-email@example.com"
                      />
                    ) : (
                      <div className="profile-display h-12 px-4 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm flex items-center text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                        {user.email || 'No email set'}
                      </div>
                    )}
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-800/50">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleSaveProfileChanges}
                        disabled={loading || Object.keys(errors).length > 0}
                        className="flex-1 h-12 rounded-xl font-semibold text-sm px-6 transition-all bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Saving...
                          </>
                        ) : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelProfile}
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl font-semibold text-sm px-6 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-600/50 backdrop-blur-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditProfile}
                      className="w-full h-12 rounded-xl font-semibold text-sm px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl flex items-center justify-center"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="profile-label block uppercase tracking-wider mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => handleInputChange('current', e.target.value)}
                      disabled={loading}
                      className={`w-full h-12 px-4 rounded-xl bg-slate-900/70 border-2 text-sm font-semibold backdrop-blur-sm transition-all shadow-inner ${
                        errors.current 
                          ? 'border-red-400/60 ring-red-400/30 focus:border-red-400' 
                          : loading 
                            ? 'border-slate-600/50' 
                            : 'border-orange-500/40 focus:border-orange-400 focus:ring-orange-400/30 hover:border-orange-400/60'
                      }`}
                      placeholder="Enter current password"
                    />
                    {errors.current && <p className="mt-1 text-xs text-red-400">{errors.current}</p>}
                  </div>

                  <div>
                    <label className="profile-label block uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => handleInputChange('new', e.target.value)}
                      disabled={loading}
                      className={`w-full h-12 px-4 rounded-xl bg-slate-900/70 border-2 text-sm font-semibold backdrop-blur-sm transition-all shadow-inner ${
                        errors.new 
                          ? 'border-red-400/60 ring-red-400/30 focus:border-red-400' 
                          : loading 
                            ? 'border-slate-600/50' 
                            : 'border-orange-500/40 focus:border-orange-400 focus:ring-orange-400/30 hover:border-orange-400/60'
                      }`}
                      placeholder="New password (6+ chars, 1 number, 1 uppercase)"
                    />
                    {errors.new && <p className="mt-1 text-xs text-red-400">{errors.new}</p>}
                  </div>

                  <div>
                    <label className="profile-label block uppercase tracking-wider mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => handleInputChange('confirm', e.target.value)}
                      disabled={loading}
                      className={`w-full h-12 px-4 rounded-xl bg-slate-900/70 border-2 text-sm font-semibold backdrop-blur-sm transition-all shadow-inner ${
                        errors.confirm 
                          ? 'border-red-400/60 ring-red-400/30 focus:border-red-400' 
                          : loading 
                            ? 'border-slate-600/50' 
                            : 'border-orange-500/40 focus:border-orange-400 focus:ring-orange-400/30 hover:border-orange-400/60'
                      }`}
                      placeholder="Confirm new password"
                    />
                    {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm}</p>}
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-800/50">
                  <button
                    onClick={handleSavePassword}
                    disabled={loading}
                    className="flex-1 h-12 rounded-xl font-semibold text-sm px-6 transition-all bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Changing...
                      </>
                    ) : 'Change Password'}
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    disabled={loading}
                    className="flex-1 h-12 rounded-xl font-semibold text-sm px-6 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-600/50 backdrop-blur-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6 pt-4 border-t border-slate-800/50">
            <button
              onClick={handleBackToDashboard}
              disabled={loading}
              className="h-11 px-10 rounded-xl font-semibold text-sm bg-gradient-to-r from-slate-700/80 to-slate-800/80 hover:from-slate-600 hover:to-slate-700 border border-slate-600/50 backdrop-blur-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

