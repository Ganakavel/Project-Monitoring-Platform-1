import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, Zap, CheckCircle, Lock, Mail, AlertCircle, Users } from 'lucide-react';
import { TEAM_USERS, TeamUser } from '../data/initialData';

interface SignInPageProps {
  onSignIn: (email: string, password: string) => boolean;
}

const features = [
  'Real-time project monitoring',
  'Team collaboration & live chat',
  'Smart calendar & task tracking',
  'AI-powered project assistant',
];

export const SignInPage: React.FC<SignInPageProps> = ({ onSignIn }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamUser | null>(null);

  // Unique members for display (skip demo alias, keep one per memberId)
  const displayMembers = TEAM_USERS.filter((u) => u.email !== 'demo@nexgencreators.io');

  const handleMemberClick = (user: TeamUser) => {
    setSelectedMember(user);
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const ok = onSignIn(email.trim(), password);
    if (!ok) setError('Invalid email or password. Pick a member below or enter credentials manually.');
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSignupSuccess(true);
    setTimeout(() => {
      setSignupSuccess(false);
      setTab('signin');
      setPassword('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex font-sans antialiased">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">NexGen Creators</p>
            <p className="text-blue-200 text-xs">Project Monitoring Platform</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Manage projects<br />
            <span className="text-blue-200">at the speed of thought.</span>
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-sm">
            Everything your team needs — tasks, calendar, documents, and real-time AI collaboration — in one powerful platform.
          </p>
          <ul className="space-y-3 mb-10">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-blue-50 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Team avatars on branding panel */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {displayMembers.slice(0, 6).map((u) => (
                <img
                  key={u.memberId + u.email}
                  src={u.profile.avatar}
                  alt={u.profile.name}
                  className="w-8 h-8 rounded-full ring-2 ring-white/50 object-cover"
                  title={u.profile.name}
                />
              ))}
            </div>
            <p className="text-blue-100 text-xs ml-1">
              <span className="font-bold text-white">{displayMembers.length} team members</span> already inside
            </p>
          </div>
        </div>

        <div className="relative text-blue-300 text-xs">© 2026 NexGen Creators. All rights reserved.</div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f1f3f8] p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <p className="text-slate-800 font-bold text-base">NexGen Creators</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button
                className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  tab === 'signin' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => { setTab('signin'); setError(''); }}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  tab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => { setTab('signup'); setError(''); }}
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </button>
            </div>

            <div className="p-6">
              {/* ══ SIGN IN ══ */}
              {tab === 'signin' && (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-0.5">Welcome back</h2>
                  <p className="text-xs text-slate-500 mb-4">Sign in as a team member</p>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{error}</p>
                    </div>
                  )}

                  {/* ── Team Member Quick-Select ── */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-600 mb-2.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      Select your account
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {displayMembers.map((user) => {
                        const isSelected = selectedMember?.email === user.email;
                        return (
                          <button
                            key={user.email}
                            type="button"
                            onClick={() => handleMemberClick(user)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-200'
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                            }`}
                            title={`${user.profile.name} — ${user.email}`}
                          >
                            <div className="relative">
                              <img
                                src={user.profile.avatar}
                                alt={user.profile.name}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight truncate w-full">
                              {user.profile.name.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-slate-400 text-center truncate w-full leading-tight">
                              {user.profile.role.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedMember && (
                      <div className="mt-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-700">
                        <span className="font-semibold">{selectedMember.profile.name}</span> selected · credentials auto-filled ✓
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-3">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setSelectedMember(null); }}
                          placeholder="member@nexgencreators.io"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/30 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading
                        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <LogIn className="w-4 h-4" />}
                      {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                  </form>

                  {/* Credentials table */}
                  <details className="mt-4 group">
                    <summary className="text-xs text-blue-600 font-semibold cursor-pointer select-none hover:underline list-none flex items-center gap-1">
                      <span>📋 View all team credentials</span>
                      <span className="text-slate-400 group-open:rotate-90 transition-transform inline-block">›</span>
                    </summary>
                    <div className="mt-2 rounded-xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-[10px]">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left px-2.5 py-1.5 text-slate-500 font-semibold">Member</th>
                            <th className="text-left px-2.5 py-1.5 text-slate-500 font-semibold">Password</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {displayMembers.map((u) => (
                            <tr
                              key={u.email}
                              className="hover:bg-blue-50 cursor-pointer transition-colors"
                              onClick={() => handleMemberClick(u)}
                            >
                              <td className="px-2.5 py-1.5">
                                <div className="flex items-center gap-1.5">
                                  <img src={u.profile.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                                  <span className="font-semibold text-slate-700">{u.profile.name.split(' ')[0]}</span>
                                </div>
                              </td>
                              <td className="px-2.5 py-1.5 font-mono text-slate-500">{u.password}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </>
              )}

              {/* ══ SIGN UP ══ */}
              {tab === 'signup' && (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-0.5">Create account</h2>
                  <p className="text-xs text-slate-500 mb-5">Join the NexGen Creators workspace</p>

                  {signupSuccess ? (
                    <div className="flex flex-col items-center py-8 gap-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">Account created!</p>
                      <p className="text-xs text-slate-500 text-center">Redirecting to sign in…</p>
                    </div>
                  ) : (
                    <>
                      {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-red-600">{error}</p>
                        </div>
                      )}
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm password</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type={showConfirm ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password"
                              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <button type="submit" disabled={loading}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                          {loading ? 'Creating…' : 'Create Account'}
                        </button>
                      </form>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">NexGen Creators · Secured Platform · v2.0</p>
        </div>
      </div>
    </div>
  );
};
