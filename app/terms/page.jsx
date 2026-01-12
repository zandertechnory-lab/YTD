export default function Terms() {
    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-4xl mx-auto text-gray-300">
            <h1 className="text-4xl font-bold mb-8 text-white">Terms of Use</h1>
            <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Usage Policy</h2>
                    <p>By using this service, you agree not to download copyrighted material without permission. You are solely responsible for any content you download.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Disclaimer</h2>
                    <p>This tool is not affiliated with YouTube or Google. It is provided "as is" without any warranties.</p>
                </section>
            </div>
        </div>
    );
}
