const fs = require('fs');
const { parse } = require('csv-parse');

/**
 * Loads and parses the dataset CSV into a structured array of objects.
 * Handles data cleaning and standardization.
 * @param {string} filePath - the path to the CSV file
 * @returns {Promise<Array>} - Promise resolving to array of parsed records
 */
function ingestDataset(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .on('error', (err) => {
                reject(err);
            })
            .pipe(parse({
                columns: true,
                trim: true,
                skip_empty_lines: true
            }))
            .on('data', (data) => {
                // Ensure all fields exist
                if (data['Gift For'] && data['Interests'] && data['Occassion'] && data['Budget']) {
                    results.push({
                        giftFor: data['Gift For'].trim(),
                        interests: data['Interests'].trim(),
                        occasion: data['Occassion'].trim(),
                        budget: data['Budget'].trim(),
                        suggestion: data['Gift Suggestion'] ? data['Gift Suggestion'].trim() : ''
                    });
                }
            })
            .on('end', () => {
                resolve(results);
            });
    });
}

/**
 * Format budget into generic categories ['Low', 'Mid', 'High'] roughly
 * matching the original string parsing if requested in later phases
 */
function standardizeBudgetTier(budgetStr) {
    const b = budgetStr.toLowerCase();
    if (b.includes('low') || b.includes('<1000')) return 'Low';
    if (b.includes('mid') || b.includes('1000-5000')) return 'Mid';
    if (b.includes('high') || b.includes('>5000')) return 'High';
    return budgetStr; // Unknown fallback
}

module.exports = {
    ingestDataset,
    standardizeBudgetTier
};
