const questionAnswerPrompt = ({ role, experience, topicsToFocus, numberOfQuestions, existingQuestions = [] }) => {
    const avoidRepeatsBlock = existingQuestions.length > 0
        ? `\n- Do NOT repeat, or closely rephrase, any of these already-asked questions:\n${existingQuestions.map((q) => `  - ${q}`).join("\n")}\n`
        : "";

    return `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write exactly ${numberOfQuestions} unique and varied interview questions.
- For each question, write a deep, well-structured answer that:
  - Clearly defines the concept and explains why it matters for a ${role}.
  - Walks through a practical example or real-world scenario, not just a definition.
  - Includes a small code example inside the answer when the topic is code-related.
  - Covers common trade-offs, edge cases, or pitfalls a candidate should be ready to discuss.
  - Is thorough enough for a candidate to actually learn from (roughly 120-200 words), not a one-line summary.
- IMPORTANT: Return a JSON array of exactly ${numberOfQuestions} objects, even if you have to invent plausible questions to reach the count. Do not return fewer than ${numberOfQuestions} items.${avoidRepeatsBlock}
- Add a randomizer: ${Math.random()} and timestamp: ${Date.now()} to ensure uniqueness.
- Keep formatting very clean.
- Return a pure JSON array like:

[
  {
    "question": "Question here?",
    "answer": "Answer here."
  },
  ...
]

Important: Do NOT add any extra text. Only return valid JSON.
`;
};

const conceptExplainPrompt = (question) =>( `
You are an AI trained to generate in-depth explanations for a given interview question.

Task:

- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- Structure the explanation to cover, in order:
  - The core definition, in plain language.
  - Why the concept matters in real-world software engineering.
  - A practical example or step-by-step walkthrough.
  - Common pitfalls, trade-offs, or likely interviewer follow-up questions.
- Make the explanation thorough enough for a candidate to genuinely learn from (roughly 200-350 words), not a one- or two-sentence summary.
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- If the explanation includes a code example, provide a small code block.
- Keep the formatting very clean and clear.
- Return the result as a valid JSON object in the following format:

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`);


export { questionAnswerPrompt, conceptExplainPrompt };


