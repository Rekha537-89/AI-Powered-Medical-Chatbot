// ═══════════════════════════════════════════════
//  HealthAI — Express Backend Proxy
//  Proxies IBM IAM token + WatsonX API calls
//  so the browser never touches IBM directly.
// ═══════════════════════════════════════════════

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── IBM WatsonX config (server-side only) ──
const IBM_CONFIG = {
    projectId: 'a0a5cc1f-6385-4952-be11-f9c19c29b36e',
    apiKey:    's2tJtVXy9V9H8iMjsMo_aGtMyIGMElrR-IYzlSecKcyP',
    endpoint:  'https://us-south.ml.cloud.ibm.com',
    modelId:   'ibm/granite-3-8b-instruct'
};

// ── Token cache ──
let cachedToken  = null;
let tokenExpiry  = 0;

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ── POST /api/chat  ──────────────────────────
// Body: { prompt: string, parameters: object }
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, parameters } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });

        const token = await getAccessToken();

        const ibmRes = await fetch(
            `${IBM_CONFIG.endpoint}/ml/v1/text/generation?version=2023-05-29`,
            {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept':        'application/json'
                },
                body: JSON.stringify({
                    model_id:   IBM_CONFIG.modelId,
                    project_id: IBM_CONFIG.projectId,
                    input:      prompt,
                    parameters: parameters || {
                        decoding_method:    'greedy',
                        max_new_tokens:     1024,
                        min_new_tokens:     10,
                        stop_sequences:     ['<|user|>', '<|system|>'],
                        repetition_penalty: 1.05
                    }
                })
            }
        );

        if (!ibmRes.ok) {
            const errText = await ibmRes.text();
            console.error('WatsonX error:', ibmRes.status, errText);
            return res.status(ibmRes.status).json({ error: errText });
        }

        const data = await ibmRes.json();
        res.json(data);

    } catch (err) {
        console.error('Proxy /api/chat error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── Internal: fetch + cache IAM token ────────
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiry - 60_000) return cachedToken;

    const iamRes = await fetch('https://iam.cloud.ibm.com/identity/token', {
        method:  'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':       'application/json'
        },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${IBM_CONFIG.apiKey}`
    });

    if (!iamRes.ok) {
        const txt = await iamRes.text();
        throw new Error(`IAM token error ${iamRes.status}: ${txt}`);
    }

    const data    = await iamRes.json();
    cachedToken   = data.access_token;
    tokenExpiry   = now + (data.expires_in * 1000);
    return cachedToken;
}

// ── Catch-all: serve index.html for SPA ──────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n  HealthAI server running at http://localhost:${PORT}\n`);
});
