'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed. Please try again.');
      } else {
        // Registration successful, redirect to sign-in page
        router.push('/auth/signin?message=Registration successful! Please sign in.'); 
      }
    } catch (err) {
      console.error("Registration exception:", err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Password strength checks
  const hasMinLength = password.length >= 6;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background via-background to-background/90">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-accent-1/5 via-accent-3/5 to-transparent rounded-full opacity-70 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent-2/5 via-accent-4/5 to-transparent rounded-full opacity-60 blur-[100px]" />
      </div>
      
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-3/40 to-accent-3/20 text-accent-1 shadow-sm transition-all duration-300">
                <Flame className="w-5 h-5 text-accent-1" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif text-foreground tracking-tight leading-tight">
                  Ministry Suite
                </span>
                <span className="text-[10px] text-muted-foreground/70 tracking-wider uppercase font-light">
                  Built by pastors, for pastors
                </span>
              </div>
            </div>
          </motion.div>

          <Card className="border border-border/20 bg-card shadow-lg premium-card">
            <CardHeader className="text-center pb-4">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl font-serif font-medium tracking-tight text-foreground">Create Account</CardTitle>
                <CardDescription className="text-muted-foreground mt-1.5">
                  Join our community of ministry leaders
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5"
                variants={itemVariants}
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-destructive bg-destructive/5 border border-destructive/10 p-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="pl-10 py-5 h-11 bg-white dark:bg-gray-950 border-border focus:border-accent-1/50 focus:ring-accent-1/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="pl-10 py-5 h-11 bg-white dark:bg-gray-950 border-border focus:border-accent-1/50 focus:ring-accent-1/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pl-10 py-5 h-11 bg-white dark:bg-gray-950 border-border focus:border-accent-1/50 focus:ring-accent-1/20"
                      aria-describedby="password-requirements"
                    />
                  </div>
                  
                  <div id="password-requirements" className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-accent-1/20' : 'bg-muted'}`}>
                        {hasMinLength && <Check className="w-3 h-3 text-accent-1" />}
                      </div>
                      <p className={`text-xs ${hasMinLength ? 'text-accent-1' : 'text-muted-foreground'}`}>
                        At least 6 characters
                      </p>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full py-5 h-11 bg-black hover:bg-gray-800 text-white font-extrabold tracking-wide shadow-md border-0"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'} 
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-2 pb-6">
              <motion.p className="text-sm text-muted-foreground" variants={itemVariants}>
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-accent-1 hover:text-accent-1/80 transition-colors">
                  Sign In
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
          
          <motion.div variants={itemVariants} className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our <a href="#" className="underline hover:text-accent-1 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-accent-1 transition-colors">Privacy Policy</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 