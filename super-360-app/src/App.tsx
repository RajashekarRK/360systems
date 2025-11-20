import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SuperAdminView } from './components/SuperAdminView';
import { ParticipantPortal } from './components/ParticipantPortal';
import { FacultyDashboard } from './components/FacultyDashboard';
import { ClientAdminView } from './components/ClientAdminView';
import { ManagerDashboard } from './components/ManagerDashboard';
import { login, getNotifications, markNotificationRead, registerUser, verify2FACode } from './services/mockBackend';
import { User as UserType, UserRole, Notification } from './types';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  RefreshCcw,
  Loader2,
  Lock,
  Key,
  User,
  Mail
} from 'lucide-react';

// --- GLOBAL ERROR BOUNDARY ---
class GlobalErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-greatlakes-gray-light flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500"/>
                        </div>
                        <h2 className="text-2xl font-bold text-greatlakes-gray-darker mb-2">System Error</h2>
                        <p className="text-greatlakes-gray-dark mb-6 text-sm">
                            An unexpected error occurred. Please try refreshing the application.
                            <br/>
                            <span className="font-mono text-xs bg-gray-100 p-1 mt-2 inline-block rounded text-red-600">
                                {this.state.error?.message || 'Unknown Error'}
                            </span>
                        </p>
                        <div className="flex space-x-3 justify-center">
                             <button
                                onClick={this.handleRetry}
                                className="gl-btn-primary flex items-center"
                            >
                                <RefreshCcw size={16} className="mr-2"/> Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// --- LOGIN SCREEN ---
const LoginScreen: React.FC<{
  onLogin: (email: string, password: string) => void;
  onRegisterRequest: () => void;
  isLoading: boolean;
  error: string | null;
}> = ({ onLogin, onRegisterRequest, isLoading, error }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  // Demo credentials helper
  const demoCredentials = [
    { role: 'Super Admin', email: 'super@greatlakes.edu.in', password: 'password' },
    { role: 'Client Admin', email: 'client@company.com', password: 'password' },
    { role: 'Faculty', email: 'faculty@greatlakes.edu.in', password: 'password' },
    { role: 'Manager', email: 'manager@company.com', password: 'password' },
    { role: 'Employee', email: 'employee@company.com', password: 'password' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-greatlakes-blue via-greatlakes-blue/90 to-greatlakes-blue/80 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 flex flex-col justify-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
              {t('common.appName')}
            </h1>
            <p className="text-xl mb-2">{t('common.instituteName')}</p>
            <p className="text-blue-100">
              Comprehensive 360° feedback and performance management platform
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">Platform Features:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Multi-degree assessments (360°, 240°, 180°, 90°)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>AI-powered insights & sentiment analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Real-time analytics & reporting</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Multi-language support (11 languages)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Integrated communication hub</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-greatlakes-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-greatlakes-gray-darker">{t('auth.signIn')}</h2>
            <p className="text-greatlakes-gray-dark text-sm">{t('auth.pleaseSignIn')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-greatlakes-gray-dark mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gl-input"
                placeholder="your.email@greatlakes.edu.in"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-greatlakes-gray-dark mb-2">
                <Key className="inline w-4 h-4 mr-1" />
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gl-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                {t('auth.rememberMe')}
              </label>
              <a href="#forgot" className="text-greatlakes-blue hover:underline">
                {t('auth.forgotPassword')}
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full gl-btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.signIn')
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Demo Credentials (for testing):</p>
            <div className="space-y-1 text-xs">
              {demoCredentials.map((cred, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  className="flex justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <span className="font-medium">{cred.role}:</span>
                  <span className="text-gray-600">{cred.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    if (!currentUser) return;
    try {
      const notifs = await getNotifications(currentUser.id);
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      if (response.requires2FA) {
        setRequires2FA(true);
        setTempUserId(response.user.id);
      } else {
        setCurrentUser(response.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (code: string) => {
    if (!tempUserId) return;
    setLoading(true);
    setError(null);
    try {
      const success = await verify2FACode(tempUserId, code);
      if (success) {
        const response = await login('', ''); // Re-login after 2FA
        setCurrentUser(response.user);
        setRequires2FA(false);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
    setRequires2FA(false);
    setTempUserId(null);
  };

  const handleRegisterRequest = () => {
    alert('Registration flow - would open registration form');
  };

  // Render based on user role
  const renderDashboard = () => {
    if (!currentUser) return null;

    const commonProps = {
      currentUser,
      notifications,
      onNotificationRead: async (notifId: string) => {
        await markNotificationRead(notifId);
        loadNotifications();
      },
    };

    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminView {...commonProps} />;
      case 'client_admin':
        return <ClientAdminView {...commonProps} />;
      case 'faculty':
        return <FacultyDashboard {...commonProps} />;
      case 'manager':
        return <ManagerDashboard {...commonProps} />;
      case 'employee':
        return <ParticipantPortal {...commonProps} />;
      default:
        return <div className="p-8 text-center">Role not configured</div>;
    }
  };

  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {!currentUser ? (
          requires2FA ? (
            <div className="min-h-screen bg-gradient-to-br from-greatlakes-blue to-greatlakes-primary-dark flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Two-Factor Authentication</h2>
                <p className="text-center text-gray-600 mb-6">
                  Enter the verification code sent to your device
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const code = (e.target as any).code.value;
                    handle2FAVerify(code);
                  }}
                >
                  <input
                    type="text"
                    name="code"
                    className="gl-input mb-4"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                  {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                  <button type="submit" className="w-full gl-btn-primary" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <LoginScreen
              onLogin={handleLogin}
              onRegisterRequest={handleRegisterRequest}
              isLoading={loading}
              error={error}
            />
          )
        ) : (
          <>
            <Header
              currentUser={currentUser}
              onLogout={handleLogout}
              notifications={notifications.filter(n => !n.read).length}
            />
            <main className="flex-1 bg-greatlakes-gray-light">
              {renderDashboard()}
            </main>
            <Footer />
          </>
        )}
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;
