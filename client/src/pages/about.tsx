import { Header } from "@/components/layout/header";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">About Us</h1>
                <p className="text-gray-500 mb-8">Impero Di Golds & Diamonds</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">Our Story</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Founded in 2022, Impero Di Golds & Diamonds is a premier luxury gold and diamond jewelry house
                        dedicated to bringing you the finest craftsmanship and the most exquisite designs. We blend timeless
                        tradition with modern elegance to create pieces that tell your unique story.
                    </p>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our curated collection features handcrafted gold jewelry in 24K, 22K, 21K, and 18K purity,
                        alongside stunning diamond pieces that are ethically sourced and certified for quality.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">What We Offer</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <div>
                            <h3 className="font-bold mb-2">Live Gold Rates</h3>
                            <p>
                                Stay informed with real-time gold and silver market prices updated throughout the day,
                                so you always know the true value of your investment.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Premium Catalog</h3>
                            <p>
                                Browse our extensive collection of necklaces, rings, bracelets, earrings, and bespoke pieces,
                                each crafted with meticulous attention to detail.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Virtual Try-On</h3>
                            <p>
                                Experience our innovative augmented reality feature that lets you try on jewelry virtually
                                before making a purchase, right from the comfort of your home.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Bespoke Design</h3>
                            <p>
                                Work with our master artisans to create a one-of-a-kind piece tailored to your vision.
                                From engagement rings to anniversary gifts, we bring your dreams to life.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">Our Promise</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        At Impero Di Golds & Diamonds, we are committed to transparency, quality, and exceptional service.
                        Every piece in our collection comes with a certificate of authenticity, and our pricing reflects
                        real-time market rates so you always get fair value.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We would love to hear from you. Reach out to us at:<br />
                        <strong>admin@impero-id.com</strong>
                    </p>
                </section>
            </main>
        </div>
    );
}
