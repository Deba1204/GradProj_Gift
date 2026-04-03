const path = require('path');
const { ingestDataset, standardizeBudgetTier } = require('./ingest');

const datasetPath = path.join(__dirname, 'dataset.csv');

describe('Phase 1: Data Ingestion', () => {
    test('standardizeBudgetTier correctly categorizes strings', () => {
        expect(standardizeBudgetTier('Low (<1000 INR) 500-1000')).toBe('Low');
        expect(standardizeBudgetTier('Mid (1000-5000) INR')).toBe('Mid');
        expect(standardizeBudgetTier('High (>5000 INR)')).toBe('High');
        expect(standardizeBudgetTier('Unknown budget string')).toBe('Unknown budget string');
    });

    test('ingestDataset successfully parses the dataset into objects', async () => {
        const data = await ingestDataset(datasetPath);
        
        // Ensure data is parsed and is an array
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0); // Assuming the CSV is not empty
        
        // Assert structure of objects
        const firstRow = data[0];
        expect(firstRow).toHaveProperty('giftFor');
        expect(firstRow).toHaveProperty('interests');
        expect(firstRow).toHaveProperty('occasion');
        expect(firstRow).toHaveProperty('budget');
        expect(firstRow).toHaveProperty('suggestion');
    });

    test('ingestDataset correctly maps the "Friend" Birthday data', async () => {
        const data = await ingestDataset(datasetPath);
        
        const testCase = data.find(row => 
            row.giftFor === 'Friend' && 
            row.interests === 'Music' && 
            row.occasion === 'Birthday'
        );
        
        expect(testCase).toBeDefined();
        if (testCase) {
             expect(testCase.suggestion).toBe('Earphones');
        }
    });

    test('ingestDataset gracefully fails on bad file paths', async () => {
        await expect(ingestDataset('bad_path_does_not_exist.csv')).rejects.toThrow(/ENOENT/);
    });
});
