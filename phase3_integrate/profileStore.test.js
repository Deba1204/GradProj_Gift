const { ProfileStore } = require('./profileStore');

describe('Phase 3: Integration - Profile Store', () => {
    let store;

    beforeEach(() => {
        // Use a fresh instance for every test
        store = new ProfileStore();
    });

    test('Successfully saves a profile and returns an ID', () => {
        const profileData = { giftFor: 'Friend', interests: 'Music', occasion: 'Birthday', budget: 'Low' };
        
        const profileId = store.saveProfile(profileData);
        expect(profileId).toBeDefined();
        expect(typeof profileId).toBe('string');
        expect(profileId.length).toBeGreaterThan(0);
    });

    test('Retrieves the exact saved profile using the ID', () => {
        const profileData = { giftFor: 'Hero', interests: 'Action', occasion: 'Victory', budget: 'High' };
        
        const profileId = store.saveProfile(profileData);
        const retrieved = store.getProfile(profileId);
        
        expect(retrieved).toEqual(profileData);
    });

    test('Returns null when fetching a non-existent profile', () => {
        const retrieved = store.getProfile('invalid-id-xyz');
        expect(retrieved).toBeNull();
    });

    test('Throws error when saving a null profile', () => {
        expect(() => {
            store.saveProfile(null);
        }).toThrow("Cannot save empty profile.");
    });
});
