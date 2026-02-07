import { LiveTicker } from '@/components/ui/live-ticker';
import { Header } from '@/components/layout/header';
import { ProductCard } from '@/components/product/product-card';
import { GoldRatesTable } from '@/components/ui/gold-rates-table';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, MapPin, RotateCcw, Star, Diamond, Gem, Smartphone, PenTool, UserCheck, TrendingUp, Sparkles, Crown, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/reveal';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PRODUCTS as STATIC_PRODUCTS, Product } from '@/lib/products';
import { Link } from 'wouter';

// Assets
import marbleBg from '@assets/generated_images/white_marble_luxury_texture_background.png';
import liquidGoldImg from '@assets/generated_images/abstract_flowing_gold_liquid_on_white_marble.png';
import boutiqueImg from '@assets/generated_images/luxury_jewelry_boutique_interior.png';
import jewelrySetImg from '@assets/generated_images/luxury_gold_jewelry_set.png';
import logoImg from '@assets/impero_logo_transparent.png';

// Hero Images
import heroImg1 from '@assets/generated_images/model_wearing_luxury_diamond_necklace.png';
import heroImg2 from '@assets/generated_images/elegant_woman_with_gold_bridal_jewelry.png';
import heroImg3 from '@assets/generated_images/luxury_diamond_necklace_on_model.png';

// Bespoke Backgrounds
import bespokeBg1 from '@assets/generated_images/close_up_of_master_jeweler_setting_a_diamond.png';
import bespokeBg2 from '@assets/generated_images/luxury_gold_texture_wave_abstract.png';
import bespokeBg3 from '@assets/generated_images/diamond_dust_on_black_velvet.png';
import bespokeBg4 from '@assets/generated_images/gold_bullion_bars_in_vault.png';
import bespokeBg5 from '@assets/generated_images/intricate_gold_filigree_pattern.png';
import bespokeBg6 from '@assets/generated_images/luxury_jewelry_design_sketch.png';

const heroImages = [heroImg1, heroImg3];
const bespokeImages = [bespokeBg1, bespokeBg2, bespokeBg3, bespokeBg4, bespokeBg5, bespokeBg6];

export default function Home() {
  const { scrollY } = useScroll();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bespokeImageIndex, setBespokeImageIndex] = useState(0);

  const { data: dbProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const PRODUCTS: Product[] = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;

  // Smooth parallax effects
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 600], [1, 0.95]);

  // Image slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      setBespokeImageIndex((prev) => (prev + 1) % bespokeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <LiveTicker />
      <Header />
      {/* Hero Section - Redesigned for Impact */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-white">
        {/* Background Elements */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${marbleBg})` }}
        />
        {/* Removed overlay */}

        <div className="container relative z-10 px-4 grid lg:grid-cols-12 gap-12 items-center h-full">
          <motion.div
            style={{ opacity: opacityHero, scale: scaleHero }}
            className="lg:col-span-12 space-y-8 max-w-4xl mx-auto text-center"
          >
            <Reveal direction="down" delay={0.1}>
              <div className="flex items-center justify-center gap-4">
                <span className="h-[1px] w-12 bg-[#BF953F]"></span>
                <span className="text-xs font-bold tracking-[0.3em] text-[#BF953F] uppercase">Est. 2022</span>
              </div>
            </Reveal>

            <h1 className="font-serif text-6xl md:text-8xl font-medium leading-[1.05] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FBF5B7] to-[#AA771C] drop-shadow-sm"
                >
                  IMPERO DI
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block italic pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-sm"
                >
                  Golds & Diamonds
                </motion.span>
              </span>
            </h1>

            <Reveal delay={0.6} direction="up" blur={true}>
              <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
                The intersection of investment-grade purity and artisanal mastery. Secure your legacy with Impero.
              </p>
            </Reveal>

            <Reveal delay={0.8} direction="up">
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                <Link href="/catalog">
                  <Button className="h-14 px-10 bg-gray-900 hover:bg-black text-white rounded-sm font-medium tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    View Catalog
                  </Button>
                </Link>
                <Link href="/bespoke">
                  <Button variant="outline" className="h-14 px-10 border-gray-300 text-gray-900 hover:border-primary hover:text-primary rounded-sm font-medium tracking-wide transition-all duration-300">
                    Bespoke Jewelry
                  </Button>
                </Link>
              </div>
            </Reveal>
          </motion.div>


        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-primary/50"
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 bg-secondary/30 border-y border-secondary overflow-hidden">
        <div className="flex whitespace-nowrap gap-16 animate-marquee items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-primary-foreground/50">
              <Diamond className="w-3 h-3 text-primary" />
              <span>Swiss Certified 999.9</span>
              <span className="text-gray-300">|</span>
              <span>Conflict Free Diamonds</span>
              <span className="text-gray-300">|</span>
              <span>Lifetime Warranty</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Rates Table  - MOVED UP */}
      <GoldRatesTable />



      {/* Featured Collection - Asymmetric Layout - MOVED UP */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <Reveal direction="right" duration={1}>
              <div className="relative group">
                <div className="absolute -top-10 -left-10 w-full h-full border border-gray-100 z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="overflow-hidden">
                  <img src={jewelrySetImg} alt="Luxury Set" className="relative z-10 shadow-2xl w-full transform transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-primary/10 w-2/3 h-2/3 -z-10 blur-3xl" />
              </div>
            </Reveal>

            <div className="space-y-10">
              <Reveal delay={0.2}>
                <h2 className="font-serif text-6xl text-gray-900 leading-none">
                  The Bridal <br />
                  <span className="text-gradient-gold italic">Collection</span>
                </h2>
              </Reveal>

              <Reveal delay={0.4}>
                <p className="text-lg text-gray-500 font-light leading-relaxed">
                  Every piece tells a story of elegance and eternity. Meticulously handcrafted by master artisans to ensure your special day shines as bright as your future.
                </p>
              </Reveal>

              <StaggerContainer delay={0.5} className="grid grid-cols-2 gap-8 pt-4">
                <StaggerItem className="space-y-2">
                  <h4 className="font-serif text-2xl text-gray-900">18K & 21K</h4>
                  <p className="text-sm text-gray-500">Premium Purity Standards</p>
                </StaggerItem>
                <StaggerItem className="space-y-2">
                  <h4 className="font-serif text-2xl text-gray-900">VVS1</h4>
                  <p className="text-sm text-gray-500">Diamond Clarity Guarantee</p>
                </StaggerItem>
              </StaggerContainer>

              <Reveal delay={0.6}>
                <Link href="/catalog?category=jewelry">
                  <Button className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-none font-serif tracking-wide text-lg mt-8 transform transition-transform hover:-translate-y-1">
                    Discover the Collection
                  </Button>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Jewelry Grid - MOVED UP & Modified to 2 columns on mobile */}
      <section id="jewelry" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {PRODUCTS.filter(p => p.category === 'jewelry').map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  purity={product.purity}
                  baseWeight={product.baseWeight}
                  makingCharge={product.makingCharge}
                  type={product.type}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gold Coins Section - Modified to 2 columns on mobile */}
      <section id="coins" className="py-32 bg-gray-50 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <Reveal className="max-w-xl">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Investment Grade</span>
              <h2 className="font-serif text-5xl font-medium text-gray-900 mb-6">Gold Coins</h2>
              <p className="text-gray-500 font-light leading-relaxed text-lg">
                Precision-minted gold coins featuring the prestigious IDi hallmark. Perfect for gifting or building your investment portfolio.
              </p>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <Link href="/catalog?category=coins">
                <Button variant="link" className="group text-gray-900 hover:text-primary p-0 text-lg font-serif italic">
                  View All Coins <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {PRODUCTS.filter(p => p.category === 'coins').slice(0, 4).map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  purity={product.purity}
                  baseWeight={product.baseWeight}
                  displayWeight={product.displayWeight}
                  customWeights={product.customWeights}
                  makingCharge={product.makingCharge}
                  type={product.type}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gold Bars Section - Modified to 2 columns on mobile */}
      <section id="bars" className="py-32 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <Reveal className="max-w-xl">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Premium Bullion</span>
              <h2 className="font-serif text-5xl font-medium text-gray-900 mb-6">Gold Bars</h2>
              <p className="text-gray-500 font-light leading-relaxed text-lg">
                Acquire wealth in its purest form. Our Swiss-grade bars are recognized globally and come with tamper-proof certification.
              </p>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <Link href="/catalog?category=bars">
                <Button variant="link" className="group text-gray-900 hover:text-primary p-0 text-lg font-serif italic">
                  View All Bars <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {PRODUCTS.filter(p => p.category === 'bars').slice(0, 4).map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  purity={product.purity}
                  baseWeight={product.baseWeight}
                  displayWeight={product.displayWeight}
                  customWeights={product.customWeights}
                  makingCharge={product.makingCharge}
                  type={product.type}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Silver Bullion Section - Modified to 2 columns on mobile */}
      <section id="silver" className="py-32 bg-gray-50 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <Reveal className="max-w-xl">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">New Arrival</span>
              <h2 className="font-serif text-5xl font-medium text-gray-900 mb-6">Silver Bullion</h2>
              <p className="text-gray-500 font-light leading-relaxed text-lg">
                Diversify your portfolio with our premium 999.9 fine silver collection. From minted bars to coins, each piece represents accessible luxury and tangible value.
              </p>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <Link href="/catalog?category=silver">
                <Button variant="link" className="group text-gray-900 hover:text-primary p-0 text-lg font-serif italic">
                  View All Silver <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {PRODUCTS.filter(p => p.category === 'silver').slice(0, 4).map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  purity={product.purity}
                  baseWeight={product.baseWeight}
                  displayWeight={product.displayWeight}
                  customWeights={product.customWeights}
                  makingCharge={product.makingCharge}
                  type={product.type}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Campaign Gallery - High Fashion - MOVED DOWN */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <Reveal className="mb-12 text-center">
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase block mb-3">The Campaign</span>
            <h2 className="font-serif text-4xl text-gray-900 dark:text-gray-100">Muse & Masterpiece</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[heroImg2, heroImg3].map((img, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="relative group overflow-hidden aspect-[3/4] cursor-pointer shadow-lg">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                  <img
                    src={img}
                    alt="Campaign Shot"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-serif text-2xl italic">
                      {["The Bridal Edit", "Diamond Purity"][i]}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05),transparent_70%)] pointer-events-none" />

          <Reveal className="mb-20 text-center relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-[1px] w-12 bg-primary/50" />
              <span className="text-xs font-bold tracking-[0.4em] text-primary uppercase">Unrivaled Excellence</span>
              <div className="h-[1px] w-12 bg-primary/50" />
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-gray-900 dark:text-gray-100 mb-6 drop-shadow-sm">The Impero Experience</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed text-lg">
              Where investment-grade purity meets artisanal mastery. Our ecosystem is designed for the discerning few.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {[
              {
                icon: <Smartphone className="w-10 h-10" strokeWidth={1} />,
                title: "Virtual Atelier",
                description: "Try on our rarest pieces instantly with our hyper-realistic AR technology.",
                link: "/try-on",
                bg: "from-purple-500/10 to-pink-500/10",
                border: "group-hover:border-purple-500/30"
              },
              {
                icon: <UserCheck className="w-10 h-10" strokeWidth={1} />,
                title: "Private Stylist",
                description: "Consult with our gemologists to curate a collection that defines your legacy.",
                link: "/bespoke",
                bg: "from-blue-500/10 to-cyan-500/10",
                border: "group-hover:border-blue-500/30"
              },
              {
                icon: <PenTool className="w-10 h-10" strokeWidth={1} />,
                title: "Bespoke Creation",
                description: "Collaborate with master artisans to transform your vision into an eternal heirloom.",
                link: "/bespoke",
                bg: "from-amber-500/10 to-orange-500/10",
                border: "group-hover:border-amber-500/30"
              },
              {
                icon: <TrendingUp className="w-10 h-10" strokeWidth={1} />,
                title: "Market Intelligence",
                description: "Access real-time bullion analytics and transparent buyback valuations.",
                link: "/compare",
                bg: "from-emerald-500/10 to-green-500/10",
                border: "group-hover:border-emerald-500/30"
              },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <Link href={feature.link}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`group relative h-full bg-white/5 dark:bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-gray-200/50 dark:border-white/5 ${feature.border} transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden`}
                  >
                    {/* Animated Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                    {/* Floating Glow Orb */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-8 p-4 w-fit rounded-xl bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-transparent border border-gray-200 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-500 text-gray-800 dark:text-gray-100">
                        {feature.icon}
                      </div>

                      <h3 className="font-serif text-2xl text-gray-900 dark:text-gray-100 mb-4 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow font-light">
                        {feature.description}
                      </p>

                      <div className="flex items-center text-primary font-medium text-xs tracking-[0.2em] uppercase group-hover:gap-3 gap-2 transition-all duration-300">
                        Explore Benefit <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Premium Services Grid */}
          <Reveal delay={0.6} className="mt-24">
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 rounded-[2rem] p-12 border border-gray-200 dark:border-white/5 shadow-2xl">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h3 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-gray-100 mb-2">The Impero Promise</h3>
                  <p className="text-gray-500 dark:text-gray-500 text-sm tracking-widest uppercase">Standards of Perfection</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center bg-white/50 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/5">
                  {[
                    { icon: <Crown className="w-6 h-6" />, label: "Royal Warranty" },
                    { icon: <RotateCcw className="w-6 h-6" />, label: "Lifetime Resizing" },
                    { icon: <Sparkles className="w-6 h-6" />, label: "Pristine Care" },
                    { icon: <ShieldCheck className="w-6 h-6" />, label: "Secure Storage" },
                    { icon: <Award className="w-6 h-6" />, label: "GIA Certified" },
                    { icon: <Star className="w-6 h-6" />, label: "VIP Access" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 group cursor-default">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-primary border border-gray-100 dark:border-white/10 shadow-sm group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Boutique Experience Section - MOVED DOWN */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <Reveal>
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900">The Impero Experience</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-gray-500 font-light leading-relaxed">
                  Step into our flagship boutique in the heart of Dubai. Designed as a sanctuary of luxury, our showroom offers a private viewing experience where you can explore our collections in complete comfort and privacy.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <ul className="space-y-4 pt-4">
                  {["Private VIP Suites", "Certified Gemologists", "Valet Parking Service"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="order-1 lg:order-2">
              <Reveal direction="left">
                <img src={boutiqueImg} alt="Luxury Boutique Interior" className="w-full shadow-2xl rounded-sm" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Clean & Minimal - MOVED DOWN */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
            {[
              { icon: ShieldCheck, title: "100% Certified", desc: "Hallmarked Purity" },
              { icon: MapPin, title: "Visit Showroom", desc: "Gold Souq, Deira" },
              { icon: RotateCcw, title: "Buyback Guarantee", desc: "Instant Liquidity" },
              { icon: Gem, title: "Best Price", desc: "Live Market Rates" },
            ].map((item, i) => (
              <StaggerItem
                key={i}
                className="bg-white p-10 flex flex-col items-center text-center group cursor-default transition-all duration-300 hover:z-10 hover:shadow-xl"
              >
                <item.icon className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors duration-300 mb-6 transform group-hover:scale-110" strokeWidth={1} />
                <h3 className="font-serif font-medium text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{item.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Bespoke Service CTA */}
      <section id="bespoke" className="py-32 bg-gray-900 text-white relative overflow-hidden isolate">
        <motion.div style={{ y: y2 }} className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={bespokeImageIndex}
              src={bespokeImages[bespokeImageIndex]}
              alt="Luxury Background"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}
              className="w-full h-[150%] object-cover mix-blend-overlay"
            />
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-0" />

        <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto space-y-8">
          <Reveal direction="down">
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Bespoke Service</span>
          </Reveal>

          <Reveal>
            <h2 className="font-serif text-5xl md:text-7xl font-medium">Create Your Masterpiece</h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-gray-300 font-light text-xl leading-relaxed max-w-2xl mx-auto">
              Work directly with our senior designers to craft a one-of-a-kind piece that reflects your unique style and story.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex justify-center gap-6 pt-8">
              <a href="https://wa.me/971506485898?text=I%20am%20interested%20in%20a%20private%20bespoke%20jewelry%20consultation." target="_blank" rel="noopener noreferrer">
                <Button className="h-14 px-10 bg-gradient-gold text-gray-900 font-bold tracking-wide rounded-none hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                  Book Private Consultation
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-24 pb-12 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="mb-6">
                  <img src={logoImg} alt="Impero Di Gold Logo" className="h-40 w-auto object-contain" />
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-light max-w-xs">
                The premier destination for certified bullion and high-jewelry in the Middle East. Setting the gold standard since 2022.
              </p>
            </div>

            <Reveal delay={0.1}>
              <div>
                <h4 className="font-serif text-lg mb-6 text-gray-900">Collections</h4>
                <ul className="space-y-4 text-sm text-gray-500 font-light">
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Gold Bullion</a></li>
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Diamond Rings</a></li>
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Bridal Sets</a></li>
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Investment Plans</a></li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <h4 className="font-serif text-lg mb-6 text-gray-900">Client Care</h4>
                <ul className="space-y-4 text-sm text-gray-500 font-light">
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Live Gold Rates</a></li>
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Return Policy</a></li>
                  <li><a href="#" className="hover:text-primary hover:pl-2 transition-all block">Book Appointment</a></li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div>
                <h4 className="font-serif text-lg mb-6 text-gray-900">Contact Us</h4>
                <ul className="space-y-4 text-sm text-gray-500 font-light">
                  <li>
                    <span className="block font-medium text-gray-900 mb-1">Headquarters</span>
                    Gold Souq, Deira<br />Dubai, United Arab Emirates
                  </li>
                  <li>
                    <span className="block font-medium text-gray-900 mb-1">Phone</span>
                    <a href="tel:+971506485898" className="hover:text-primary">+971 50 648 5898</a>
                  </li>
                  <li>
                    <span className="block font-medium text-gray-900 mb-1">Email</span>
                    <a href="mailto:Admin@imperodigolduae.com" className="hover:text-primary">Admin@imperodigolduae.com</a>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-light tracking-wide">
            <p>© 2022 Impero Di Gold & Diamonds LLC. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0 uppercase">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
