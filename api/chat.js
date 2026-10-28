export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured'
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: String(req.body?.message || 'Hello').slice(0, 1000)
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Gemini request failed'
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: 'Could not connect to Gemini'
    });
  }
}
