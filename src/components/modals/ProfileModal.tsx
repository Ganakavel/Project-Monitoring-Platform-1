import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Check, User, Mail, Briefcase, Globe, Sparkles, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

export const ProfileModal: React.FC = () => {
  const { profile, updateProfile, isProfileModalOpen, setIsProfileModalOpen } = useApp();

  const [formData, setFormData] = useState<UserProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form with latest profile every time modal opens
  useEffect(() => {
    if (isProfileModalOpen) {
      setFormData(profile);
    }
  }, [isProfileModalOpen]);

  // Preset avatar choices
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  ];

  if (!isProfileModalOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Update form preview AND push instantly to profile so sidebar/topbar update immediately
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        updateProfile({ avatar: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-blue-100 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time Profile Updation
          </div>
          <h2 className="text-xl font-bold">Edit Your Profile</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Changes synchronize instantly across your team dashboard and chat.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
          {/* Avatar Section */}
          <div className="flex items-center gap-5">
            {/* Avatar with hover overlay */}
            <div className="relative group shrink-0">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50 shadow-md"
              />
              <label className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity gap-1">
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Change</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 transition-colors w-fit"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>
              <p className="text-[11px] text-slate-400">JPG, PNG or GIF · Max 5 MB</p>

              {/* Preset avatars */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Or choose a preset</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                {presetAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: url }))}
                    className={`relative rounded-full transition-transform hover:scale-110 ${
                      formData.avatar === url ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    }`}
                  >
                    <img
                      src={url}
                      alt="Preset"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  </button>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['online', 'busy', 'away', 'offline'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: st }))}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium capitalize flex items-center justify-center gap-1.5 transition-all ${
                    formData.status === st
                      ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-semibold ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      st === 'online'
                        ? 'bg-emerald-500'
                        : st === 'busy'
                        ? 'bg-rose-500'
                        : st === 'away'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Role Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title / Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Email & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Timezone
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, timezone: e.target.value }))
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio / Focus
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
