import GlassCard from '@/components/ui/GlassCard';

export default function FAQ() {
    const faqs = [
        {
            q: "Is it free?",
            a: "Yes, NeonDownloader is 100% free to use."
        },
        {
            q: "Is it legal?",
            a: "Downloading copyrighted content without permission is against YouTube's Terms of Service. This tool is intended for personal use only (e.g., your own videos or Creative Commons content)."
        },
        {
            q: "Can I download 4K videos?",
            a: "Currently, we support up to 1080p resolutions with audio. Higher resolutions requiring separate stream merging are in development."
        },
        {
            q: "Where do files go?",
            a: "Files are downloaded directly to your device's default download folder (Gallery on mobile)."
        }
    ];

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 text-center text-neon-purple">Frequently Asked Questions</h1>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <GlassCard key={index}>
                            <h3 className="text-xl font-bold mb-2 text-white">{faq.q}</h3>
                            <p className="text-gray-400">{faq.a}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
