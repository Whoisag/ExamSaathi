const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const file1 = '/home/whoisag/Downloads/Class12_PCM_1000_Question_Bank.csv';
const file2 = '/home/whoisag/Downloads/Class12_PCM_Additional_1000_Question_Bank.csv';
const file3 = '/home/whoisag/Downloads/Class12_PCM_All_Chapters_Exactly_1000.csv';

const output = path.join(__dirname, '../public/data/csv_questions.json');

const allQuestions = [];
let idCounter = 1;

function parseFile(filePath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return resolve();
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        results.data.forEach(row => {
          if (!row.Subject || !row.Question) return;
          
          let subject = row.Subject.trim();
          if (subject.toLowerCase() === 'maths' || subject.toLowerCase() === 'math') subject = 'Mathematics';
          if (subject.toLowerCase() === 'physics') subject = 'Physics';
          if (subject.toLowerCase() === 'chemistry') subject = 'Chemistry';
          
          const rawDifficulty = (row.Difficulty || 'Medium').trim();
          const difficulty = rawDifficulty.charAt(0).toUpperCase() + rawDifficulty.slice(1).toLowerCase();

          const q = {
            id: `csv-${idCounter++}`,
            exam: 'cbse-12',
            subject: subject,
            chapter: row.Chapter ? row.Chapter.trim() : 'Miscellaneous',
            year: 2026,
            marks: difficulty === 'Hard' ? 5 : (difficulty === 'Medium' ? 3 : 1),
            questionType: 'Short Answer',
            difficulty: difficulty,
            questionText: row.Question.trim(),
            sourceType: 'csv_bank',
            analyzerTags: ['PCM Question Bank', row.Chapter ? row.Chapter.trim() : 'General'],
            answer: row.Answer ? row.Answer.trim() : '',
            hint: 'Review the fundamental formulas and step-by-step principles for this topic.'
          };
          allQuestions.push(q);
        });
        resolve();
      }
    });
  });
}

async function main() {
  await parseFile(file1);
  await parseFile(file2);
  await parseFile(file3);
  fs.writeFileSync(output, JSON.stringify(allQuestions, null, 2));
  console.log(`Saved ${allQuestions.length} total questions to ${output}`);
}

main();
