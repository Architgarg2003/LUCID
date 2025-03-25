const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyBK1edzaiNbCD3ngi7OL2yX-z3XqBjKuG4');


export async function getEmbeddings(text: string) {

    try {
        const model = genAI.getGenerativeModel({
            model: "text-embedding-004" // Removed options
        });
        const result = await model.embedContent(text);

        const data = result.embedding;
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


// File: create_card.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const Create_card = mutation({
    args: {
        tags: v.array(v.string()),
        companyName: v.string(),
        jobTitle: v.string(),
        jobDescription: v.string(),
        userId: v.string(),
        testId: v.string(),
        resume: v.string(),
        difficulty: v.string(),
        jobTitleEmbeddings: v.array(v.float64())
    },

    handler: async (ctx, args) => {
        try {

            // const jobTitleEmbeddings = await getEmbeddings( args.jobTitle );


            const newCardId = await ctx.db.insert("generatedCards", {
                tags: args.tags,
                companyName: args.companyName,
                jobTitle: args.jobTitle,
                jobDescription: args.jobDescription,
                starsCount: BigInt(0),
                userId: args.userId,
                testId: args.testId,
                upvoteCount: BigInt(0),
                // upvoteStatus:false,
                resume: args.resume,
                difficultyLevel: args.difficulty,
                createdAt: new Date().toISOString(),
                embeddings: args.jobTitleEmbeddings
            });

            return newCardId;
        } catch (error) {
            console.error("Error in Create_card mutation:", error);
            throw new Error("Failed to create card");
        }
    },
});