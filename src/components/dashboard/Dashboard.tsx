import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Shield, Settings } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-600">Your account details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                  <p className="text-sm text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                  <p className="text-sm text-gray-900">{user?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-600">Account security status</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    ✓ Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Two-Factor Auth</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    ✓ Enabled
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Manage preferences</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Manage Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Your Dashboard!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been successfully authenticated and secured.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Shield className="w-4 h-4 mr-2" />
                Secured with JWT Authentication
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}