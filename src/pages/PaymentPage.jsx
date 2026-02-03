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
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center max-w-6xl">

                {/* Left Column: Profile & Leaderboard */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 text-center"
                    >
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 blur-lg opacity-50" />
                            <img src={STREAMER_DETAILS.avatar} alt="Avatar" className="relative w-full h-full rounded-full border-2 border-white/10 shadow-xl" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900" title="Online" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{STREAMER_DETAILS.name}</h1>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">{STREAMER_DETAILS.bio}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hidden lg:block"
                    >
                        <div className="flex items-center gap-2 mb-4 text-violet-400 font-bold uppercase text-xs tracking-wider">
                            <Trophy className="h-4 w-4" /> Top Supporters
                        </div>
                        <div className="space-y-4">
                            {TOP_SUPPORTERS.map((s, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-violet-500/10 group-hover:text-violet-400 transition-colors">
                                            {i + 1}
                                        </div>
                                        <div className="text-sm font-medium text-slate-300">{s.name}</div>
                                    </div>
                                    <div className="text-sm font-bold text-emerald-400">₹{s.amount}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Payment Flow */}
                <div className="w-full lg:w-[480px]">
                    <AnimatePresence mode="wait">
                        {step === 'input' && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl shadow-violet-500/10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-amber-400" />
                                        Send a Tip
                                    </h2>
                                    <div className="text-xs font-medium text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
                                        SECURED BY UPI
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block group-focus-within:text-violet-400 transition-colors">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-500 font-light group-focus-within:text-white transition-colors">₹</span>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-3xl font-bold outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
                                            {quickAmounts.map(amt => (
                                                <button
                                                    key={amt}
                                                    onClick={() => setAmount(amt)}
                                                    className="px-4 py-2 rounded-xl bg-slate-800/50 border border-white/5 text-sm font-medium hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all whitespace-nowrap"
                                                >
                                                    ₹{amt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">From</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name (Optional)"
                                                className="w-full bg-slate-900/30 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Message</label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Say something nice..."
                                                rows={2}
                                                className="w-full bg-slate-900/30 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition-colors resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePay}
                                        disabled={!amount}
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Proceed to Pay <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'qr' && (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl text-center"
                            >
                                <div className="mb-6">
                                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Total Amount</h3>
                                    <div className="text-4xl font-black text-white">₹{amount}</div>
                                </div>

                                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-white/5 mx-auto max-w-[280px] mb-8 relative group">
                                    <div className="absolute inset-0 bg-violet-500/20 blur-xl group-hover:blur-2xl transition-all" />
                                    <div className="relative bg-white rounded-2xl overflow-hidden">
                                        <img src={qrUrl} alt="QR Code" className="w-full h-full mix-blend-multiply" />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">
                                        SCAN WITH ANY UPI APP
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handlePaid}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="h-5 w-5" /> I Have Paid
                                    </button>
                                    <button
                                        onClick={() => setStep('input')}
                                        className="w-full bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-medium py-3 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-900/20 backdrop-blur-2xl border border-emerald-500/30 rounded-[32px] p-12 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 animate-bounce">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Payment Sent!</h2>
                                <p className="text-emerald-200/80 mb-8 max-w-[200px] mx-auto">
                                    Your tip will appear on stream shortly. Thank you for your support!
                                </p>
                                <button
                                    onClick={() => { setStep('input'); setAmount(''); setMessage(''); }}
                                    className="px-8 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors"
                                >
                                    Send Another
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
