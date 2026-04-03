const { RecommendationGenerator } = require('./generator');
const { Groq } = require('groq-sdk');

// Mock out the entire groq-sdk so we aren't making real network requests during unit tests
jest.mock('groq-sdk');

describe('Phase 4: Recommendation Generator', () => {
    let generator;

    beforeEach(() => {
        // Clear all mock instances and calls to constructor before each test runs
        Groq.mockClear();
    });

    test('Successfully generates and parses suggestions', async () => {
        // Setup a fake successful response payload matching what Groq would yield
        const mockResponse = {
            choices: [{
                message: {
                    content: JSON.stringify({
                        suggestions: [
                            { giftName: "Mocked Earphones", reason: "Music lover limit" }
                        ]
                    })
                }
            }]
        };

        const mockCreate = jest.fn().mockResolvedValue(mockResponse);
        Groq.mockImplementation(() => {
            return {
                chat: {
                    completions: {
                        create: mockCreate
                    }
                }
            };
        });

        generator = new RecommendationGenerator('fake-test-key');

        const testProfile = { giftFor: 'Friend', interests: 'Music', occasion: 'Birthday', budget: 'Low' };
        const suggestions = await generator.generateSuggestions(testProfile, "Csv Data Setup");
        
        expect(suggestions).toBeDefined();
        expect(suggestions.length).toBe(1);
        expect(suggestions[0].giftName).toBe("Mocked Earphones");
        // Verify we actually triggered the mock API
        expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    test('Throws error if parsing JSON completely fails', async () => {
        const mockResponse = {
            choices: [{ message: { content: "This is a raw text string, not json!" } }]
        };

        const mockCreate = jest.fn().mockResolvedValue(mockResponse);
        Groq.mockImplementation(() => {
            return { chat: { completions: { create: mockCreate } } };
        });

        generator = new RecommendationGenerator('fake-test-key');
        
        await expect(generator.generateSuggestions({}, "csv data")).rejects.toThrow("Failed to parse JSON from AI.");
    });

    test('Throws validation errors for missing dependencies', async () => {
        generator = new RecommendationGenerator('dummy-key');

        await expect(generator.generateSuggestions(null, "context")).rejects.toThrow("Profile is required.");
        await expect(generator.generateSuggestions({}, null)).rejects.toThrow("Dataset context is required.");
    });
});
