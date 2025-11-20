
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { LayoutDashboard, Users, GraduationCap, UserCircle, Settings, Menu, LogOut, ShieldCheck, Briefcase, User, Bell, Globe, Lock, Key, AlertTriangle, RefreshCcw, Zap } from 'lucide-react';
import { SuperAdminView } from './components/SuperAdminView';
import { ParticipantPortal } from './components/ParticipantPortal';
import { FacultyDashboard } from './components/FacultyDashboard';
import { ClientAdminView } from './components/ClientAdminView';
import { ManagerDashboard } from './components/ManagerDashboard';
import { login, getNotifications, markNotificationRead, registerUser, verify2FACode } from './services/mockBackend';
import { User as UserType, UserRole, Notification } from './types';

// --- GLOBAL ERROR BOUNDARY (Section V1.1) ---
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
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-rose-100">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-rose-500"/>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">System Encountered an Error</h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            Our automated diagnostics have logged this event. Please try refreshing the application.
                            <br/>
                            <span className="font-mono text-xs bg-slate-100 p-1 mt-2 inline-block rounded text-rose-600">
                                {this.state.error?.message || 'Unknown Error'}
                            </span>
                        </p>
                        <div className="flex space-x-3 justify-center">
                             <button 
                                onClick={this.handleRetry}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center"
                            >
                                <RefreshCcw size={16} className="mr-2"/> Reload Application
                            </button>
                            <button className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// --- REUSABLE UI COMPONENTS (Section T & X) ---

export const SmartButton: React.FC<{
    onClick?: (e: React.MouseEvent) => Promise<void> | void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}> = ({ onClick, children, variant = 'primary', className = '', isLoading = false, disabled, type = 'button' }) => {
    const [internalLoading, setInternalLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        if (type === 'submit') return; // Let form handle submit
        if (onClick) {
            setInternalLoading(true);
            try {
                await onClick(e);
            } finally {
                setInternalLoading(false);
            }
        }
    };

    const baseStyles = "px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-1";
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-md",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300",
        danger: "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 focus:ring-rose-500"
    };

    const loadingState = isLoading || internalLoading;

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled || loadingState}
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            aria-busy={loadingState}
        >
            {loadingState ? (
                <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="opacity-80">Processing...</span>
                </>
            ) : children}
        </button>
    );
};

export const ValidatedInput: React.FC<{
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    validator?: (val: string) => string | null; // Returns error message or null
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
}> = ({ label, type = 'text', value, onChange, validator, placeholder, required, maxLength }) => {
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (touched && validator) {
            setError(validator(value));
        }
    }, [value, touched, validator]);

    return (
        <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all ${
                        error 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-300'
                    }`}
                    aria-invalid={!!error}
                    aria-errormessage={error || undefined}
                />
                {/* Validation Icon */}
                <div className="absolute right-3 top-3 pointer-events-none">
                    {touched && !error && value && <ShieldCheck size={16} className="text-emerald-500" />}
                    {touched && error && <AlertTriangle size={16} className="text-rose-500" />}
                </div>
            </div>
            {/* Error & Counter */}
            <div className="flex justify-between mt-1">
                <span className="text-xs text-rose-500 font-medium min-h-[1rem]">{error}</span>
                {maxLength && (
                    <span className="text-xs text-slate-400">
                        {value.length}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
};

export const AdvancedTable: React.FC<{
    title: string;
    data: any[];
    columns: { key: string; label: string; sortable?: boolean; render?: (row: any) => React.ReactNode }[];
    actions?: React.ReactNode;
}> = ({ title, data, columns, actions }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-slate-800">{title}</h3>
                {actions}
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-6 py-3 whitespace-nowrap">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length === 0 ? (
                            <tr><td colSpan={columns.length} className="p-6 text-center text-slate-400">No data available</td></tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    {columns.map(col => (
                                        <td key={col.key} className="px-6 py-3">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Validation Utils
export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    if (email.endsWith('tempmail.com')) return "Disposable emails not allowed";
    return null;
};

export const validateText = (text: string, minLength = 2): string | null => {
    if (!text || text.length < minLength) return `Must be at least ${minLength} characters`;
    return null;
};


// Simple Translation Dictionary
const I18N: any = {
    en: {
        instituteAdmin: 'Institute Admin',
        clientAdmin: 'Client Admin',
        facultyDashboard: 'Faculty Dashboard',
        myAssessment: 'My Assessment',
        myTeam: 'My Team',
        signOut: 'Sign Out',
        manageRaters: 'Manage Raters',
        welcomeBack: 'Welcome back',
        loginTitle: 'Nexus 360',
        loginSubtitle: 'Enterprise Executive Feedback System',
        email: 'Email Address',
        signIn: 'Sign In',
        vendorLogin: 'Vendor Portal Login',
        verificationRequired: 'Verification Required',
        enterCode: 'Enter the 6-digit code sent to your email.'
    },
    az: {
        instituteAdmin: 'İnstitut İnzibatçısı',
        clientAdmin: 'Müştəri İnzibatçısı',
        facultyDashboard: 'Fakültə Paneli',
        myAssessment: 'Mənim Qiymətləndirməm',
        myTeam: 'Mənim Komandam',
        signOut: 'Çıxış',
        manageRaters: 'Qiymətləndiriciləri İdarə Et',
        welcomeBack: 'Xoş gəlmisiniz',
        loginTitle: 'Nexus 360',
        loginSubtitle: 'Korporativ Rəy Sistemi',
        email: 'E-poçt ünvanı',
        signIn: 'Daxil ol',
        vendorLogin: 'Təchizatçı Girişi',
        verificationRequired: 'Təsdiqləmə Tələb Olunur',
        enterCode: 'E-poçtunuza göndərilən 6 rəqəmli kodu daxil edin.'
    }
};

type View = 'superadmin' | 'clientadmin' | 'participant' | 'faculty' | 'manager_team';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<UserType | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@nexus.edu'); // Default for demo
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // 2FA State
  const [is2FA, setIs2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [tempUser, setTempUser] = useState<UserType | null>(null);
  
  // Registration State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Navigation State
  const [activeView, setActiveView] = useState<View>('superadmin'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Language State
  const [language, setLanguage] = useState<'en' | 'az'>('en');

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Error Simulation
  const [simulateCrash, setSimulateCrash] = useState(false);

  const t = I18N[language]; // Translation Helper

  useEffect(() => {
      if (user) {
          getNotifications(user.id).then(setNotifications);
      }
  }, [user]);
  
  if (simulateCrash) {
      throw new Error("Simulated catastrophic failure for testing Global Error Boundary.");
  }

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      setLoginError('');
      
      // Use validation before submitting
      const emailError = validateEmail(loginEmail);
      if (emailError) {
          setLoginError(emailError);
          setLoginLoading(false);
          return;
      }

      try {
          const response = await login(loginEmail);
          
          if (response.requires2FA) {
              setTempUser(response.user);
              setIs2FA(true);
              setLoginLoading(false);
              return;
          }

          finalizeLogin(response.user);

      } catch (err) {
          setLoginError('Invalid credentials. Try the demo accounts.');
          setLoginLoading(false);
      } 
  };
  
  const handle2FAVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      try {
          await verify2FACode(loginEmail, twoFACode);
          if(tempUser) finalizeLogin(tempUser);
      } catch (err) {
          setLoginError('Invalid code.');
          setLoginLoading(false);
      }
  }

  const finalizeLogin = (u: UserType) => {
      setUser(u);
      // Set default view based on role
      switch(u.role) {
          case 'super_admin': setActiveView('superadmin'); break;
          case 'client_admin': setActiveView('clientadmin'); break;
          case 'faculty': setActiveView('faculty'); break;
          case 'manager': setActiveView('manager_team'); break; 
          case 'vendor': alert("Welcome Vendor Partner! Limited Access Mode."); setActiveView('participant'); break;
          default: setActiveView('participant');
      }
      setLoginLoading(false);
      setIs2FA(false);
  }
  
  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      await registerUser(regName, regEmail);
      setLoginLoading(false);
      alert("Registration submitted. Please wait for Admin approval.");
      setIsRegisterMode(false);
  }

  const handleNotificationClick = async (id: string) => {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  }

  // Sidebar Navigation Items based on Role
  const getNavItems = () => {
      if (!user) return [];
      const items = [];

      if (user.role === 'super_admin') {
          items.push({ id: 'superadmin', label: t.instituteAdmin, icon: <LayoutDashboard size={20} /> });
      }
      if (user.role === 'client_admin' || user.role === 'super_admin') {
          items.push({ id: 'clientadmin', label: t.clientAdmin, icon: <Briefcase size={20} /> });
      }
      if (user.role === 'faculty' || user.role === 'super_admin') {
          items.push({ id: 'faculty', label: t.facultyDashboard, icon: <GraduationCap size={20} /> });
      }
      if (user.role === 'manager' || user.role === 'employee' || user.role === 'client_admin' || user.role === 'vendor') {
          items.push({ id: 'participant', label: t.myAssessment, icon: <UserCircle size={20} /> });
      }
      if (user.role === 'manager') {
          items.push({ id: 'manager_team', label: t.myTeam, icon: <Users size={20} /> });
      }

      return items;
  };

  const navItems = getNavItems();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Login Screen Component
  if (!user) {
      return (
          <GlobalErrorBoundary>
          <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                  <div className="bg-slate-900 p-8 text-center">
                      <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/50">
                          <span className="font-bold text-white text-2xl">N</span>
                      </div>
                      <h1 className="text-2xl font-bold text-white">{t.loginTitle}</h1>
                      <p className="text-slate-400 mt-2">{t.loginSubtitle}</p>
                  </div>
                  
                  {is2FA ? (
                       <form onSubmit={handle2FAVerify} className="p-8 space-y-6">
                           <div className="text-center">
                               <div className="inline-flex p-3 bg-indigo-50 rounded-full text-indigo-600 mb-3"><ShieldCheck size={32}/></div>
                               <h3 className="text-lg font-bold text-slate-800">{t.verificationRequired}</h3>
                               <p className="text-sm text-slate-500">{t.enterCode}</p>
                           </div>
                           <div>
                               <input 
                                 type="text" 
                                 className="w-full text-center text-2xl tracking-widest font-bold border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                 placeholder="000000"
                                 maxLength={6}
                                 value={twoFACode}
                                 onChange={e => setTwoFACode(e.target.value)}
                               />
                           </div>
                           {loginError && <div className="text-xs text-rose-500 text-center">{loginError}</div>}
                           <SmartButton type="submit" isLoading={loginLoading} className="w-full">
                               {loginLoading ? 'Verifying...' : 'Verify Login'}
                           </SmartButton>
                           <button type="button" onClick={() => {setIs2FA(false); setLoginError('');}} className="w-full text-sm text-slate-500 hover:text-indigo-600 mt-2">Back</button>
                       </form>
                  ) : isRegisterMode ? (
                       <form onSubmit={handleRegister} className="p-8 space-y-4">
                          <h3 className="text-lg font-bold text-slate-800 text-center">Create Account</h3>
                          <ValidatedInput 
                              label="Full Name" 
                              value={regName} 
                              onChange={setRegName} 
                              validator={(val) => validateText(val, 3)} 
                              required 
                          />
                          <ValidatedInput 
                              label={t.email} 
                              type="email" 
                              value={regEmail} 
                              onChange={setRegEmail} 
                              validator={validateEmail} 
                              required 
                          />
                          <SmartButton type="submit" className="w-full mt-4">Submit Registration</SmartButton>
                          <button type="button" onClick={() => setIsRegisterMode(false)} className="w-full text-sm text-slate-500 hover:text-indigo-600 mt-4">Back to Login</button>
                       </form>
                  ) : (
                      <form onSubmit={handleLogin} className="p-8 space-y-4">
                          {loginError && (
                              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100 flex items-center">
                                  <AlertTriangle size={16} className="mr-2"/> {loginError}
                              </div>
                          )}
                          
                          <ValidatedInput 
                              label={t.email} 
                              type="email" 
                              value={loginEmail} 
                              onChange={setLoginEmail} 
                              validator={validateEmail} 
                              placeholder="name@company.com"
                              required 
                          />

                          <SmartButton type="submit" isLoading={loginLoading} className="w-full shadow-lg shadow-indigo-200/50">
                              {t.signIn}
                          </SmartButton>
                          
                          <div className="text-center mt-4">
                              <button type="button" onClick={() => setIsRegisterMode(true)} className="text-sm text-slate-500 hover:text-indigo-600 font-medium">
                                  Don't have an account? <span className="text-indigo-600">Register</span>
                              </button>
                          </div>

                          <div className="pt-6 border-t border-slate-100 mt-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center tracking-wider">Demo Credentials</p>
                              <div className="grid grid-cols-2 gap-2">
                                  <button type="button" onClick={() => setLoginEmail('admin@nexus.edu')} className="text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded text-slate-600 border border-slate-200 transition">Super Admin</button>
                                  <button type="button" onClick={() => setLoginEmail('hr@acme.com')} className="text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded text-slate-600 border border-slate-200 transition">HR Director</button>
                                  <button type="button" onClick={() => setLoginEmail('sarah@acme.com')} className="text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded text-slate-600 border border-slate-200 transition">Manager</button>
                                  <button type="button" onClick={() => setLoginEmail('partner@vendor.com')} className="text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded text-slate-600 border border-slate-200 transition">{t.vendorLogin}</button>
                              </div>
                          </div>
                      </form>
                  )}
              </div>
              <div className="mt-6 flex flex-col items-center space-y-2">
                 <p className="text-slate-400 text-sm">© 2025 Nexus Institute. All rights reserved.</p>
                 <button onClick={() => setSimulateCrash(true)} className="text-[10px] text-slate-300 hover:text-rose-500 transition">Test Error Boundary</button>
              </div>
          </div>
          </GlobalErrorBoundary>
      );
  }

  return (
    <GlobalErrorBoundary>
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-lg">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus 360</span>
        </div>

        <div className="p-6 border-b border-slate-800">
             <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-400 border-2 border-slate-600">
                     {user.name.charAt(0)}
                 </div>
                 <div className="overflow-hidden">
                     <p className="font-bold truncate text-sm">{user.name}</p>
                     <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
                 </div>
             </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={() => setUser(null)}
            className="flex items-center space-x-3 text-slate-400 hover:text-white cursor-pointer transition w-full"
          >
            <LogOut size={20} />
            <span>{t.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <span className="font-bold text-slate-800">Nexus 360</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
               <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                     {navItems.find(n => n.id === activeView)?.label}
                   </h1>
                   <p className="text-slate-500 mt-1">
                     {activeView === 'participant' && "Manage your feedback journey and view reports."}
                     {activeView === 'superadmin' && "Manage global clients, credits, and institute settings."}
                     {activeView === 'faculty' && "Track cohort progress and analyze competency gaps."}
                     {activeView === 'clientadmin' && "Program configuration and rater approval queue."}
                     {activeView === 'manager_team' && "Track team progress and approve rater nominations."}
                   </p>
               </div>

               <div className="flex items-center space-x-4">
                   <button 
                        onClick={() => setLanguage(language === 'en' ? 'az' : 'en')}
                        className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 shadow-sm text-sm font-medium transition hover:shadow-md"
                   >
                       <Globe size={16} />
                       <span>{language === 'en' ? 'English' : 'Azərbaycan'}</span>
                   </button>

                   <div className="relative">
                       <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600 hover:text-indigo-600 relative transition hover:shadow-md"
                       >
                           <Bell size={20} />
                           {unreadCount > 0 && (
                               <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm animate-pulse">
                                   {unreadCount}
                               </span>
                           )}
                       </button>

                       {showNotifications && (
                           <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                               <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</span>
                                   <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><LogOut size={14}/></button>
                               </div>
                               <div className="max-h-96 overflow-y-auto">
                                   {notifications.length === 0 ? (
                                       <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                                   ) : (
                                       notifications.map(n => (
                                           <div 
                                                key={n.id} 
                                                onClick={() => handleNotificationClick(n.id)}
                                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition ${!n.read ? 'bg-indigo-50/30' : ''}`}
                                           >
                                               <div className="flex justify-between items-start mb-1">
                                                   <p className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</p>
                                                   <span className="text-[10px] text-slate-400">{n.date}</span>
                                               </div>
                                               <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                           </div>
                                       ))
                                   )}
                               </div>
                               <div className="p-2 text-center border-t border-slate-50">
                                   <button className="text-xs text-indigo-600 font-medium hover:underline">Mark all as read</button>
                               </div>
                           </div>
                       )}
                   </div>
               </div>
            </div>

            {/* View Content */}
            {activeView === 'superadmin' && <SuperAdminView />}
            {activeView === 'participant' && <ParticipantPortal />}
            {activeView === 'faculty' && <FacultyDashboard />}
            {activeView === 'clientadmin' && <ClientAdminView />}
            {activeView === 'manager_team' && <ManagerDashboard user={user} />}
          </div>
        </div>
      </main>
    </div>
    </GlobalErrorBoundary>
  );
};

export default App;
