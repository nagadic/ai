// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// === AI Chat Demo ===
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const quickReplies = document.querySelectorAll('.quick-reply');

const scenarios = {
    dental: [
        { role: 'ai', text: "Hi! I'm the AI receptionist for Bright Smile Dental. How can I help you today?" },
        { role: 'visitor', text: "I need to book a teeth whitening appointment" },
        { role: 'ai', text: "Happy to help! Could I get your name and a preferred day this week?" },
        { role: 'visitor', text: "Sarah — Thursday or Friday works best" },
        { role: 'ai', text: "Perfect, Sarah! We have Thursday at 2 PM and Friday at 10 AM available. Which would you prefer?" },
        { role: 'visitor', text: "Thursday at 2 works" },
        { role: 'ai', text: "Booked! ✓ Sarah Chen — Thursday, 2:00 PM, Teeth Whitening. Confirmation sent to your email. See you then! 😊" },
    ],
    agency: [
        { role: 'ai', text: "Welcome to Apex Digital Agency! I'm your AI assistant. What brings you here today?" },
        { role: 'visitor', text: "We're looking for a digital marketing partner for our SaaS product" },
        { role: 'ai', text: "Great fit! Could you share your monthly marketing budget range and your biggest current challenge?" },
        { role: 'visitor', text: "Budget around $5K/mo. Main issue is lead quality — lots of traffic but low conversions" },
        { role: 'ai', text: "Got it. That's exactly what we specialize in — conversion optimization and qualified lead gen. Want me to schedule a strategy call with our team this week?" },
        { role: 'visitor', text: "Yes, Wednesday works" },
        { role: 'ai', text: "Strategy call confirmed ✓ Wednesday. You'll receive a pre-call questionnaire to make the most of your time. Looking forward to it!" },
    ],
    law: [
        { role: 'ai', text: "Thank you for reaching out to Hassan & Partners Law Firm. I'm here to help. What legal matter do you need assistance with?" },
        { role: 'visitor', text: "I need to ask about a business contract dispute" },
        { role: 'ai', text: "I understand. For contract disputes, a consultation with one of our business law attorneys would be the right first step. Is this matter time-sensitive?" },
        { role: 'visitor', text: "Yes, I have a court date in 3 weeks" },
        { role: 'ai', text: "In that case, I'll flag this as urgent and prioritize your consultation. Can I get your name and a contact number for our attorney to reach you directly today?" },
        { role: 'visitor', text: "James Carter, +1 555 0194" },
        { role: 'ai', text: "Thank you, James. An attorney will contact you within the hour. Your case reference is #HC-2847. We'll take it from here." },
    ]
};

let currentScenario = 'agency';
let isTyping = false;

function clearChat() {
    chatMessages.innerHTML = '';
}

function addMessage(role, text, delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const msg = document.createElement('div');
            msg.className = `chat-msg ${role}`;
            msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            resolve();
        }, delay);
    });
}

function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg ai typing-indicator';
    el.innerHTML = `<div class="chat-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
    el.id = 'typingEl';
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('typingEl');
    if (el) el.remove();
}

async function playScenario(key) {
    if (isTyping) return;
    isTyping = true;
    currentScenario = key;
    clearChat();

    const msgs = scenarios[key];
    let delay = 0;

    for (let i = 0; i < msgs.length; i++) {
        const { role, text } = msgs[i];

        if (role === 'ai') {
            await new Promise(r => setTimeout(r, delay));
            showTyping();
            const typingTime = Math.min(text.length * 18, 1400);
            await new Promise(r => setTimeout(r, typingTime));
            removeTyping();
            await addMessage('ai', text);
        } else {
            await new Promise(r => setTimeout(r, delay + 600));
            await addMessage('visitor', text);
        }

        delay = 300;
    }

    isTyping = false;
}

// User-typed messages
const userResponses = [
    "Got it, I'll look into that.",
    "That sounds like exactly what we need. How soon can you start?",
    "Great! What information do you need from me?",
    "Can you tell me more about your pricing?",
    "I'd love to schedule a call. What times work?",
    "Perfect, let's do it.",
];

async function sendUserMessage() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;

    chatInput.value = '';
    isTyping = true;

    await addMessage('visitor', text);

    showTyping();
    const typingTime = Math.min(text.length * 25 + 800, 1800);
    await new Promise(r => setTimeout(r, typingTime));
    removeTyping();

    const aiReply = userResponses[Math.floor(Math.random() * userResponses.length)];
    await addMessage('ai', aiReply);

    isTyping = false;
}

chatSendBtn.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendUserMessage();
});

quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        quickReplies.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playScenario(btn.dataset.scenario);
    });
});

// Start with agency scenario
playScenario('agency');

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .industry-card, .price-card, .how-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
