import { Header } from "@/components/layout/header";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Terms & Conditions</h1>
                <p className="text-gray-500 mb-8">Last Updated: February 2026</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        By accessing and using the Impero Di Golds & Diamonds application ("App"), you agree to be bound
                        by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the App.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">2. Use of the App</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <p>
                            The App is provided for informational and browsing purposes. You may use the App to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Browse our jewelry catalog and product listings</li>
                            <li>View live gold and silver market rates</li>
                            <li>Use the virtual try-on feature to preview jewelry</li>
                            <li>Compare gold prices across different purities</li>
                            <li>Contact us for bespoke jewelry inquiries</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">3. Account Registration</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Some features of the App require you to create an account. You are responsible for maintaining
                        the confidentiality of your account credentials and for all activities that occur under your account.
                        You agree to provide accurate and complete information when registering.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">4. Gold Rates & Pricing</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Gold and silver rates displayed in the App are sourced from third-party market data providers
                        and are provided for informational purposes only. While we strive to display accurate and up-to-date
                        pricing, we do not guarantee the accuracy of market rates. Final pricing for any purchase will be
                        confirmed at the time of transaction.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">5. Intellectual Property</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        All content in the App, including but not limited to text, images, logos, designs, product photographs,
                        and software, is the property of Impero Di Golds & Diamonds and is protected by applicable intellectual
                        property laws. You may not reproduce, distribute, or create derivative works without our written consent.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">6. Virtual Try-On Feature</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        The virtual try-on feature uses your device's camera to provide an augmented reality preview of jewelry.
                        This feature is for visualization purposes only and may not perfectly represent the actual product.
                        Colors, sizes, and proportions may vary from the physical product.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">7. Limitation of Liability</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        The App is provided "as is" without warranties of any kind, either express or implied. Impero Di Golds & Diamonds
                        shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the App.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">8. Changes to Terms</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        We reserve the right to update or modify these Terms and Conditions at any time. Changes will be effective
                        immediately upon posting in the App. Your continued use of the App after any changes constitutes your
                        acceptance of the updated terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">9. Contact Us</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        If you have any questions about these Terms and Conditions, please contact us at:<br />
                        <strong>admin@impero-id.com</strong>
                    </p>
                </section>
            </main>
        </div>
    );
}
