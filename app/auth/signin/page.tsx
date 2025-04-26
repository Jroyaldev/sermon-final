'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Redirect back or to home
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(error ? 'Invalid credentials' : null);
  const [success, setSuccess] = useState<string | null>(message || null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually based on result
        email,
        password,
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        setFormError('Invalid email or password. Please try again.'); 
      } else if (result?.ok) {
        // Sign-in successful
        router.push(callbackUrl); // Redirect to intended page or home
      } else {
        setFormError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      setFormError('An unexpected error occurred. Please try again.');
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
                <CardTitle className="text-2xl font-serif font-medium tracking-tight text-foreground">Sign In</CardTitle>
                <CardDescription className="text-muted-foreground mt-1.5">
                  Enter your credentials to continue
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5"
                variants={itemVariants}
              >
                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-destructive bg-destructive/5 border border-destructive/10 p-3 rounded-lg"
                  >
                    {formError}
                  </motion.div>
                )}
                
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-accent-1 bg-accent-3/10 border border-accent-3/20 p-3 rounded-lg"
                  >
                    {success}
                  </motion.div>
                )}
                
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs font-medium text-accent-1 hover:text-accent-1/80 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
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
                    />
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
                    {loading ? 'Signing In...' : 'Sign In'} 
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-2 pb-6">
              <motion.p className="text-sm text-muted-foreground" variants={itemVariants}>
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-medium text-accent-1 hover:text-accent-1/80 transition-colors">
                  Sign Up
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
          
          <motion.div variants={itemVariants} className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our <a href="#" className="underline hover:text-accent-1 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-accent-1 transition-colors">Privacy Policy</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 