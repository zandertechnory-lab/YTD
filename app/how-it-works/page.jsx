import GlassCard from '@/components/ui/GlassCard';

export default function HowItWorks() {
    const steps = [
        {
            title: "1. Paste Link",
            description: "Copy the YouTube video URL and paste it into the search box on the homepage.",
            icon: "📋"
        },
        {
            title: "2. Choose Format",
            description: "Select your preferred video quality (1080p, 720p etc.) or audio-only format.",
            icon: "⚙️"
        },
        {
            title: "3. Download",
            description: "Click the download button and the file will be saved directly to your device.",
            icon: "💾"
        }
    ];

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 text-center text-neon-blue">How It Works</h1>
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <GlassCard key={index} className="text-center hover:bg-white/5 transition-colors" hoverEffect>
                            <div className="text-6xl mb-6">{step.icon}</div>
                            <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
