import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Zap, Mail, Lock, AlertCircle, Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4 relative overflow-hidden">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Theme toggle */}
      <button onClick={toggle} className="absolute top-5 right-5 p-2.5 rounded-xl glass text-luna-300 dark:text-luna-100/60 hover:text-luna-400 dark:hover:text-luna-100 transition-colors z-10">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-sm fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl btn-primary mb-4 shadow-xl float">
            <Zap size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-luna-400 dark:text-luna-100 tracking-tight">Welcome back</h1>
          <p className="text-luna-300/70 dark:text-luna-100/50 mt-1 text-sm font-medium">Sign in to Insight Log</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="flex items-center gap-2 bg-red-50/80 dark:bg-red-900/20 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm border border-red-200/50 dark:border-red-800/30">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-luna-300 dark:text-luna-100/60 mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luna-200 dark:text-luna-200/50" />
                  <input type={type} required value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="input-field w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 rounded-xl text-sm mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-luna-100/50 dark:bg-luna-400/20 rounded-xl text-xs text-luna-300 dark:text-luna-100/60 border border-luna-200/30 dark:border-luna-100/10">
            <strong>Demo:</strong> lilly@example.com / password123
          </div>

          <p className="text-center text-sm text-luna-300/70 dark:text-luna-100/40 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-luna-200 dark:text-luna-100 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
