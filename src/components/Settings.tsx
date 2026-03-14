import { Sidebar } from './Sidebar';
import { User, ViewType } from '../App';
import { Bell, Lock, User as UserIcon, Mail, Shield } from 'lucide-react';

interface SettingsProps {
  user: User;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}

export function Settings({ user, onNavigate, onLogout }: SettingsProps) {
  return (
    <div className="flex h-screen">
      <Sidebar
        user={user}
        currentView="settings"
        notificationCount={0}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
            <p className="text-slate-600 mt-1">
              Manage your account preferences and settings
            </p>
          </div>
        </header>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Account Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      readOnly
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Notification Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Email Notifications</p>
                    <p className="text-sm text-slate-600">Receive email updates about your projects</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {user.role === 'student' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Access Request Notifications</p>
                      <p className="text-sm text-slate-600">Get notified when faculty request access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Project Updates</p>
                    <p className="text-sm text-slate-600">Updates about projects you're involved in</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Privacy & Security</h3>
              </div>
              
              <div className="space-y-4">
                {user.role === 'student' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Profile Visibility</p>
                      <p className="text-sm text-slate-600">Make your profile visible to faculty</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-600">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Change Password</p>
                    <p className="text-sm text-slate-600">Update your account password</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition">
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Delete Account</p>
                    <p className="text-sm text-slate-600">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
