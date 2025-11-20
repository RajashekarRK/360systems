import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Search, Globe, ChevronDown, User, Bell, Settings } from 'lucide-react';
import { languages } from '../../i18n/config';
import type { User as UserType } from '../../types';

interface HeaderProps {
  currentUser: UserType | null;
  onLogout?: () => void;
  notifications?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, notifications = 0 }) => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguageMenuOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <header className="gl-header sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-greatlakes-blue text-white py-2 px-4 text-xs hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <span>{t('common.instituteName')}</span>
          </div>
          <div className="flex space-x-4">
            <a href="mailto:admissions@greatlakes.edu.in" className="hover:underline text-white">
              admissions@greatlakes.edu.in
            </a>
            <span>|</span>
            <a href="tel:+914428181897" className="hover:underline text-white">
              +91 44 2818 1897
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logos/greatlakes-logo.png"
                alt="Great Lakes Chennai"
                className="h-12 md:h-16"
                onError={(e) => {
                  // Fallback to text if image not found
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="hidden md:block">
                <div className="text-greatlakes-blue font-bold text-lg">Great Lakes</div>
                <div className="text-gray-600 text-xs">Institute of Management</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="#dashboard" className="text-gray-700 hover:text-greatlakes-blue font-medium transition">
                {t('dashboard.overview')}
              </a>
              <a href="#programs" className="text-gray-700 hover:text-greatlakes-blue font-medium transition">
                {t('nav.programs')}
              </a>
              <a href="#feedback" className="text-gray-700 hover:text-greatlakes-blue font-medium transition">
                {t('dashboard.myFeedback')}
              </a>
              <a href="#reports" className="text-gray-700 hover:text-greatlakes-blue font-medium transition">
                {t('dashboard.reports')}
              </a>
              <a href="#analytics" className="text-gray-700 hover:text-greatlakes-blue font-medium transition">
                {t('dashboard.analytics')}
              </a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Change Language"
                >
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="hidden md:inline text-sm font-medium">
                    {currentLanguage.nativeName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Language Dropdown */}
                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                          i18n.language === lang.code ? 'bg-greatlakes-blue text-white' : 'text-gray-700'
                        }`}
                      >
                        {lang.nativeName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              {currentUser && (
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="User Menu"
                  >
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-greatlakes-blue text-white flex items-center justify-center">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline text-sm font-medium">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <a href="#profile" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition">
                        <User className="w-4 h-4" />
                        <span>{t('common.profile')}</span>
                      </a>
                      <a href="#settings" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition">
                        <Settings className="w-4 h-4" />
                        <span>{t('common.settings')}</span>
                      </a>
                      <hr className="my-2" />
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                      >
                        {t('auth.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="gl-btn-primary">
                  {t('auth.signIn')}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.search') + '...'}
                  className="w-full gl-input pl-10"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto py-4 space-y-2">
            <a
              href="#dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {t('dashboard.overview')}
            </a>
            <a
              href="#programs"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {t('nav.programs')}
            </a>
            <a
              href="#feedback"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {t('dashboard.myFeedback')}
            </a>
            <a
              href="#reports"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {t('dashboard.reports')}
            </a>
            <a
              href="#analytics"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {t('dashboard.analytics')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
