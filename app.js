require('dotenv').config();
const readline = require('readline');
const path = require('path');

// Import Modules from Phases 1-4
const { ingestDataset } = require('./phase1_data_ingestion/ingest');
const { validateProfile } = require('./phase2_user_input/validator');
const { defaultStore } = require('./phase3_integrate/profileStore');
const { RecommendationGenerator } = require('./phase4_recommendation/generator');
const { formatSuggestions } = require('./phase5_display/display');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));
const datasetPath = path.join(__dirname, 'phase1_data_ingestion', 'dataset.csv');

async function main() {
    console.log("Loading dataset... (Phase 1)");
    let dataset;
    try {
        dataset = await ingestDataset(datasetPath);
    } catch (err) {
        console.error("Failed to load dataset:", err);
        process.exit(1);
    }

    console.log("\n=========================================");
    console.log("   Gifting Recommendations Service ✨    ");
    console.log("=========================================\n");

    // Phase 2: Capture Input
    const giftFor = await askQuestion("Who is this gift for? (e.g., Friend): ");
    const interests = await askQuestion("What are their interests? (e.g., Music): ");
    const occasion = await askQuestion("What is the occasion? (e.g., Birthday): ");
    const budget = await askQuestion("What is your budget limit? (e.g., Low, High): ");
    rl.close();

    console.log("\nValidating Input... (Phase 2 Validation)");
    const validation = validateProfile({ giftFor, interests, occasion, budget });

    if (!validation.isValid) {
        console.error("Invalid Input:", validation.errors.join(", "));
        process.exit(1);
    }

    console.log("Saving Profile... (Phase 3 Integration)");
    const profileId = defaultStore.saveProfile(validation.data);
    const savedProfile = defaultStore.getProfile(profileId);

    console.log("Generating AI Recommendations... (Phase 4 Recommendation)");
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        console.log("\n[!] WARNING: Valid GROQ_API_KEY is missing in .env file! API will crash.");
    }

    const generator = new RecommendationGenerator(process.env.GROQ_API_KEY);
    try {
        // Prepare context data efficiently for the LLM
        const contextStr = dataset.map(d => `Target: ${d.giftFor}, Interests: ${d.interests}, Budget: ${d.budget} -> Suggests: ${d.suggestion}`).join("\n");
        const ideas = await generator.generateSuggestions(savedProfile, contextStr);

        // Phase 5 Output Formatting
        const output = formatSuggestions(ideas);
        console.log(output);

    } catch (err) {
        console.error("\nFailed to generate ideas:", err.message);
    }
}

main();
