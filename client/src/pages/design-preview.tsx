import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Preview Images
import monolithImg from "@/assets/previews/luxury_ui_onyx_monolith_1770421655917.png";
import architecturalImg from "@/assets/previews/luxury_ui_architectural_luxury_1770421702542.png";
import goldenHourImg from "@/assets/previews/luxury_ui_golden_hour_minimal_1770421686116.png";
import royalPalaceImg from "@/assets/previews/luxury_web_design_royal_palace_ui_1770421551426.png";

// Unique/Avant-Garde Images
import cartierUniqueImg from "@/assets/previews/unique_noir_monolith_cartier_1770430928839.png";
import motiwalaUniqueImg from "@/assets/previews/architectural_jewelry_as_motiwala_1770431645174.png";
import goldDustImg from "@/assets/previews/unique_gold_dust_equinox_1770431755456.png";
import asymmetricGridImg from "@/assets/previews/asymmetric_luxury_grid_1770433099999.png";
import liquidGoldImg from "@/assets/previews/liquid_gold_experimental_1770434062810.png";

// User Requested
import brilliantTemplateImg from "@/assets/previews/glossy_black_template_preview.png";
import mobileAppImg from "@/assets/previews/mobile_jewelry_app_1770434713159.png";

const concepts = [
    {
        id: 1,
        title: "Glossy Black (Your Selection)",
        description: "The 'Brilliant' style template you requested. Deep glossy black background with classic gold circles.",
        image: brilliantTemplateImg,
        style: "Classic Glossy"
    },
    {
        id: 2,
        title: "Obsidy Mobile App",
        description: "Premium mobile-first experience. Clean, modern interface designed specifically for iPhone and Android users.",
        image: mobileAppImg,
        style: "Mobile App"
    },
    {
        id: 3,
        title: "The Cartier Concept (Noir Monolith)",
        description: "Ultra-luxury fashion editorial. Bold typography with high-contrast model imagery. The pinnacle of sophistication.",
        image: cartierUniqueImg,
        style: "Fashion Avant-Garde"
    },
    {
        id: 4,
        title: "Motiwala Heritage",
        description: "Deep luxury heritage style. Gold-on-black interface with centered product focus and elegant crown insignias.",
        image: motiwalaUniqueImg,
        style: "Classic Royal"
    },
    {
        id: 5,
        title: "Liquid Gold (3D Experimental)",
        description: "Modern masterpiece. Uses 3D liquid gold flow animations to guide the user's eye to the diamonds.",
        image: liquidGoldImg,
        style: "3D Kinetic"
    },
    {
        id: 6,
        title: "Equinox Gold Dust",
        description: "Cinematic atmosphere. Floating gold particles and urban luxury theme. Very unique for jewelry branding.",
        image: goldDustImg,
        style: "Cinematic Dark"
    }
];

export default function DesignPreview() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 md:px-20">
            <div className="max-w-7xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-12 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Live Site
                    </Button>
                </Link>

                <header className="mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-bold tracking-[0.5em] text-primary uppercase block mb-4"
                    >
                        Design Showcase
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl mb-6"
                    >
                        Select Your Vision
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl font-light"
                    >
                        I have prepared 6 unique 4K design concepts for Impero Di Gold & Diamonds.
                        Scroll through the options below and tell me which one you want me to build.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                    {concepts.map((concept, idx) => (
                        <motion.div
                            key={concept.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden rounded-none mb-8 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={concept.image}
                                        alt={concept.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">{concept.style}</span>
                                    <span className="text-zinc-600 text-xs font-mono italic">Option 0{concept.id}</span>
                                </div>
                                <h3 className="font-serif text-3xl group-hover:text-primary transition-colors duration-300">
                                    {concept.title}
                                </h3>
                                <p className="text-zinc-400 font-light leading-relaxed">
                                    {concept.description}
                                </p>
                                <div className="pt-4">
                                    <Button variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary/5 rounded-none text-xs tracking-widest uppercase py-6 px-8 group">
                                        Select This Style <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <footer className="mt-40 pt-20 border-t border-zinc-800 text-center">
                    <p className="text-zinc-500 text-sm italic font-serif">
                        Designed exclusively for Impero Di Gold & Diamonds LLC.
                    </p>
                </footer>
            </div>
        </div>
    );
}
