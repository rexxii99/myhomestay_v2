
import React, { useState } from 'react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onOpenAuth: () => void;
  currentUser: any;
  setMode: (mode: 'guest' | 'host') => void;
  mode: 'guest' | 'host';
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenAuth, currentUser, setMode, mode }) => {
  const [query, setQuery] = useState('');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 md:px-12">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#'}>
          <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <span className="text-rose-500 font-bold text-2xl hidden md:block">myhomestay</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow px-2 py-1">
          <button className="flex-1 text-left px-4 font-medium text-sm border-r border-gray-200">Anywhere</button>
          <button className="flex-1 text-left px-4 font-medium text-sm border-r border-gray-200">Any week</button>
          <button className="flex-1 text-left px-4 text-gray-500 text-sm">Add guests</button>
          <div className="bg-rose-500 p-2 rounded-full text-white ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMode(mode === 'guest' ? 'host' : 'guest')}
            className="hidden lg:block text-sm font-semibold hover:bg-gray-100 px-4 py-3 rounded-full"
          >
            {mode === 'guest' ? 'Switch to hosting' : 'Switch to guesting'}
          </button>
          
          <div 
            onClick={onOpenAuth}
            className="flex items-center gap-3 border border-gray-300 rounded-full px-3 py-1 cursor-pointer hover:shadow-md transition-shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white overflow-hidden">
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage} alt="User" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
