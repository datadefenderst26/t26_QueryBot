import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Mail, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type UserRole = 'user' | 'admin';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    // SUCCESS
    navigate('/', { state: { isAdmin: data.user.role === 'admin' } });

  } catch (err) {
    alert('Backend not reachable');
  } finally {
    setIsLoading(false);
  }
};

     

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="glass-card-elevated p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 glow-primary mb-2">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">
              Query<span className="text-gradient-primary">Bot</span>
            </h1>
            <p className="text-muted-foreground">AI-powered SQL Assistant</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sign in as</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="role-user"
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    role === 'user' 
                      ? "border-primary bg-primary/10 glow-primary" 
                      : "border-border/50 bg-muted/30"
                  )}
                >
                  <RadioGroupItem value="user" id="role-user" className="sr-only" />
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    role === 'user' ? "bg-primary/20" : "bg-muted"
                  )}>
                    <User className={cn(
                      "w-5 h-5",
                      role === 'user' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium",
                      role === 'user' ? "text-foreground" : "text-muted-foreground"
                    )}>
                      User
                    </div>
                    <div className="text-xs text-muted-foreground">Query access</div>
                  </div>
                </Label>

                <Label
                  htmlFor="role-admin"
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    "hover:border-warning/50 hover:bg-warning/5",
                    role === 'admin' 
                      ? "border-warning bg-warning/10" 
                      : "border-border/50 bg-muted/30"
                  )}
                  style={role === 'admin' ? { boxShadow: '0 0 20px -5px hsl(38 92% 50% / 0.4)' } : {}}
                >
                  <RadioGroupItem value="admin" id="role-admin" className="sr-only" />
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    role === 'admin' ? "bg-warning/20" : "bg-muted"
                  )}>
                    <Shield className={cn(
                      "w-5 h-5",
                      role === 'admin' ? "text-warning" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium",
                      role === 'admin' ? "text-foreground" : "text-muted-foreground"
                    )}>
                      Admin
                    </div>
                    <div className="text-xs text-muted-foreground">Full access</div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 glow-primary text-lg font-medium transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
