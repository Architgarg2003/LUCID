import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

export const push_interview_answer = mutation({
    args: {
        userId: v.string(),
        InterviewId: v.string(),
        jobTitle:v.string(),
        analytics: v.array(v.object({
            strength: v.optional(v.array(v.string())),
            weakness: v.optional(v.array(v.string())),
            summary: v.optional(v.string()),
            score: v.optional(v.string())
        })),
        answerSet: v.array(
            v.object({
                question: v.string(),
                userAnswer: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {

        try {
            const newTestAnswerId = await ctx.db.insert("InterviewAnswer", {
                userId: args.userId,
                InterviewId: args.InterviewId,
                jobTitle:args.jobTitle,
                date: new Date().toISOString(),
                analytics: args.analytics,
                answerSet: args.answerSet,
            });

            return newTestAnswerId;
        } catch (error) {
            console.error("Error in push_interview_answer mutation:", error);
            throw new Error("Failed to store push_interview_answer");
        }
    }
});