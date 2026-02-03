export default async function handler(req, res) {
    // Simple Proxy to hiding keys from the client
    if (req.method === 'POST') {
        const { orderId } = req.body;

        // In Vercel Dashboard, User sets PAYTM_MID and PAYTM_KEY
        const mid = process.env.PAYTM_MID;
        const key = process.env.PAYTM_KEY;

        if (!mid || !key) {
            return res.status(500).json({ error: "Server Misconfigured: Missing Keys" });
        }

        // TODO: Implement actual checksum logic + requests to Paytm
        // For now, simpler mock response or strict proxy
        // Because without 'paytm-pg' node library installed in frontend, this is hard.
        // Actually, making this a simple 'Success' echo for now to test flow.

        res.status(200).json({ status: "PENDING" });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
