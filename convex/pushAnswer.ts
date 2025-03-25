import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const push_test_answer = mutation({
    args: {
        userId: v.string(),
        testId: v.string(),
        jobTitle:v.string(),
        answerSet: v.array(
            v.object({
                question: v.string(),
                userAnswer: v.string(),
                correctAnswer: v.string(),
                providedOptions: v.array(v.string())
            })
        ),
    },
    handler: async (ctx, args) => {
        try {
            const newTestAnswerId = await ctx.db.insert("TestAnswer", {
                userId: args.userId,
                testId: args.testId,
                jobTitle:args.jobTitle,
                date: new Date().toISOString(),
                answerSet: args.answerSet,
            });

            return newTestAnswerId;
        } catch (error) {
            console.error("Error in push_test_answer mutation:", error);
            throw new Error("Failed to store test answers");
        }
    }
});