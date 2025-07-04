import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { api } from "../lib/api";
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.auth.login(email);
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (err: unknown) {
      setError((err as Error).message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 flex items-center justify-center">
      <Card className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md p-0 md:p-2 w-[500px] md:w-[600px]">
        <CardHeader className="px-8 pt-6 pb-2">
          <div className="flex space-x-2 mt-0 mb-2">
            <Button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className={cn(
                "flex-1",
                isLoginMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              )}
            >
              Login
            </Button>
            <Button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className={cn(
                "flex-1",
                !isLoginMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              )}
            >
              Sign Up
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-10 px-8 pb-4 pt-2">
          <form onSubmit={handleAuth} className="space-y-8">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                disabled={loading}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-white/80">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                disabled={loading}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-500 hover:from-blue-700 hover:via-blue-800 hover:to-yellow-600 text-white border-0"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isLoginMode ? 'Logging in...' : 'Signing up...'}
                </>
              ) : (
                isLoginMode ? 'Login' : 'Sign Up'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


