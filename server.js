const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve current directory

// Enhanced chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message, context, mood } = req.body;
    
    // You could integrate with OpenAI API here
    // const response = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: message }]
    // });
    
    // For now, enhanced responses
    const enhancedResponses = [
        `Berry says: "${message}" is fascinating! Let me think about that with my bear wisdom... 🐻✨`,
        `Hmm... as a magical bear, I sense that "${message}" holds special meaning! 🌟`,
        `The forest spirits whisper that "${message}" connects to the ancient magic of the woods! 🌳`,
        `Berry's magical interpretation: "${message}" reminds me of honey-drenched adventures! 🍯`,
        `With my fuzzy bear logic, I believe "${message}" reveals hidden truths! 🔮`
    ];
    
    const randomResponse = enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)];
    
    res.json({
        response: randomResponse,
        mood: mood || 'curious',
        timestamp: new Date().toISOString(),
        magicLevel: Math.floor(Math.random() * 100),
        energyChange: Math.floor(Math.random() * 10) - 2
    });
});

// Weather proxy endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { lat = 52.52, lon = 13.41 } = req.query;
        
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );
        
        res.json({
            ...response.data,
            magicDescription: generateWeatherMagic(response.data.current)
        });
    } catch (error) {
        console.error('Weather API error:', error);
        res.json({
            current: {
                temperature_2m: 22,
                wind_speed_10m: 12,
                relative_humidity_2m: 65,
                time: new Date().toISOString()
            },
            magicDescription: "The weather is enchanted with sunny magic today! ☀️✨"
        });
    }
});

function generateWeatherMagic(weather) {
    const temp = weather.temperature_2m;
    const wind = weather.wind_speed_10m;
    const humidity = weather.relative_humidity_2m;
    
    if (temp > 25) return "Perfect weather for sunbathing and honey collecting! 🐻☀️";
    if (temp < 0) return "Brr! Time to hibernate with warm bear hugs! ❄️🛌";
    if (wind > 20) return "The wind whispers ancient forest secrets today! 💨🌳";
    if (humidity > 80) return "The air is thick with magic and mist! Perfect for mushroom spotting! 🍄";
    
    return "A beautifully balanced day in the enchanted forest! 🌟";
}

// Magic spells endpoint
app.get('/api/spells', (req, res) => {
    const spells = [
        { name: "Berry's Hug Spell", effect: "+10 Happiness", emoji: "🐻💕" },
        { name: "Honey Drizzle", effect: "+5 Energy", emoji: "🍯✨" },
        { name: "Forest Whisper", effect: "Weather Insight", emoji: "🌳👂" },
        { name: "Starlight Beam", effect: "Mood Boost", emoji: "🌟✨" },
        { name: "Berry Blossom", effect: "Friendship Growth", emoji: "🍓🌸" }
    ];
    
    res.json({
        spells: spells,
        magicalEnergy: Math.floor(Math.random() * 100),
        forestBlessing: true
    });
});

// Story generator endpoint
app.post('/api/story', (req, res) => {
    const { theme = 'adventure' } = req.body;
    
    const stories = {
        adventure: "Once, Berry discovered a map to the Crystal Caves where fireflies danced in rainbow colors...",
        mystery: "In the foggy morning, Berry found paw prints leading to the Whispering Willow...",
        magic: "On a starry night, the Northern Lights taught Berry the dance of the cosmos...",
        friendship: "Berry met a lonely squirrel and together they built the greatest nut fortress...",
        seasonal: "As autumn leaves fell, Berry learned the secret language of the changing seasons..."
    };
    
    res.json({
        story: stories[theme] || stories.adventure,
        moral: "True magic lies in friendship and curiosity!",
        length: "short",
        interactive: true
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✨ Berry Bear Magic Server running on port ${PORT} ✨`);
    console.log(`🐻 Berry says: "Welcome to the enchanted forest!" 🌳`);
});
