import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/reveal';
import { motion, useScroll, useTransform } from 'framer-motion';

import bespokeBg1 from '@assets/generated_images/close_up_of_master_jeweler_setting_a_diamond.png';
import bespokeBg6 from '@assets/generated_images/luxury_jewelry_design_sketch.png';
import bespokeBg2 from '@assets/generated_images/luxury_gold_texture_wave_abstract.png';

export default function BespokePage() {
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 500], [0, 200]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.img
                        style={{ y: yParallax }}
                        src={bespokeBg1}
                        alt="Master Jeweler at Work"
                        className="w-full h-[120%] object-cover object-top brightness-50"
                    />
                </div>

                <div className="container relative z-10 px-4 text-center text-white space-y-6">
                    <Reveal>
                        <span className="text-sm font-bold tracking-[0.3em] text-primary uppercase">Custom Commission</span>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <h1 className="font-serif text-6xl md:text-8xl font-medium">Bespoke By Impero</h1>
                    </Reveal>
                    <Reveal delay={0.4}>
                        <p className="text-xl font-light max-w-2xl mx-auto text-gray-200">
                            Transform your vision into an eternal masterpiece. Pure gold, flawless diamonds, and your unique story.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* The Process */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Reveal>
                            <h2 className="font-serif text-4xl text-gray-900 mb-4">The Creation Process</h2>
                            <div className="w-24 h-[1px] bg-primary mx-auto"></div>
                        </Reveal>
                    </div>

                    <StaggerContainer className="grid md:grid-cols-3 gap-12">
                        {[
                            { step: "01", title: "Consultation", desc: "Meet with our senior designers to discuss your inspiration, budget, and stone preferences." },
                            { step: "02", title: "Design & Sketch", desc: "We create detailed 3D renderings and hand-sketches for your approval before casting begins." },
                            { step: "03", title: "Craftsmanship", desc: "Our master goldsmiths bring the design to life using traditional techniques and the finest materials." }
                        ].map((item, i) => (
                            <StaggerItem key={i} className="text-center group">
                                <div className="text-6xl font-serif text-gray-100 group-hover:text-primary/20 transition-colors duration-500 mb-4 font-bold">{item.step}</div>
                                <h3 className="text-2xl font-serif text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* Feature/Showcase */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <Reveal direction="right">
                        <img src={bespokeBg6} alt="Design Sketch" className="shadow-2xl rounded-sm" />
                    </Reveal>
                    <div className="space-y-8">
                        <Reveal>
                            <h2 className="font-serif text-4xl text-gray-900">Artistry Without Compromise</h2>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="text-gray-500 text-lg font-light leading-relaxed">
                                Every bespoke piece starts with a blank canvas. Whether you are looking to reset an heirloom diamond or create a bridal set from scratch, our atelier in Dubai ensures execution to the highest Swiss standards.
                            </p>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <ul className="space-y-4">
                                {["GIA Certified Diamonds", "Ethically Sourced Gold", "Lifetime Maintenance"].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-800">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-gray-900 relative overflow-hidden text-center text-white">
                <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${bespokeBg2})` }}></div>
                <div className="container relative z-10 px-4 space-y-8">
                    <Reveal>
                        <h2 className="font-serif text-5xl">Begin Your Journey</h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                            Schedule a private appointment at our Deira showroom or start a virtual consultation.
                        </p>
                    </Reveal>
                    <Reveal delay={0.4}>
                        <a href="https://wa.me/971506485898?text=I%20am%20interested%20in%20a%20bespoke%20commission." target="_blank" rel="noopener noreferrer">
                            <Button className="h-14 px-12 bg-gradient-gold text-gray-900 font-bold tracking-wide hover:scale-105 transition-transform duration-300">
                                Enquire on WhatsApp
                            </Button>
                        </a>
                    </Reveal>
                </div>
            </section>

            {/* Simple Footer (Replicated for now to avoid refactor complexity) */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center text-sm text-gray-500 font-light">
                <div className="container mx-auto px-4">
                    <p>&copy; 2022 Impero Di Gold & Diamonds LLC. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
