import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(username, password);
            } else {
                await register(username, password);
            }
            onClose();
            setUsername('');
            setPassword('');
        } catch (error: any) {
            // Error handling is done in the auth hook
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
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
                                required
                                className="bg-white border-gray-200 focus:border-primary/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <Button
                            variant="link"
                            className="p-0 h-auto font-semibold text-primary"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
