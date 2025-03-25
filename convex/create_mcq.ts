

import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const generateMCQ = action({
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
You are a Candidate Evaluation AI bot, working for the ${args.companyName} company. The company provided is looking for a candidate suitable for this Job Title: ${args.jobTitle} and Job Description: ${args.jobDescription}. 
The company prefers the difficulty level of the questions to be ${args.difficulty}. The company is strictly serious about hiring it's next employee and they want to screen the employee of these following parameters:
- The candidate should have a great understanding of the job description.
- Questions asked should be case and scenario based on real life implementation of the employee's on the job.
- The candidate should have a good understanding of the company.
- Above Average knowledge of Data Structures and Algorithms.
- There is no easy level, if the given difficulty level is easy, the question asked should be of medium level.If the given difficulty level is medium, the question asked should be of hard level.If the given difficulty level is hard, the question asked should be of very hard level.
- Given the Job Description, the candidate should be a 80% fit for the job role.
- In relation to the specific job role, the candidate should have a deep understanding of the skills and qualifications required as set per the difficulty level.
- The candidate should have a great and in-depth understanding of the technologies, tools and projects mentioned in the resume related to the Job Title.
- Plus, any aptitude questions that you think are relevant to the job role.
- Should be a great fit for the company culture.
- The Questions asked should reflect questions as if asked by a real interviewer.

You as a bot, which knows about the company, and the company data and background and everything relevant to its existence hs already being fed into your training set, you have to craft 15-20 Multiple choice based questions. The provided ${args.resume} should be used as a reference on what the candidate knows and where he stands as per the set standards.
The questions asked should be to judge the candidate for the job role on the basic of the job description according to the company standards and should be somewhat referred to the candidate's resume. The options given for the MCQs should be strategical, and should by themselves be a little tricky and must make the candidate to use their brain.
Please provide the output in the following JSON format without any additional formatting or markdown And Make sure to start the answer index from 1:
      [
        {
          "question": (Question in a sentence or two),
          "options": [(4 options with one correct answer, seperated by comma)],
          "answer": (index of the correct answer)
        }
      ]
      
No questions about experience should be asked. All questions stated should be used to state the eligibility of the candidate for the job role.
The company is a huge conglomerate, so the questions asked should not hurt the company's reputation to it's standards for hiring candidates.
Strictly Refrain from asking How, What, Why, When, Where questions about frameworks, processes or technologies. The questions should be direct, related to job title, should make the user his brain and explain himself to answer the question.
No forced question about company culture, ask only if necessary.
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
      console.error("Error generating MCQs:", error);
      throw new Error("Failed to generate MCQs");
    }
  },
});


// //////////////////////////////////

import { mutation } from "./_generated/server";

type MCQItem = {
  answer: string | number;
  options: string[];
  question: string;
};

export const push_mcq = mutation({
  args: {
    userId: v.string(),
    mcqArray: v.array(
      v.object({
        answer: v.union(v.string(), v.number()),
        options: v.array(v.string()),
        question: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      const formattedMCQ = args.mcqArray.map((item: MCQItem) => ({
        answer: String(item.answer),
        options: item.options,
        question: item.question
      }));

      const newTestId = await ctx.db.insert("Test", {
        userId: args.userId,
        date: new Date().toISOString(),
        QuestionSet: formattedMCQ,
      });

      return newTestId;
    } catch (error) {
      console.error("Error in push_mcq mutation:", error);
      throw new Error("Failed to store MCQs");
    }
  }
});