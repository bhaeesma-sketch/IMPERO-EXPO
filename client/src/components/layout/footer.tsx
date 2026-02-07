import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Phone, Mail } from 'lucide-react';
// Using verified relative path
import logoImg from '../../assets/impero_logo_transparent.png';

export function Footer() {
    return (
        <footer className="bg-white text-black border-t border-gray-100 pt-20 pb-12">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/">
                            <img src={logoImg} alt="Impero" className="h-10 w-auto object-contain brightness-0" />
                        </Link>
                        <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                            Meticulously crafted gold and diamond jewelry, celebrating the art of adornment. Designed in Dubai for the world.
                        </p>
                        <div className="flex gap-4">
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-black transition-colors cursor-pointer" />
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-black transition-colors cursor-pointer" />
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-black transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="font-serif text-lg mb-6">Collections</h4>
                        <ul className="space-y-4 text-sm font-medium tracking-wide uppercase text-gray-500">
                            <li><Link href="/catalog" className="hover:text-black transition-colors">New Arrivals</Link></li>
                            <li><Link href="/catalog?category=jewelry" className="hover:text-black transition-colors">High Jewelry</Link></li>
                            <li><Link href="/catalog?category=coins" className="hover:text-black transition-colors">Investment Gold</Link></li>
                            <li><Link href="/bespoke" className="hover:text-black transition-colors">Bespoke</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-serif text-lg mb-6">Service</h4>
                        <ul className="space-y-4 text-sm font-medium tracking-wide uppercase text-gray-500">
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
                            <li><Link href="/cleaning" className="hover:text-black transition-colors">Jewelry Care</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-serif text-lg mb-6">Stay Adorned</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe for exclusive access to new collections and private sales.</p>
                        <div className="flex border-b border-black pb-2">
                            <input type="email" placeholder="Your Email Address" className="w-full text-sm outline-none placeholder:text-gray-400 bg-transparent" />
                            <button className="text-xs uppercase font-bold tracking-widest hover:text-gray-500">Join</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-400 gap-4">
                    <p>© 2024 Impero Di Gold LLC. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-black">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
