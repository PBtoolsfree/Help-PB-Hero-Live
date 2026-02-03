import React, { useState } from 'react';

// You can configure your UPI ID here
// In a real Vercel app, these should come from Environment Variables
const STREAMER_UPI_ID = "your-vpa@upi";
const STREAMER_NAME = "Your Channel Name";

export default function PaymentPage() {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [orderId, setOrderId] = useState('');

    const generateQR = () => {
        if (!amount || amount <= 0) return alert("Please enter a valid amount");

        // Generate a unique Order ID for tracking
        const newOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        setOrderId(newOrderId);

        // Format: upi://pay?pa=ADDRESS&pn=NAME&am=AMOUNT&tn=MESSAGE&tr=ORDER_ID
        const upiLink = `upi://pay?pa=${STREAMER_UPI_ID}&pn=${encodeURIComponent(STREAMER_NAME)}&am=${amount}&tn=${encodeURIComponent(message || "Donation")}&tr=${newOrderId}&cu=INR`;

        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`);
        setShowQR(true);
    };

    const handlePaid = async () => {
        // Call the Vercel API to mark it as "User Said Paid" (Optional/Trust based)
        // Or just let the Poll mechanic handle the actual bank confirmation
        alert("Thanks! If the payment went through, the alert will pop up in a few seconds.");
        setShowQR(false);
        setAmount('');
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">

                <div className="bg-gradient-to-b from-white/5 to-transparent p-6 text-center border-b border-white/10">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full p-1 shadow-lg shadow-purple-500/20 mb-4">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-3xl">🎮</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{STREAMER_NAME}</h1>
                    <p className="text-white/50 text-sm mt-1">Send a tip to support the stream!</p>
                </div>

                {!showQR ? (
                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Amount (INR)</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-2xl font-bold outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-white/10"
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[20, 50, 100, 500].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val)}
                                        className="py-2 bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/50 border border-transparent rounded-lg text-sm font-medium transition-all"
                                    >
                                        ₹{val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Say something nice..."
                                    rows="3"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={generateQR}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Pay via UPI</span>
                        </button>
                    </div>
                ) : (
                    <div className="p-8 flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="text-center mb-6">
                            <p className="text-white/60 text-sm">Scan with any UPI App</p>
                            <h2 className="text-3xl font-bold mt-1 text-white">₹{amount}</h2>
                        </div>

                        <div className="p-4 bg-white rounded-2xl shadow-xl shadow-white/5 mb-6">
                            <img src={qrUrl} alt="UPI QR" className="w-48 h-48 mix-blend-multiply" />
                        </div>

                        <div className="flex gap-2 w-full">
                            <button
                                onClick={() => setShowQR(false)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaid}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                I Have Paid
                            </button>
                        </div>
                        <div className="text-xs font-mono text-white/30 mt-4">Order ID: {orderId}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
