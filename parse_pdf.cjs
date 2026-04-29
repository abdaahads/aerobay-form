const fs = require('fs');
const pdf = require('pdf-parse');

const files = ["AeroBay Advanced .pdf", "AeroBay Offerings_Standard.pdf", "AeroBay Premium.pdf", "basix.pdf"];

async function run() {
  for (const file of files) {
    try {
      const dataBuffer = fs.readFileSync(file);
      const data = await pdf(dataBuffer);
      fs.writeFileSync(file.replace('.pdf', '_node.txt').replace(/ /g, '_'), data.text);
      console.log(`Extracted ${file}`);
    } catch(e) {
      console.error(`Failed ${file}`, e.message);
    }
  }
}
run();
