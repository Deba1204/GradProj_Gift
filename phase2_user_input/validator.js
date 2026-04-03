/**
 * Validates the raw user input captured from the CLI/Frontend.
 * Ensure missing or heavily malformed formats are blocked before processing.
 * 
 * @param {Object} input - The raw key-value pairs from the user.
 * @returns {Object} - Result object containing isValid (boolean) and either errors or normalized data.
 */
function validateProfile(input) {
    const { giftFor, interests, occasion, budget } = input || {};
    const errors = [];

    if (!giftFor || typeof giftFor !== 'string' || giftFor.trim() === '') {
        errors.push("Missing or invalid 'giftFor'");
    }
    if (!interests || typeof interests !== 'string' || interests.trim() === '') {
        errors.push("Missing or invalid 'interests'");
    }
    if (!occasion || typeof occasion !== 'string' || occasion.trim() === '') {
        errors.push("Missing or invalid 'occasion'");
    }
    if (!budget || typeof budget !== 'string' || budget.trim() === '') {
        errors.push("Missing or invalid 'budget'");
    }

    if (errors.length > 0) {
        return { isValid: false, errors };
    }

    return { 
        isValid: true, 
        data: {
            giftFor: giftFor.trim(),
            interests: interests.trim(),
            occasion: occasion.trim(),
            budget: budget.trim()
        } 
    };
}

module.exports = { validateProfile };
