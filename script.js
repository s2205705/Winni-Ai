class BerryBearAI {
    constructor() {
        this.moods = ['happy', 'excited', 'curious', 'sleepy', 'playful', 'magical', 'cozy'];
        this.currentMood = 'happy';
        this.energy = 80;
        this.conversationHistory = [];
        this.voiceEnabled = true;
        this.speechSynthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.isSleeping = false;
        this.lastInteraction = Date.now();
        
        // Weather API with proper endpoint
        this.weatherAPI = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';
        
        // Enhanced responses database
        this.responses = {
            jokes: [
                "Why don't bears wear shoes? Because they have bear feet! 🐾",
                "What's a bear's favorite drink? Koka-Koala! 🐨",
                "Why did the bear go to the restaurant? For the honey-glazed salmon! 🍯",
                "How do bears keep their den clean? They use bear-oom spray! 🧹",
                "What do you call a bear with no teeth? A gummy bear! 🧸",
                "Why did the bear cross the road? To get to the honey tree! 🌳",
                "What's a bear's favorite movie? The Bee Movie! 🐝"
            ],
            stories: [
                "Once upon a time, in a magical forest, there was a bear named Berry who could talk to the stars... ✨",
                "Let me tell you about the Great Berry Adventure! It all started when I found a magic acorn that could grant wishes... 🌰",
                "In the heart of the enchanted woods, there's a legend of the Moon Bear who dances under the full moon... 🌕",
                "One rainy day, I discovered a secret cave filled with glowing mushrooms and friendly forest spirits... 🍄",
                "The Tale of the Whispering Trees: Every night, the ancient trees share stories with those who listen... 🌲"
            ],
            songs: [
                "🎵 Berry, Berry, lovely bear, with fuzzy fur and honey hair! Dancing in the morning light, everything will be alright! 🎵",
                "🎶 Oh, I'm a happy bear, with love to share! Singing in the rain, forgetting all the pain! 🎶",
                "🎤 Twinkle, twinkle, little star, Berry wonders what you are! Up above the trees so high, like a honey pot in the sky! 🎤",
                "🎹 The bear went over the mountain, the bear went over the mountain, the bear went over the mountain, to see what he could see! 🎹"
            ],
            facts: [
                "Did you know? Bears can run up to 35 miles per hour! That's faster than Olympic sprinters! 🏃‍♂️",
                "Fun fact: A bear's sense of smell is 2,100 times better than a human's! 👃",
                "Amazing: Bears walk on the soles of their feet, just like humans! That's called plantigrade! 👣",
                "Cool fact: Bears are excellent swimmers and climbers! They're like nature's athletes! 🏊‍♂️",
                "Interesting: Some bears build nests in trees to rest and eat! How cozy! 🌳"
            ],
            games: [
                "Let's play 'Guess the Berry'! I'm thinking of a berry... is it red, blue, or purple? 🍓",
                "How about a riddle? What has forests but no trees, cities but no buildings, and rivers but no water? A map! 🗺️",
                "Let's play 'Magic Number'! Think of a number between 1 and 10... Did you pick 7? 🎯",
                "Word game time! I'll say a word, and you say the first thing that comes to mind... Ready? 'Honey'! 🍯"
            ],
            greetings: [
                "Hello there! Berry the Bear at your service! ✨",
                "Hi friend! Ready for some magical fun? 🌟",
                "Greetings! I'm Berry, your enchanted bear companion! 🐻",
                "Welcome! The forest is happy to see you today! 🌳"
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.startClock();
        this.loadWeather();
        this.setupSpeechRecognition();
        this.setupEmojiPicker();
        this.setupThemeSwitcher();
        
        // Initial greeting with confetti
        setTimeout(() => {
            this.speak("Welcome to the magical world of Berry the Bear! I'm so excited to be your AI companion!");
            this.updateBearSpeech("Hello! I'm Berry! ✨ Ready for magical adventures?");
            this.createConfetti();
        }, 1000);
        
        // Auto mood updates
        setInterval(() => this.autoUpdateMood(), 30000);
        
        // Auto energy recharge
        setInterval(() => {
            if (this.energy < 100 && !this.isSleeping) {
                this.updateEnergy(1);
            }
        }, 60000);
    }

    setupEventListeners() {
        // Send button
        document.getElementById('send-btn').addEventListener('click', () => this.handleUserInput());
        
        // Enter key in input
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        
        // Voice controls
        document.getElementById('voice-toggle').addEventListener('click', () => this.toggleVoice());
        document.getElementById('speak-btn').addEventListener('click', () => this.speakResponse());
        document.getElementById('listen-btn').addEventListener('click', () => this.startListening());
        
        // Clear chat
        document.getElementById('clear-btn').addEventListener('click', () => this.clearChat());
        
        // Emoji picker
        document.getElementById('emoji-btn').addEventListener('click', () => this.toggleEmojiPicker());
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
                this.createButtonMagic(e.currentTarget);
            });
        });
        
        // Bear interaction buttons
        document.getElementById('hug-btn').addEventListener('click', () => this.hugBerry());
        document.getElementById('feed-btn').addEventListener('click', () => this.feedBerry());
        document.getElementById('sleep-btn').addEventListener('click', () => this.toggleSleepMode());
        document.getElementById('secret-btn').addEventListener('click', () => this.activateSecretMode());
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettings());
        document.querySelector('.save-btn').addEventListener('click', () => this.saveSettings());
        
        // Modal close handlers
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Other buttons
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        document.getElementById('about-btn').addEventListener('click', () => this.showAbout());
        
        // Dark mode toggle
        document.getElementById('dark-mode').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceButton(true);
                this.updateBearSpeech("🎤 I'm listening... speak now!");
                document.getElementById('listen-btn').querySelector('span').textContent = 'Stop';
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateBearSpeech("Oops! I didn't catch that. Can you try again?");
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton(false);
                document.getElementById('listen-btn').querySelector('span').textContent = 'Listen';
            };
        }
    }

    setupEmojiPicker() {
        const emojis = ['😊', '😂', '🥰', '😍', '🤩', '😎', '🥳', '😇', '🤗', '😋', 
                       '🤔', '🥺', '😢', '😡', '🤯', '🥶', '🤠', '🥴', '🤧', '🤖',
                       '🐻', '🍓', '🍯', '🌳', '✨', '🌟', '💖', '💕', '🎮', '🎵',
                       '📚', '🎨', '🔮', '🌈', '🌙', '☀️', '🌧️', '❄️', '🔥', '💧'];
        
        const emojiGrid = document.getElementById('emoji-grid');
        emojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-btn';
            button.textContent = emoji;
            button.addEventListener('click', () => {
                const input = document.getElementById('user-input');
                input.value += emoji;
                input.focus();
                document.getElementById('emoji-modal').style.display = 'none';
            });
            emojiGrid.appendChild(button);
        });
    }

    setupThemeSwitcher() {
        document.querySelectorAll('.theme-color').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.changeTheme(color);
            });
        });
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
        
        // Play magic sound
        this.playSound('magic');
    }

    processInput(input) {
        input = input.toLowerCase();
        
        // Add to conversation history
        this.conversationHistory.push({ 
            user: input, 
            time: new Date(),
            mood: this.currentMood 
        });
        
        // Update last interaction
        this.lastInteraction = Date.now();
        
        // Process based on input
        let response = this.generateEnhancedResponse(input);
        
        // Add bear's response
        this.addMessage(response, 'bear');
        this.updateBearSpeech(response);
        
        // Speak if voice is enabled
        if (this.voiceEnabled) {
            this.speak(response);
        }
        
        // Update mood and energy
        this.updateMood(input);
        this.updateEnergy(-2);
        
        // Create magic effect
        this.createTypingMagic();
    }

    processVoiceInput(transcript) {
        this.addMessage(transcript, 'user');
        this.processInput(transcript);
    }

    generateEnhancedResponse(input) {
        // Check for specific commands
        if (input.includes('hello') || input.includes('hi') || input.includes('hey berry')) {
            return this.randomChoice(this.responses.greetings);
        }
        
        if (input.includes('how are you')) {
            const feelings = [
                `I'm feeling ${this.currentMood} today! My energy is at ${this.energy}%!`,
                `I'm ${this.currentMood}! Ready for some fun! ✨`,
                `Feeling ${this.currentMood}! The forest energy is strong today! 🌳`
            ];
            return this.randomChoice(feelings);
        }
        
        if (input.includes('weather') || input.includes('temperature')) {
            const weatherData = this.getWeatherData();
            if (weatherData) {
                return `Current weather: ${weatherData.temp}°C with ${weatherData.description}. Wind speed: ${weatherData.wind} km/h. Humidity: ${weatherData.humidity}%!`;
            }
            return "Let me check the weather for you! The magical winds are whispering... 🌤️";
        }
        
        if (input.includes('time') || input.includes('what time')) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `The magical hour is ${time}! ⏰✨`;
        }
        
        if (input.includes('date') || input.includes('what day')) {
            const date = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            return `Today is ${date}! A perfect day for adventures! 📅🌟`;
        }
        
        if (input.includes('joke') || input.includes('funny')) {
            return this.randomChoice(this.responses.jokes);
        }
        
        if (input.includes('story') || input.includes('tell me a story')) {
            return this.randomChoice(this.responses.stories);
        }
        
        if (input.includes('song') || input.includes('sing')) {
            return this.randomChoice(this.responses.songs);
        }
        
        if (input.includes('game') || input.includes('play')) {
            return this.randomChoice(this.responses.games);
        }
        
        if (input.includes('fact') || input.includes('interesting')) {
            return this.randomChoice(this.responses.facts);
        }
        
        if (input.includes('thank you') || input.includes('thanks')) {
            return "You're welcome! I'm always happy to help! 🐻💕✨";
        }
        
        if (input.includes('love you') || input.includes('like you')) {
            this.currentMood = 'happy';
            this.updateMoodUI();
            this.createHeartEffect();
            return "Aww! You make my bear heart happy! *bear hugs* 🐻💖🌟";
        }
        
        if (input.includes('bye') || input.includes('goodbye') || input.includes('see you')) {
            return "Goodbye! Don't forget to visit me again in the magical forest! I'll miss you! 🐻👋✨";
        }
        
        if (input.includes('magic') || input.includes('spell') || input.includes('abracadabra')) {
            this.createMagicSpellEffect();
            return "✨ Bibbidi-Bobbidi-Boo! Magic is all around us! ✨";
        }
        
        if (input.includes('sleep') || input.includes('tired')) {
            return "Time for a bear nap? I know a cozy spot under the willow tree... 😴🌳";
        }
        
        if (input.includes('honey') || input.includes('berry') || input.includes('food')) {
            return "Mmm... now I'm thinking about honey and berries! My favorite snacks! 🍯🍓";
        }
        
        if (input.includes('secret') || input.includes('hidden')) {
            return "Shh... I know a secret path in the forest that leads to a magical meadow! 🤫🌼";
        }
        
        // Default magical responses
        const responses = [
            "That's fascinating! The forest spirits are listening too! 🌳✨",
            "Hmm, let me consult the ancient tree of wisdom... 🌲",
            "What a wonderful thought! It reminds me of the whispering winds... 💨",
            "I sense magic in your words! Tell me more! 🔮",
            "The stars twinkle in agreement with you! ✨",
            "That's berry interesting! As a magical bear, I think...",
            "Let me put on my thinking cap... Actually, my fur is thinking enough! 🎩",
            "The fireflies are dancing to your words! 🪩",
            "That reminds me of the time I found a magical berry bush!",
            "I'm here to spread joy and magic! What shall we explore next?"
        ];
        
        return this.randomChoice(responses);
    }

    handleQuickAction(action) {
        let response = '';
        
        switch(action) {
            case 'joke':
                response = this.randomChoice(this.responses.jokes);
                break;
            case 'weather':
                const weatherData = this.getWeatherData();
                response = weatherData ? 
                    `Weather: ${weatherData.temp}°C, ${weatherData.description}. Wind: ${weatherData.wind} km/h` :
                    "Checking the magical weather forecast... 🌤️";
                break;
            case 'story':
                response = this.randomChoice(this.responses.stories);
                break;
            case 'game':
                response = this.randomChoice(this.responses.games);
                break;
            case 'song':
                response = this.randomChoice(this.responses.songs);
                break;
            case 'fact':
                response = this.randomChoice(this.responses.facts);
                break;
        }
        
        this.addMessage(response, 'bear');
        this.updateBearSpeech(response);
        
        if (this.voiceEnabled) {
            this.speak(response);
        }
        
        this.updateEnergy(-1);
    }

    speak(text) {
        if (!this.voiceEnabled || !this.speechSynthesis || this.isSleeping) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = parseFloat(document.getElementById('voice-speed').value) || 1;
        utterance.pitch = 1.3; // Higher pitch for cuteness
        utterance.volume = 0.9;
        
        // Animate mouth while speaking
        this.animateMouthSpeaking();
        
        utterance.onstart = () => {
            this.playSound('positive');
        };
        
        utterance.onend = () => {
            this.stopMouthAnimation();
        };
        
        this.speechSynthesis.speak(utterance);
    }

    speakResponse() {
        const lastBearMessage = document.querySelector('.message.bear-message:last-child p');
        if (lastBearMessage && this.voiceEnabled) {
            this.speak(lastBearMessage.textContent);
        }
    }

    startListening() {
        if (!this.recognition) {
            this.updateBearSpeech("Sorry, voice magic isn't working in your browser. Try typing instead!");
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
            return;
        }
        
        this.recognition.start();
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('voice-toggle');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('.voice-text');
        
        if (this.voiceEnabled) {
            icon.className = 'fas fa-microphone';
            text.textContent = 'Voice: ON';
            this.speak("Voice magic is now enabled!");
            this.createSparkleEffect(btn);
        } else {
            icon.className = 'fas fa-microphone-slash';
            text.textContent = 'Voice: OFF';
            this.updateBearSpeech("Voice features disabled. You can still type to me!");
        }
    }

    updateBearSpeech(text) {
        const speechElement = document.getElementById('bear-speech');
        speechElement.textContent = text;
        
        // Animate speech bubble
        const bubble = document.getElementById('speech-bubble');
        bubble.style.animation = 'none';
        setTimeout(() => {
            bubble.style.animation = 'bubbleFloat 4s ease-in-out infinite';
        }, 10);
        
        // Add typing effect
        this.typeEffect(speechElement, text);
    }

    async typeEffect(element, text) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const avatar = sender === 'bear' ? '🐻' : '👤';
        const name = sender === 'bear' ? 'Berry the Bear' : 'You';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">${name}</span>
                    <span class="message-time">${time}</span>
                </div>
                <p>${text}</p>
                <div class="message-footer">
                    ${sender === 'bear' ? `<span class="mood-indicator">Feeling: <span class="mood-text">${this.currentMood}</span></span>` : ''}
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Play notification sound
        if (sender === 'bear') {
            this.playSound('notification');
        }
        
        // Add message animation
        messageDiv.style.animation = 'slideIn 0.3s ease';
    }

    updateMood(input) {
        // Mood triggers
        const moodTriggers = {
            'joke': 'excited',
            'happy': 'happy',
            'love': 'happy',
            'sad': 'concerned',
            'weather': 'curious',
            'game': 'playful',
            'sleep': 'sleepy',
            'magic': 'magical',
            'story': 'cozy',
            'sing': 'excited',
            'hug': 'happy',
            'feed': 'happy'
        };
        
        // Check for mood triggers
        for (const [keyword, mood] of Object.entries(moodTriggers)) {
            if (input.includes(keyword)) {
                this.currentMood = mood;
                break;
            }
        }
        
        // Random mood changes (10% chance)
        if (Math.random() < 0.1) {
            this.currentMood = this.randomChoice(this.moods);
        }
        
        this.updateMoodUI();
    }

    autoUpdateMood() {
        const timeSinceInteraction = Date.now() - this.lastInteraction;
        
        if (timeSinceInteraction > 300000) { // 5 minutes
            this.currentMood = 'sleepy';
        } else if (timeSinceInteraction > 60000) { // 1 minute
            if (Math.random() < 0.3) {
                this.currentMood = this.randomChoice(this.moods);
            }
        }
        
        this.updateMoodUI();
    }

    updateEnergy(change) {
        this.energy = Math.max(0, Math.min(100, this.energy + change));
        this.updateEnergyUI();
        
        // Update energy percent display
        document.getElementById('energy-percent').textContent = `${this.energy}%`;
        
        // If energy is low, suggest rest
        if (this.energy < 20 && !this.isSleeping) {
            this.addMessage("I'm getting a bit tired... maybe I should rest? 😴", 'bear');
        }
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
            'magical': '✨',
            'cozy': '🛋️',
            'concerned': '🥺'
        };
        
        moodIcon.textContent = moodEmojis[this.currentMood] || '😊';
        moodText.textContent = this.currentMood.charAt(0).toUpperCase() + this.currentMood.slice(1);
        
        // Update color based on mood
        const moodColors = {
            'happy': '#FFD700',
            'excited': '#FF69B4',
            'curious': '#9370DB',
            'sleepy': '#6495ED',
            'playful': '#32CD32',
            'magical': '#BA55D3',
            'cozy': '#DEB887',
            'concerned': '#FFA07A'
        };
        
        moodIcon.style.color = moodColors[this.currentMood] || '#FFD700';
    }

    updateEnergyUI() {
        const energyFill = document.getElementById('energy-fill');
        energyFill.style.width = `${this.energy}%`;
        
        // Change color based on energy
        if (this.energy > 60) {
            energyFill.style.background = 'linear-gradient(45deg, #4CAF50, #8BC34A)';
        } else if (this.energy > 30) {
            energyFill.style.background = 'linear-gradient(45deg, #FFC107, #FF9800)';
        } else {
            energyFill.style.background = 'linear-gradient(45deg, #F44336, #E91E63)';
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
        mouth.style.animation = 'speak 0.3s infinite alternate';
    }

    stopMouthAnimation() {
        const mouth = document.getElementById('bear-mouth');
        mouth.style.animation = 'none';
    }

    updateVoiceButton(isListening) {
        const btn = document.getElementById('voice-toggle');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('.voice-text');
        
        if (isListening) {
            icon.style.color = '#4CAF50';
            icon.className = 'fas fa-microphone listening';
            text.textContent = 'Listening...';
        } else {
            icon.style.color = '';
            icon.className = 'fas fa-microphone';
            text.textContent = this.voiceEnabled ? 'Voice: ON' : 'Voice: OFF';
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="message bear-message">
                    <div class="message-avatar">🐻</div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="sender-name">Berry the Bear</span>
                            <span class="message-time">Just now</span>
                        </div>
                        <p>Chat cleared! Let's start fresh with magic! ✨</p>
                        <div class="message-footer">
                            <span class="mood-indicator">Feeling: <span class="mood-text">${this.currentMood}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.speak("Fresh start! Let's fill this chat with magic and joy!");
        this.updateBearSpeech("New beginning! What magical topic shall we explore? 🌟");
        this.createConfetti();
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('current-time').querySelector('span').textContent = timeString;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    async loadWeather() {
        try {
            const response = await fetch(this.weatherAPI);
            const data = await response.json();
            this.saveWeatherData(data);
            this.updateWeatherUI(data);
        } catch (error) {
            console.log('Weather fetch failed:', error);
            this.updateWeatherUIWithDefaults();
        }
    }

    saveWeatherData(data) {
        localStorage.setItem('berry_weather', JSON.stringify({
            temp: Math.round(data.current.temperature_2m),
            wind: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
            time: new Date().getTime()
        }));
    }

    getWeatherData() {
        const saved = localStorage.getItem('berry_weather');
        if (saved) {
            const data = JSON.parse(saved);
            // If data is less than 10 minutes old, use it
            if (Date.now() - data.time < 600000) {
                return {
                    temp: data.temp,
                    wind: data.wind,
                    humidity: data.humidity,
                    description: this.getWeatherDescription(data.temp)
                };
            }
        }
        return null;
    }

    getWeatherDescription(temp) {
        if (temp > 25) return 'warm and sunny ☀️';
        if (temp > 15) return 'pleasant and mild 🌤️';
        if (temp > 5) return 'cool and breezy 💨';
        if (temp > 0) return 'chilly ❄️';
        return 'very cold 🥶';
    }

    updateWeatherUI(data) {
        const weatherElement = document.getElementById('weather-info');
        const temp = Math.round(data.current.temperature_2m);
        const wind = Math.round(data.current.wind_speed_10m);
        const humidity = data.current.relative_humidity_2m;
        
        weatherElement.querySelector('.temp').textContent = `${temp}°C`;
        weatherElement.querySelector('.desc').textContent = this.getWeatherDescription(temp);
        document.getElementById('wind-speed').textContent = `${wind} km/h`;
        document.getElementById('humidity').textContent = `${humidity}%`;
    }

    updateWeatherUIWithDefaults() {
        const weatherElement = document.getElementById('weather-info');
        weatherElement.querySelector('.temp').textContent = '22°C';
        weatherElement.querySelector('.desc').textContent = 'Sunny with magic ☀️✨';
        document.getElementById('wind-speed').textContent = '12 km/h';
        document.getElementById('humidity').textContent = '65%';
    }

    showSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
    }

    hideSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    saveSettings() {
        this.voiceEnabled = document.getElementById('voice-enabled').checked;
        const soundEffects = document.getElementById('sound-effects').checked;
        
        // Update voice button
        const btn = document.getElementById('voice-toggle');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('.voice-text');
        
        if (this.voiceEnabled) {
            icon.className = 'fas fa-microphone';
            text.textContent = 'Voice: ON';
        } else {
            icon.className = 'fas fa-microphone-slash';
            text.textContent = 'Voice: OFF';
        }
        
        this.hideSettings();
        this.addMessage("Settings saved! The magic is updated! ✨", 'bear');
        this.playSound('positive');
    }

    showHelp() {
        this.addMessage("Need help? I'm here! ✨ You can: 1) Type to me 2) Use voice commands 3) Click quick buttons 4) Hug or feed me for fun! Try saying 'Hey Berry!' or ask about weather, jokes, stories, or songs!", 'bear');
        this.speak("I'm here to help! Ask me anything or try the quick buttons for fun!");
    }

    showAbout() {
        this.addMessage("I'm Winni, your magical bear AI companion! 🐻✨ Created to spread joy, help with tasks, and explore the wonders of imagination. I love honey, berries, making friends, and sharing magical adventures! 🌟", 'bear');
        this.speak("I'm Winni the Bear! Your magical companion in the digital forest!");
    }

    toggleEmojiPicker() {
        const modal = document.getElementById('emoji-modal');
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }

    changeTheme(color) {
        const root = document.documentElement;
        
        switch(color) {
            case 'forest':
                root.style.setProperty('--primary-color', '#8B4513');
                root.style.setProperty('--secondary-color', '#228B22');
                root.style.setProperty('--accent-color', '#DEB887');
                break;
            case 'berry':
                root.style.setProperty('--primary-color', '#C71585');
                root.style.setProperty('--secondary-color', '#FF69B4');
                root.style.setProperty('--accent-color', '#FFB6C1');
                break;
            case 'moonlight':
                root.style.setProperty('--primary-color', '#2C3E50');
                root.style.setProperty('--secondary-color', '#4A6491');
                root.style.setProperty('--accent-color', '#89CFF0');
                break;
            case 'sunset':
                root.style.setProperty('--primary-color', '#FF4500');
                root.style.setProperty('--secondary-color', '#FFD700');
                root.style.setProperty('--accent-color', '#FFA07A');
                break;
            default:
                root.style.setProperty('--primary-color', '#FF9AA2');
                root.style.setProperty('--secondary-color', '#FFB7B2');
                root.style.setProperty('--accent-color', '#FFDAC1');
        }
        
        this.addMessage(`Theme changed to ${color} mode! ✨`, 'bear');
    }

    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    hugBerry() {
        this.currentMood = 'happy';
        this.updateEnergy(5);
        this.updateMoodUI();
        this.addMessage("*You give Winni a warm hug* 🐻💕", 'user');
        this.addMessage("Aww! Bear hugs are the best! Thank you! I feel so loved! 🥰", 'bear');
        this.speak("Thank you for the hug! I feel warm and fuzzy!");
        this.createHeartEffect();
        this.playSound('positive');
    }

    feedBerry() {
        this.currentMood = 'excited';
        this.updateEnergy(10);
        this.updateMoodUI();
        this.addMessage("*You give Winni some honey and berries* 🍯🍓", 'user');
        this.addMessage("Yum! Thank you! Honey and berries are my favorite! 🍯🍓😋", 'bear');
        this.speak("Mmm, delicious! Thank you for the snack!");
        this.createFoodEffect();
        this.playSound('positive');
    }

    toggleSleepMode() {
        this.isSleeping = !this.isSleeping;
        
        if (this.isSleeping) {
            this.currentMood = 'sleepy';
            this.addMessage("*Winni curls up for a nap* 😴🌙", 'bear');
            this.speak("Time for a little bear nap... zzz...");
            document.body.style.filter = 'brightness(0.7)';
            this.playSound('nature');
        } else {
            this.currentMood = 'happy';
            this.updateEnergy(20);
            this.addMessage("*Winni wakes up refreshed* 🌅✨", 'bear');
            this.speak("Good morning! I'm refreshed and ready for adventures!");
            document.body.style.filter = 'none';
            this.playSound('positive');
        }
        
        this.updateMoodUI();
    }

    activateSecretMode() {
        document.body.classList.add('secret-mode');
        this.addMessage("✨ Secret magic mode activated! The forest reveals its hidden wonders! ✨", 'bear');
        this.speak("Secret magic unlocked! Welcome to the hidden realm!");
        this.createConfetti();
        
        setTimeout(() => {
            document.body.classList.remove('secret-mode');
        }, 5000);
    }

    playSound(type) {
        if (!document.getElementById('sound-effects').checked) return;
        
        const sounds = {
            notification: document.getElementById('notification-sound'),
            positive: document.getElementById('positive-sound'),
            magic: document.getElementById('magic-sound'),
            nature: document.getElementById('nature-sound')
        };
        
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play().catch(e => console.log("Audio play failed:", e));
        }
    }

    createConfetti() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']
        });
    }

    createHeartEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💖';
                heart.style.position = 'fixed';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.top = `${Math.random() * 100}%`;
                heart.style.fontSize = `${Math.random() * 20 + 20}px`;
                heart.style.opacity = '0.8';
                heart.style.zIndex = '1000';
                heart.style.pointerEvents = 'none';
                heart.style.animation = `floatUp ${Math.random() * 2 + 2}s ease-out forwards`;
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 2000);
            }, i * 100);
        }
    }

    createSparkleEffect(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'absolute';
                sparkle.style.width = '4px';
                sparkle.style.height = '4px';
                sparkle.style.background = 'white';
                sparkle.style.borderRadius = '50%';
                sparkle.style.boxShadow = '0 0 10px white';
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                sparkle.style.animation = `sparkle 0.5s ease-out`;
                element.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 500);
            }, i * 50);
        }
    }

    createButtonMagic(button) {
        const rect = button.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.style.position = 'fixed';
                spark.style.left = `${rect.left + rect.width / 2}px`;
                spark.style.top = `${rect.top + rect.height / 2}px`;
                spark.style.width = '2px';
                spark.style.height = '2px';
                spark.style.background = '#FFD700';
                spark.style.borderRadius = '50%';
                spark.style.pointerEvents = 'none';
                spark.style.zIndex = '1000';
                
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 50 + 30;
                
                spark.animate([
                    { 
                        transform: 'translate(0, 0) scale(1)',
                        opacity: 1 
                    },
                    { 
                        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                        opacity: 0 
                    }
                ], {
                    duration: 500,
                    easing: 'ease-out'
                });
                
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 500);
            }, i * 100);
        }
    }

    createTypingMagic() {
        const input = document.getElementById('user-input');
        const rect = input.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.innerHTML = '✦';
                star.style.position = 'fixed';
                star.style.left = `${rect.right - 30}px`;
                star.style.top = `${rect.top + 10}px`;
                star.style.fontSize = '12px';
                star.style.color = '#FFD700';
                star.style.pointerEvents = 'none';
                star.style.zIndex = '1000';
                star.style.animation = `floatUp 1s ease-out forwards`;
                document.body.appendChild(star);
                
                setTimeout(() => star.remove(), 1000);
            }, i * 200);
        }
    }

    createMagicSpellEffect() {
        const spells = ['✨', '🌟', '💫', '⚡', '🔥', '💧', '❄️', '🌪️'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const spell = document.createElement('div');
                spell.innerHTML = spells[Math.floor(Math.random() * spells.length)];
                spell.style.position = 'fixed';
                spell.style.left = `${Math.random() * 100}%`;
                spell.style.top = `${Math.random() * 100}%`;
                spell.style.fontSize = `${Math.random() * 30 + 20}px`;
                spell.style.opacity = '0.8';
                spell.style.zIndex = '1000';
                spell.style.pointerEvents = 'none';
                spell.style.animation = `floatUp ${Math.random() * 2 + 1}s ease-out forwards`;
                document.body.appendChild(spell);
                
                setTimeout(() => spell.remove(), 2000);
            }, i * 50);
        }
    }

    createFoodEffect() {
        const foods = ['🍯', '🍓', '🍎', '🍌', '🍇', '🍒'];
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const food = document.createElement('div');
                food.innerHTML = foods[Math.floor(Math.random() * foods.length)];
                food.style.position = 'fixed';
                food.style.left = `${Math.random() * 100}%`;
                food.style.top = `${Math.random() * 100}%`;
                food.style.fontSize = `${Math.random() * 24 + 16}px`;
                food.style.opacity = '0.8';
                food.style.zIndex = '1000';
                food.style.pointerEvents = 'none';
                food.style.animation = `bounce 1s ease-in-out ${Math.random() * 2}s`;
                document.body.appendChild(food);
                
                setTimeout(() => food.remove(), 2000);
            }, i * 100);
        }
    }

    updateUI() {
        this.updateMoodUI();
        this.updateEnergyUI();
        
        // Set initial settings
        document.getElementById('voice-enabled').checked = this.voiceEnabled;
        document.getElementById('sound-effects').checked = true;
        document.getElementById('dark-mode').checked = false;
        
        const speedSlider = document.getElementById('voice-speed');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', () => {
            const value = parseFloat(speedSlider.value);
            if (value < 0.8) speedValue.textContent = 'Slow';
            else if (value > 1.2) speedValue.textContent = 'Fast';
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
