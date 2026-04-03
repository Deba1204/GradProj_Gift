const crypto = require('crypto');

class ProfileStore {
    constructor() {
        this.profiles = new Map();
    }

    /**
     * Saves a user profile and returns a unique profileId.
     * @param {Object} validProfileData - Extracted and validated profile data.
     * @returns {string} - The unique profile ID required for later retrieval.
     */
    saveProfile(validProfileData) {
        if (!validProfileData) {
            throw new Error("Cannot save empty profile.");
        }
        
        // Generate a pseudo-unique UUID
        const profileId = crypto.randomUUID 
            ? crypto.randomUUID() 
            : Date.now().toString() + Math.random().toString(36).substring(2, 9);
            
        this.profiles.set(profileId, validProfileData);
        return profileId;
    }

    /**
     * Retrieves a profile by ID
     * @param {string} profileId 
     * @returns {Object|null} - The profile data or null if not found
     */
    getProfile(profileId) {
        return this.profiles.get(profileId) || null;
    }

    /**
     * Clears all profiles from memory (useful for testing/resetting)
     */
    clearAll() {
        this.profiles.clear();
    }
}

// Export a singleton instance for actual usage, and the class for standalone testing
const defaultStore = new ProfileStore();

module.exports = { 
    ProfileStore,
    defaultStore
};
