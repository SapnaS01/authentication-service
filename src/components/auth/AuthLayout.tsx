import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            {children}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}