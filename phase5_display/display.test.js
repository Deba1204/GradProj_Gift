const { formatSuggestions } = require('./display');

describe('Phase 5: Display Formatting Engine', () => {
    
    test('Correctly formats a valid array of suggestions', () => {
        const ideas = [
            { giftName: "Football", reason: "Because they like sports." },
            { giftName: "Jersey", reason: "A matching team jersey." }
        ];
        
        const output = formatSuggestions(ideas);
        
        expect(output).toContain("Top Suggestions");
        expect(output).toContain("1. Football");
        expect(output).toContain("Why? Because they like sports.");
        expect(output).toContain("2. Jersey");
        expect(output).toContain("Why? A matching team jersey.");
    });

    test('Handles empty arrays gracefully', () => {
        const output = formatSuggestions([]);
        expect(output).toContain("We couldn't generate specific suggestions");
        expect(output).not.toContain("1.");
    });

    test('Gracefully falls back when properties are missing natively', () => {
        const ideas = [
            { giftName: "Mystery Gift" }, // missing reason
            { reason: "Because it's nice." } // missing name
        ];
        const output = formatSuggestions(ideas);
        
        expect(output).toContain("1. Mystery Gift");
        expect(output).toContain("Why? We thought they would like this"); // Fallback trigger
        expect(output).toContain("2. Creative Idea"); // Fallback trigger
        expect(output).toContain("Why? Because it's nice.");
    });

    test('Handles null or non-array inputs safely', () => {
        const output = formatSuggestions(null);
        expect(output).toContain("We couldn't generate specific suggestions");
    });
});
