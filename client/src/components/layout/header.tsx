import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Phone, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { AuthModal } from '@/components/auth/AuthModal';
import { VaultUnlock } from '@/components/admin/VaultUnlock';
// ... other imports ...
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Assets
import logoImg from '@assets/impero_logo_transparent.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  // Triple tap detection
  useEffect(() => {
    if (tapCount === 3) {
      setShowSwipeHint(true);
      setTapCount(0);
    }
    const timer = setTimeout(() => setTapCount(0), 1000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  // Swipe right detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (showSwipeHint) {
      setSwipeStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (showSwipeHint) {
      const swipeEndX = e.changedTouches[0].clientX;
      const swipeDistance = swipeEndX - swipeStartX;

      if (swipeDistance > 80) { // Swipe right threshold
        setShowSwipeHint(false);
        setIsVaultOpen(true);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showSwipeHint) {
      setSwipeStartX(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (showSwipeHint) {
      const swipeDistance = e.clientX - swipeStartX;

      if (swipeDistance > 80) {
        setShowSwipeHint(false);
        setIsVaultOpen(true);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Swipe Hint Overlay */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-e-resize"
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatType: "loop"
              }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex gap-2">
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-16 h-1 bg-white/50 rounded-full"
                />
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
                  className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-white/50 border-b-[6px] border-b-transparent"
                />
              </div>
              <p className="text-white text-2xl font-serif tracking-widest uppercase">Swipe Right</p>
              <p className="text-white/50 text-xs tracking-[0.5em] uppercase">Security Access</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`w-full transition-all duration-300 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 ${isScrolled ? 'py-4 shadow-md' : 'py-8'
          }`}
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-20 md:h-28">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Desktop Navigation - LEFT SIDE - ADDDED PADDING */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide flex-1 justify-start pr-40">
              {[
                { name: 'Catalog', href: '/catalog' },
                { name: 'Bespoke', href: '/bespoke' },
                { name: 'Bullion', href: '/catalog?category=bullion' },
                { name: 'Compare', href: '/compare' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative py-2 text-gray-600 hover:text-primary transition-colors group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Logo - ABSOLUTE CENTER & MASSIVE & BLING */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <div
                onClick={() => setTapCount(prev => prev + 1)}
                className="block group pointer-events-auto cursor-pointer"
              >
                <div className="h-24 md:h-40 w-auto relative flex items-center justify-center transition-all duration-500 hover:scale-105">
                  <img
                    src={logoImg}
                    alt="Impero Di Gold Logo"
                    className="h-full w-auto object-contain drop-shadow-2xl animate-bling"
                  />
                </div>
              </div>
            </div>

            {/* Vault Unlock Modal */}
            <VaultUnlock
              isOpen={isVaultOpen}
              onClose={() => setIsVaultOpen(false)}
              onUnlock={() => {
                setIsVaultOpen(false);
                setLocation('/admin');
              }}
            />

            {/* Actions - RIGHT SIDE */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide mr-6 pl-40">
                {[
                  { name: 'Live Rates', href: '/#rates' },
                  { name: 'About Us', href: '/#about' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative py-2 text-gray-600 hover:text-primary transition-colors group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 transition-transform hover:rotate-12" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
                )}
              </button>

              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                <Search className="w-5 h-5" />
              </button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600 hover:text-primary relative group">
                      <User className="w-5 h-5" />
                      {/* <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white"></span> */}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white z-[60]">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.username || 'User'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className="font-serif hover:text-primary"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Log in
                  </Button>
                  <Button
                    className="bg-black text-white hover:bg-gray-800 font-serif"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-white font-serif tracking-wide gap-2">
                <Phone className="w-4 h-4" />
                Concierge
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {
          isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                  <span className="font-serif text-xl font-bold">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="flex flex-col">
                    {user && (
                      <div className="px-6 py-4 bg-gray-50 mb-4 mx-4 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Welcome back</p>
                        <p className="font-bold text-gray-900">{user.username}</p>
                      </div>
                    )}

                    {[
                      { name: 'Catalog', href: '/catalog' },
                      { name: 'Bespoke', href: '/bespoke' },
                      { name: 'Gold Bullion', href: '/catalog?category=bullion' },
                      { name: 'Diamond Jewelry', href: '/catalog?category=jewelry' },
                      { name: 'Compare Prices', href: '/compare' },
                      { name: 'Live Rates', href: '/#rates' },
                      { name: 'About Us', href: '/#about' },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-6 py-4 text-lg font-medium text-gray-800 border-b border-gray-50 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {!user ? (
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setLocation('/auth'); setIsMobileMenuOpen(false); }}
                        className="px-6 py-4 text-lg font-medium text-primary border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        Login / Register
                      </a>
                    ) : (
                      <button
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="px-6 py-4 text-lg font-medium text-red-600 text-left hover:bg-gray-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    )}
                  </nav>
                </div>
                <div className="p-6 bg-gray-50">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-serif gap-2">
                    <Phone className="w-4 h-4" />
                    Request Callback
                  </Button>
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >
    </>
  );
}
