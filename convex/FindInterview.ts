import { v } from "convex/values";
import { query } from "./_generated/server";

export const getJTbyInterviewId = query({
    args: { InterviewId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("generatedInterviewCards")
            .filter((q) => q.eq(q.field("InterviewId"), args.InterviewId))
            .first();
        return test?.jobTitle;
    },
});



export const getInterviewFJTbyTestId = query({
    args: { InterviewId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("InterviewCards")
            .filter((q) => q.eq(q.field("InterviewId"), args.InterviewId))
            .first();
        return test?.jobTitle;
    },
});





