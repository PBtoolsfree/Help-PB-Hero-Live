import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, CreditCard, ChevronRight, CheckCircle2, QrCode, X, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Configuration
const STREAMER_DETAILS = {
    name: "Pi Bot Live",
    upiId: "your-vpa@upi",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=PiBot&backgroundColor=b6e3f4",
    bio: "Creating the ultimate AI-powered streaming experience. Support the bot server costs!"
};

// Mock Leaderboard Data
const TOP_SUPPORTERS = [
    { name: "Rahul_Gamer", amount: 5000, time: "2h ago" },
    { name: "SnehaPlays", amount: 2500, time: "5h ago" },
    { name: "TechKing", amount: 1000, time: "1d ago" },
];

export default function PaymentPage() {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('input'); // input | qr | success
    const [qrUrl, setQrUrl] = useState('');

    const quickAmounts = [50, 100, 500, 1000];

    const handlePay = () => {
        if (!amount || Number(amount) <= 0) return;

        // Generate QR Logic
        const orderId = `ORD-${Date.now()}`;
        const upiLink = `upi://pay?pa=${STREAMER_DETAILS.upiId}&pn=${encodeURIComponent(STREAMER_DETAILS.name)}&am=${amount}&tn=${encodeURIComponent(message || "Support")}&tr=${orderId}&cu=INR`;
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiLink)}`);
        setStep('qr');
    };

    const handlePaid = () => {
        setStep('success');
        // In real app, poll backend here
    };

    return (
        <div className="min-h-screen bg-[#130d25] text-white font-sans selection:bg-purple-500/30">
            {/* Navbar placeholder to match screenshot */}
            <nav className="absolute top-0 w-full flex items-center justify-between px-6 py-4 z-20">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                        <Sparkles className="h-5 w-5 fill-current" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">StreamTipz</span>
                </div>
                <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-full text-xs font-bold transition-colors border border-purple-500/20">
                    Dashboard
                </button>
            </nav>

            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center max-w-4xl min-h-[calc(100vh-80px)]">

                {/* Hero Section (if in input mode and no amount selected yet) */}
                <AnimatePresence>
                    {step === 'input' && !amount && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-center mb-12 space-y-4"
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                <Sparkles className="inline h-3 w-3 mr-1 mb-0.5" /> 92% Earnings Retention
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                                Accept support from<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-[length:200%_auto] animate-gradient">True Fans</span> Instantly
                            </h1>
                            <p className="text-slate-400 max-w-lg mx-auto text-lg">
                                The cleanest, most professional tipping page for Indian streamers. Supports UPI with instant alerts to OBS.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
                    {/* Profile Card / Payment Card */}
                    <motion.div
                        layout
                        className="w-full max-w-[420px] bg-[#1a142e]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] p-1 shadow-2xl shadow-black/50"
                    >
                        <div className="bg-[#151026] rounded-[28px] p-6 md:p-8 relative overflow-hidden h-full">
                            {/* Streamer Info Header */}
                            <div className="text-center relative z-10 mb-8">
                                <div className="relative w-24 h-24 mx-auto mb-4 group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <img src={STREAMER_DETAILS.avatar} alt="Avatar" className="relative w-full h-full rounded-full border-4 border-[#1a142e] shadow-xl z-10" />
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-[#1a142e] rounded-full z-20" title="Online" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">{STREAMER_DETAILS.name}</h2>
                                <p className="text-white/40 text-sm mt-1 flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live on YouTube
                                </p>
                            </div>

                            {/* Payment Flow */}
                            <AnimatePresence mode="wait">
                                {step === 'input' && (
                                    <motion.div
                                        key="input"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-purple-400 font-medium">₹</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="500"
                                                    className="w-full bg-[#1e1736] border border-purple-500/20 rounded-2xl py-4 pl-10 pr-4 text-3xl font-bold text-white outline-none focus:border-purple-500 focus:bg-[#251d3d] transition-all placeholder:text-white/10"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                {quickAmounts.map(amt => (
                                                    <button
                                                        key={amt}
                                                        onClick={() => setAmount(amt)}
                                                        className="flex-1 py-2 bg-[#1e1736] hover:bg-purple-600 hover:text-white border border-white/5 rounded-xl text-xs font-bold text-purple-300 transition-all"
                                                    >
                                                        ₹{amt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name (Optional)"
                                                className="w-full bg-[#1e1736] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 transition-colors"
                                            />
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Send a message..."
                                                rows={2}
                                                className="w-full bg-[#1e1736] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 transition-colors resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={handlePay}
                                            disabled={!amount}
                                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                                        >
                                            Donate Now <Sparkles className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 'qr' && (
                                    <motion.div
                                        key="qr"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center"
                                    >
                                        <div className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-4">Scan to Pay ₹{amount}</div>
                                        <div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                            <img src={qrUrl} alt="QR" className="w-56 h-56 mix-blend-multiply" />
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                onClick={handlePaid}
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
                                            >
                                                I Have Paid
                                            </button>
                                            <button
                                                onClick={() => setStep('input')}
                                                className="text-white/40 hover:text-white text-sm font-medium transition-colors"
                                            >
                                                Cancel Protocol
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
                                            <CheckCircle2 className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Payment Detected</h3>
                                        <p className="text-white/50 text-sm mb-8">
                                            Pi Bot is processing your donation.<br />Alert will trigger on stream shortly.
                                        </p>
                                        <button
                                            onClick={() => { setStep('input'); setAmount(''); setMessage(''); }}
                                            className="px-8 py-3 bg-[#1e1736] hover:bg-purple-600/20 text-white font-bold rounded-xl border border-white/5 transition-all"
                                        >
                                            Make Another
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
