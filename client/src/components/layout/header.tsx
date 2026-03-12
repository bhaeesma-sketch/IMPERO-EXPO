import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Phone, User, LogOut, Settings, Moon, Sun, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useWishlist } from '@/hooks/use-wishlist';
import { AuthModal } from '@/components/auth/AuthModal';
import { VaultUnlock } from '@/components/admin/VaultUnlock';
import { NotificationBell } from '@/components/notifications/notification-bell';
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
  const { count: wishlistCount } = useWishlist();
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
        className={`w-full transition-all duration-300 z-[100] header-glass bg-background/80 backdrop-blur-lg border-b border-border/50 sticky top-0 ${isScrolled ? 'py-3 shadow-xl' : 'py-6'
          }`}
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16 md:h-24">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors z-50 text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation - LEFT SIDE */}
            <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-[0.15em] uppercase flex-1 justify-start pr-32">
              {[
                { name: 'Catalog', href: '/catalog' },
                { name: 'Bespoke', href: '/bespoke' },
                { name: 'Bullion', href: '/catalog?category=bullion' },
                { name: 'Try On', href: '/try-on' },
                { name: 'Compare', href: '/compare' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative py-2 text-foreground/70 hover:text-primary transition-all duration-300 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Logo - ABSOLUTE CENTER */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <div
                onClick={() => setTapCount(prev => prev + 1)}
                className="block group pointer-events-auto cursor-pointer"
              >
                <div className="h-16 md:h-28 w-auto relative flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                  <img
                    src={logoImg}
                    alt="Impero Di Gold Logo"
                    className="h-full w-auto object-contain logo-glow drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                  />
                  {/* Subtle radial glow behind logo */}
                  <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>
            </div>

            {/* Actions - RIGHT SIDE */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-[0.15em] uppercase mr-4 pl-32">
                {[
                  { name: 'Live Rates', href: '/#rates' },
                  { name: 'About Us', href: '/about' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative py-2 text-foreground/70 hover:text-primary transition-all duration-300 group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-1.5 border-l border-border/30 pl-4 ml-2">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 hover:bg-white/5 rounded-full transition-all text-foreground/70 hover:text-primary"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-[18px] h-[18px]" />
                  ) : (
                    <Moon className="w-[18px] h-[18px]" />
                  )}
                </button>

                <Link href="/wishlist">
                  <button className="p-2.5 hover:bg-white/5 rounded-full transition-colors text-foreground/70 hover:text-primary relative group">
                    <Heart className="w-[18px] h-[18px] group-hover:fill-primary group-hover:text-primary transition-all" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </Link>

                <NotificationBell />

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2.5 hover:bg-white/5 rounded-full transition-colors text-foreground/70 hover:text-primary relative group">
                        <User className="w-[18px] h-[18px]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border z-[100] text-foreground">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem className="focus:bg-primary/10">
                        <User className="mr-2 h-4 w-4" />
                        <span className="truncate">{user.username || 'User'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden lg:flex items-center gap-3">
                    <Button
                      variant="ghost"
                      className="text-[12px] uppercase tracking-widest hover:text-primary font-medium px-4"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Login
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white text-[12px] uppercase tracking-widest font-bold px-5 h-10 shadow-lg shadow-primary/20"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Join
                    </Button>
                  </div>
                )}
              </div>

              <a href="https://wa.me/971506485898" target="_blank" rel="noopener noreferrer" className="hidden xl:block">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] uppercase tracking-widest font-bold px-6 h-10 rounded-full shadow-lg shadow-emerald-900/10 ml-2">
                  <Phone className="w-3.5 h-3.5 mr-2" />
                  Whatapp
                </Button>
              </a>
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
                <div className="p-6 flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-xl">
                  <span className="font-serif text-xl font-bold text-foreground">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground/70 hover:text-primary">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4 bg-background/95 backdrop-blur-xl">
                  <nav className="flex flex-col">
                    {user && (
                      <div className="px-6 py-4 bg-primary/10 mb-4 mx-4 rounded-lg border border-primary/20">
                        <p className="text-[10px] text-primary uppercase tracking-[0.2em] mb-1 font-bold">Welcome back</p>
                        <p className="font-serif text-lg text-foreground truncate">{user.username}</p>
                      </div>
                    )}

                    {[
                      { name: 'Catalog', href: '/catalog' },
                      { name: 'Bespoke', href: '/bespoke' },
                      { name: 'Gold Bullion', href: '/catalog?category=bullion' },
                      { name: 'Diamond Jewelry', href: '/catalog?category=jewelry' },
                      { name: 'Virtual Try-On', href: '/try-on' },
                      { name: 'Compare Prices', href: '/compare' },
                      { name: 'EMI Calculator', href: '/emi-calculator' },
                      { name: 'My Wishlist', href: '/wishlist' },
                      { name: 'Live Rates', href: '/#rates' },
                      { name: 'About Us', href: '/about' },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-6 py-4 text-[15px] font-medium text-foreground/80 border-b border-border/20 hover:bg-primary/5 hover:text-primary transition-all duration-300 uppercase tracking-[0.1em]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {!user ? (
                      <button
                        onClick={() => { setLocation('/auth'); setIsMobileMenuOpen(false); }}
                        className="px-6 py-4 text-[15px] font-bold text-primary border-b border-border/20 hover:bg-primary/5 transition-all text-left uppercase tracking-[0.1em]"
                      >
                        Login / Sign Up
                      </button>
                    ) : (
                      <button
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="px-6 py-4 text-[15px] font-bold text-red-500 text-left hover:bg-red-500/5 transition-all uppercase tracking-[0.1em]"
                      >
                        Sign Out
                      </button>
                    )}
                  </nav>
                </div>
                <div className="p-6 bg-background/95 backdrop-blur-xl border-t border-border/50">
                  <a href="https://wa.me/971506485898" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif gap-2 rounded-full h-12 shadow-lg shadow-emerald-900/20">
                      <Phone className="w-4 h-4" />
                      Request Concierge
                    </Button>
                  </a>
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >
    </>
  );
}
