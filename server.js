require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Modular Architecture Imports
const { ingestDataset } = require('./phase1_data_ingestion/ingest');
const { validateProfile } = require('./phase2_user_input/validator');
const { defaultStore } = require('./phase3_integrate/profileStore');
const { RecommendationGenerator } = require('./phase4_recommendation/generator');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const datasetPath = path.join(__dirname, 'phase1_data_ingestion', 'dataset.csv');
let stringifiedDatasetContext = "";

// Global Dataset Initialization Pipeline
async function initServer() {
    try {
        console.log("Loading dataset... (Phase 1)");
        const dataset = await ingestDataset(datasetPath);
        
        // Stringify the dataset purely as context
        stringifiedDatasetContext = dataset.map(d => `Target: ${d.giftFor}, Interests: ${d.interests}, Budget: ${d.budget} -> Suggests: ${d.suggestion}`).join("\n");
        console.log("Dataset successfully loaded into context map.");
        
        app.listen(PORT, () => {
            console.log(`Backend REST API is running elegantly on port ${PORT}`);
        });
    } catch(err) {
        console.error("Critical failure during dataset ingestion:", err);
        process.exit(1);
    }
}

// REST Endpoint linking React UI to the Modular Phase Engine
app.post('/api/recommendations', async (req, res) => {
    
    // 1. Process User Input Validation (Phase 2)
    const validation = validateProfile(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ error: "Invalid Input", details: validation.errors });
    }

    // 2. Integration & Store (Phase 3)
    const profileId = defaultStore.saveProfile(validation.data);
    const savedProfile = defaultStore.getProfile(profileId);

    // 3. Recommendation Generation (Phase 4)
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        return res.status(500).json({ error: "Server Configuration Error: Missing API Key." });
    }

    try {
        const generator = new RecommendationGenerator(process.env.GROQ_API_KEY);
        const ideas = await generator.generateSuggestions(savedProfile, stringifiedDatasetContext);

        // Serve valid payload to Web UI dynamically
        return res.status(200).json({ ideas, profileId });
    } catch (err) {
        console.error("Generator Error:", err.message);
        return res.status(500).json({ error: "Failed to generate recommendations via AI." });
    }
});

// Boot the Server
initServer();
