import React from 'react';
import { Chrome, Facebook, Github } from 'lucide-react';
import Button from '../ui/Button';

interface OAuthProvidersProps {
  onOAuthLogin: (provider: string) => Promise<void>;
  loading?: boolean;
}

const providers = [
  { id: 'google', name: 'Google', icon: Chrome, color: 'bg-red-500 hover:bg-red-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'github', name: 'GitHub', icon: Github, color: 'bg-gray-800 hover:bg-gray-900' },
];

export default function OAuthProviders({ onOAuthLogin, loading = false }: OAuthProvidersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <button
              key={provider.id}
              onClick={() => onOAuthLogin(provider.id)}
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${provider.color} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon className="w-5 h-5 mr-3" />
              Continue with {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}