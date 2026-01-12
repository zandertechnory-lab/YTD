export default function Privacy() {
    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-4xl mx-auto text-gray-300">
            <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
            <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Data Collection</h2>
                    <p>We do not store any personal data or the videos you download. All processing happens in real-time and no logs are kept of your activity.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Cookies</h2>
                    <p>We use local storage only to enhance your user experience (e.g., saving your theme preferences).</p>
                </section>
            </div>
        </div>
    );
}
