const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// API endpoints for enhanced features
app.post('/api/chat', (req, res) => {
    const { message, context } = req.body;
    
    // You could integrate with OpenAI API here
    // const aiResponse = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: message,
    //     max_tokens: 150
    // });
    
    // For now, simple echo
    const responses = [
        "I heard you say: " + message,
        "That's interesting! Tell me more about that.",
        "As a bear AI, I think... hmm... let me ponder that.",
        "Berry is thinking... 🐻... " + message + " is fascinating!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
        response: randomResponse,
        mood: 'curious',
        timestamp: new Date().toISOString()
    });
});

// Weather proxy endpoint (to avoid CORS issues)
app.get('/api/weather', async (req, res) => {
    try {
        // In production, use a real weather API with your key
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=0.1278&current_weather=true');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({
            current_weather: {
                temperature: 22,
                weathercode: 0,
                time: new Date().toISOString()
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Berry Bear AI Server running on port ${PORT}`);
});
