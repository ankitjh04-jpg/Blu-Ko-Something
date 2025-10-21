import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

interface SignInFormProps {
  onToggle: () => void;
}

export function SignInForm({ onToggle }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    setLoading(false);

    if (signInError) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#A8B8CC] mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6A7B93]" size={20} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1E4C80] bg-opacity-40 border border-[#6A7B93] border-opacity-30 rounded-lg text-white placeholder-[#6A7B93] focus:outline-none focus:ring-2 focus:ring-[#FBC888] focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#A8B8CC] mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6A7B93]" size={20} />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1E4C80] bg-opacity-40 border border-[#6A7B93] border-opacity-30 rounded-lg text-white placeholder-[#6A7B93] focus:outline-none focus:ring-2 focus:ring-[#FBC888] focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FBC888] hover:bg-[#FBC888]/90 text-[#002B5C] font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <p className="text-center text-[#A8B8CC] text-sm">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-[#FBC888] hover:text-[#FBC888]/80 font-medium transition-colors"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}
