export default async function handler(req, res) {
    const { text } = req.body;
    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Bella

    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: "POST",
            headers: {
                "xi-api-key": process.env.ELEVENLABS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2"
            })
        }
    );

    const audioBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
}