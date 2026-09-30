const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('E:/portlandpunk/client/public/rain-blade.html', 'utf8');

// Extract all <script> blocks
const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const code = match[1];
  // Skip external scripts that have src="..." and empty innerHTML
  if (!code.trim()) continue;

  try {
    new vm.Script(code);
    console.log(`Script #${scriptIndex} syntax OK (${code.length} characters)`);
  } catch (err) {
    console.error(`Script #${scriptIndex} SYNTAX ERROR:`, err.message);
    errors++;
  }
}

if (errors === 0) {
  console.log('ALL SCRIPTS PASSED SYNTAX VALIDATION PERFECTLY!');
  process.exit(0);
} else {
  console.error(`Found ${errors} syntax errors.`);
  process.exit(1);
}
