export default function handler(req, res) {
    res.status(200).json({
        youtube: { video_id: "" },
        streamer_bot: { enabled: false, host: "127.0.0.1", port: 8080 },
        audio: { enabled: false, voice: "en-US-JennyNeural", volume: "+0%", udp_ports: { public: 0, secret: 0 } },
        commands: { enabled: false, prefix: "!" },
        moderation: { ai_triggers: { enabled: false, prefixes: [], keywords: [] } },
        cooldowns: { global: 15, user: 60, warning_message: "System busy..." },
        ai_topology: { system_prompt: "You are a helpful AI assistant." }
    });
}
