import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const generateInterviewQuestions = action({
    args: {
        jobTitle: v.string(),
        jobDescription: v.string(),
        resume: v.string(),
        difficulty: v.string(),
        companyName: v.string(),
    },
    handler: async (ctx, args) => {
        const genAI = new GoogleGenerativeAI('AIzaSyBSIh1TNpbNfI-6mj4OqJQE6sfYOjSWAZM');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `

      Given the candidate's resume, the job description, and the job title, generate 5 to 6 thoughtful and 
      specific HR interview question that directly relates to the candidate's qualifications and the job requirements. 
      Ensure the question is open-ended, allowing the candidate to elaborate on their skills, experiences, and qualifications. 
      The question should be designed to encourage the candidate to provide detailed responses 
      that highlight their suitability for the role

      Job Title: ${args.jobTitle}

      Company Name: ${args.companyName}

      Job Description: 
      ${args.jobDescription}

      User's Resume: 
      ${args.resume}

      difficulty level:
      ${args.difficulty}

      Please provide the output in the following JSON format without any additional formatting or markdown:

      [
        {
          "question": "What is the primary responsibility of a Full Stack Developer?",
        },
        {
          "question": "Which of the following technologies is most commonly used for front-end development?",
        }
      ]
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            let text = response.text();

            // Remove any markdown formatting if present
            text = text.replace(/```json\n|\n```/g, '').trim();

            // Parse the JSON string to an object
            const mcqArray = JSON.parse(text);

            return mcqArray;
        } catch (error) {
            console.error("Error generating interview Questions:", error);
            throw new Error("Failed to interview Qs");
        }
    },
});


// //////////////////////////////////

import { mutation } from "./_generated/server";

type InterviewItem = {
    question: string;
};

export const push_Interview = mutation({
    args: {
        userId: v.string(),
        mcqArray: v.array(
            v.object({
                question: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        try {
            const formattedMCQ = args.mcqArray.map((item: InterviewItem) => ({
                question: item.question
            }));

            const newInterviewId = await ctx.db.insert("Interview", {
                userId: args.userId,
                date: new Date().toISOString(),
                QuestionSet: formattedMCQ,
            });

            return newInterviewId;
        } catch (error) {
            console.error("Error in push_interview mutation:", error);
            throw new Error("Failed to store interview Qs");
        }
    }
});