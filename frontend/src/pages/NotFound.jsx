import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animation-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animation-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="glass-card p-12">
          {/* 404 Display */}
        <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">
                Oops! Page Not Found
              </h2>
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

          {/* Search Icon Animation */}
          <div className="mb-8">
            <div className="inline-flex p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animation-float">
              <Search className="h-16 w-16 text-purple-400" />
            </div>
          </div>

          {/* Action Buttons */}
        <div className="space-y-4">
          <Link
              to="/"
              className="btn-primary inline-flex items-center space-x-3 text-lg px-8 py-4"
          >
              <Home className="h-6 w-6" />
              <span>Return Home</span>
          </Link>
          
            <div className="text-center">
          <button
            onClick={() => window.history.back()}
                className="btn-outline inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-white/60">
              If you believe this is an error, please contact our support team
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-sm"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 