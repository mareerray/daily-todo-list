import FormData from 'form-data';

export default async function handler(req, res) {
    const { audio } = req.body;
    const audioBuffer = Buffer.from(audio, 'base64');

    const formData = new FormData();
    formData.append('file', audioBuffer, {
        filename: 'recording.webm',
        contentType: 'audio/webm'
    });
    formData.append('model_id', 'scribe_v2');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            ...formData.getHeaders()
        },
        body: formData.getBuffer()
    });

    const result = await response.json();
    console.log('ElevenLabs response:', result);
    res.status(200).json(result);
}