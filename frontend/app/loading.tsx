'use client';

import { Rocket } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center mb-4 animate-bounce">
        <Rocket className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Carregando...</h1>
    </div>
  );
}