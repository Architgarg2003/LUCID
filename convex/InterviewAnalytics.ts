import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { action } from "./_generated/server";


export const createAnalytics = action({
    args: {
        answerSet: v.array(
            v.object({
                question: v.string(),
                userAnswer: v.string(),
            })
        )
    },
    handler: async (ctx, args) => {
        console.log(args.answerSet);
        const genAI = new GoogleGenerativeAI('AIzaSyBSIh1TNpbNfI-6mj4OqJQE6sfYOjSWAZM');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const formattedAnswerSet = JSON.stringify(args.answerSet, null, 2);

        const prompt = `
Analyze the entire interview data and evaluate the candidate's overall performance based on the following criteria, given that you ignore spelling mistakes, casual flukes, and you have to strictly stick to the quality of the answer given by the user for evaluation. Strictly keep the output short and concise and meaningful for the user to read and understand:

    - Strength: List the key positive points based on the overall interview performance.
    - Weakness: List the areas needing improvement based on the overall interview performance, give some reasonable improvement suggestions, maybe in new topics relevant to their future in the interview, not always, only in situations where there is nothing really to point.
    - Summary: Provide an insightful summary of the candidate's performance in one concise sentence.
    - Score: Rate the overall interview performance on a scale of 100, based on confidence, accuracy of answers, how short and precise it was, and the quality overall. Also, this value has to strictly be a 2 digit answer.

Interview Data is provided bellow which is an array of objects containing question and userAnswer for each question 
for example :[
  {
    question: '.....',
    userAnswer: '....'
  },
   {
    question: '.....',
    userAnswer: '....'
  },...
]
${formattedAnswerSet}

Please provide the output in the following JSON format without any additional formatting or markdown:

    [{
      "strength": [
        "Demonstrates strong understanding of full-stack development concepts, particularly in the context of building complex applications.",
        "Possesses practical experience with distributed environments and collaboration tools, ensuring smooth team communication.",
        "Displays expertise in using React, Node.js, MongoDB, and other technologies to build real-time features.",
        "Highlights knowledge of RESTful APIs, authentication, error handling, and data formatting.",
        "Shows proficiency in using Docker and Kubernetes for containerization, scaling, and orchestration.",
        "Expresses familiarity with Agile methodologies and contributes actively to team processes."
      ],
      "weakness": [
        "Candidate's answers are comprehensive and well-structured, highlighting their experience and technical skills.  There is no area for improvement, they have covered all the topics and showcased their knowledge with relevant examples.",
        "Could potentially delve deeper into specific challenges faced in implementing solutions, providing more context on the problem-solving process."
      ],
      "summary": "The candidate demonstrates a strong understanding of full-stack development, distributed environments, and Agile methodologies, showcasing their practical experience and technical expertise.",
      "score": "95"
    }]
    `;

    console.log(prompt);

        try {
            const result = await model.generateContent(prompt);
            let text = await result.response.text(); // Await text extraction

            console.log("AI Response Text:", text); // Log response for debugging

            // Clean up and parse JSON
            text = text.replace(/```json\n|\n```/g, '').trim();
            const analytics = JSON.parse(text);

            return analytics;
        } catch (error) {
            console.error("Error generating analytics:", error);
            throw new Error("Failed to generate analytics.");
        }
    },
}) 