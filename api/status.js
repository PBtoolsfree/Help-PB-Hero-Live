export default function handler(req, res) {
    res.status(200).json({
        status: "online",
        backend: "vercel-standalone",
        message: "Running in standalone mode"
    });
}
