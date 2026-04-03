const { validateProfile } = require('./validator');

describe('Phase 2: User Input Validation', () => {
    
    test('Successfully validates & normalizes a correct profile', () => {
        const input = {
            giftFor: 'Friend ',
            interests: ' Music ',
            occasion: 'Birthday',
            budget: 'Low'
        };
        const result = validateProfile(input);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toBeUndefined();
        // Assert normalization
        expect(result.data.giftFor).toBe('Friend'); 
        expect(result.data.interests).toBe('Music');
    });

    test('Fails gracefully when multiple fields are missing', () => {
        const input = {
            giftFor: 'Friend '
            // missing interests, occasion, budget
        };
        const result = validateProfile(input);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(3);
        expect(result.errors).toContain("Missing or invalid 'interests'");
    });

    test('Fails on completely empty/null input', () => {
        const result = validateProfile(null);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(4);
    });

    test('Fails when fields are empty strings', () => {
        const input = {
            giftFor: '   ',
            interests: '   ',
            occasion: '   ',
            budget: '   '
        };
        const result = validateProfile(input);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(4);
    });

});
