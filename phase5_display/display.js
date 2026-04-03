/**
 * Formats the generated recommendations into a visually appealing string representation for CLI UI.
 * @param {Array} suggestions - Array of suggestion objects { giftName, reason }.
 * @returns {string} - The formatted string ready to be logged to the console.
 */
function formatSuggestions(suggestions) {
    let output = "\n=========================================\n";
    output += "           ✨ Top Suggestions ✨          \n";
    output += "=========================================\n\n";
    
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
        output += "We couldn't generate specific suggestions based on this profile.\n";
        return output;
    }

    suggestions.forEach((item, i) => {
        const name = item.giftName || "Creative Idea";
        const reason = item.reason || "We thought they would like this based on their interests.";
        output += `${i + 1}. ${name}\n`;
        output += `   Why? ${reason}\n\n`;
    });

    // Remove the final trailing whitespace and add a single newline for cleanliness
    return output.trimEnd() + "\n";
}

module.exports = { formatSuggestions };
