const readline = require('readline');

// Polyfill for fetch if running on Node < 18
const fetch = global.fetch || require('node-fetch');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_URL = 'http://localhost:3000';

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function startConversation() {
    console.log("=========================================");
    console.log("   Gifting Recommendations Service ✨    ");
    console.log("=========================================\n");
    console.log("Let's find the perfect gift!\n");

    const giftFor = await askQuestion("Who is this gift for? (e.g., Friend, Mother, Sister, Partner): ");
    const interests = await askQuestion("What are their interests? (e.g., Music, Fashion, Sports, Tech): ");
    const occasion = await askQuestion("What is the occasion? (e.g., Birthday, Anniversary, Promotion): ");
    const budget = await askQuestion("What is your budget limit? (e.g., Low, Mid 1000-5000 INR, High): ");

    console.log("\nBuilding your profile...");

    try {
        // Step 1: Build Profile
        const profileRes = await fetch(`${API_URL}/buildProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ giftFor, interests, occasion, budget })
        });

        if (!profileRes.ok) {
            throw new Error(`Failed to build profile: ${profileRes.statusText}`);
        }

        const profileData = await profileRes.json();
        const profileId = profileData.profileId;
        
        console.log(`Profile created! Generating ideas via AI... (Please wait a few seconds)\n`);

        // Step 2: Generate Ideas
        const ideasRes = await fetch(`${API_URL}/generateIdeas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profileId })
        });

        if (!ideasRes.ok) {
            const errBody = await ideasRes.text();
            throw new Error(`Failed to generate ideas: ${errBody}`);
        }

        const ideasData = await ideasRes.json();
        
        console.log("=========================================");
        console.log("           ✨ Top Suggestions ✨          ");
        console.log("=========================================\n");

        if (ideasData.suggestions && Array.isArray(ideasData.suggestions)) {
            ideasData.suggestions.forEach((item, index) => {
                console.log(`${index + 1}. ${item.giftName}`);
                console.log(`   Why? ${item.reason}\n`);
            });
        } else {
            console.log("No suggestions found or invalid format received:", ideasData);
        }

    } catch (err) {
        console.error("Error communicating with server:", err.message);
        console.log("Make sure your backend is running (`node server.js`) andGROQ_API_KEY is set in .env.");
    } finally {
        rl.close();
    }
}

startConversation();
