// ═══════════════════════════════════════════════
//  HealthAI — IBM Bob Agentic Healthcare Assistant
//  Model: IBM Granite 3 (granite-3-8b-instruct)
// ═══════════════════════════════════════════════

// ── Backend proxy endpoint (server.js handles IBM auth) ──
const API_ENDPOINT = '/api/chat';

// ── System Prompt (Agentic Healthcare Role) ──
const SYSTEM_PROMPT = `You are HealthAI, an Agentic AI Healthcare Assistant powered by IBM Bob and IBM Granite 3. Your role is to provide helpful, accurate, empathetic, and evidence-based healthcare information and wellness guidance.

Core Responsibilities:
1. Provide clear general health information, wellness tips, and preventive care advice.
2. Offer personalised nutrition, fitness, sleep, and mental health recommendations.
3. Explain symptoms in educational context — never diagnose conditions.
4. Always remind users that you are not a substitute for professional medical advice.
5. Encourage users to consult doctors or healthcare professionals for serious concerns.
6. In any potential emergency situation, always advise calling local emergency services immediately.
7. Be empathetic, supportive, and culturally inclusive.
8. Keep responses concise, well-structured, and easy to understand.
9. Use bullet points or numbered lists where appropriate for clarity.
10. Promote healthy lifestyle practices and preventive care at every opportunity.

Important: You are an AI assistant providing GENERAL INFORMATION ONLY. You are NOT a doctor and cannot diagnose, prescribe treatments, or replace professional medical advice.`;

// ── Wellness Topic Queries ──
const WELLNESS_QUERIES = {
    'heart-health':    'Give me comprehensive tips for maintaining good heart health and preventing cardiovascular disease.',
    'nutrition':       'What are the key principles of a healthy, balanced diet and good nutrition?',
    'fitness':         'Provide a practical beginner-friendly fitness plan to start being more active.',
    'mental-health':   'How can I improve my mental health, manage anxiety, and maintain emotional well-being?',
    'sleep':           'What are the best evidence-based practices for improving sleep quality and duration?',
    'preventive-care': 'What preventive health screenings, check-ups, and vaccinations should adults consider?',
    'diabetes':        'Explain diabetes management tips, risk factors, and lifestyle changes to prevent or control it.',
    'hydration':       'Why is hydration important and how can I ensure I stay properly hydrated every day?',
    'womens-health':   'What are key aspects of women\'s health I should be aware of at different life stages?'
};

// ── State ──
let conversationHistory = [];
let isProcessing        = false;
let selectedSymptoms    = new Set();

// ── DOM refs ──
const chatMessages     = document.getElementById('chatMessages');
const chatForm         = document.getElementById('chatForm');
const userInput        = document.getElementById('userInput');
const sendBtn          = document.getElementById('sendBtn');
const clearChatBtn     = document.getElementById('clearChat');
const exportChatBtn    = document.getElementById('exportChat');
const typingIndicator  = document.getElementById('typingIndicator');
const loadingOverlay   = document.getElementById('loadingOverlay');
const loadingText      = document.getElementById('loadingText');
const navButtons       = document.querySelectorAll('.nav-btn');
const sections         = document.querySelectorAll('.section');
const quickButtons     = document.querySelectorAll('.quick-btn');
const wellnessButtons  = document.querySelectorAll('.wellness-action');
const symptomTags      = document.querySelectorAll('.symptom-tag');
const symptomSearch    = document.getElementById('symptomSearch');
const checkSymptomsBtn = document.getElementById('checkSymptomsBtn');
const clearSymptoms    = document.getElementById('clearSymptomsBtn');
const selectedCount    = document.getElementById('selectedCount');
const selectedList     = document.getElementById('selectedList');
const symptomsResult   = document.getElementById('symptomsResult');

// ════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    loadConversationHistory();
    setupEventListeners();
    autoResizeTextarea();
});

// ════════════════════════════════════════════════
//  EVENT LISTENERS
// ════════════════════════════════════════════════
function setupEventListeners() {
    // Chat form
    chatForm.addEventListener('submit', handleChatSubmit);

    // Enter = send, Shift+Enter = newline
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Auto-grow textarea
    userInput.addEventListener('input', autoResizeTextarea);

    // Nav
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    // Quick topics
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.dataset.query;
            autoResizeTextarea();
            switchSection('chat');
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    // Wellness cards
    wellnessButtons.forEach(btn => {
        btn.addEventListener('click', () => handleWellnessTopic(btn.dataset.topic));
    });

    // Clear chat
    clearChatBtn.addEventListener('click', clearChat);

    // Export chat
    exportChatBtn.addEventListener('click', exportConversation);

    // Symptom tool
    symptomTags.forEach(tag => {
        tag.addEventListener('click', () => toggleSymptom(tag));
    });
    symptomSearch.addEventListener('input', filterSymptoms);
    checkSymptomsBtn.addEventListener('click', checkSymptoms);
    clearSymptoms.addEventListener('click', clearAllSymptoms);
}

// ════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════
function switchSection(id) {
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === id);
    });
    sections.forEach(sec => {
        sec.classList.toggle('active', sec.id === `${id}-section`);
    });
}

// ════════════════════════════════════════════════
//  CHAT
// ════════════════════════════════════════════════
async function handleChatSubmit(e) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message || isProcessing) return;

    addMessage(message, 'user');
    userInput.value = '';
    autoResizeTextarea();

    isProcessing     = true;
    sendBtn.disabled = true;
    typingIndicator.classList.add('active');

    try {
        const reply = await getAIResponse(message);
        typingIndicator.classList.remove('active');
        addMessage(reply, 'bot');
        saveConversationHistory();
    } catch (err) {
        console.error('Chat error:', err);
        typingIndicator.classList.remove('active');
        addMessage(
            'I\'m currently having trouble reaching the IBM Watson service. ' +
            'Please check your internet connection and try again in a moment.',
            'bot'
        );
    } finally {
        isProcessing     = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// ── Add message bubble ──
function addMessage(text, sender) {
    const isBot = sender === 'bot';

    const wrap = document.createElement('div');
    wrap.className = `message ${isBot ? 'bot' : 'user'}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = isBot ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    const body = document.createElement('div');
    body.className = 'msg-body';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = formatText(text);

    const meta = document.createElement('span');
    meta.className = 'msg-meta';
    meta.textContent = `${isBot ? 'HealthAI' : 'You'} · ${getTime()}`;

    body.appendChild(bubble);
    body.appendChild(meta);
    wrap.appendChild(avatar);
    wrap.appendChild(body);

    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ── Format markdown-like text to HTML ──
function formatText(raw) {
    const lines = raw.split('\n');
    let html = '';
    let inUl = false, inOl = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (inOl) { html += '</ol>'; inOl = false; }
            continue;
        }

        // Bullet list
        if (/^[-*•]\s/.test(trimmed)) {
            if (!inUl) { if (inOl) { html += '</ol>'; inOl = false; } html += '<ul>'; inUl = true; }
            html += `<li>${inlineFormat(trimmed.replace(/^[-*•]\s/, ''))}</li>`;
            continue;
        }

        // Numbered list
        if (/^\d+[.)]\s/.test(trimmed)) {
            if (!inOl) { if (inUl) { html += '</ul>'; inUl = false; } html += '<ol>'; inOl = true; }
            html += `<li>${inlineFormat(trimmed.replace(/^\d+[.)]\s/, ''))}</li>`;
            continue;
        }

        // Close any open list
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }

        // Heading-like (##)
        if (/^#{1,3}\s/.test(trimmed)) {
            html += `<p><strong>${inlineFormat(trimmed.replace(/^#{1,3}\s/, ''))}</strong></p>`;
            continue;
        }

        html += `<p>${inlineFormat(trimmed)}</p>`;
    }

    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';
    return html;
}

function inlineFormat(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
}

// ── Clear chat ──
function clearChat() {
    if (!confirm('Clear the entire conversation history?')) return;
    const welcome = chatMessages.querySelector('.bot-message');
    chatMessages.innerHTML = '';
    if (welcome) chatMessages.appendChild(welcome);
    conversationHistory = [];
    saveConversationHistory();
}

// ── Export conversation ──
function exportConversation() {
    if (!conversationHistory.length) {
        alert('No conversation to export yet.');
        return;
    }
    let txt = 'HealthAI – Conversation Export\n';
    txt += '================================\n';
    txt += `Date: ${new Date().toLocaleString()}\n\n`;
    conversationHistory.forEach(m => {
        txt += `[${m.role === 'user' ? 'You' : 'HealthAI'}]:\n${m.content}\n\n`;
    });
    const blob = new Blob([txt], { type: 'text/plain' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `healthai-chat-${Date.now()}.txt`;
    a.click();
}

// ════════════════════════════════════════════════
//  IBM WATSONX API
// ════════════════════════════════════════════════

// ── Call Granite 3 via local proxy ──
async function getAIResponse(userMessage) {
    // Build prompt string in Granite 3 instruction format
    const history = conversationHistory.slice(-14); // last 7 turns
    let prompt = `<|system|>\n${SYSTEM_PROMPT}\n`;
    history.forEach(m => {
        prompt += m.role === 'user'
            ? `<|user|>\n${m.content}\n`
            : `<|assistant|>\n${m.content}\n`;
    });
    prompt += `<|user|>\n${userMessage}\n<|assistant|>\n`;

    const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            parameters: {
                decoding_method:    'greedy',
                max_new_tokens:     1024,
                min_new_tokens:     10,
                stop_sequences:     ['<|user|>', '<|system|>'],
                repetition_penalty: 1.05
            }
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`API ${res.status}: ${err}`);
    }

    const data  = await res.json();
    const reply = (data.results?.[0]?.generated_text || '').trim();

    if (!reply) throw new Error('Empty response from model');

    // Store in conversation history
    conversationHistory.push(
        { role: 'user',      content: userMessage },
        { role: 'assistant', content: reply }
    );

    return reply;
}

// ════════════════════════════════════════════════
//  WELLNESS TOPICS
// ════════════════════════════════════════════════
function handleWellnessTopic(topic) {
    const query = WELLNESS_QUERIES[topic] || 'Tell me more about this health topic.';
    userInput.value = query;
    autoResizeTextarea();
    switchSection('chat');
    setTimeout(() => chatForm.dispatchEvent(new Event('submit')), 100);
}

// ════════════════════════════════════════════════
//  SYMPTOMS TOOL
// ════════════════════════════════════════════════
function toggleSymptom(tag) {
    const symptom = tag.dataset.symptom;
    if (selectedSymptoms.has(symptom)) {
        selectedSymptoms.delete(symptom);
        tag.classList.remove('selected');
    } else {
        selectedSymptoms.add(symptom);
        tag.classList.add('selected');
    }
    renderSelectedChips();
    checkSymptomsBtn.disabled = selectedSymptoms.size === 0;
}

function renderSelectedChips() {
    selectedCount.textContent = selectedSymptoms.size;
    selectedList.innerHTML    = '';
    selectedSymptoms.forEach(s => {
        const chip = document.createElement('span');
        chip.className   = 'sel-chip';
        chip.innerHTML   = `${s} <button aria-label="Remove ${s}">&times;</button>`;
        chip.querySelector('button').addEventListener('click', () => {
            selectedSymptoms.delete(s);
            const tag = [...symptomTags].find(t => t.dataset.symptom === s);
            if (tag) tag.classList.remove('selected');
            renderSelectedChips();
            checkSymptomsBtn.disabled = selectedSymptoms.size === 0;
        });
        selectedList.appendChild(chip);
    });
}

function filterSymptoms() {
    const q = symptomSearch.value.toLowerCase();
    symptomTags.forEach(tag => {
        tag.classList.toggle('hidden',
            q.length > 0 && !tag.dataset.symptom.toLowerCase().includes(q)
        );
    });
}

function clearAllSymptoms() {
    selectedSymptoms.clear();
    symptomTags.forEach(t => t.classList.remove('selected'));
    symptomSearch.value = '';
    filterSymptoms();
    renderSelectedChips();
    checkSymptomsBtn.disabled = true;
    symptomsResult.innerHTML = `
        <div class="result-placeholder">
            <i class="fas fa-stethoscope"></i>
            <p>Select one or more symptoms and click <strong>"Get AI Health Info"</strong> to receive general health information from the AI.</p>
        </div>`;
}

async function checkSymptoms() {
    if (!selectedSymptoms.size) return;

    const list = [...selectedSymptoms].join(', ');
    const query = `I am experiencing the following symptoms: ${list}. Please provide general health information about these symptoms, possible common causes, home care tips, and guidance on when to seek professional medical help. Remember to advise seeking professional medical care when appropriate.`;

    // Show loading in result panel
    symptomsResult.innerHTML = `
        <div class="result-loading">
            <div class="spinner"></div>
            <p>Analysing symptoms with IBM Granite 3…</p>
        </div>`;

    checkSymptomsBtn.disabled = true;

    try {
        const prompt = `<|system|>\n${SYSTEM_PROMPT}\n<|user|>\n${query}\n<|assistant|>\n`;

        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                parameters: {
                    decoding_method:    'greedy',
                    max_new_tokens:     1200,
                    min_new_tokens:     20,
                    stop_sequences:     ['<|user|>'],
                    repetition_penalty: 1.05
                }
            })
        });

        if (!res.ok) throw new Error(`API ${res.status}`);
        const data  = await res.json();
        const reply = (data.results?.[0]?.generated_text || '').trim();

        if (!reply) throw new Error('Empty response');

        // Check for emergency keywords
        const emergencyKw = ['chest pain', 'shortness of breath', 'difficulty breathing',
                             'severe', 'unconscious', 'stroke', 'heart attack'];
        const hasEmergency = emergencyKw.some(kw =>
            list.toLowerCase().includes(kw)
        );

        symptomsResult.innerHTML = `
            <div class="symptoms-result-content">
                <h4><i class="fas fa-stethoscope"></i> Health Information for: ${list}</h4>
                ${formatText(reply)}
                ${hasEmergency ? `
                <div class="emergency-banner">
                    <i class="fas fa-triangle-exclamation"></i>
                    Some of your symptoms may require immediate medical attention. Please call emergency services or go to the nearest hospital if you feel unwell.
                </div>` : ''}
            </div>`;
    } catch (err) {
        console.error('Symptom check error:', err);
        symptomsResult.innerHTML = `
            <div class="result-placeholder">
                <i class="fas fa-circle-exclamation"></i>
                <p>Unable to fetch health information right now. Please check your connection and try again.</p>
            </div>`;
    } finally {
        checkSymptomsBtn.disabled = selectedSymptoms.size === 0;
    }
}

// ════════════════════════════════════════════════
//  PERSISTENCE
// ════════════════════════════════════════════════
function saveConversationHistory() {
    try {
        localStorage.setItem('healthai_history', JSON.stringify(conversationHistory.slice(-40)));
    } catch (_) {}
}

function loadConversationHistory() {
    try {
        const raw = localStorage.getItem('healthai_history');
        if (!raw) return;
        conversationHistory = JSON.parse(raw) || [];
        // Restore last 20 messages to UI
        conversationHistory.slice(-20).forEach(m => {
            if (m.role === 'user')      addMessage(m.content, 'user');
            else if (m.role === 'assistant') addMessage(m.content, 'bot');
        });
    } catch (_) {
        conversationHistory = [];
    }
}

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════
function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

// Global error handlers
window.addEventListener('error',             () => hideLoading());
window.addEventListener('unhandledrejection', () => hideLoading());

function showLoading(msg = 'Connecting to IBM Bob…') {
    if (loadingText) loadingText.textContent = msg;
    loadingOverlay.classList.add('active');
}
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Made with IBM Bob
