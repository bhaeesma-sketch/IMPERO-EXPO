
import { Header } from "@/components/layout/header";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last Updated: February 2026</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">1. Introduction</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Impero ID ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
                        This privacy policy explains how we collect, use, and handle your information when you use our mobile application and website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">2. Data We Collect</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <h3 className="font-bold">A. Account Information</h3>
                        <p>
                            When you create an account, we collect your <strong>Name</strong> and <strong>Email Address/Username</strong>.
                            This is used solely to authenticate your access to the exclusive Impero Vault and wholesale pricing.
                        </p>

                        <h3 className="font-bold">B. Camera and TrueDepth API Data</h3>
                        <p>
                            Our "Virtual Atelier" (Virtual Try-On) feature requires access to your device's camera.
                            <strong>We do not transmit, store, or share your facial data on our servers.</strong>
                            All processing happens locally on your device in real-time to overlay jewelry models onto your video feed.
                            The camera data is discarded immediately after the AR session ends.
                        </p>

                        <h3 className="font-bold">C. Photos Library</h3>
                        <p>
                            If you choose to capture and save a photo of your virtual try-on session, we request access to your Photo Library
                            save the image locally to your device. We do not access other photos in your library.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">3. Data Sharing</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
                        Your data is secure and used only for the core functionality of the Impero ID application.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-serif mb-4">4. Contact Us</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        If you have any questions about this Privacy Policy, please contact us at:<br />
                        <strong>admin@impero-id.com</strong>
                    </p>
                </section>
            </main>
        </div>
    );
}
