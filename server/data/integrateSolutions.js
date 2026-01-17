// Script to integrate solutions into sampleChallenges.js
// Run this with: node integrateSolutions.js

const fs = require('fs');
const path = require('path');

const sampleChallengesPath = path.join(__dirname, 'sampleChallenges.js');
const solutionsPath = path.join(__dirname, 'SOLUTIONS_TO_ADD.js');

// Read the current challenges file
let challengesContent = fs.readFileSync(sampleChallengesPath, 'utf8');

// Read the solutions
const solutions = require('./SOLUTIONS_TO_ADD.js');

// Challenge indices and their titles (for verification)
const challengeUpdates = [
  { index: 3, title: 'Real-time Data Processing Pipeline', solutions: solutions.challenge4Solutions },
  { index: 4, title: 'Multi-Region Disaster Recovery', solutions: solutions.challenge5Solutions },
  { index: 5, title: 'AI Chatbot Deployment', solutions: solutions.challenge6Solutions },
  { index: 6, title: 'Add Search to Existing E-commerce', solutions: solutions.challenge7Solutions },
  { index: 7, title: 'Add Caching to Slow API', solutions: solutions.challenge8Solutions },
  { index: 8, title: 'Extend Video Platform with Analytics', solutions: solutions.challenge9Solutions },
  { index: 9, title: 'Add AI Image Recognition to Photo App', solutions: solutions.challenge10Solutions }
];

console.log('Starting solution integration...\n');

// For each challenge, replace empty solutions: [] with actual solutions
challengeUpdates.forEach(({ index, title, solutions: solutionArray }) => {
  console.log(`Processing Challenge ${index + 1}: ${title}`);

  // Find the pattern for this challenge
  const searchPattern = new RegExp(
    `(title: "${title}"[\\s\\S]*?editorial: \`[\\s\\S]*?\`,\\s*)solutions: \\[\\]`,
    'g'
  );

  // Check if pattern exists
  const match = challengesContent.match(searchPattern);

  if (match) {
    // Convert solution objects to formatted string
    const solutionsStr = JSON.stringify(solutionArray, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
      .replace(/: "([^"]*?)"/g, ": '$1'"); // Change double quotes to single quotes for strings

    // Replace empty solutions array with populated one
    challengesContent = challengesContent.replace(
      searchPattern,
      `$1solutions: ${solutionsStr}`
    );

    console.log(`  ✓ Added ${solutionArray.length} solution(s)`);
  } else {
    console.log(`  ✗ Could not find matching pattern - may already have solutions or pattern mismatch`);
  }

  console.log('');
});

// Write the updated content back
fs.writeFileSync(sampleChallengesPath, challengesContent, 'utf8');

console.log('Solution integration complete!');
console.log(`\nUpdated file: ${sampleChallengesPath}`);
console.log('\nPlease review the changes and test the application.');
