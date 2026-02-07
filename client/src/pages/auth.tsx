import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import marbleBg from '@assets/generated_images/white_marble_luxury_texture_background.png';

export default function AuthPage() {
  const { login, register, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);
    await login(username, password);
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);
    await register(username, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${marbleBg})` }}
      />
      
      {/* Abstract Gold Accent */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 mb-2">IMPERO</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Member Access</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50 p-1">
              <TabsTrigger value="login" className="font-serif">Login</TabsTrigger>
              <TabsTrigger value="register" className="font-serif">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your secure vault.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username / Email</Label>
                    <Input 
                      id="username" 
                      placeholder="Enter your username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white border-gray-200 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border-gray-200 focus:border-primary/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Secure Login"}
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Lock className="w-3 h-3" />
                    <span>256-bit SSL Encrypted Connection</span>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Apply for Membership</CardTitle>
                  <CardDescription>
                    Create an account to view exclusive wholesale rates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input 
                      id="reg-username" 
                      placeholder="Choose a username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white border-gray-200 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="Choose a strong password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border-gray-200 focus:border-primary/50"
                    />
                  </div>
                  <div className="flex items-start gap-2 pt-2">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-xs text-gray-500 leading-tight">
                      By registering, you agree to our Terms of Service and Privacy Policy regarding bullion trading.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 hover:bg-black text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
