class WinniBearAI {
    constructor() {
        // Winni's State
        this.mood = 'happy';
        this.energy = 92;
        this.friendship = 80;
        this.isSleeping = false;
        this.isListening = false;
        this.voiceEnabled = true;
        this.conversationHistory = [];
        
        // Weather API
        this.weatherAPI = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';
        
        // Response Database
        this.responses = {
            greetings: [
                "Hello there! Winni the Bear at your service! 🐻✨",
                "Hi friend! Ready for some forest adventures? 🌳",
                "Greetings! I'm Winni, your magical bear companion! 🎩",
                "Welcome back! I was just thinking about you! 💭"
            ],
            jokes: [
                "Why don't bears wear shoes? Because they have bear feet! 🐾",
                "What's a bear's favorite drink? Koka-Koala! 🐨",
                "Why did the bear go to the restaurant? For the honey-glazed salmon! 🍯",
                "How do bears keep their den clean? They use bear-oom spray! 🧹"
            ],
            stories: [
                "Once upon a time in the enchanted forest, there was a little bear who discovered a magical honey tree that glowed in the moonlight... 🌙🍯",
                "Let me tell you about the Great Berry Adventure! Winni once followed a trail of sparkling berries to a secret meadow where fireflies danced in rainbow colors... ✨🪩",
                "In the heart of the whispering woods, there's a legend about the Moon Bear who paints the stars every night... 🌟🎨",
                "One rainy afternoon, Winni found a cozy cave filled with ancient scrolls that told stories of the forest's history... 📜🌧️"
            ],
            facts: [
                "Did you know? A bear's sense of smell is 2,100 times better than a human's! They can smell honey from 3 kilometers away! 👃🍯",
                "Fun fact: Bears can run up to 35 miles per hour – that's faster than Olympic sprinters! 🏃‍♂️💨",
                "Amazing: Some bears build nests in trees to rest and eat! How cozy is that? 🌳🛏️",
                "Interesting: Bears walk on the soles of their feet, just like humans! That's called plantigrade locomotion! 👣"
            ],
            weatherResponses: {
                sunny: ["Perfect day for a forest picnic! ☀️🌳", "The sun is smiling on us today! 😊", "Great weather for honey collecting! 🍯"],
                cloudy: ["Cozy cloud cover today! Perfect for storytelling! ☁️📖", "The clouds are painting pictures in the sky! 🎨", "Soft light for a gentle forest walk! 🌥️"],
                rainy: ["Rainy days are perfect for cozy den time! ☔🛋️", "The forest is getting a nice drink of water! 💧", "Let's watch the raindrops dance! 💃"],
                snowy: ["Winter wonderland! Time for bear snow angels! ❄️👼", "The forest is wearing a white blanket! 🛌", "Perfect weather for hot honey tea! 🍵"]
            }
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
        
        // Initial greeting
        setTimeout(() => {
            this.speak("Hello! I'm Winni the Bear! So happy to meet you!");
            this.updateWinniSpeech(this.randomChoice(this.responses.greetings));
            this.createConfetti();
        }, 1000);
        
        // Auto updates
        setInterval(() => this.updateMood(), 30000);
        setInterval(() => this.updateEnergy(1), 60000);
    }
    
    setupEventListeners() {
        // Chat input
        document.getElementById('send-button').addEventListener('click', () => this.handleUserInput());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        
        // Voice toggle
        document.getElementById('voice-toggle').addEventListener('click', () => this.toggleVoice());
        document.getElementById('voice-input').addEventListener('click', () => this.toggleListening());
        
        // Clear chat
        document.getElementById('clear-chat').addEventListener('click', () => this.clearChat());
        
        // Quick actions
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
            });
        });
        
        // Suggestions
        document.querySelectorAll('.suggestion').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.suggestion;
                document.getElementById('chat-input').value = text;
                this.handleUserInput();
            });
        });
        
        // Settings
        document.getElementById('chat-settings').addEventListener('click', () => this.showSettings());
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettings());
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // About
        document.getElementById('about-button').addEventListener('click', () => this.showAbout());
        
        // Help
        document.getElementById('help-button').addEventListener('click', () => this.showHelp());
        
        // Emoji picker
        document.getElementById('emoji-picker').addEventListener('click', () => this.showEmojiPicker());
        
        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Settings tabs
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchSettingsTab(tabId);
            });
        });
        
        // Theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.changeTheme(theme);
            });
        });
        
        // Refresh Winni
        document.getElementById('refresh-winni').addEventListener('click', () => this.refreshWinni());
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
                this.showTypingIndicator(true);
                this.updateWinniSpeech("🎤 I'm listening... speak now!");
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateWinniSpeech("Oops! I didn't catch that. Can you try again?");
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton(false);
                this.showTypingIndicator(false);
            };
        }
    }
    
    setupEmojiPicker() {
        const emojiCategories = {
            smileys: ['😊', '😂', '🥰', '😍', '🤩', '😎', '🥳', '😇', '🤗', '😋', '🤔', '🥺', '😢', '😡', '🤯'],
            animals: ['🐻', '🐝', '🦊', '🦁', '🐯', '🐨', '🐼', '🐰', '🦝', '🐿️', '🦔', '🦡', '🐦', '🦋', '🐞'],
            nature: ['🌳', '🌲', '🌴', '🌱', '🌼', '🌸', '🌻', '🍃', '🍂', '🍁', '🌙', '⭐', '🌟', '✨', '☀️'],
            objects: ['🍯', '🍓', '🍎', '🍌', '🍇', '🎮', '📚', '🎨', '🎵', '🎭', '🔮', '💎', '🎁', '🎀', '🎈'],
            symbols: ['💖', '💕', '💫', '⚡', '🔥', '💧', '❄️', '🌈', '☁️', '☔', '🌊', '🌪️', '🌀', '💫', '✨']
        };
        
        const emojiGrid = document.getElementById('emoji-grid');
        
        // Load smileys by default
        this.loadEmojiCategory('smileys', emojiCategories);
        
        // Category buttons
        document.querySelectorAll('.emoji-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                
                // Update active button
                document.querySelectorAll('.emoji-category').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Load emojis
                this.loadEmojiCategory(category, emojiCategories);
            });
        });
    }
    
    loadEmojiCategory(category, emojiCategories) {
        const emojiGrid = document.getElementById('emoji-grid');
        emojiGrid.innerHTML = '';
        
        emojiCategories[category].forEach(emoji => {
            const button = document.createElement('button');
            button.textContent = emoji;
            button.addEventListener('click', () => {
                const input = document.getElementById('chat-input');
                input.value += emoji;
                input.focus();
                document.getElementById('emoji-modal').classList.remove('active');
            });
            emojiGrid.appendChild(button);
        });
    }
    
    handleUserInput() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        
        if (!text) return;
        
        this.addMessage(text, 'user');
        this.processInput(text);
        input.value = '';
        input.focus();
        
        this.animateWinni();
        this.playSound('notification');
    }
    
    processVoiceInput(transcript) {
        this.addMessage(transcript, 'user');
        this.processInput(transcript);
    }
    
    processInput(text) {
        text = text.toLowerCase();
        
        // Add to history
        this.conversationHistory.push({
            text: text,
            time: new Date(),
            mood: this.mood
        });
        
        // Generate response
        let response = this.generateResponse(text);
        
        // Add Winni's response
        setTimeout(() => {
            this.addMessage(response, 'winni');
            this.updateWinniSpeech(response);
            
            if (this.voiceEnabled && !this.isSleeping) {
                this.speak(response);
            }
        }, 500);
        
        // Update stats
        this.updateMoodBasedOnInput(text);
        this.updateEnergy(-1);
        this.updateFriendship(1);
    }
    
    generateResponse(input) {
        // Check for greetings
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return this.randomChoice(this.responses.greetings);
        }
        
        // Check for how are you
        if (input.includes('how are you') || input.includes('how do you feel')) {
            return `I'm feeling ${this.mood} today! My energy is at ${this.energy}% and our friendship level is ${this.friendship}%! 🐻✨`;
        }
        
        // Check for weather
        if (input.includes('weather') || input.includes('temperature')) {
            const weather = this.getCurrentWeather();
            if (weather) {
                return `Current weather: ${weather.temp}°C with ${weather.description}. Wind: ${weather.wind} km/h. ${this.randomChoice(this.responses.weatherResponses[weather.type] || this.responses.weatherResponses.sunny)}`;
            }
            return "The forest weather is magical today! Perfect for adventures! 🌤️";
        }
        
        // Check for jokes
        if (input.includes('joke') || input.includes('funny') || input.includes('laugh')) {
            return this.randomChoice(this.responses.jokes);
        }
        
        // Check for stories
        if (input.includes('story') || input.includes('tell me') || input.includes('bedtime')) {
            return this.randomChoice(this.responses.stories);
        }
        
        // Check for facts
        if (input.includes('fact') || input.includes('interesting') || input.includes('learn')) {
            return this.randomChoice(this.responses.facts);
        }
        
        // Check for games
        if (input.includes('game') || input.includes('play')) {
            return "Let's play 'Guess the Berry'! I'm thinking of a berry... is it red, blue, or purple? 🍓🫐🍇";
        }
        
        // Check for music
        if (input.includes('song') || input.includes('sing') || input.includes('music')) {
            return "🎵 Winni the Bear, with honey in my hair! Dancing in the forest, without a care! La la la! 🎵";
        }
        
        // Check for love
        if (input.includes('love') || input.includes('like you') || input.includes('miss you')) {
            this.mood = 'happy';
            this.updateMoodUI();
            this.createHeartEffect();
            return "Aww! You make my bear heart happy! *bear hugs* 🐻💖";
        }
        
        // Check for help
        if (input.includes('help') || input.includes('what can you do')) {
            return "I can tell stories, share jokes, check weather, play games, and be your magical friend! What would you like to do? ✨";
        }
        
        // Check for sleep
        if (input.includes('sleep') || input.includes('tired') || input.includes('nap')) {
            return "Time for a cozy bear nap? I know the perfect sunny spot! 😴🌞";
        }
        
        // Check for food
        if (input.includes('honey') || input.includes('eat') || input.includes('hungry')) {
            return "Mmm... honey! My favorite! Did you know bears can eat up to 40,000 berries in a single day? 🍯🍓";
        }
        
        // Check for magic
        if (input.includes('magic') || input.includes('spell') || input.includes('abracadabra')) {
            this.createMagicEffect();
            return "✨ Bibbidi-Bobbidi-Boo! The forest magic is strong today! ✨";
        }
        
        // Check for bye
        if (input.includes('bye') || input.includes('goodbye') || input.includes('see you')) {
            return "Goodbye friend! Come visit me again in the enchanted forest! I'll save some honey for you! 🐻👋🍯";
        }
        
        // Default response
        const responses = [
            "That's interesting! Tell me more about that! 🐻",
            "Hmm, let me think about that with my bear brain... 🧠",
            "The forest spirits are listening too! What else would you like to know? 🌳",
            "I love learning new things! Can you tell me more? 📚",
            "That reminds me of the time I found a magical berry bush! 🍓✨",
            "As a bear, I think... hmm... that's fascinating!",
            "Let me consult the ancient tree of wisdom about that... 🌲",
            "The fireflies are dancing to your words! 🪩"
        ];
        
        return this.randomChoice(responses);
    }
    
    handleAction(action) {
        let response = '';
        
        switch(action) {
            case 'hug':
                this.mood = 'happy';
                this.updateEnergy(5);
                this.updateFriendship(3);
                response = "Aww! Thank you for the bear hug! I feel warm and fuzzy! 🐻💕";
                this.createHeartEffect();
                this.animateWinni('hug');
                break;
                
            case 'feed':
                this.mood = 'excited';
                this.updateEnergy(10);
                response = "Yum! Honey! Thank you! You're the best! 🍯😋";
                this.createFoodEffect();
                this.animateWinni('eat');
                break;
                
            case 'play':
                this.mood = 'playful';
                this.updateEnergy(-5);
                response = "Yay! Let's play hide and seek in the forest! Ready or not, here I come! 🎮🌳";
                this.animateWinni('dance');
                break;
                
            case 'story':
                this.mood = 'cozy';
                response = this.randomChoice(this.responses.stories);
                this.animateWinni('listen');
                break;
                
            case 'dance':
                this.mood = 'excited';
                this.updateEnergy(-8);
                response = "🎵 Dance party time! Shake your bear paws! 💃🐾🎶";
                this.animateWinni('dance');
                this.createConfetti();
                break;
                
            case 'nap':
                this.isSleeping = !this.isSleeping;
                if (this.isSleeping) {
                    this.mood = 'sleepy';
                    response = "*yawns* Time for a little bear nap... zzz... 😴🌙";
                    this.animateWinni('sleep');
                } else {
                    this.mood = 'happy';
                    this.updateEnergy(20);
                    response = "Good morning! I'm refreshed and ready for adventures! 🌅✨";
                    this.animateWinni('wake');
                }
                break;
        }
        
        this.addMessage(response, 'winni');
        this.updateWinniSpeech(response);
        
        if (this.voiceEnabled && !this.isSleeping) {
            this.speak(response);
        }
        
        this.updateUI();
    }
    
    speak(text) {
        if (!this.voiceEnabled || !window.speechSynthesis || this.isSleeping) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = parseFloat(document.getElementById('voice-speed')?.value || 1);
        utterance.pitch = parseFloat(document.getElementById('voice-pitch')?.value || 1.2);
        utterance.volume = 0.9;
        
        // Animate mouth
        this.animateMouth(true);
        
        utterance.onend = () => {
            this.animateMouth(false);
        };
        
        window.speechSynthesis.speak(utterance);
    }
    
    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('voice-toggle');
        
        if (this.voiceEnabled) {
            btn.innerHTML = '<i class="fas fa-microphone"></i><span>Voice</span>';
            btn.classList.add('voice-control');
            this.speak("Voice features enabled! You can talk to me now!");
        } else {
            btn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Voice</span>';
            btn.classList.remove('voice-control');
            this.updateWinniSpeech("Voice features disabled. You can still type to me!");
        }
    }
    
    toggleListening() {
        if (!this.recognition) {
            this.updateWinniSpeech("Sorry, voice recognition isn't available in your browser.");
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    updateVoiceButton(isListening) {
        const btn = document.getElementById('voice-input');
        
        if (isListening) {
            btn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
            btn.style.color = '#10B981';
        } else {
            btn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
            btn.style.color = '';
        }
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${sender}-message fade-in`;
        
        const time = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const avatar = sender === 'winni' ? '🐻' : '👤';
        const name = sender === 'winni' ? 'Winni the Bear' : 'You';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">${avatar}</div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender">${name}</span>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="message-text">
                    <p>${text}</p>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Update message count
        const count = messagesContainer.querySelectorAll('.message').length - 1; // Subtract welcome message
        document.querySelector('.message-count').textContent = `${count} messages`;
    }
    
    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        
        messagesContainer.innerHTML = '';
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }
        
        this.updateWinniSpeech("Fresh start! What shall we talk about? 🐻✨");
        this.speak("Chat cleared! Ready for new adventures!");
        
        document.querySelector('.message-count').textContent = '0 messages';
    }
    
    updateWinniSpeech(text) {
        const speechElement = document.getElementById('winni-speech');
        speechElement.textContent = '';
        
        // Typewriter effect
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                speechElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        typeWriter();
        
        // Animate bubble
        const bubble = document.getElementById('speech-bubble');
        bubble.style.animation = 'none';
        setTimeout(() => {
            bubble.style.animation = 'messageSlide 0.3s ease-out';
        }, 10);
    }
    
    showTypingIndicator(show) {
        const indicator = document.getElementById('typing-indicator');
        indicator.classList.toggle('active', show);
    }
    
    updateMood() {
        // Random mood changes when idle
        const moods = ['happy', 'curious', 'playful', 'cozy', 'sleepy'];
        if (Math.random() < 0.2) {
            this.mood = this.randomChoice(moods);
            this.updateMoodUI();
        }
    }
    
    updateMoodBasedOnInput(input) {
        const moodMap = {
            'joke': 'playful',
            'happy': 'happy',
            'love': 'happy',
            'sad': 'cozy',
            'weather': 'curious',
            'game': 'playful',
            'sleep': 'sleepy',
            'story': 'cozy',
            'magic': 'excited'
        };
        
        for (const [keyword, mood] of Object.entries(moodMap)) {
            if (input.includes(keyword)) {
                this.mood = mood;
                break;
            }
        }
        
        this.updateMoodUI();
    }
    
    updateMoodUI() {
        const moodValue = document.getElementById('mood-value');
        const moodFill = document.querySelector('.mood-fill');
        
        moodValue.textContent = this.mood.charAt(0).toUpperCase() + this.mood.slice(1);
        
        // Map mood to percentage for progress bar
        const moodPercent = {
            'happy': 90,
            'excited': 95,
            'playful': 85,
            'curious': 80,
            'cozy': 75,
            'sleepy': 60
        };
        
        const percent = moodPercent[this.mood] || 80;
        moodFill.style.width = `${percent}%`;
        
        // Update mood icon
        const moodIcon = document.querySelector('.stat-icon.mood i');
        const moodIcons = {
            'happy': 'fa-smile',
            'excited': 'fa-grin-stars',
            'playful': 'fa-laugh-beam',
            'curious': 'fa-thinking',
            'cozy': 'fa-couch',
            'sleepy': 'fa-bed'
        };
        
        if (moodIcons[this.mood]) {
            moodIcon.className = `fas ${moodIcons[this.mood]}`;
        }
    }
    
    updateEnergy(change) {
        this.energy = Math.max(0, Math.min(100, this.energy + change));
        
        const energyValue = document.getElementById('energy-value');
        const energyFill = document.querySelector('.energy-fill');
        
        energyValue.textContent = `${this.energy}%`;
        energyFill.style.width = `${this.energy}%`;
        
        // Change color based on energy
        if (this.energy > 70) {
            energyFill.style.background = 'linear-gradient(90deg, var(--secondary), var(--secondary-light))';
        } else if (this.energy > 40) {
            energyFill.style.background = 'linear-gradient(90deg, #F59E0B, #FBBF24)';
        } else {
            energyFill.style.background = 'linear-gradient(90deg, #DC2626, #EF4444)';
            if (change < 0) {
                this.updateWinniSpeech("I'm getting a bit tired... maybe time for some honey? 🍯😴");
            }
        }
    }
    
    updateFriendship(change) {
        this.friendship = Math.max(0, Math.min(100, this.friendship + change));
        
        const friendshipValue = document.getElementById('friendship-value');
        const friendshipFill = document.querySelector('.friendship-fill');
        
        const level = Math.floor(this.friendship / 10) + 1;
        friendshipValue.textContent = `Level ${level}`;
        friendshipFill.style.width = `${this.friendship}%`;
        
        // Update achievement if reached new level
        if (level >= 8) {
            document.querySelector('.achievement.locked .achievement-title').textContent = 'Best Friends Forever';
            document.querySelector('.achievement.locked .achievement-desc').textContent = 'Reached friendship level 8';
            document.querySelector('.achievement.locked').classList.remove('locked');
            document.querySelector('.achievement.locked').classList.add('unlocked');
        }
    }
    
    updateUI() {
        this.updateMoodUI();
        
        // Update energy display
        document.getElementById('energy-value').textContent = `${this.energy}%`;
        document.querySelector('.energy-fill').style.width = `${this.energy}%`;
        
        // Update friendship display
        const level = Math.floor(this.friendship / 10) + 1;
        document.getElementById('friendship-value').textContent = `Level ${level}`;
        document.querySelector('.friendship-fill').style.width = `${this.friendship}%`;
    }
    
    animateWinni(action = 'default') {
        const winni = document.getElementById('winni-character');
        const mouth = document.getElementById('winni-mouth');
        
        // Reset animation
        winni.style.animation = 'none';
        mouth.style.animation = 'none';
        
        setTimeout(() => {
            switch(action) {
                case 'hug':
                    winni.style.animation = 'heartbeat 1s ease-in-out';
                    break;
                case 'eat':
                    mouth.style.animation = 'bounce 0.5s ease-in-out 3';
                    break;
                case 'dance':
                    winni.style.animation = 'dance 1s ease-in-out infinite';
                    break;
                case 'listen':
                    // Gentle nod
                    winni.style.animation = 'gentle-bounce 2s ease-in-out';
                    break;
                case 'sleep':
                    // Slow breathing
                    winni.style.animation = 'gentle-pulse 3s ease-in-out infinite';
                    break;
                case 'wake':
                    winni.style.animation = 'gentle-bounce 2s ease-in-out 2';
                    break;
                default:
                    winni.style.animation = 'gentle-bounce 2s ease-in-out';
            }
        }, 10);
    }
    
    animateMouth(speaking) {
        const mouth = document.getElementById('winni-mouth');
        
        if (speaking) {
            mouth.style.animation = 'bounce 0.3s infinite alternate';
        } else {
            mouth.style.animation = 'none';
        }
    }
    
    startClock() {
        const updateClock = () => {
            const now = new Date();
            
            // Update time
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            document.getElementById('current-time').textContent = timeString;
            
            // Update date
            const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            document.getElementById('current-date').textContent = dateString;
            
            // Update season icon
            const month = now.getMonth();
            const seasonIcon = document.getElementById('season-icon');
            
            if (month >= 2 && month <= 4) {
                seasonIcon.className = 'fas fa-seedling'; // Spring
            } else if (month >= 5 && month <= 7) {
                seasonIcon.className = 'fas fa-sun'; // Summer
            } else if (month >= 8 && month <= 10) {
                seasonIcon.className = 'fas fa-leaf'; // Autumn
            } else {
                seasonIcon.className = 'fas fa-snowflake'; // Winter
            }
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    async loadWeather() {
        try {
            const response = await fetch(this.weatherAPI);
            const data = await response.json();
            
            const temp = Math.round(data.current.temperature_2m);
            const wind = Math.round(data.current.wind_speed_10m);
            const humidity = data.current.relative_humidity_2m;
            
            // Update weather widget
            document.getElementById('temp-value').textContent = `${temp}°`;
            document.getElementById('wind-speed').textContent = `${wind} km/h`;
            document.getElementById('humidity').textContent = `${humidity}%`;
            
            // Update weather description
            const desc = document.getElementById('weather-desc');
            const icon = document.querySelector('.weather-icon i');
            
            let weatherType = 'sunny';
            let weatherDesc = 'Sunny';
            let weatherIcon = 'fa-sun';
            
            if (temp < 0) {
                weatherType = 'snowy';
                weatherDesc = 'Snowy';
                weatherIcon = 'fa-snowflake';
            } else if (temp < 10) {
                weatherType = 'cloudy';
                weatherDesc = 'Chilly';
                weatherIcon = 'fa-cloud';
            } else if (humidity > 80) {
                weatherType = 'rainy';
                weatherDesc = 'Rainy';
                weatherIcon = 'fa-cloud-rain';
            } else if (temp > 25) {
                weatherDesc = 'Hot';
                weatherIcon = 'fa-temperature-high';
            }
            
            desc.textContent = weatherDesc;
            icon.className = `fas ${weatherIcon}`;
            icon.style.color = weatherType === 'sunny' ? '#F59E0B' : 
                              weatherType === 'cloudy' ? '#94A3B8' :
                              weatherType === 'rainy' ? '#60A5FA' : 
                              weatherType === 'snowy' ? '#A5B4FC' : '#F59E0B';
            
            // Store weather data
            this.currentWeather = {
                temp: temp,
                wind: wind,
                humidity: humidity,
                type: weatherType,
                description: weatherDesc
            };
            
        } catch (error) {
            console.log('Weather fetch failed:', error);
            
            // Default weather
            document.getElementById('temp-value').textContent = '22°';
            document.getElementById('wind-speed').textContent = '12 km/h';
            document.getElementById('humidity').textContent = '65%';
            document.getElementById('weather-desc').textContent = 'Sunny';
            
            this.currentWeather = {
                temp: 22,
                wind: 12,
                humidity: 65,
                type: 'sunny',
                description: 'Sunny'
            };
        }
    }
    
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    showSettings() {
        document.getElementById('settings-modal').classList.add('active');
    }
    
    hideSettings() {
        document.getElementById('settings-modal').classList.remove('active');
    }
    
    saveSettings() {
        // Get values
        const voiceEnabled = document.getElementById('voice-enabled').checked;
        const notifications = document.getElementById('notifications-enabled').checked;
        const soundEffects = document.getElementById('sound-effects').checked;
        const darkMode = document.getElementById('dark-mode').checked;
        const animations = document.getElementById('animations').checked;
        
        // Apply settings
        this.voiceEnabled = voiceEnabled;
        
        if (!soundEffects) {
            // Disable all sounds
            document.querySelectorAll('audio').forEach(audio => audio.volume = 0);
        } else {
            document.querySelectorAll('audio').forEach(audio => audio.volume = 0.7);
        }
        
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        if (!animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
        
        // Save to localStorage
        const settings = {
            voiceEnabled,
            notifications,
            soundEffects,
            darkMode,
            animations,
            voiceSpeed: document.getElementById('voice-speed').value,
            voicePitch: document.getElementById('voice-pitch').value,
            userName: document.getElementById('user-name').value,
            winniName: document.getElementById('winni-name').value
        };
        
        localStorage.setItem('winni-settings', JSON.stringify(settings));
        
        // Show confirmation
        this.updateWinniSpeech("Settings saved! The magic is updated! ✨");
        this.hideSettings();
        this.playSound('positive');
    }
    
    switchSettingsTab(tabId) {
        // Update active tab
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Show active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
    
    changeTheme(theme) {
        const root = document.documentElement;
        
        // Update active theme button
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        event.target.closest('.theme-option').classList.add('active');
        
        // Change CSS variables based on theme
        switch(theme) {
            case 'forest':
                root.style.setProperty('--primary', '#8B5CF6');
                root.style.setProperty('--secondary', '#10B981');
                root.style.setProperty('--accent', '#F59E0B');
                break;
            case 'berry':
                root.style.setProperty('--primary', '#EC4899');
                root.style.setProperty('--secondary', '#F59E0B');
                root.style.setProperty('--accent', '#8B5CF6');
                break;
            case 'midnight':
                root.style.setProperty('--primary', '#6366F1');
                root.style.setProperty('--secondary', '#0EA5E9');
                root.style.setProperty('--accent', '#10B981');
                break;
            case 'honey':
                root.style.setProperty('--primary', '#D97706');
                root.style.setProperty('--secondary', '#FBBF24');
                root.style.setProperty('--accent', '#10B981');
                break;
        }
        
        this.updateWinniSpeech(`Theme changed to ${theme}! Looking good! 🎨`);
    }
    
    toggleTheme() {
        const themes = ['forest', 'berry', 'midnight', 'honey'];
        const currentTheme = document.querySelector('.theme-option.active').dataset.theme;
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        this.changeTheme(themes[nextIndex]);
    }
    
    showAbout() {
        document.getElementById('about-modal').classList.add('active');
    }
    
    showHelp() {
        const helpMessage = "Need help? Here are some things you can ask me: 'Tell me a story', 'How's the weather?', 'Tell me a joke', 'Let's play a game', or just chat with me about anything! You can also click the quick action buttons to interact with me! 🐻💕";
        
        this.addMessage(helpMessage, 'winni');
        this.updateWinniSpeech(helpMessage);
        
        if (this.voiceEnabled) {
            this.speak("I'm here to help! Ask me anything or try the quick buttons!");
        }
    }
    
    showEmojiPicker() {
        document.getElementById('emoji-modal').classList.add('active');
    }
    
    refreshWinni() {
        this.energy = Math.min(100, this.energy + 20);
        this.mood = 'happy';
        this.updateUI();
        
        this.updateWinniSpeech("Ahh! Refreshed and ready for more adventures! 🐻✨");
        this.animateWinni('wake');
        this.playSound('positive');
        
        // Create sparkle effect
        this.createSparkleEffect(document.querySelector('.logo-icon'));
    }
    
    playSound(type) {
        if (!document.getElementById('sound-effects')?.checked) return;
        
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
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#0EA5E9']
            });
        }
    }
    
    createHeartEffect() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💖';
                heart.style.position = 'fixed';
                heart.style.left = `${Math.random() * 100}vw`;
                heart.style.top = `${Math.random() * 100}vh`;
                heart.style.fontSize = `${Math.random() * 24 + 16}px`;
                heart.style.opacity = '0.8';
                heart.style.zIndex = '1000';
                heart.style.pointerEvents = 'none';
                heart.style.animation = `float-up ${Math.random() * 2 + 2}s ease-out forwards`;
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 2000);
            }, i * 100);
        }
    }
    
    createFoodEffect() {
        const foods = ['🍯', '🍓', '🍎', '🍌', '🍇'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const food = document.createElement('div');
                food.innerHTML = foods[Math.floor(Math.random() * foods.length)];
                food.style.position = 'fixed';
                food.style.left = `${Math.random() * 100}vw`;
                food.style.top = `${Math.random() * 100}vh`;
                food.style.fontSize = `${Math.random() * 20 + 16}px`;
                food.style.opacity = '0.8';
                food.style.zIndex = '1000';
                food.style.pointerEvents = 'none';
                food.style.animation = `float-up ${Math.random() * 2 + 1}s ease-out forwards`;
                document.body.appendChild(food);
                
                setTimeout(() => food.remove(), 2000);
            }, i * 100);
        }
    }
    
    createMagicEffect() {
        const symbols = ['✨', '🌟', '💫', '⚡', '🔥'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const symbol = document.createElement('div');
                symbol.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
                symbol.style.position = 'fixed';
                symbol.style.left = `${Math.random() * 100}vw`;
                symbol.style.top = `${Math.random() * 100}vh`;
                symbol.style.fontSize = `${Math.random() * 30 + 20}px`;
                symbol.style.opacity = '0.8';
                symbol.style.zIndex = '1000';
                symbol.style.pointerEvents = 'none';
                symbol.style.animation = `float-up ${Math.random() * 2 + 1}s ease-out forwards`;
                document.body.appendChild(symbol);
                
                setTimeout(() => symbol.remove(), 2000);
            }, i * 50);
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
                sparkle.style.boxShadow = '0 0 8px white';
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                sparkle.style.animation = `sparkle 0.5s ease-out`;
                element.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 500);
            }, i * 50);
        }
    }
    
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Initialize Winni when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.winni = new WinniBearAI();
    
    // Load saved settings
    const savedSettings = localStorage.getItem('winni-settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply settings
        document.getElementById('voice-enabled').checked = settings.voiceEnabled;
        document.getElementById('notifications-enabled').checked = settings.notifications;
        document.getElementById('sound-effects').checked = settings.soundEffects;
        document.getElementById('dark-mode').checked = settings.darkMode;
        document.getElementById('animations').checked = settings.animations;
        document.getElementById('voice-speed').value = settings.voiceSpeed || 1;
        document.getElementById('voice-pitch').value = settings.voicePitch || 1.2;
        document.getElementById('user-name').value = settings.userName || 'Friend';
        document.getElementById('winni-name').value = settings.winniName || 'Winni';
        
        // Apply dark mode
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Apply animations
        if (!settings.animations) {
            document.body.classList.add('no-animations');
        }
    }
});
