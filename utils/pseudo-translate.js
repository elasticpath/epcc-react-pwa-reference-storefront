
const fs = require('fs');
const path = require('path');
const localizer = require("app-localizer");

const inputPath = path.join(__dirname, './../src/locales/en.json');
const inputStr = fs.readFileSync(inputPath, 'utf8');
const input = JSON.parse(inputStr);

const output = {};

for (let key in input) {
  output[key] = localizer.toPseudoText(input[key], { accents: true, expander: 0, wordexpander: 0.3 });
}

const outputPath = path.join(__dirname, './../src/locales/fr.json');
const outputStr = JSON.stringify(output, null, 2);

fs.writeFileSync(outputPath, outputStr, 'utf8');
