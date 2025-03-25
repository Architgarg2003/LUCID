
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI('AIzaSyBK1edzaiNbCD3ngi7OL2yX-z3XqBjKuG4');

// const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export const generateTags = async (questions: any[]) => {
//     const prompt = `
// Based on the following array of multiple-choice questions (MCQs), generate a list of three technical tags that best represent the overall content of the questions. The tags should be relevant to the technical concepts, skills, or technologies mentioned in the questions. The tags should be provided in an array format, with each tag being a concise and specific term.

// Questions:
// [
//   {
//     "question": "What is the primary responsibility of a Full Stack Developer?",
//     "options": [
//       "Designing the user interface",
//       "Managing the database",
//       "Handling both front-end and back-end development",
//       "Creating marketing strategies"
//     ],
//     "answer": 3
//   },
//   {
//     "question": "Which of the following technologies is most commonly used for front-end development?",
//     "options": [
//       "Node.js",
//       "React.js",
//       "MongoDB",
//       "Python"
//     ],
//     "answer": 2
//   }
// ]

// Please provide the output in the following JSON format without any additional text or formatting:

// {
//   "tags": ["Tag1", "Tag2", "Tag3"]
// }

// `;

//     try {
//         const result = await model1.generateContent(prompt);
//         const response = result.response;
//         let text = response.text();

//         // Remove any markdown formatting if present
//         text = text.replace(/```json\n|\n```/g, '').trim();

//         // Parse the JSON string to an object
//         const mcqArray = JSON.parse(text);

//         // Validate the structure of the generated MCQs
//         if (!Array.isArray(mcqArray) || mcqArray.length === 0) {
//             throw new Error("Invalid Tags format generated");
//         }

//         return mcqArray;
//     } catch (error) {
//         console.error("Error generating Tags:", error);
//         throw new Error("Failed to generate Tags");
//     }
// }


// import { v } from "convex/values";
// import { action } from "./_generated/server";

// export const getTags = action({
//     args: {
//         questions: v.any()
//     },
//     handler: async (ctx, args) => {
//         const tags = await generateTags(args.questions);
//         return tags;
//     },
// });



// File: convex/getTags.ts

import { v } from "convex/values";
import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyBSIh1TNpbNfI-6mj4OqJQE6sfYOjSWAZM');
const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateTags(questions: any[]) {
    const prompt = `
Based on the following array of multiple-choice questions (MCQs), generate a list of three technical tags that best represent the overall content of the questions. The tags should be relevant to the technical concepts, skills, or technologies mentioned in the questions. The tags should be provided in an array format, with each tag being a concise and specific term.

Questions:
${JSON.stringify(questions, null, 2)}

Please provide the output in the following JSON format without any additional text or formatting:

{
  "tags": ["Tag1", "Tag2", "Tag3"]
}
`;

    try {
        const result = await model1.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Remove any markdown formatting if present
        text = text.replace(/```json\n|\n```/g, '').trim();

        // Parse the JSON string to an object
        const tagsObject = JSON.parse(text);

        // Validate the structure of the generated tags
        if (!Array.isArray(tagsObject.tags) || tagsObject.tags.length === 0) {
            throw new Error("Invalid Tags format generated");
        }

        return tagsObject.tags;
    } catch (error) {
        console.error("Error generating Tags:", error);
        throw new Error("Failed to generate Tags");
    }
}

export const getTags = action({
    args: {
        questions: v.array(v.object({
            question: v.string(),
            options: v.array(v.string()),
            answer: v.number()
        }))
    },
    handler: async (ctx, args) => {
        const tags = await generateTags(args.questions);
        return tags;
    },
});