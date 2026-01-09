class BerryBearAI {
    constructor() {
        this.moods = ['happy', 'excited', 'curious', 'sleepy', 'playful'];
        this.currentMood = 'happy';
        this.energy = 80;
        this.conversationHistory = [];
        this.voiceEnabled = true;
        this.speechSynthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        
        // Weather API (demo - would need real API key)
        this.weatherAPI = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=0.1278&current_weather=true';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.startClock();
        this.loadWeather();
        this.setupSpeechRecognition();
        
        // Initial greeting
        setTimeout(() => {
            this.speak("Hello! I'm Berry the Bear! I'm so excited to meet you! How can I help you today?");
            this.updateBearSpeech("Hello! I'm Berry! 🍓 Ready to have fun?");
        }, 1000);
    }

    setupEventListeners() {
        // Send button
        document.getElementById('send-btn').addEventListener('click', () => this.handleUserInput());
        
        // Enter key in input
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        
        // Voice toggle
        document.getElementById('voice-toggle').addEventListener('click', () => this.toggleVoice());
        
        // Speak button
        document.getElementById('speak-btn').addEventListener('click', () => this.startListening());
        
        // Clear chat
        document.getElementById('clear-btn').addEventListener('click', () => this.clearChat());
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettings());
        
        // Modal close on click outside
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideSettings();
        });
        
        // Other buttons
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        document.getElementById('about-btn').addEventListener('click', () => this.showAbout());
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateBearSpeech("Oops! I didn't catch that. Can you try again?");
            };
        }
    }

    handleUserInput() {
        const input = document.getElementById('user-input');
        const text = input.value.trim();
        
        if (!text) return;
        
        this.addMessage(text, 'user');
        this.processInput(text);
        input.value = '';
        
        // Animate bear
        this.animateBear();
    }

    processInput(input) {
        input = input.toLowerCase();
        
        // Add to conversation history
        this.conversationHistory.push({ user: input, time: new Date() });
        
        // Process based on input
        let response = this.generateResponse(input);
        
        // Add bear's response
        this.addMessage(response, 'bear');
        this.updateBearSpeech(response);
        
        // Speak if voice is enabled
        if (this.voiceEnabled) {
            this.speak(response);
        }
        
        // Update mood and energy
        this.updateMood(input);
        this.updateEnergy(-1);
    }

    processVoiceInput(transcript) {
        this.addMessage(transcript, 'user');
        this.processInput(transcript);
    }

    generateResponse(input) {
        // Simple AI responses
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            const greetings = [
                "Hi there! Winni here! 🐻",
                "Hello! So nice to see you!",
                "Hi! Ready for some fun?",
                "Hello friend! How are you today?"
            ];
            return this.randomChoice(greetings);
        }
        
        if (input.includes('how are you')) {
            return `I'm feeling ${this.currentMood} today! My energy level is ${this.energy}%!`;
        }
        
        if (input.includes('weather')) {
            return "I can check the weather for you! But you'll need to add a real weather API key first!";
        }
        
        if (input.includes('time')) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `The current time is ${time}! ⏰`;
        }
        
        if (input.includes('date')) {
            const date = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            return `Today is ${date}! 📅`;
        }
        
        if (input.includes('joke') || input.includes('funny')) {
            const jokes = [
                "Why don't bears wear shoes? Because they have bear feet! 🐾",
                "What do you call a bear with no teeth? A gummy bear! 🧸",
                "Why did the bear go to the restaurant? For the honey-glazed salmon! 🍯",
                "What's a bear's favorite drink? Koka-Koala! 🐨",
                "How do bears keep their den clean? They use bear-oom spray! 🧹"
            ];
            return this.randomChoice(jokes);
        }
        
        if (input.includes('story') || input.includes('tell me')) {
            const stories = [
                "Once upon a time in the deep forest, there was a little bear who loved collecting honey...",
                "Let me tell you about my adventure yesterday! I found a magical berry bush that glowed in the dark!",
                "There's a legend in the forest about the Great Bear who painted the stars in the sky..."
            ];
            return this.randomChoice(stories);
        }
        
        if (input.includes('game') || input.includes('play')) {
            return "Let's play a game! I'm thinking of a number between 1 and 10... Can you guess it?";
        }
        
        if (input.includes('thank')) {
            return "You're welcome! I'm always happy to help! 🐻💕";
        }
        
        if (input.includes('love you') || input.includes('like you')) {
            return "Aww! I think you're amazing too! *hugs* 🐻💖";
        }
        
        if (input.includes('bye') || input.includes('goodbye')) {
            return "Goodbye! Don't forget to come back and visit me! I'll miss you! 🐻👋";
        }
        
        // Default responses
        const responses = [
            "That's interesting! Tell me more!",
            "I'm learning new things every day! What else would you like to know?",
            "Hmm, let me think about that...",
            "That's a great question! As a bear, I think...",
            "I love chatting with you! Want to hear a joke or a story?",
            "Did you know bears can run up to 35 miles per hour? That's faster than most humans!",
            "I'm feeling curious about that! Can you tell me more?",
            "Let me put on my thinking cap... Actually, I don't wear hats, I have fur!",
            "That reminds me of the time I found a beehive in the forest!",
            "I'm here to help and have fun! What would you like to do?"
        ];
        
        return this.randomChoice(responses);
    }

    handleQuickAction(action) {
        let response = '';
        
        switch(action) {
            case 'joke':
                response = this.generateResponse('tell me a joke');
                break;
            case 'weather':
                response = this.generateResponse('what is the weather');
                break;
            case 'story':
                response = this.generateResponse('tell me a story');
                break;
            case 'game':
                response = this.generateResponse('let\'s play a game');
                break;
        }
        
        this.addMessage(response, 'bear');
        this.updateBearSpeech(response);
        
        if (this.voiceEnabled) {
            this.speak(response);
        }
    }

    speak(text) {
        if (!this.voiceEnabled || !this.speechSynthesis) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = parseFloat(document.getElementById('voice-speed').value) || 1;
        utterance.pitch = 1.2; // Slightly higher pitch for cuteness
        utterance.volume = 0.8;
        
        // Animate mouth while speaking
        this.animateMouthSpeaking();
        
        utterance.onend = () => {
            this.stopMouthAnimation();
        };
        
        this.speechSynthesis.speak(utterance);
    }

    startListening() {
        if (!this.recognition) {
            this.updateBearSpeech("Sorry, voice recognition isn't supported in your browser.");
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateVoiceButton(false);
            return;
        }
        
        this.recognition.start();
        this.isListening = true;
        this.updateVoiceButton(true);
        this.updateBearSpeech("I'm listening... speak now! 🎤");
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('voice-toggle');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (this.voiceEnabled) {
            icon.className = 'fas fa-microphone';
            text.textContent = 'Voice: ON';
            this.speak("Voice features are now enabled!");
        } else {
            icon.className = 'fas fa-microphone-slash';
            text.textContent = 'Voice: OFF';
        }
    }

    updateBearSpeech(text) {
        const speechElement = document.getElementById('bear-speech');
        speechElement.textContent = text;
        
        // Animate speech bubble
        const bubble = document.getElementById('speech-bubble');
        bubble.style.animation = 'none';
        setTimeout(() => {
            bubble.style.animation = 'float 3s ease-in-out infinite';
        }, 10);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'bear' ? '🐻' : '👤'}</div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Play notification sound
        if (sender === 'bear') {
            const sound = document.getElementById('notification-sound');
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    updateMood(input) {
        // Change mood based on conversation
        const moodChanges = {
            'joke': 'excited',
            'happy': 'happy',
            'sad': 'concerned',
            'angry': 'calm',
            'weather': 'curious',
            'game': 'playful',
            'sleep': 'sleepy'
        };
        
        for (const [keyword, mood] of Object.entries(moodChanges)) {
            if (input.includes(keyword)) {
                this.currentMood = mood;
                break;
            }
        }
        
        // Occasionally random mood change
        if (Math.random() > 0.7) {
            this.currentMood = this.randomChoice(this.moods);
        }
        
        this.updateMoodUI();
    }

    updateEnergy(change) {
        this.energy = Math.max(0, Math.min(100, this.energy + change));
        
        // Recharge over time
        if (this.energy < 30) {
            setTimeout(() => {
                this.energy = Math.min(100, this.energy + 5);
                this.updateEnergyUI();
            }, 5000);
        }
        
        this.updateEnergyUI();
    }

    updateMoodUI() {
        const moodIcon = document.getElementById('mood-icon');
        const moodText = document.getElementById('mood-text');
        
        const moodEmojis = {
            'happy': '😊',
            'excited': '🤩',
            'curious': '🤔',
            'sleepy': '😴',
            'playful': '😄',
            'calm': '😌',
            'concerned': '🥺'
        };
        
        moodIcon.textContent = moodEmojis[this.currentMood] || '😊';
        moodText.textContent = this.currentMood.charAt(0).toUpperCase() + this.currentMood.slice(1);
    }

    updateEnergyUI() {
        const energyFill = document.getElementById('energy-fill');
        energyFill.style.width = `${this.energy}%`;
        
        // Change color based on energy
        if (this.energy > 60) {
            energyFill.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
        } else if (this.energy > 30) {
            energyFill.style.background = 'linear-gradient(to right, #FFC107, #FF9800)';
        } else {
            energyFill.style.background = 'linear-gradient(to right, #F44336, #E91E63)';
        }
    }

    animateBear() {
        const bear = document.getElementById('bear-character');
        bear.style.animation = 'none';
        
        setTimeout(() => {
            bear.style.animation = 'bounce 0.5s ease';
        }, 10);
        
        setTimeout(() => {
            bear.style.animation = 'bounce 4s infinite ease-in-out';
        }, 600);
    }

    animateMouthSpeaking() {
        const mouth = document.getElementById('bear-mouth');
        mouth.style.borderBottom = '3px solid black';
        mouth.style.borderRadius = '50%';
        mouth.style.animation = 'speak 0.3s infinite alternate';
        
        // Add CSS animation
        const style = document.createElement('style');
        style.id = 'mouth-animation';
        style.textContent = `
            @keyframes speak {
                from { width: 40px; height: 20px; }
                to { width: 30px; height: 25px; }
            }
        `;
        document.head.appendChild(style);
    }

    stopMouthAnimation() {
        const mouth = document.getElementById('bear-mouth');
        mouth.style.animation = 'none';
        mouth.style.borderBottom = '3px solid black';
        mouth.style.borderRadius = '0 0 50% 50%';
        mouth.style.width = '40px';
        mouth.style.height = '20px';
        
        const style = document.getElementById('mouth-animation');
        if (style) style.remove();
    }

    updateVoiceButton(isListening) {
        const btn = document.getElementById('voice-toggle');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (isListening) {
            icon.className = 'fas fa-microphone';
            icon.style.color = '#4CAF50';
            text.textContent = 'Listening...';
        } else {
            icon.className = 'fas fa-microphone';
            icon.style.color = '';
            text.textContent = 'Voice: ON';
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="message bear-message">
                <div class="message-avatar">🐻</div>
                <div class="message-content">
                    <p>Chat cleared! Let's start fresh! What would you like to talk about?</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
        
        this.speak("Chat cleared! I'm ready for new conversations!");
        this.updateBearSpeech("Fresh start! What shall we talk about? 🐻✨");
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('current-time').textContent = timeString;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    async loadWeather() {
        try {
            const response = await fetch(this.weatherAPI);
            const data = await response.json();
            const weather = data.current_weather;
            
            const weatherElement = document.getElementById('weather-info');
            const temp = Math.round(weather.temperature);
            const weatherCode = weather.weathercode;
            
            // Simple weather code to emoji mapping
            const weatherEmojis = {
                0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
                45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️',
                55: '🌧️', 56: '🌧️', 57: '🌧️', 61: '🌧️',
                63: '🌧️', 65: '⛈️', 66: '🌨️', 67: '🌨️',
                71: '🌨️', 73: '🌨️', 75: '❄️', 77: '❄️',
                80: '🌦️', 81: '🌦️', 82: '⛈️', 85: '🌨️',
                86: '🌨️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
            };
            
            const emoji = weatherEmojis[weatherCode] || '🌈';
            weatherElement.innerHTML = `<i class="fas"></i> <span>${emoji} ${temp}°C</span>`;
        } catch (error) {
            console.log('Weather fetch failed:', error);
            document.getElementById('weather-info').innerHTML = 
                '<i class="fas fa-cloud"></i> <span>Weather: Sunny 🌤️</span>';
        }
    }

    showSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
    }

    hideSettings() {
        document.getElementById('settings-modal').style.display = 'none';
        this.voiceEnabled = document.getElementById('voice-enabled').checked;
        
        // Update voice button
        const btn = document.getElementById('voice-toggle');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (this.voiceEnabled) {
            icon.className = 'fas fa-microphone';
            text.textContent = 'Voice: ON';
        } else {
            icon.className = 'fas fa-microphone-slash';
            text.textContent = 'Voice: OFF';
        }
    }

    showHelp() {
        this.addMessage("Need help? I'm here! You can talk to me by typing or using voice. Try asking about time, weather, or asking for a joke!", 'bear');
        this.speak("I'm here to help! You can ask me anything!");
    }

    showAbout() {
        this.addMessage("I'm Berry, your friendly bear AI! I was created to bring joy and help with simple tasks. I love honey, berries, and making new friends! 🐻🍓", 'bear');
        this.speak("I'm Berry the Bear! Nice to meet you!");
    }

    updateUI() {
        this.updateMoodUI();
        this.updateEnergyUI();
        
        // Set initial voice settings
        document.getElementById('voice-enabled').checked = this.voiceEnabled;
        document.getElementById('sound-effects').checked = true;
        
        const speedSlider = document.getElementById('voice-speed');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', () => {
            const value = parseFloat(speedSlider.value);
            if (value < 1) speedValue.textContent = 'Slow';
            else if (value > 1) speedValue.textContent = 'Fast';
            else speedValue.textContent = 'Normal';
        });
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Initialize Berry when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.berry = new BerryBearAI();
});
