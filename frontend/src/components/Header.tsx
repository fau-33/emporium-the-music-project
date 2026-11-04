import React, { useEffect, useState } from "react";
import { Music, Wifi, WifiOff, ShoppingBag } from "lucide-react";
import { checkApiHealth } from "../services/api";

export const Header: React.FC = () => {
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend connection status on component mount
    checkApiHealth()
      .then(() => setIsApiOnline(true))
      .catch(() => setIsApiOnline(false));
  }, []);

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              Empório da Música
            </h1>
            <p className="text-xs text-amber-400 font-medium">
              Sua música começa aqui • Campo Grande/MS
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#catalog" className="hover:text-amber-400 transition-colors">
            Catalog
          </a>
          <a
            href="#promotions"
            className="hover:text-amber-400 transition-colors"
          >
            Promotions
          </a>
          <a
            href="#policies"
            className="hover:text-amber-400 transition-colors"
          >
            Store Policies
          </a>
        </nav>

        {/* Right Action & API Status Indicator */}
        <div className="flex items-center space-x-4">
          {/* API Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            {isApiOnline === null ? (
              <span className="text-slate-400 animate-pulse">
                Checking API...
              </span>
            ) : isApiOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">
                  API Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400 font-medium">API Offline</span>
              </>
            )}
          </div>

          {/* CTA Button */}
          <a
            href="#chat"
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Chat AI Assistant</span>
          </a>
        </div>
      </div>
    </header>
  );
};
